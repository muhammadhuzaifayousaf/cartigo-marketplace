/**
 * Product Controller
 * Handles all product-related API requests
 */
const { Product } = require('../models/Product');

/**
 * @desc    Get all approved (verified) products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ verified: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
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

    res.status(200).json({
      success: true,
      data: product,
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
