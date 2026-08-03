/**
 * Authentication Middleware
 * Reads the JWT from the Authorization header, verifies it,
 * and attaches the authenticated user to the request.
 * Also provides role-based access control for seller routes.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect a route — only allows authenticated users through.
 * Expects: Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user no longer exists',
      });
    }

    next();
  } catch (error) {
    console.error(`Auth middleware error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

/**
 * Authorize roles — restrict a route to one or more roles.
 * Must be used AFTER `protect`.
 * Usage: router.get('/', protect, authorize('seller'), handler)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no user',
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — requires role: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
