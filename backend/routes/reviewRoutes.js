/**
 * Review Routes
 * Customer product ratings & reviews.
 */
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProductReviews,
  getMyReview,
  getSellerReviews,
  getSellerPublicStats,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

// GET /api/reviews/product/:productId — public reviews for a product
router.get('/product/:productId', getProductReviews);

// GET /api/reviews/seller/:sellerId/stats — public seller rating summary
router.get('/seller/:sellerId/stats', getSellerPublicStats);

// GET /api/reviews/my/:productId — the user's review + eligibility
router.get('/my/:productId', protect, getMyReview);

// GET /api/reviews/seller — latest reviews across the seller's products
router.get('/seller', protect, authorize('seller', 'admin'), getSellerReviews);

// POST /api/reviews — create a review (delivered purchase required)
router.post('/', protect, createReview);

// PUT /api/reviews/:id — edit own review
router.put('/:id', protect, updateReview);

// DELETE /api/reviews/:id — delete own review
router.delete('/:id', protect, deleteReview);

module.exports = router;
