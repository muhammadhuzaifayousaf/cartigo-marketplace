/**
 * Order Controller
 * Handles order creation for authenticated users.
 */
const Order = require('../models/Order');

/**
 * Compute order totals using the same logic as the frontend
 * so the saved numbers match what the customer saw at checkout.
 */
const computeTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal >= 100 ? 60 : 0;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = Math.max(subtotal - discount + tax, 0);
  return { subtotal, discount, tax, total };
};

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No order items provided',
    });
  }

  if (!shippingAddress) {
    return res.status(400).json({
      success: false,
      message: 'Shipping address is required',
    });
  }

  const { subtotal, discount, tax, total } = computeTotals(items);

  const order = await Order.create({
    user: req.user._id,
    items: items.map((item) => ({
      product: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image || '',
    })),
    shippingAddress,
    subtotal,
    discount,
    tax,
    total,
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
};

module.exports = { createOrder };
