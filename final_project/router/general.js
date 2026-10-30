const express = require('express');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const publicUsers = express.Router();

// Register a new customer.
publicUsers.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Both username and password are required.' });
  }
  if (!username.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Username and password cannot be empty.' });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: 'Username already exists. Please choose another username.' });
  }
  users.push({ username: username.trim(), password });
  return res.status(201).json({ message: 'User successfully registered. You can now log in.' });
});

// Get all books available in the shop.
publicUsers.get('/', (_req, res) => res.status(200).json(books));

// Get a book by ISBN.
publicUsers.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  return res.status(200).json({ [req.params.isbn]: book });
});

// Get all books by author (case-insensitive exact author match).
publicUsers.get('/author/:author', (req, res) => {
  const author = req.params.author.trim().toLocaleLowerCase();
  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) => book.author.toLocaleLowerCase() === author)
  );
  if (Object.keys(matches).length === 0) return res.status(404).json({ message: 'No books found for this author.' });
  return res.status(200).json(matches);
});

// Get all books by title (case-insensitive exact title match).
publicUsers.get('/title/:title', (req, res) => {
  const title = req.params.title.trim().toLocaleLowerCase();
  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) => book.title.toLocaleLowerCase() === title)
  );
  if (Object.keys(matches).length === 0) return res.status(404).json({ message: 'No books found with this title.' });
  return res.status(200).json(matches);
});

// Get reviews for a book.
publicUsers.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  return res.status(200).json(book.reviews);
});

module.exports.general = publicUsers;
