/**
 * Order Controller
 * Handles order creation, customer order history, seller order
 * management, and order status/tracking updates.
 */
const Order = require('../models/Order');
const User = require('../models/User');
const { Product } = require('../models/Product');
const { syncProductSoldState } = require('../utils/productSync');

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
 * Derive an order's overall status from its item statuses.
 * Orders have NO stored status — this is computed on the fly using these rules
 * (highest precedence first):
 *   1. every item Pending            → Pending
 *   2. every item Cancelled          → Cancelled
 *   3. some Pending + some Cancelled → Partially Cancelled
 *   4. at least one Confirmed and nothing shipped yet → Processing
 *   5. some Cancelled + some Confirmed → Processing
 *   6. any item In Transit or Arrived → Partially Shipped
 *   7. all active items Delivered + some Cancelled → Partially Delivered
 *   8. every active item Delivered   → Delivered
 */
const computeOverallStatus = (items) => {
  const statuses = items.map((item) => item.status).filter(Boolean);
  if (statuses.length === 0) return 'Pending';

  const cancelled = statuses.filter((s) => s === 'Cancelled');
  const active = statuses.filter((s) => s !== 'Cancelled');

  // 1. Every item still Pending
  if (active.length > 0 && active.every((s) => s === 'Pending') && cancelled.length === 0) return 'Pending';
  // 2. Every item Cancelled
  if (statuses.every((s) => s === 'Cancelled')) return 'Cancelled';
  // 3. Some Pending + some Cancelled (nothing else)
  if (active.every((s) => s === 'Pending') && cancelled.length > 0) return 'Partially Cancelled';
  // 4/5. At least one Confirmed and nothing shipped yet (Pending/Cancelled mix is fine)
  if (
    active.some((s) => s === 'Confirmed') &&
    active.every((s) => s === 'Confirmed' || s === 'Pending')
  ) {
    return 'Processing';
  }
  // 6. Any item In Transit or Arrived
  if (active.some((s) => s === 'In Transit' || s === 'Arrived')) return 'Partially Shipped';
  // 7/8. Every active item Delivered
  if (active.length > 0 && active.every((s) => s === 'Delivered')) {
    return cancelled.length > 0 ? 'Partially Delivered' : 'Delivered';
  }
  return 'Processing';
};

/**
 * Recompute the customer-facing totals from the CURRENT item statuses.
 * Cancelled items stay in history but are excluded from the charged amount:
 *   cancelledAmount = value of cancelled item lines
 *   final*          = totals recomputed over the active (non-cancelled) items
 * The stored subtotal/discount/tax/total remain the "Original Total".
 */
const computeOrderTotals = (items) => {
  const cancelledAmount = items
    .filter((item) => item.status === 'Cancelled')
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  const active = items.filter((item) => item.status !== 'Cancelled');
  const subtotal = active.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal >= 100 ? 60 : 0;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = Math.max(subtotal - discount + tax, 0);

  return {
    cancelledAmount,
    finalSubtotal: subtotal,
    finalDiscount: discount,
    finalTax: tax,
    finalTotal: total,
  };
};

/**
 * Attach the computed overall status + current totals to an order before
 * sending it out.
 */
const serializeOrder = (order) => {
  const doc = order.toObject ? order.toObject() : order;
  return {
    ...doc,
    overallStatus: computeOverallStatus(doc.items),
    ...computeOrderTotals(doc.items),
  };
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
      // Every item starts its own independent lifecycle as Pending.
      status: 'Pending',
      statusHistory: [{ status: 'Pending', date: new Date() }],
      trackingNumber: item.trackingNumber || '',
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
    data: serializeOrder(order),
  });
};

/**
 * @desc    Get the authenticated customer's orders (newest first)
 * @route   GET /api/orders/my
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders.map(serializeOrder),
  });
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

  res.status(200).json({ success: true, data: serializeOrder(order) });
};

/**
 * @desc    Get orders containing items sold by the authenticated seller
 * @route   GET /api/seller/orders
 * @access  Private (seller)
 */
