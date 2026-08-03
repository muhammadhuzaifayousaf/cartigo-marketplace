/**
 * Admin Controller
 * Handles the product approval workflow.
 */
const { Product } = require('../models/Product');

/**
 * @desc    List products for the admin approval queue
 * @route   GET /api/admin/products?status=pending|rejected|all
 * @access  Private (admin)
 */
const getAdminProducts = async (req, res) => {
  const status = req.query.status || 'all';

  let query = {};
  if (status === 'pending' || status === 'rejected') {
    query = { status };
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .populate('seller', 'name email');

  res.status(200).json({ success: true, count: products.length, data: products });
};

/**
 * @desc    Approve or reject a product's storefront visibility
 * @route   PUT /api/admin/products/:id/verify
 * @access  Private (admin)
 */
const updateProductVerification = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const verified = Boolean(req.body.verified);
  product.verified = verified;
  product.status = verified ? 'approved' : 'rejected';
  await product.save();

  res.status(200).json({
    success: true,
    message: verified ? 'Product approved' : 'Product rejected',
    data: product,
  });
};

module.exports = { getAdminProducts, updateProductVerification };
