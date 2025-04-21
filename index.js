const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Simulated data for API
const books = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian" },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
  },
];

// Filter books by genre (optional)
// //TODO: ADD CODE HERE ⬇️ to Filter books by genre.
app.get("/books", (req, res, next) => {
  setTimeout(() => {
    const { genre } = req.query;
      if (genre) {
        const filteredBooks = books.filter((book) => book.genre.includes(genre));
        res.send(filteredBooks);
      } else {
        return res.send(books); // No filtering if genre is not provided
      }
  }, 1000); // Simulate a 1-second delay
});

// GET specific book by ID with async/await
app.get("/books/:id", async (req, res, next) => {
  try {
      const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundBook = books.find((b) => b.id === parseInt(req.params.id, 10));
        if (foundBook) {
          resolve(foundBook);
        } else {
          reject(new Error("Book not found"))
          //TODO: ADD CODE to reject the promise
        }
      }, 1000); // Simulate a 1-second delay
    });
    res.send(book)
  } catch (err) {
    err.status = 404;
    next(err)
  }
  
});

//TODO: ADD CODE HERE ⬇️
//Error handling middleware handling 404 error
app.use((req,res,next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error)
})
//Error handling middleware handling general error
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const response = {
    message: err.message || "Internal Server Error",
    status: status,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  console.error(err.stack);
  res.status(status).send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}`);
});
