/**
 * Auth Routes
 * Endpoints for registration, login, and password changes.
 */
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register — Create a new account
router.post('/register', registerUser);

// POST /api/auth/login — Authenticate and receive a JWT
router.post('/login', loginUser);

// PUT /api/auth/change-password — Update the logged-in user's password
router.put('/change-password', protect, changePassword);

module.exports = router;
