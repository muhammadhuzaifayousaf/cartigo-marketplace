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
 * Self-contained SVG placeholder (gray box with a "P").
 * Rendered from a data URI so it works offline and on every device —
 * no external host (e.g. placehold.co) that can be blocked on mobile.
 */
const svgPlaceholder = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%' height='100%' fill='#f0f0f0'/><text x='50%' y='54%' font-size='40' fill='#b0b0b0' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif'>P</text></svg>`
export const placeholderImg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgPlaceholder)}`

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
