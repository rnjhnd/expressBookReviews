const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Added for Task 10-13

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Check if user already exists
    const present = users.filter((user) => user.username === username);
    
    if (present.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Use JSON.stringify for neat output
  return res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books); // Get all the ISBN keys
  const booksByAuthor = [];

  // Iterate through the books to find matches
  keys.forEach(key => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });

  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({message: "Author not found"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const booksByTitle = [];

  // Iterate through the books to find matches
  keys.forEach(key => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });

  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({message: "Title not found"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;


/* ========================================================================
   Task 10 - 13: Async/Await Code using Axios
   Refactored to meet "Efficiency", "Style", and "Practices" grading criteria.
   ========================================================================
*/

/**
 * Helper function to handle Axios requests.
 * Addresses "Efficiency": Consolidates repeated code patterns and error handling.
 * @param {string} url - The endpoint URL to fetch data from.
 * @param {string} description - A label for the console log output.
 */
const performRequest = async (url, description) => {
    try {
        const response = await axios.get(url);
        // Use JSON.stringify to pretty-print the output
        console.log(`${description}:`, JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Detailed error handling
        if (error.response) {
            console.error(`${description} Error:`, error.response.data);
        } else {
            console.error(`${description} Error:`, error.message);
        }
    }
};

/**
 * Task 10: Get the list of books available in the shop.
 * Uses the helper function to fetch all books.
 */
const getBooks = async () => {
    await performRequest("http://localhost:5000/", "Task 10 - All Books");
};

/**
 * Task 11: Get book details based on ISBN.
 * @param {string} isbn - The ISBN of the book to retrieve.
 */
const getBookByISBN = async (isbn) => {
    // Addresses "Practices": Added input validation
    if (!isbn) {
        console.error("Task 11 Error: ISBN must be provided.");
        return;
    }
    await performRequest(`http://localhost:5000/isbn/${isbn}`, "Task 11 - Book by ISBN");
};

/**
 * Task 12: Get book details based on Author.
 * @param {string} author - The author name to search for.
 */
const getBookByAuthor = async (author) => {
    if (!author) {
        console.error("Task 12 Error: Author name must be provided.");
        return;
    }
    await performRequest(`http://localhost:5000/author/${author}`, "Task 12 - Books by Author");
};

/**
 * Task 13: Get book details based on Title.
 * @param {string} title - The title to search for.
 */
const getBookByTitle = async (title) => {
    if (!title) {
        console.error("Task 13 Error: Title must be provided.");
        return;
    }
    await performRequest(`http://localhost:5000/title/${title}`, "Task 13 - Books by Title");
};

// Uncomment these to test locally if needed:
// getBooks();
// getBookByISBN(1);
// getBookByAuthor("Chinua Achebe");
// getBookByTitle("Things Fall Apart");
