/**
 * Order Model
 * Mongoose schema for placed orders, linked to the user who placed them.
 */
const mongoose = require('mongoose');

/**
 * Order Schema
 * - user: reference to the User who placed the order
 * - items: snapshot of each purchased product (name, price, qty, image, seller)
 *          with its OWN independent status lifecycle (multi-seller orders).
 *          Each item tracks its own status history + tracking number.
 * - shippingAddress: filled from the checkout form
 * - totals: computed server-side (subtotal, discount, tax, total)
 * - There is NO global order status. An overall status is derived from the
 *   item statuses by the controllers (computeOverallStatus).
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
        // Per-item lifecycle — each seller manages only their own items.
        status: {
          type: String,
          enum: ['Pending', 'Confirmed', 'In Transit', 'Arrived', 'Delivered', 'Cancelled'],
          default: 'Pending',
        },
        // Append-only history of every status this item has been in.
        statusHistory: [
          {
            status: { type: String, required: true },
            date: { type: Date, default: Date.now },
          },
        ],
        trackingNumber: { type: String, default: '' },
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
    paymentStatus: {
      type: String,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
