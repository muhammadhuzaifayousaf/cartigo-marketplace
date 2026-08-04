/**
 * Order Controller
 * Handles order creation, customer order history, seller order
 * management, and order status/tracking updates.
 */
const Order = require('../models/Order');
const { Product } = require('../models/Product');

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
      seller: item.seller || null,
      sellerName: item.sellerName || 'ShopHub',
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

/**
 * @desc    Get the authenticated customer's orders (newest first)
 * @route   GET /api/orders/my
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, data: orders });
};

/**
 * @desc    Get a single order (owner, admin, or seller selling an item on it)
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isOwner = order.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  const sellsItem = order.items.some(
    (item) => item.seller && item.seller.toString() === req.user._id.toString()
  );

  if (!isOwner && !isAdmin && !sellsItem) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  res.status(200).json({ success: true, data: order });
};

/**
 * @desc    Get orders containing items sold by the authenticated seller
 * @route   GET /api/seller/orders
 * @access  Private (seller)
 */
const getSellerOrders = async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, data: orders });
};

/**
 * Apply the effects of a successful delivery: decrement each item's product
 * stock and bump its sold count by the delivered quantity. Products that no
 * longer exist are skipped. Called exactly once per order (guarded by
 * deliveryProcessed).
 */
const processDeliveredOrder = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    product.stock = Math.max(0, (product.stock || 0) - item.qty);
    product.orders = (product.orders || 0) + item.qty;
    await product.save();
  }
};

/**
 * @desc    Update an order's status (tracking)
 * @route   PUT /api/orders/:id/status
 * @access  Private (seller owning an item on the order, or admin)
 */
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['Pending', 'Confirmed', 'In Transit', 'Arrived', 'Delivered', 'Cancelled'];

  if (!status || !allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${allowed.join(', ')}`,
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isAdmin = req.user.role === 'admin';
  const ownsItem = order.items.some(
    (item) => item.seller && item.seller.toString() === req.user._id.toString()
  );

  if (!isAdmin && !ownsItem) {
    return res.status(403).json({
      success: false,
      message: 'Access denied — you do not sell an item on this order',
    });
  }

  order.status = status;

  if (status === 'Delivered' && !order.deliveryProcessed) {
    await processDeliveredOrder(order);
    order.deliveryProcessed = true;
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: `Order marked as "${status}"`,
    data: order,
  });
};

/**
 * @desc    Customer cancels their own order before the seller confirms it
 * @route   PUT /api/orders/:id/cancel
 * @access  Private (order owner)
 */
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  if (order.status !== 'Pending') {
    return res.status(400).json({
      success: false,
      message: 'This order can no longer be cancelled — it has already been confirmed by the seller',
    });
  }

  order.status = 'Cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order,
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
  cancelOrder,
};
