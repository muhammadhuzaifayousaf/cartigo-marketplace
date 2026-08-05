/**
 * Product stock/sold synchronization helpers.
 *
 * The live "sold" count and available stock are derived from the Order
 * collection rather than maintained as running counters, so they always
 * reflect reality even if orders are delivered, cancelled, or deleted
 * outside the normal flow:
 *   sold  = quantity currently in Delivered orders
 *   stock = originalStock - sold   (floored at 0)
 */
const Order = require('../models/Order');

/**
 * Sum the delivered quantity per product across ALL products (one query).
 * @returns {Promise<Map<string, number>>} productId -> sold qty
 */
const getSoldMap = async () => {
  const rows = await Order.aggregate([
    { $match: { status: 'Delivered' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', sold: { $sum: '$items.qty' } } },
  ]);
  return new Map(rows.map((row) => [row._id.toString(), row.sold]));
};

/**
 * Sum the delivered quantity for a single product.
 * @returns {Promise<number>}
 */
const soldForProduct = async (productId) => {
  const rows = await Order.aggregate([
    { $match: { status: 'Delivered', 'items.product': productId } },
    { $unwind: '$items' },
    { $match: { 'items.product': productId } },
    { $group: { _id: null, sold: { $sum: '$items.qty' } } },
  ]);
  return rows.length ? rows[0].sold : 0;
};

/**
 * Recompute and persist a product's sold count and available stock from the
 * current Delivered orders. Call after any delivery/cancellation/deletion.
 */
const syncProductSoldState = async (product) => {
  const sold = await soldForProduct(product._id);
  product.orders = sold;
  product.stock = Math.max(0, (product.originalStock || 0) - sold);
  await product.save();
  return { sold, stock: product.stock };
};

module.exports = { getSoldMap, soldForProduct, syncProductSoldState };
