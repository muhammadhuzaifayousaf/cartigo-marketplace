/**
 * Order Routes
 * Protected endpoints for placing orders, viewing history,
 * and updating tracking status.
 */
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders — Create a new order (requires JWT)
router.post('/', protect, createOrder);

// GET /api/orders/my — Authenticated customer's order history
router.get('/my', protect, getMyOrders);

// PUT /api/orders/:id/status — Update order tracking status
// (seller owning an item on the order, or admin)
router.put('/:id/status', protect, updateOrderStatus);

// GET /api/orders/:id — Single order (owner or admin)
router.get('/:id', protect, getOrderById);

module.exports = router;
