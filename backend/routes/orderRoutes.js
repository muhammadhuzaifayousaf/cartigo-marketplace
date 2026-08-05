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
  updateItemStatus,
  cancelOrder,
  cancelItem,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/orders — Create a new order (requires JWT)
router.post('/', protect, createOrder);

// GET /api/orders/my — Authenticated customer's order history
router.get('/my', protect, getMyOrders);

// PUT /api/orders/:id/items/:itemId/status — Update one item's tracking status
// (the seller who owns that item, or admin)
router.put('/:id/items/:itemId/status', protect, updateItemStatus);

// PATCH /api/orders/:id/items/:itemId/cancel — Customer cancels one pending item
router.patch('/:id/items/:itemId/cancel', protect, cancelItem);

// PUT /api/orders/:id/cancel — Customer cancels their pending order
router.put('/:id/cancel', protect, cancelOrder);

// GET /api/orders/:id — Single order (owner or admin)
router.get('/:id', protect, getOrderById);

// DELETE /api/orders/:id — Delete an order (admin); reverses delivery effects
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;
