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

/**
 * Predefined business categories chosen during seller registration.
 * They become read-only once the account is created.
 */
const BUSINESS_CATEGORIES = [
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
];

const isBusinessCategory = (value) => BUSINESS_CATEGORIES.includes(value);

module.exports = {
  PRODUCT_CATEGORIES,
  isProductCategory,
  BUSINESS_CATEGORIES,
  isBusinessCategory,
};
