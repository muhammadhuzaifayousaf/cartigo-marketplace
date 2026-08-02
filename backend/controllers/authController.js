/**
 * Auth Controller
 * Handles user registration and login.
 */
const User = require('../models/User');
const validator = require('validator');
const generateToken = require('../utils/generateToken');

/**
 * Build the user payload returned to the client (never the password).
 */
const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email and password',
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters',
    });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists',
    });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: buildAuthPayload(user),
  });
};

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: buildAuthPayload(user),
    });
  }

  res.status(401).json({
    success: false,
    message: 'Invalid email or password',
  });
};

module.exports = { registerUser, loginUser };
