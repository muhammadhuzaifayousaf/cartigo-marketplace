/**
 * JWT Utilities
 * Creates signed JSON Web Tokens for authenticated users.
 */
const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT containing the user id.
 * @param {string} id - MongoDB ObjectId of the user
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;
