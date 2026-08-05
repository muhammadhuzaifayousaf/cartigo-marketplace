/**
 * Auth Controller
 * Handles user registration and login.
 * Users register as either a customer ('user') or a 'seller'.
 */
const User = require('../models/User');
const validator = require('validator');
const generateToken = require('../utils/generateToken');
const { isBusinessCategory } = require('../config/categories');

/**
 * Build the user payload returned to the client (never the password).
 * Includes the user's role so the frontend can branch the UI.
 */
const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || '',
  token: generateToken(user._id),
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  const { name, email, password, role, location, businessCategory } = req.body;

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

  // Only 'user' and 'seller' can self-register. 'admin' is reserved.
  const selectedRole = role === 'seller' ? 'seller' : 'user';

  // Sellers must pick a location and a business category during registration;
  // both become read-only once the account exists.
  if (selectedRole === 'seller') {
    if (!location || !String(location).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Location is required for seller accounts',
      });
    }
    if (!businessCategory || !isBusinessCategory(businessCategory)) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a valid business category',
      });
    }
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists',
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: selectedRole,
    ...(selectedRole === 'seller'
      ? {
          location: String(location).trim(),
          businessCategory,
        }
      : {}),
  });

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
