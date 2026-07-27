/**
 * Product Model
 * Mongoose schema for ecommerce products
 */
const mongoose = require('mongoose');

/**
 * Product Schema
 * Defines all fields used by the frontend:
 * - name, price, image, description, category, stock (required)
 * - brand, seller, verified, originalPrice, rating, orders, reviews, specs, features (optional)
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
    },
    brand: {
      type: String,
      default: '',
    },
    seller: {
      type: String,
      default: 'ShopHub',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    orders: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Seed Data
 * Used to populate the database if the products collection is empty.
 * Includes products across Electronics, Clothing, Shoes, Home, and Accessories categories.
 */
const seedProducts = [
  {
    name: 'Aurora Wireless Headphones',
    price: 129.99,
    image: 'headphones.jpg',
    description: 'Immersive over-ear headphones with active noise cancellation and a 30-hour battery life.',
    category: 'Electronics',
    stock: 24,
    rating: 4.8,
    brand: 'Aurora',
    seller: 'Artel Market',
    verified: true,
    originalPrice: 159.99,
    orders: 152,
    reviews: 28,
  },
  {
    name: 'Nova Lite Laptop',
    price: 899.0,
    image: 'laptop.jpg',
    description: 'A lightweight laptop designed for everyday productivity, streaming, and remote work.',
    category: 'Electronics',
    stock: 12,
    rating: 4.7,
    brand: 'Nova',
    seller: 'Bright Labs',
    verified: true,
    originalPrice: 999.0,
    orders: 87,
    reviews: 19,
  },
  {
    name: 'Peak Action Camera',
    price: 249.5,
    image: 'camera.jpg',
    description: 'Capture crystal-clear action footage with 4K video, waterproof design, and image stabilization.',
    category: 'Electronics',
    stock: 18,
    rating: 4.6,
    brand: 'Peak',
    seller: 'Adventure Co.',
    verified: false,
    originalPrice: 299.5,
    orders: 134,
    reviews: 22,
  },
  {
    name: 'Orbit Smartwatch',
    price: 189.99,
    image: 'smartwatch.jpg',
    description: 'Track workouts, sleep, and notifications in a slim, modern smartwatch.',
    category: 'Electronics',
    stock: 30,
    rating: 4.9,
    brand: 'Orbit',
    seller: 'Pulse Gear',
    verified: true,
    originalPrice: 229.99,
    orders: 201,
    reviews: 45,
  },
  {
    name: 'Summit Running Shoes',
    price: 89.0,
    image: 'shoe.jpg',
    description: 'Breathable running shoes with responsive cushioning for everyday training.',
    category: 'Shoes',
    stock: 16,
    rating: 4.5,
    brand: 'Summit',
    seller: 'FitHouse',
    verified: false,
    originalPrice: 109.0,
    orders: 98,
    reviews: 15,
  },
  {
    name: 'Harbor Denim Jacket',
    price: 74.5,
    image: 'jacket.jpg',
    description: 'A tailored denim jacket with a comfortable fit for cool-weather outfits.',
    category: 'Clothing',
    stock: 22,
    rating: 4.4,
    brand: 'Harbor',
    seller: 'Studio North',
    verified: false,
    originalPrice: 94.5,
    orders: 76,
    reviews: 11,
  },
  {
    name: 'Cedar Everyday Backpack',
    price: 59.99,
    image: 'backpack.jpg',
    description: 'A durable everyday backpack with padded compartments for work or travel.',
    category: 'Clothing',
    stock: 20,
    rating: 4.7,
    brand: 'Cedar',
    seller: 'Urban Carry',
    verified: true,
    originalPrice: 79.99,
    orders: 143,
    reviews: 31,
  },
  {
    name: 'Lumen Cotton Tee',
    price: 24.99,
    image: 'tshirt.jpg',
    description: 'Soft cotton T-shirt available in multiple colors for casual everyday wear.',
    category: 'Clothing',
    stock: 40,
    rating: 4.3,
    brand: 'Lumen',
    seller: 'Threadworks',
    verified: false,
    originalPrice: 34.99,
    orders: 267,
    reviews: 52,
  },
  {
    name: 'Aero Ceramic Kettle',
    price: 49.0,
    image: 'kettle.jpg',
    description: 'A fast-heating electric kettle with a stainless steel interior and sleek finish.',
    category: 'Home',
    stock: 14,
    rating: 4.6,
    brand: 'Aero',
    seller: 'Homebase',
    verified: false,
    originalPrice: 69.0,
    orders: 65,
    reviews: 8,
  },
  {
    name: 'Mira Blender Pro',
    price: 69.5,
    image: 'blender.jpg',
    description: 'Powerful blender with multiple speed settings for smoothies, soups, and sauces.',
    category: 'Home',
    stock: 17,
    rating: 4.5,
    brand: 'Mira',
    seller: 'Kitchen Lane',
    verified: false,
    originalPrice: 89.5,
    orders: 89,
    reviews: 14,
  },
  {
    name: 'Apple iPhone 12 Pro 256GB Blue',
    price: 298.0,
    image: 'phone1.jpg',
    description: 'Flagship iPhone with triple camera system. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'Electronics',
    stock: 25,
    rating: 4.8,
    reviews: 32,
    orders: 154,
    brand: 'Apple',
    seller: 'Guanjoi Trading LLC',
    verified: true,
    originalPrice: 128.0,
    specs: {
      Model: 'iPhone 12 Pro',
      Storage: '256GB',
      Color: 'Blue',
      Type: 'Classic smartphone',
      Material: 'Aluminum and glass',
      Design: 'Modern premium',
      Customization: 'Customized logo and design custom packages',
      Protection: 'Refund Policy',
      Warranty: '2 years full warranty',
    },
    features: ['5G capable', 'ProMotion display', 'Night mode'],
  },
  {
    name: 'Terra Travel Tote',
    price: 44.0,
    image: 'wallet.jpg',
    description: 'A versatile travel tote with roomy compartments and a polished finish.',
    category: 'Accessories',
    stock: 26,
    rating: 4.2,
    brand: 'Terra',
    seller: 'Carry Studio',
    verified: false,
    originalPrice: 59.0,
    orders: 112,
    reviews: 18,
  },
  {
    name: 'Urban Leather Belt',
    price: 34.99,
    image: 'wallet.jpg',
    description: 'Genuine leather belt with a brushed nickel buckle, perfect for formal and casual wear.',
    category: 'Accessories',
    stock: 35,
    rating: 4.4,
    brand: 'Urban',
    seller: 'Style Co.',
    verified: true,
    originalPrice: 49.99,
    orders: 178,
    reviews: 23,
  },
  {
    name: 'Precision Coffee Maker',
    price: 119.0,
    image: 'coffee.jpg',
    description: 'Brew barista-quality coffee at home with precise temperature control and a built-in grinder.',
    category: 'Home',
    stock: 10,
    rating: 4.7,
    brand: 'BrewTech',
    seller: 'Homebase',
    verified: true,
    originalPrice: 149.0,
    orders: 56,
    reviews: 9,
  },
];

const Product = mongoose.model('Product', productSchema);

/**
 * Seed the products collection if it is empty.
 * Called once during server startup.
 */
const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts);
      console.log(`Seeded ${seedProducts.length} products into the database`);
    } else {
      console.log(`Products collection already has ${count} documents — skipping seed`);
    }
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
  }
};

module.exports = { Product, seedDatabase };
