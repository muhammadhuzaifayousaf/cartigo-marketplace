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

// Predefined business categories chosen during seller registration.
// Mirrors backend/config/categories.js. Read-only once the account is created.
export const BUSINESS_CATEGORIES = [
  'General',
  'Electronics',
  'Computers & Accessories',
  'Mobile Phones & Accessories',
  'Home Appliances',
  'Clothing & Fashion',
  'Shoes & Footwear',
  'Beauty & Personal Care',
  'Health & Medical',
  'Sports & Outdoors',
  'Jewelry & Watches',
  'Furniture',
  'Home & Living',
  'Kitchen & Dining',
  'Baby & Kids',
  'Toys & Games',
  'Automotive',
  'Books & Stationery',
  'Grocery & Food',
  'Pet Supplies',
  'Tools & Hardware',
  'Office Supplies',
  'Industrial Equipment',
  'Agriculture',
  'Handmade & Crafts',
  'Other',
]
