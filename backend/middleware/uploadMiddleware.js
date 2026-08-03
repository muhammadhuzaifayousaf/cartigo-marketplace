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

/**
 * Accept an image field named "images" (multiple files).
 * Exposed as the `images` middleware.
 */
const uploadImages = upload.array('images', 5);

module.exports = { uploadImages, isCloudinaryConfigured };
