/**
 * Order Model
 * Mongoose schema for placed orders, linked to the user who placed them.
 */
const mongoose = require('mongoose');

/**
 * Order Schema
 * - user: reference to the User who placed the order
 * - items: snapshot of each purchased product (name, price, qty, image, seller)
 * - shippingAddress: filled from the checkout form
 * - totals: computed server-side (subtotal, discount, tax, total)
 * - status: lifecycle from Pending → Confirmed → In Transit → Arrived → Delivered
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
        image: { type: String, default: '' },
        // Denormalized so sellers and customers can identify item ownership
        // without extra lookups.
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
        sellerName: { type: String, default: 'ShopHub' },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Transit', 'Arrived', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    // True once the delivered order has affected product stock/orders so the
    // effects are applied exactly once (setting status back to Delivered won't
    // decrement stock or bump the sold count again).
    deliveryProcessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
