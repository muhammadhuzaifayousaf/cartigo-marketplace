/**
 * Express Server — Ecommerce Backend
 * Runs on port 5000, connects to MongoDB Atlas
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// ── Middleware ──
app.use(express.json());       // Parse JSON request bodies
app.use(cors());               // Enable Cross-Origin Resource Sharing

// ── Routes ──
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
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
