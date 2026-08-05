/**
 * Review Controller
 * Handles customer product ratings & reviews.
 * Rules:
 * - Only logged-in users who purchased AND received a product (order
 *   status "Delivered") can review it.
 * - One review per user per product (edit/delete allowed).
 * - Every mutation recomputes the product's cached review data
 *   (reviewDocs, averageRating, totalReviews).
 */
const Review = require('../models/Review');
const Order = require('../models/Order');
const { Product } = require('../models/Product');
const mongoose = require('mongoose');

/**
 * Recompute a product's embedded review cache and aggregate rating from
 * the Review collection. Called after every create/update/delete.
 */
const recalcProductReviews = async (productId) => {
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 100) / 100
      : 0;

  await Product.findByIdAndUpdate(productId, {
    reviewDocs: reviews.map((r) => ({
      user: r.user?._id || r.user,
      userName: r.user?.name || 'Customer',
      userAvatar: r.user?.avatar || '',
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
    averageRating,
    totalReviews,
  });
};

/**
 * Build a 1–5 star distribution from a review list.
 */
const buildDistribution = (reviews) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });
  return distribution;
};

/**
 * @desc    Get all reviews for a product with a rating summary
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 100) / 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        productId: req.params.productId,
        averageRating,
        totalReviews,
        distribution: buildDistribution(reviews),
        reviews,
      },
    });
  } catch (error) {
    console.error(`Error fetching reviews: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews',
    });
  }
};

/**
 * @desc    Get a seller's public aggregate rating across all their products
 * @route   GET /api/reviews/seller/:sellerId/stats
 * @access  Public
 */
const getSellerPublicStats = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sellerId)) {
      return res.status(200).json({
        success: true,
        data: { sellerId: req.params.sellerId, averageRating: 0, totalReviews: 0 },
      });
    }

    const reviews = await Review.find({ seller: req.params.sellerId });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 100) / 100
        : 0;

    res.status(200).json({
      success: true,
      data: { sellerId: req.params.sellerId, averageRating, totalReviews },
    });
  } catch (error) {
    console.error(`Error fetching seller rating stats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller rating stats',
    });
  }
};

/**
 * @desc    Get the authenticated user's review + eligibility for a product
 * @route   GET /api/reviews/my/:productId
 * @access  Private
 */
const getMyReview = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Eligible only if the user has a DELIVERED ITEM for this product
    // (item-level status — an order may only be partially delivered).
    // $elemMatch requires product + status to match on the SAME item, so a
    // cancelled item for this product never grants eligibility.
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      items: { $elemMatch: { product: productId, status: 'Delivered' } },
    });

    const existing = await Review.findOne({ user: req.user._id, product: productId });

    res.status(200).json({
      success: true,
      data: {
        productId,
        eligible: Boolean(deliveredOrder),
        review: existing || null,
      },
    });
  } catch (error) {
    console.error(`Error checking review eligibility: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while checking review eligibility',
    });
  }
};

/**
 * @desc    Get the latest reviews across the seller's products
 * @route   GET /api/reviews/seller
 * @access  Private (seller/admin)
 */
const getSellerReviews = async (req, res) => {
  try {
    const productIds = await Product.find({ seller: req.user._id }).distinct('_id');

    if (productIds.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const reviews = await Review.find({ product: { $in: productIds } })
      .populate('user', 'name avatar')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error(`Error fetching seller reviews: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller reviews',
    });
  }
};

/**
 * Validate rating + comment fields.
 * Returns a message string, or null when valid.
 */
const validateReviewFields = ({ rating, comment }) => {
  if (rating !== undefined) {
    const stars = Number(rating);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return 'Rating must be a whole number between 1 and 5';
    }
  }
  if (comment !== undefined) {
    const text = (comment || '').trim();
    if (text.length < 10) return 'Comment must be at least 10 characters';
    if (text.length > 1000) return 'Comment must be at most 1000 characters';
  }
  return null;
};

/**
 * @desc    Create a review for a purchased & delivered product
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required' });
  }

  const invalid = validateReviewFields({ rating, comment });
  if (invalid) {
    return res.status(400).json({ success: false, message: invalid });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Must have purchased the product and received it (that order item delivered).
  // $elemMatch ties the product + Delivered condition to the SAME order item,
  // so a cancelled line for this product cannot grant review eligibility.
  const deliveredOrder = await Order.findOne({
    user: req.user._id,
    items: { $elemMatch: { product: productId, status: 'Delivered' } },
  });
  if (!deliveredOrder) {
    return res.status(400).json({
      success: false,
      message: 'You can only review products you have purchased and received',
    });
  }

  // One review per user per product.
  const duplicate = await Review.findOne({ user: req.user._id, product: productId });
  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this product',
    });
  }

  // Identify the seller from the delivered order item.
  const item = deliveredOrder.items.find(
    (i) => i.product.toString() === productId.toString() && i.status === 'Delivered'
  );
  const seller = item?.seller || product.seller || null;

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    order: deliveredOrder._id,
    seller,
    rating: Number(rating),
    title: (title || '').trim(),
    comment: comment.trim(),
  });

  await recalcProductReviews(productId);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
};

/**
 * @desc    Update the authenticated user's own review
 * @route   PUT /api/reviews/:id
 * @access  Private (owner)
 */
const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;

  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'You can only edit your own review' });
  }

  const invalid = validateReviewFields({ rating, comment });
  if (invalid) {
    return res.status(400).json({ success: false, message: invalid });
  }

  if (rating !== undefined) review.rating = Number(rating);
  if (comment !== undefined) review.comment = comment.trim();
  if (title !== undefined) review.title = (title || '').trim();

  await review.save();
  await recalcProductReviews(review.product);

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
};

/**
 * @desc    Delete the authenticated user's own review
 * @route   DELETE /api/reviews/:id
 * @access  Private (owner)
 */
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'You can only delete your own review' });
  }

  const productId = review.product;
  await Review.findByIdAndDelete(review._id);
  await recalcProductReviews(productId);

  res.status(200).json({ success: true, message: 'Review deleted successfully' });
};

module.exports = {
  getProductReviews,
  getMyReview,
  getSellerReviews,
  getSellerPublicStats,
  createReview,
  updateReview,
  deleteReview,
};
