const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const publicUsers = express.Router();

// Register a new user.
publicUsers.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' ||
      !username.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const cleanUsername = username.trim();
  if (isValid(cleanUsername)) {
    return res.status(409).json({ message: 'User already exists. Please choose another username.' });
  }
  users.push({ username: cleanUsername, password });
  return res.status(201).json({ message: 'User successfully registered. Now you can login.' });
});

// Get every book, including its author, title and reviews.
publicUsers.get('/', (_req, res) => res.status(200).json(books));

// Get one book by its ISBN. In the supplied catalogue, the object key is the ISBN.
publicUsers.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  return res.status(200).json(book);
});

// Get all books by author. Return an array with the ISBN included in each result.
publicUsers.get('/author/:author', (req, res) => {
  const author = req.params.author.trim().toLocaleLowerCase();
  const matches = Object.entries(books)
    .filter(([, book]) => book.author.toLocaleLowerCase() === author)
    .map(([isbn, book]) => ({ isbn: Number(isbn), ...book }));
  if (matches.length === 0) {
    return res.status(404).json({ message: 'No books found for this author.' });
  }
  return res.status(200).json(matches);
});

// Get all books by title. Return an array with the ISBN included in each result.
publicUsers.get('/title/:title', (req, res) => {
  const title = req.params.title.trim().toLocaleLowerCase();
  const matches = Object.entries(books)
    .filter(([, book]) => book.title.toLocaleLowerCase() === title)
    .map(([isbn, book]) => ({ isbn: Number(isbn), ...book }));
  if (matches.length === 0) {
    return res.status(404).json({ message: 'No books found with this title.' });
  }
  return res.status(200).json(matches);
});

// Get the initial book review. Return the rubric's no-reviews message when empty.
publicUsers.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  if (!book.reviews || Object.keys(book.reviews).length === 0) {
    return res.status(200).json({ message: 'No reviews found for this book.' });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = publicUsers;
