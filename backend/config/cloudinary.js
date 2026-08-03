/**
 * Cloudinary Configuration
 * Reads credentials from environment variables and initializes the
 * Cloudinary SDK used for product image uploads.
 */
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * True when all three Cloudinary credentials are present in .env.
 * Used to give clear errors instead of cryptic upload failures.
 */
const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

module.exports = { cloudinary, isCloudinaryConfigured };
