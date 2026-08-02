/**
 * Order Routes
 * Protected endpoints for placing orders.
 */
const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders — Create a new order (requires JWT)
router.post('/', protect, createOrder);

module.exports = router;
