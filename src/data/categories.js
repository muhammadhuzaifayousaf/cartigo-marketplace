// Canonical product categories — mirrors backend/config/categories.js
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Computers & Accessories',
  'Home Appliances',
  'Clothing & Fashion',
  'Shoes & Footwear',
  'Jewelry & Watches',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Books & Media',
  'Automotive',
  'Grocery & Food',
  'Health & Wellness',
  'Home & Furniture',
  'Bags & Luggage',
]

// Subset shown in the navbar secondary bar (keep it to a single row).
export const navCategories = PRODUCT_CATEGORIES.slice(0, 8)
