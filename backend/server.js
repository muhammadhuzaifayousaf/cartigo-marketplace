/**
 * Express Server — Ecommerce Backend
 * Runs on port 5000, connects to MongoDB Atlas
 */

// Load environment variables from .env FIRST so that modules required
// below (Cloudinary config, auth middleware, etc.) see them.
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const { PRODUCT_CATEGORIES } = require('./config/categories');

// Initialize Express app
const app = express();

// ── Middleware ──
app.use(express.json());       // Parse JSON request bodies
app.use(cors());               // Enable Cross-Origin Resource Sharing

// ── Routes ──
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Canonical category list used by the storefront and seller product form
app.get('/api/categories', (req, res) => {
  res.status(200).json({ success: true, data: PRODUCT_CATEGORIES });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error(`Unhandled error: ${err.message || err.error?.message || 'unknown'}`);
  console.error(err.stack || err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || err.error?.message || 'Server error',
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB Atlas
  await connectDB();

  // Seed products if collection is empty
  const { seedDatabase } = require('./models/Product');
  await seedDatabase();

  // Start listening for requests
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
