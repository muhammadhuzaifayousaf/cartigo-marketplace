/**
 * Auth Routes
 * Public endpoints for registration and login.
 */
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// POST /api/auth/register — Create a new account
router.post('/register', registerUser);

// POST /api/auth/login — Authenticate and receive a JWT
router.post('/login', loginUser);

module.exports = router;
