/**
 * One-off migration: backfill the `status` field on existing products.
 * verified=true  → 'approved'
 * verified=false → 'pending'
 *
 * Run with: node scripts/migrateProductStatus.js  (from backend/)
 */
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { Product } = require('../models/Product');

(async () => {
  await connectDB();

  const raw = await Product.collection.find({}).toArray();
  let updated = 0;

  for (const product of raw) {
    if (product.status === undefined || product.status === null) {
      const status = product.verified ? 'approved' : 'pending';
      await Product.collection.updateOne(
        { _id: product._id },
        { $set: { status } }
      );
      updated += 1;
    }
  }

  console.log(`Backfilled status on ${updated}/${raw.length} products`);

  const check = await Product.find({}, 'name status verified').sort({ createdAt: 1 });
  check.forEach((p) => console.log(`- ${p.name} | status: ${p.status} | verified: ${p.verified}`));

  await mongoose.disconnect();
  process.exit(0);
})();
