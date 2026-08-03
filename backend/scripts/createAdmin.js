/**
 * One-off migration: creates the admin account and moves all store
 * products under the admin's ownership (verified = true so they appear
 * on the storefront). Also realigns seed product categories.
 *
 * Run with: node scripts/createAdmin.js  (from backend/)
 */
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const { Product } = require('../models/Product');

const ADMIN_EMAIL = 'admin@cartiqo.com';
const ADMIN_PASSWORD = '642003@Mhy';

// Seed product name → canonical category (mirrors models/Product.js)
const CATEGORY_BY_NAME = {
  'Aurora Wireless Headphones': 'Electronics',
  'Nova Lite Laptop': 'Computers & Accessories',
  'Peak Action Camera': 'Electronics',
  'Orbit Smartwatch': 'Electronics',
  'Summit Running Shoes': 'Shoes & Footwear',
  'Harbor Denim Jacket': 'Clothing & Fashion',
  'Cedar Everyday Backpack': 'Bags & Luggage',
  'Lumen Cotton Tee': 'Clothing & Fashion',
  'Aero Ceramic Kettle': 'Home Appliances',
  'Mira Blender Pro': 'Home Appliances',
  'Apple iPhone 12 Pro 256GB Blue': 'Electronics',
  'Terra Travel Tote': 'Bags & Luggage',
  'Urban Leather Belt': 'Clothing & Fashion',
  'Precision Coffee Maker': 'Home Appliances',
  'Volt USB-C Hub 8-in-1': 'Computers & Accessories',
  'Aero Standing Desk': 'Home & Furniture',
  'Pulse Fitness Tracker': 'Sports & Outdoors',
  'Trail Hiking Boots': 'Shoes & Footwear',
  'Nomad Duffel Bag': 'Bags & Luggage',
  'Ember Smart Lamp': 'Home & Furniture',
};

(async () => {
  await connectDB();

  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    admin = await User.create({
      name: 'admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Created admin account: ${ADMIN_EMAIL}`);
  } else {
    if (admin.role !== 'admin' || admin.name !== 'admin') {
      admin.role = 'admin';
      admin.name = 'admin';
      await admin.save();
    }
    console.log(`Admin account already exists: ${ADMIN_EMAIL}`);
  }

  const products = await Product.find({});
  let updated = 0;
  for (const product of products) {
    let changed = false;

    if (!product.seller || product.seller.toString() !== admin._id.toString()) {
      product.seller = admin._id;
      changed = true;
    }
    if (product.sellerName !== admin.name) {
      product.sellerName = admin.name;
      changed = true;
    }
    if (!product.verified) {
      product.verified = true;
      changed = true;
    }
    const newCategory = CATEGORY_BY_NAME[product.name];
    if (newCategory && product.category !== newCategory) {
      product.category = newCategory;
      changed = true;
    }

    if (changed) {
      await product.save();
      updated += 1;
    }
  }
  console.log(`Products owned by admin: ${updated}/${products.length}`);

  await mongoose.disconnect();
  process.exit(0);
})();
