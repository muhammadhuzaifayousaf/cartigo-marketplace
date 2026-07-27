/**
 * Database Configuration
 * Connects to MongoDB Atlas using Mongoose
 */
const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 * Reads connection string from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
