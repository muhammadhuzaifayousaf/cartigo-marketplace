/**
 * Review Model
 * Mongoose schema for customer product ratings & reviews.
 * - Only users who purchased (and received) a product can review it.
 * - One review per user per product (edit/delete allowed).
 * - Ratings are 1–5 stars; comments are 10–1000 characters.
 * Each product also caches its reviews (reviewDocs, averageRating,
 * totalReviews) — the Review collection is the source of truth and the
 * product cache is recomputed after every create/update/delete.
 */
const mongoose = require('mongoose');

/**
 * Review Schema
 * - user: the reviewer (ref User)
 * - product: the reviewed product (ref Product)
 * - order: the delivered order that proves this user purchased it (ref Order)
 * - seller: denormalized product owner (used by seller dashboards)
 * - rating: 1–5 stars
 * - title: optional short headline
 * - comment: the written review body
 */
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    title: {
      type: String,
      default: '',
      trim: true,
      maxlength: [120, 'Title must be at most 120 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment must be at most 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// A user can review a given product at most once.
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
