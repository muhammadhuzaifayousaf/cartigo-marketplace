/**
 * Seller Controller
 * Handles seller product CRUD and Cloudinary image cleanup.
 */
const { Product } = require('../models/Product');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

/**
 * Pull public image URLs out of a multer/Cloudinary upload result.
 * `req.files` is populated by `uploadImages` when files were sent.
 */
const extractImageUrls = (files) =>
  Array.isArray(files) ? files.map((file) => file.path) : [];

/**
 * Extract a safe subset of editable fields from the request body.
 */
const pickFields = (body) => {
  const fields = {};
  const keys = [
    'name',
    'price',
    'description',
    'category',
    'stock',
    'brand',
    'originalPrice',
    'verified',
    'features',
  ];
  keys.forEach((key) => {
    if (body[key] !== undefined && body[key] !== null) fields[key] = body[key];
  });
  return fields;
};

/**
 * Delete one image from Cloudinary (best-effort; never crashes the request).
 */
const deleteFromCloudinary = async (url) => {
  if (!url || !isCloudinaryConfigured()) return;
  try {
    const parts = url.split('/');
    const publicId = parts[parts.length - 1].split('.')[0];
    await cloudinary.uploader.destroy(`products/${publicId}`);
  } catch (err) {
    console.error(`Cloudinary delete failed for ${url}: ${err.message}`);
  }
};

/**
 * @desc    List the authenticated seller's own products
 * @route   GET /api/seller/products
 * @access  Private (seller)
 */
const getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: products.length, data: products });
};

/**
 * @desc    Create a product owned by the authenticated seller
 * @route   POST /api/seller/products
 * @access  Private (seller)
 */
const createMyProduct = async (req, res) => {
  const fields = pickFields(req.body);
  const images = extractImageUrls(req.files);

  if (!fields.name || !fields.price || !fields.description || !fields.category) {
    // Clean up anything already uploaded to avoid orphan images.
    await Promise.all(images.map(deleteFromCloudinary));
    return res.status(400).json({
      success: false,
      message: 'Name, price, description and category are required',
    });
  }

  const price = Number(fields.price);
  if (!Number.isFinite(price) || price < 0) {
    await Promise.all(images.map(deleteFromCloudinary));
    return res.status(400).json({ success: false, message: 'Price must be a positive number' });
  }

  const product = await Product.create({
    ...fields,
    price,
    stock: Number(fields.stock) || 0,
    image: images[0] || '',
    images,
    seller: req.user._id,
    sellerName: req.user.name,
    verified: false,
    rating: 0,
    orders: 0,
    reviews: 0,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
};

/**
 * @desc    Update one of the authenticated seller's products
 * @route   PUT /api/seller/products/:id
 * @access  Private (seller)
 */
const updateMyProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const isOwner = product.seller && product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const fields = pickFields(req.body);
  const newImages = extractImageUrls(req.files);

  if (fields.price !== undefined) fields.price = Number(fields.price);
  if (fields.stock !== undefined) fields.stock = Number(fields.stock) || 0;

  if (newImages.length > 0) {
    // Replace the existing image set with the newly uploaded ones.
    const oldImages = product.images || (product.image ? [product.image] : []);
    fields.images = newImages;
    fields.image = newImages[0];
    await Promise.all(oldImages.map(deleteFromCloudinary));
  }

  Object.assign(product, fields);
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
};

/**
 * @desc    Delete one of the authenticated seller's products
 * @route   DELETE /api/seller/products/:id
 * @access  Private (seller)
 */
const deleteMyProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const isOwner = product.seller && product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const images = product.images || (product.image ? [product.image] : []);
  await Promise.all(images.map(deleteFromCloudinary));
  await Product.deleteOne({ _id: product._id });

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
};

module.exports = {
  getMyProducts,
  createMyProduct,
  updateMyProduct,
  deleteMyProduct,
};
