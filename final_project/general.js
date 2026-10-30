// Axios client for IBM Express Book Reviews.
// Start the API with npm start, then run this file with: npm run client
const axios = require('axios');
const BASE_URL = process.env.BOOKS_API_URL || 'http://localhost:5000';

function makeHttpError(response, resource) {
  const status = response.status;
  const detail = response.data && response.data.message
    ? response.data.message
    : response.statusText;
  const error = new Error(
    status === 404
      ? `${resource} not found (HTTP 404).`
      : `${resource} request failed with HTTP ${status}: ${detail || 'Unexpected response'}`
  );
  error.status = status;
  error.data = response.data;
  return error;
}

// Retrieve the full books object with a Node-style callback: callback(error, books).
function getAllBooks(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('getAllBooks requires a callback function.');
  }

  axios.get(`${BASE_URL}/`, { validateStatus: () => true })
    .then((response) => {
      if (response.status === 200) {
        const books = response.data;
        if (!books || typeof books !== 'object' || Array.isArray(books)) {
          return callback(new Error('The books endpoint returned an invalid books object.'), null);
        }
        return callback(null, books);
      }
      if (response.status === 404) {
        return callback(makeHttpError(response, 'Book catalogue'), null);
      }
      return callback(makeHttpError(response, 'Get all books'), null);
    })
    .catch((error) => callback(error, null));
}

// Retrieve one book using the ISBN route and a Promise.
function getBooksByISBN(isbn) {
  if (isbn === undefined || isbn === null || String(isbn).trim() === '') {
    return Promise.reject(new TypeError('An ISBN is required.'));
  }

  return axios.get(`${BASE_URL}/isbn/${encodeURIComponent(String(isbn).trim())}`, {
    validateStatus: () => true
  }).then((response) => {
    if (response.status === 200) return response.data;
    if (response.status === 404) throw makeHttpError(response, `Book with ISBN ${isbn}`);
    throw makeHttpError(response, 'ISBN lookup');
  }).catch((error) => {
    if (error.response) throw makeHttpError(error.response, 'ISBN lookup');
    throw error;
  });
}

// Retrieve books by author using async/await; distinguish success, not-found and HTTP errors.
async function getBooksByAuthor(author) {
  if (typeof author !== 'string' || !author.trim()) {
    throw new TypeError('An author name is required.');
  }
  try {
    const response = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(author.trim())}`,
      { validateStatus: () => true }
    );
    if (response.status === 200) return response.data;
    if (response.status === 404) throw makeHttpError(response, `Books by author "${author}"`);
    throw makeHttpError(response, 'Author lookup');
  } catch (error) {
    if (error.response) throw makeHttpError(error.response, 'Author lookup');
    throw error;
  }
}

// Retrieve books by title using async/await; distinguish success, not-found and HTTP errors.
async function getBooksByTitle(title) {
  if (typeof title !== 'string' || !title.trim()) {
    throw new TypeError('A book title is required.');
  }
  try {
    const response = await axios.get(
      `${BASE_URL}/title/${encodeURIComponent(title.trim())}`,
      { validateStatus: () => true }
    );
    if (response.status === 200) return response.data;
    if (response.status === 404) throw makeHttpError(response, `Books with title "${title}"`);
    throw makeHttpError(response, 'Title lookup');
  } catch (error) {
    if (error.response) throw makeHttpError(error.response, 'Title lookup');
    throw error;
  }
}

// Backwards-compatible singular alias.
const getBookByISBN = getBooksByISBN;

module.exports = {
  getAllBooks,
  getBooksByISBN,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};

if (require.main === module) {
  getAllBooks((error, books) => {
    if (error) console.error('Get all books error:', error.message);
    else console.log('All books:', JSON.stringify(books, null, 2));
  });

  getBooksByISBN('1')
    .then((book) => console.log('Book by ISBN 1:', JSON.stringify(book, null, 2)))
    .catch((error) => console.error('ISBN lookup error:', error.message));

  getBooksByAuthor('Chinua Achebe')
    .then((books) => console.log('Books by author:', JSON.stringify(books, null, 2)))
    .catch((error) => console.error('Author lookup error:', error.message));

  getBooksByTitle('Things Fall Apart')
    .then((books) => console.log('Books by title:', JSON.stringify(books, null, 2)))
    .catch((error) => console.error('Title lookup error:', error.message));
}
