/**
 * Admin Routes
 * Product approval workflow — admin only.
 */
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAdminProducts, updateProductVerification } = require('../controllers/adminController');

// GET /api/admin/products — list products for the approval queue
router.get('/products', protect, authorize('admin'), getAdminProducts);

// PUT /api/admin/products/:id/verify — approve/reject a product
router.put('/products/:id/verify', protect, authorize('admin'), updateProductVerification);

module.exports = router;
