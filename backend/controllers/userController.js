/**
 * User Profile Controller
 * Handles the authenticated user's own profile (view/update/avatar) and
 * the public profile view used to reach a customer or seller from reviews,
 * orders, and the product supplier card.
 */
const User = require('../models/User');
const { Product } = require('../models/Product');
const Review = require('../models/Review');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

/**
 * Which fields each role may edit via PUT /api/users/me.
 * Sellers are intentionally limited to avatar (separate endpoint), phone
 * and description — name/email and the rest stay read-only for them.
 */
const EDITABLE_FIELDS = {
  user: ['name', 'phone', 'about', 'location', 'dob', 'gender'],
  seller: ['phone', 'description'],
  admin: ['phone', 'description'],
};

/**
 * @desc    Get the authenticated user's own profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json({ success: true, data: user });
};

/**
 * @desc    Update the authenticated user's own profile fields
 * @route   PUT /api/users/me
 * @access  Private
 */
const updateMyProfile = async (req, res) => {
  const allowed = EDITABLE_FIELDS[req.user.role] || [];
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  allowed.forEach((key) => {
    if (req.body[key] !== undefined && req.body[key] !== null) {
      user[key] = String(req.body[key]).trim();
    }
  });

  if (req.body.name !== undefined && !user.name) {
    return res.status(400).json({ success: false, message: 'Name cannot be empty' });
  }

  await user.save();
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
};

/**
 * Best-effort delete of the previous Cloudinary avatar. Never crashes the
 * request — a failed cleanup only leaks one orphan image.
 */
const deleteAvatar = async (url) => {
  if (!url || !isCloudinaryConfigured()) return;
  try {
    const parts = url.split('/');
    const publicId = parts[parts.length - 1].split('.')[0];
    await cloudinary.uploader.destroy(`avatars/${publicId}`);
  } catch (err) {
    console.error(`Cloudinary avatar delete failed for ${url}: ${err.message}`);
  }
};

/**
 * @desc    Upload/replace the authenticated user's avatar
 * @route   PUT /api/users/me/avatar
 * @access  Private
 */
const uploadMyAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image' });
  }

  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const oldAvatar = user.avatar;
  user.avatar = req.file.path;
  await user.save();

  await deleteAvatar(oldAvatar);

  res.status(200).json({
    success: true,
    message: 'Avatar updated successfully',
    data: user,
  });
};

/**
 * Aggregate rating for a seller, computed from the cached review aggregates
 * on their products (identical to the seller dashboard calculation).
 */
const getSellerRating = async (sellerId) => {
  const products = await Product.find({ seller: sellerId }).select('averageRating totalReviews');
  const totalReviews = products.reduce((sum, p) => sum + (p.totalReviews || 0), 0);
  const weighted = products.reduce(
    (sum, p) => sum + (p.averageRating || 0) * (p.totalReviews || 0),
    0
  );
  return {
    averageRating: totalReviews > 0 ? Math.round((weighted / totalReviews) * 100) / 100 : 0,
    totalReviews,
  };
};

/**
 * @desc    Get a public profile by user ID (works for customers and sellers)
 * @route   GET /api/users/:id/public
 * @access  Public
 */
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const base = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      location: user.location,
      joinedDate: user.createdAt,
    };

    // Customers: public bio/demographics + how many reviews they have written.
    if (user.role === 'user') {
      const reviewCount = await Review.countDocuments({ user: user._id });
      return res.status(200).json({
        success: true,
        data: {
          ...base,
          about: user.about,
          dob: user.dob,
          gender: user.gender,
          reviewCount,
        },
      });
    }

    // Sellers/admin: store description, category, rating, and product count.
    const [rating, productCount] = await Promise.all([
      getSellerRating(user._id),
      Product.countDocuments({ seller: user._id, status: 'approved' }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        ...base,
        description: user.description,
        businessCategory: user.businessCategory,
        rating,
        productCount,
      },
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.error(`Error fetching public profile: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error while fetching profile' });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  getPublicProfile,
};
