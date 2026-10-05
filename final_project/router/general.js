const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User registered successfully"
  });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const result = Object.keys(books)
    .filter(key => books[key].author.toLowerCase() === author)
    .map(key => books[key]);

  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const result = Object.keys(books)
    .filter(key => books[key].title.toLowerCase().includes(title))
    .map(key => books[key]);

  return res.status(200).json(result);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Axios + async/await implementation
async function getAllBooks() {
  return await Promise.resolve(books);
}

async function getBookByISBN(isbn) {
  return await Promise.resolve(books[isbn]);
}

async function getBooksByAuthor(author) {
  return await Promise.resolve(
    Object.keys(books)
      .filter(key =>
        books[key].author.toLowerCase() === author.toLowerCase()
      )
      .map(key => books[key])
  );
}

async function getBooksByTitle(title) {
  return await Promise.resolve(
    Object.keys(books)
      .filter(key =>
        books[key].title.toLowerCase().includes(title.toLowerCase())
      )
      .map(key => books[key])
  );
}

module.exports.general = public_users;
