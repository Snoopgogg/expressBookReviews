const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regdUsers = express.Router();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'ibm-express-book-reviews-change-this-secret';

const isValid = (username) => users.some((user) => user.username === username);
const authenticatedUser = (username, password) =>
  users.some((user) => user.username === username && user.password === password);

// Only registered users can log in.
regdUsers.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({ message: 'Login successful.', token });
});

// Add or update a review. JWT authentication is enforced in index.js.
regdUsers.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  const review = req.body && req.body.review;
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ message: 'A non-empty review field is required.' });
  }
  const username = req.user.username;
  book.reviews[username] = review.trim();
  return res.status(200).json({
    message: 'Review successfully added/updated.',
    isbn,
    username,
    review: book.reviews[username],
  });
});

// Delete the logged-in user's review for a book.
regdUsers.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  const username = req.user.username;
  if (!Object.prototype.hasOwnProperty.call(book.reviews, username)) {
    return res.status(404).json({ message: 'No review exists for this user and book.' });
  }
  delete book.reviews[username];
  return res.status(200).json({ message: 'Review successfully deleted.', isbn, username });
});

module.exports.authenticated = regdUsers;
module.exports.isValid = isValid;
module.exports.users = users;
