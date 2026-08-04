/**
 * Review API Service
 * Customer product ratings & reviews.
 * Reuses the shared axios instance (JWT auto-attached from localStorage).
 */
import api from './api'

/**
 * Fetch all reviews for a product with a rating summary (public).
 * @param {string} productId
 * @returns {Promise<Object>} { productId, averageRating, totalReviews, distribution, reviews }
 */
export const fetchProductReviews = async (productId) => {
  const response = await api.get(`/reviews/product/${productId}`)
  return response.data.data
}

/**
 * Check whether the logged-in user can review a product and load their
 * existing review (private).
 * @param {string} productId
 * @returns {Promise<Object>} { productId, eligible, review }
 */
export const fetchMyReview = async (productId) => {
  const response = await api.get(`/reviews/my/${productId}`)
  return response.data.data
}

/**
 * Submit a new review (private — requires a delivered purchase).
 * @param {Object} payload - { productId, rating, title, comment }
 * @returns {Promise<Object>} Created review document
 */
export const createReview = async (payload) => {
  const response = await api.post('/reviews', payload)
  return response.data.data
}

/**
 * Update the user's own review (private).
 * @param {string} id - Review ID
 * @param {Object} payload - { rating, title, comment }
 * @returns {Promise<Object>} Updated review document
 */
export const updateReview = async (id, payload) => {
  const response = await api.put(`/reviews/${id}`, payload)
  return response.data.data
}

/**
 * Delete the user's own review (private).
 * @param {string} id - Review ID
 * @returns {Promise<Object>} { success, message }
 */
export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`)
  return response.data
}

/**
 * Fetch the latest reviews across the seller's products (private).
 * @returns {Promise<Array>} Array of review documents (user + product populated)
 */
export const fetchSellerReviews = async () => {
  const response = await api.get('/reviews/seller')
  return response.data.data
}

/**
 * Fetch a seller's public aggregate rating across all their products (public).
 * @param {string} sellerId
 * @returns {Promise<Object>} { sellerId, averageRating, totalReviews }
 */
export const fetchSellerRating = async (sellerId) => {
  const response = await api.get(`/reviews/seller/${sellerId}/stats`)
  return response.data.data
}
