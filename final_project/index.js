const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customerRoutes = require('./router/auth_users.js').authenticated;
const generalRoutes = require('./router/general.js').general;

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || 'ibm-express-book-reviews-change-this-secret';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/customer', session({
  secret: process.env.SESSION_SECRET || 'fingerprint_customer',
  resave: false,
  saveUninitialized: false,
}));

// JWT authentication protects every customer review mutation route.
app.use('/customer/auth/*', (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Authorization token required. Please log in.' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
});

app.use('/customer', customerRoutes);
app.use('/', generalRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Book review server is running on http://localhost:${PORT}`);
});

module.exports = app;
