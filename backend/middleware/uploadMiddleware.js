/**
 * Upload Middleware
 * Handles product image uploads directly to Cloudinary using Multer.
 * Images are stored in the "products" folder on Cloudinary.
 */
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Multer storage that streams uploaded files straight to Cloudinary.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

// Avatar storage — smaller square crops in a dedicated "avatars" folder.
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5,                  // max 5 images per product
  },
  fileFilter: (req, file, cb) => {
    if (isCloudinaryConfigured() && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

// Separate single-file instance for avatar uploads.
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (isCloudinaryConfigured() && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

/**
 * Accept an image field named "images" (multiple files).
 * Exposed as the `images` middleware.
 */
const uploadImages = upload.array('images', 5);

/**
 * Accept a single image field named "avatar".
 */
const uploadAvatar = avatarUpload.single('avatar');

module.exports = { uploadImages, uploadAvatar, isCloudinaryConfigured };
