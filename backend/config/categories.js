/**
 * Canonical product categories.
 * Shared by seed data, the public products API, and product validation.
 */
const PRODUCT_CATEGORIES = [
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
];

const isProductCategory = (value) => PRODUCT_CATEGORIES.includes(value);

module.exports = { PRODUCT_CATEGORIES, isProductCategory };