const getSellerOrders = async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id }).sort({ createdAt: -1 });

  // Attach a lightweight `customer` card (id/name/avatar) so the seller UI
  // can render the buyer and link to their public profile. `order.user`
  // keeps the raw ObjectId for backwards compatibility.
  const userIds = [...new Set(orders.map((o) => o.user.toString()))];
  const users = await User.find({ _id: { $in: userIds } }).select('name avatar').lean();
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  const data = orders.map((order) => {
    const serialized = serializeOrder(order);
    const u = userMap.get(order.user.toString());
    return {
      ...serialized,
      customer: u ? { _id: u._id, name: u.name, avatar: u.avatar || '' } : null,
    };
  });

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
};

/**
 * Recompute stock/sold for every product on the order from the current
 * Delivered order items in the database. This runs after an item status
 * change is persisted, so delivered items count and cancelled/deleted items
 * don't. Products that no longer exist are skipped.
 */
const resyncOrderProducts = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product) continue;
    await syncProductSoldState(product);
  }
};

/**
 * @desc    Update a single item's status (tracking) on an order
 * @route   PUT /api/orders/:id/items/:itemId/status
 * @access  Private (seller who owns that item, or admin)
 */
const updateItemStatus = async (req, res) => {
  const { status, trackingNumber } = req.body;
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

  const item = order.items.find((i) => i._id.toString() === req.params.itemId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found on this order' });
  }

  // A seller may only touch their OWN items — never other sellers' items.
  const isAdmin = req.user.role === 'admin';
  const ownsItem = item.seller && item.seller.toString() === req.user._id.toString();
  if (!isAdmin && !ownsItem) {
    return res.status(403).json({
      success: false,
      message: 'Access denied — you can only update status for items you sell',
    });
  }

  if (item.status !== status) {
    item.statusHistory.push({ status, date: new Date() });
    item.status = status;
  }
  if (trackingNumber !== undefined) {
    item.trackingNumber = String(trackingNumber);
  }

  await order.save();

  // Recompute from the persisted item set — sold/stock now reflect this
  // status change (delivery counts it, cancellation/deletion drops it).
  await resyncOrderProducts(order);

  res.status(200).json({
    success: true,
    message: `Item marked as "${status}"`,
    data: serializeOrder(order),
  });
};

/**
 * @desc    Customer cancels their own order before any seller confirms it
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

  const confirmedItem = order.items.find((item) => item.status !== 'Pending');
  if (confirmedItem) {
    return res.status(400).json({
      success: false,
      message: 'This order can no longer be cancelled — an item has already been confirmed by a seller',
    });
  }

  const now = new Date();
  order.items.forEach((item) => {
    item.statusHistory.push({ status: 'Cancelled', date: now });
    item.status = 'Cancelled';
  });
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: serializeOrder(order),
  });
};

/**
 * @desc    Customer cancels a single item on their own order.
 *          Only allowed while that item is still Pending.
 * @route   PATCH /api/orders/:id/items/:itemId/cancel
 * @access  Private (order owner)
 */
const cancelItem = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const item = order.items.find((i) => i._id.toString() === req.params.itemId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found on this order' });
  }

  // Terminal-state guard — the backend never trusts the frontend.
  if (item.status !== 'Pending') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel after seller confirmation',
    });
  }

  item.statusHistory.push({ status: 'Cancelled', date: new Date() });
  item.status = 'Cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Item cancelled successfully',
    data: serializeOrder(order),
  });
};

/**
 * @desc    Delete an order (admin only). Reverses any applied delivery
 *          effects first so product stock/sold counts stay accurate.
 * @route   DELETE /api/orders/:id
 * @access  Private (admin)
 */
const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const items = order.items;
  await Order.deleteOne({ _id: order._id });

  // Removing the order drops its delivered quantity, so stock/sold are
  // recomputed for its products.
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;
    await syncProductSoldState(product);
  }

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateItemStatus,
  cancelOrder,
  cancelItem,
  deleteOrder,
};
