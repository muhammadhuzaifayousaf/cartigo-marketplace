/**
 * Returns the correct image path, accounting for GitHub Pages base URL.
 * Place all images inside: public/images/
 * Absolute URLs (Cloudinary uploads, data URIs) pass through untouched.
 * Usage: img('tshirt.jpg') → '/ecommerce-frontend/images/tshirt.jpg'
 */
export const img = (filename) =>
  filename && (filename.startsWith('http') || filename.startsWith('data:'))
    ? filename
    : `${import.meta.env.BASE_URL}images/${filename}`

/**
 * Format a price as USD currency string
 */
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

/**
 * Clamp a number between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/**
 * Truncate text to a given length
 */
export const truncate = (text, len = 60) =>
  text.length > len ? text.slice(0, len) + '…' : text

/**
 * Validate email format
 */
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
