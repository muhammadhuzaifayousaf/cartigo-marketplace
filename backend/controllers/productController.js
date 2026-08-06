/**
 * Product Controller
 * Handles all product-related API requests
 */
const mongoose = require('mongoose');
const { Product } = require('../models/Product');
const { getSoldMap, soldForProduct } = require('../utils/productSync');

/**
 * Real-time "sold" counts and available stock are derived straight from the
 * Order collection so they always reflect the actual delivered, non-cancelled
 * orders — even if orders were added, cancelled, or deleted outside this app.
 *   sold  = delivered qty
 *   stock = originalStock - sold (floored at 0)
 */
const withLiveCounts = (doc, sold) => ({
  ...doc,
  orders: sold,
  stock: Math.max(0, (doc.originalStock || 0) - sold),
});

/**
 * @desc    Get all approved (verified) products
 * @route   GET /api/products?seller=<sellerId>
 * @access  Public
 * Optional ?seller filter returns only that seller's approved products
 * (used by public seller profiles).
 */
const getProducts = async (req, res) => {
  try {
    const filter = { verified: true };

    if (req.query.seller) {
      if (!mongoose.isValidObjectId(req.query.seller)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid seller id',
        });
      }
      filter.seller = req.query.seller;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    const soldMap = await getSoldMap();
    const data = products.map((p) => {
      const doc = p.toObject();
      return withLiveCounts(doc, soldMap.get(doc._id.toString()) || 0);
    });
    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
};

/**
 * @desc    Get single approved product by ID
 * @route   GET /api/products/:id
 * @access  Public (unverified products are hidden until approved)
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Unapproved products are not visible on the public storefront.
    if (!product || !product.verified) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const sold = await soldForProduct(product._id);
    const productData = withLiveCounts(product.toObject(), sold);

    res.status(200).json({
      success: true,
      data: productData,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    console.error(`Error fetching product: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};

module.exports = { getProducts, getProductById };
