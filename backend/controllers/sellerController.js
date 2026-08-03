/**
 * Seller Controller
 * Handles seller product CRUD and Cloudinary image cleanup.
 */
const { Product } = require('../models/Product');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const { PRODUCT_CATEGORIES, isProductCategory } = require('../config/categories');

/**
 * Pull public image URLs out of a multer/Cloudinary upload result.
 * `req.files` is populated by `uploadImages` when files were sent.
 */
const extractImageUrls = (files) =>
  Array.isArray(files) ? files.map((file) => file.path) : [];

/**
 * Extract a safe subset of editable fields from the request body.
 * `verified` is intentionally excluded — approval is an admin-only action.
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

  if (!isProductCategory(fields.category)) {
    await Promise.all(images.map(deleteFromCloudinary));
    return res.status(400).json({
      success: false,
      message: `Invalid category. Choose one of: ${PRODUCT_CATEGORIES.join(', ')}`,
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
    // Admin's own listings are pre-approved; seller submissions need admin approval.
    verified: req.user.role === 'admin',
    status: req.user.role === 'admin' ? 'approved' : 'pending',
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

  // `existingImages` is the list of image URLs the seller chose to KEEP.
  // Its presence signals that images may have been removed (or new ones added).
  // Comes as a JSON string via multipart, or as an array via JSON bodies.
  const bodyHasExisting = req.body.existingImages !== undefined;
  let keptExisting = [];
  if (bodyHasExisting) {
    const raw = req.body.existingImages;
    if (Array.isArray(raw)) {
      keptExisting = raw;
    } else if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        keptExisting = Array.isArray(parsed) ? parsed : [];
      } catch {
        // Defensive fallback for `["url1","url2"]` style strings.
        keptExisting = raw
          .replace(/^\[|\]$/g, '')
          .split(',')
          .map((s) => s.replace(/^["']+|["']+$/g, '').trim())
          .filter(Boolean);
      }
    }
  }

  // Rebuild the image set whenever the seller removed an image or added new ones.
  if (bodyHasExisting || newImages.length > 0) {
    const oldImages = product.images?.length
      ? product.images
      : product.image
        ? [product.image]
        : [];
    const finalImages = [...keptExisting, ...newImages];

    // Best-effort Cloudinary cleanup for old images no longer in the set.
    const removed = oldImages.filter((url) => !finalImages.includes(url));
    await Promise.all(removed.map(deleteFromCloudinary));

    fields.images = finalImages;
    fields.image = finalImages[0] || '';
  }

  Object.assign(product, fields);

  // Seller edits (including edits of rejected products) send the product back
  // into the admin approval queue so the storefront only ever shows a reviewed
  // version. Admin edits are always pre-approved (the admin is the moderator).
  product.verified = req.user.role === 'admin';
  product.status = req.user.role === 'admin' ? 'approved' : 'pending';

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
