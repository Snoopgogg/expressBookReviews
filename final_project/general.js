// Axios client for the IBM Express Book Reviews final project.
// Start the API first (npm start), then run: npm run client
const axios = require('axios');
const BASE_URL = process.env.BOOKS_API_URL || 'http://localhost:5000';

// Retrieve all books using a Node-style callback.
function getAllBooks(callback) {
  axios.get(`${BASE_URL}/`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error, null));
}

// Retrieve a book by ISBN using a Promise.
function getBookByISBN(isbn) {
  return axios.get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`)
    .then((response) => response.data);
}

// Retrieve books by author using async/await.
async function getBooksByAuthor(author) {
  const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
  return response.data;
}

// Retrieve books by title using async/await.
async function getBooksByTitle(title) {
  const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
  return response.data;
}

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };

if (require.main === module) {
  getAllBooks((error, data) => {
    if (error) console.error('All books request failed:', error.message);
    else console.log('All books:', JSON.stringify(data, null, 2));
  });
  getBookByISBN('1')
    .then((data) => console.log('Book by ISBN:', JSON.stringify(data, null, 2)))
    .catch((error) => console.error('ISBN request failed:', error.message));
  getBooksByAuthor('Chinua Achebe')
    .then((data) => console.log('Books by author:', JSON.stringify(data, null, 2)))
    .catch((error) => console.error('Author request failed:', error.message));
  getBooksByTitle('Things Fall Apart')
    .then((data) => console.log('Books by title:', JSON.stringify(data, null, 2)))
    .catch((error) => console.error('Title request failed:', error.message));
}
