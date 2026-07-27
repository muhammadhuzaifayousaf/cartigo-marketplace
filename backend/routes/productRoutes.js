/**
 * Product Routes
 * Defines API endpoints for product operations
 */
const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// GET /api/products — Retrieve all products
router.get('/', getProducts);

// GET /api/products/:id — Retrieve a single product by ID
router.get('/:id', getProductById);

module.exports = router;
