/**
 * Seller Routes
 * All endpoints require an authenticated 'seller' role.
 */
const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadImages, isCloudinaryConfigured } = require('../middleware/uploadMiddleware');
const {
  getMyProducts,
  createMyProduct,
  updateMyProduct,
  deleteMyProduct,
} = require('../controllers/sellerController');
const { getSellerOrders } = require('../controllers/orderController');

const router = express.Router();

router.use(protect, authorize('seller', 'admin'));

// Seller product CRUD — ownership enforced in the controller.
router.get('/products', getMyProducts);
router.post('/products', uploadImages, createMyProduct);
router.put('/products/:id', uploadImages, updateMyProduct);
router.delete('/products/:id', deleteMyProduct);

// Seller order views.
router.get('/orders', getSellerOrders);

module.exports = router;
