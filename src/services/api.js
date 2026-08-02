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

// Attach the stored JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

/**
 * Register a new user.
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} Auth payload { _id, name, email, token }
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data.data;
};

/**
 * Log in an existing user.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Auth payload { _id, name, email, token }
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data.data;
};

/**
 * Place a new order.
 * @param {Object} orderData - { items, shippingAddress }
 * @returns {Promise<Object>} The created order document
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data.data;
};

export default api;
