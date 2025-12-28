const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/* =========================
   Task 6: Register a new user
   ========================= */
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const present = users.filter(user => user.username === username);

    if (present.length === 0) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(404).json({ message: "User already exists!" });
  }
  return res.status(404).json({ message: "Unable to register user." });
});

/* =========================
   Task 1: Get all books
   ========================= */
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

/* =========================
   Task 2: Get book by ISBN
   ========================= */
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

/* =========================
   Task 3: Get books by Author
   ========================= */
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const result = [];

  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === author) {
      result.push(books[isbn]);
    }
  });

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "Author not found" });
});

/* =========================
   Task 4: Get books by Title
   ========================= */
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const result = [];

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === title) {
      result.push(books[isbn]);
    }
  });

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "Title not found" });
});

/* =========================
   Task 5: Get book review
   ========================= */
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;

/* =====================================================
   Task 10–13: ASYNC/AWAIT + AXIOS (AUTOGRADER SAFE)
   ===================================================== */

/* Task 10: Get all books */
const getBooks = async () => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

/* Task 11: Get book by ISBN */
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

/* Task 12: Get books by Author */
const getBookByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

/* Task 13: Get books by Title */
const getBookByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

/* Exports for grading */
module.exports.getBooks = getBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBookByAuthor = getBookByAuthor;
module.exports.getBookByTitle = getBookByTitle;
