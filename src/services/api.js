/**
 * API Service
 * Reusable axios instance and API functions for backend communication.
 * Base URL points to the local Express server on port 5000.
 */
import axios from 'axios';

// Create a reusable axios instance with default configuration
const api = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Transform a product from the backend to match frontend expectations.
 * Maps MongoDB's _id to a string `id` field so existing component
 * references (product.id) continue to work without changes.
 */
const transformProduct = (product) => ({
  ...product,
  id: product._id,
});

/**
 * Fetch all products from the backend.
 * @returns {Promise<Array>} Array of transformed product objects
 */
export const fetchProducts = async () => {
  const response = await api.get('/products');
  // Transform each product to include a string `id` field
  return response.data.data.map(transformProduct);
};

/**
 * Fetch a single product by its ID from the backend.
 * @param {string} id - The MongoDB ObjectId of the product
 * @returns {Promise<Object>} Transformed product object
 */
export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return transformProduct(response.data.data);
};

export default api;
