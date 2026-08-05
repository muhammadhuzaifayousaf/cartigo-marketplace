/**
 * User Routes
 * Public profile view plus the authenticated user's own profile management.
 */
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');
const {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  getPublicProfile,
} = require('../controllers/userController');

const router = express.Router();

// Public — anyone can view a user's public profile card.
router.get('/:id/public', getPublicProfile);

// Private — the authenticated user manages their own profile.
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.put('/me/avatar', protect, uploadAvatar, uploadMyAvatar);

module.exports = router;
