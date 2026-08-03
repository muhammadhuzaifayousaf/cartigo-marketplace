/**
 * Product Model
 * Mongoose schema for ecommerce products
 */
const mongoose = require('mongoose');

/**
 * Product Schema
 * Defines all fields used by the frontend:
 * - name, price, image, description, category, stock (required)
 * - seller (User ref), sellerName (display fallback), images (Cloudinary URLs)
 * - brand, originalPrice, rating, orders, reviews, specs, features (optional)
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
    // Owner seller (references User). Null for seeded/store products.
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Denormalized seller display name — used as fallback so store
    // products without an owner still show a seller name.
    sellerName: {
      type: String,
      default: 'ShopHub',
      trim: true,
    },
    // Cloudinary image URLs. `image` mirrors the first entry for
    // backwards compatibility with existing frontend components.
    images: {
      type: [String],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // Approval lifecycle: pending → approved | rejected.
    // `verified` mirrors this (approved ⇒ true) for backwards compatibility.
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
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
 * Includes products across Electronics, Computers, Home Appliances, Clothing,
 * Shoes, Sports, Home & Furniture, and Bags & Luggage categories.
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
    sellerName: 'Artel Market',
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
    category: 'Computers & Accessories',
    stock: 12,
    rating: 4.7,
    brand: 'Nova',
    sellerName: 'Bright Labs',
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
    sellerName: 'Adventure Co.',
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
    sellerName: 'Pulse Gear',
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
    category: 'Shoes & Footwear',
    stock: 16,
    rating: 4.5,
    brand: 'Summit',
    sellerName: 'FitHouse',
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
    category: 'Clothing & Fashion',
    stock: 22,
    rating: 4.4,
    brand: 'Harbor',
    sellerName: 'Studio North',
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
    category: 'Bags & Luggage',
    stock: 20,
    rating: 4.7,
    brand: 'Cedar',
    sellerName: 'Urban Carry',
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
    category: 'Clothing & Fashion',
    stock: 40,
    rating: 4.3,
    brand: 'Lumen',
    sellerName: 'Threadworks',
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
    category: 'Home Appliances',
    stock: 14,
    rating: 4.6,
    brand: 'Aero',
    sellerName: 'Homebase',
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
    category: 'Home Appliances',
    stock: 17,
    rating: 4.5,
    brand: 'Mira',
    sellerName: 'Kitchen Lane',
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
    sellerName: 'Guanjoi Trading LLC',
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
    category: 'Bags & Luggage',
    stock: 26,
    rating: 4.2,
    brand: 'Terra',
    sellerName: 'Carry Studio',
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
    category: 'Clothing & Fashion',
    stock: 35,
    rating: 4.4,
    brand: 'Urban',
    sellerName: 'Style Co.',
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
    category: 'Home Appliances',
    stock: 10,
    rating: 4.7,
    brand: 'BrewTech',
    sellerName: 'Homebase',
    verified: true,
    originalPrice: 149.0,
    orders: 56,
    reviews: 9,
  },
  {
    name: 'Volt USB-C Hub 8-in-1',
    price: 45.0,
    image: 'usbc.jpg',
    description: 'Expand your laptop with an 8-in-1 USB-C hub featuring HDMI, SD card, and multiple USB ports.',
    category: 'Computers & Accessories',
    stock: 28,
    rating: 4.6,
    brand: 'Volt',
    sellerName: 'Bright Labs',
    verified: false,
    originalPrice: 59.0,
    orders: 121,
    reviews: 17,
  },
  {
    name: 'Aero Standing Desk',
    price: 249.0,
    image: 'desk.jpg',
    description: 'Sit or stand with an electric height-adjustable desk that remembers your favorite positions.',
    category: 'Home & Furniture',
    stock: 8,
    rating: 4.5,
    brand: 'Aero',
    sellerName: 'Homebase',
    verified: false,
    originalPrice: 299.0,
    orders: 43,
    reviews: 7,
  },
  {
    name: 'Pulse Fitness Tracker',
    price: 79.99,
    image: 'tracker.jpg',
    description: 'Monitor heart rate, steps, sleep, and workouts in a lightweight water-resistant tracker.',
    category: 'Sports & Outdoors',
    stock: 33,
    rating: 4.4,
    brand: 'Pulse',
    sellerName: 'Pulse Gear',
    verified: true,
    originalPrice: 99.99,
    orders: 168,
    reviews: 24,
  },
  {
    name: 'Trail Hiking Boots',
    price: 119.0,
    image: 'hiking.jpg',
    description: 'Durable waterproof hiking boots with grip soles for trails and light trekking.',
    category: 'Shoes & Footwear',
    stock: 15,
    rating: 4.6,
    brand: 'Trail',
    sellerName: 'FitHouse',
    verified: false,
    originalPrice: 149.0,
    orders: 74,
    reviews: 12,
  },
  {
    name: 'Nomad Duffel Bag',
    price: 64.5,
    image: 'nomad.jpg',
    description: 'A rugged weekender duffel with a separate shoe compartment and padded shoulder strap.',
    category: 'Bags & Luggage',
    stock: 21,
    rating: 4.3,
    brand: 'Nomad',
    sellerName: 'Urban Carry',
    verified: false,
    originalPrice: 79.5,
    orders: 95,
    reviews: 13,
  },
  {
    name: 'Ember Smart Lamp',
    price: 39.99,
    image: 'lamp.jpg',
    description: 'A dimmable smart lamp that syncs with your phone for schedules, scenes, and music-reactive lighting.',
    category: 'Home & Furniture',
    stock: 26,
    rating: 4.5,
    brand: 'Ember',
    sellerName: 'Kitchen Lane',
    verified: false,
    originalPrice: 54.99,
    orders: 132,
    reviews: 20,
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

module.exports = { Product, seedProducts, seedDatabase };
