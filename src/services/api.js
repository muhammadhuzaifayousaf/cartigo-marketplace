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

/**
 * Fetch the authenticated customer's order history (newest first).
 * @returns {Promise<Array>} Array of order documents
 */
export const fetchMyOrders = async () => {
  const response = await api.get('/orders/my');
  return response.data.data;
};

/**
 * Fetch a single order (owner or admin only).
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Order document
 */
export const fetchOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
};

/**
 * Update an order's tracking status (seller or admin).
 * @param {string} id - Order ID
 * @param {string} status - Pending | Confirmed | In Transit | Arrived | Delivered | Cancelled
 * @returns {Promise<Object>} Updated order document
 */
export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data.data;
};

/**
 * Cancel the authenticated customer's own order.
 * Only allowed while the order is still "Pending" (before the seller confirms it).
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Updated order document
 */
export const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data.data;
};

/* ── Seller endpoints ─────────────────────────────────────────────────────── */

/**
 * Fetch the authenticated seller's own products.
 * @returns {Promise<Array>} Array of product documents
 */
export const fetchSellerProducts = async () => {
  const response = await api.get('/seller/products');
  return response.data.data;
};

/**
 * Create a seller product with Cloudinary image uploads.
 * @param {FormData} formData - Fields + "images" file(s)
 * @returns {Promise<Object>} Created product document
 */
export const createSellerProduct = async (formData) => {
  const response = await api.post('/seller/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

/**
 * Update a seller product (optional image replacement).
 * @param {string} id - Product ID
 * @param {FormData} formData - Fields + optional "images" file(s)
 * @returns {Promise<Object>} Updated product document
 */
export const updateSellerProduct = async (id, formData) => {
  const response = await api.put(`/seller/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

/**
 * Delete a seller product (Cloudinary images removed server-side).
 * @param {string} id - Product ID
 * @returns {Promise<Object>} { success, message }
 */
export const deleteSellerProduct = async (id) => {
  const response = await api.delete(`/seller/products/${id}`);
  return response.data;
};

/**
 * Fetch orders that contain at least one item sold by the seller.
 * @returns {Promise<Array>} Array of order documents
 */
export const fetchSellerOrders = async () => {
  const response = await api.get('/seller/orders');
  return response.data.data;
};

/* ── Admin endpoints ──────────────────────────────────────────────────────── */

/**
 * Fetch all products (for the admin approvals queue).
 * @param {string} [status] - "pending" | "all" (optional)
 * @returns {Promise<Array>} Array of product documents
 */
export const fetchAdminProducts = async (status = 'all') => {
  const response = await api.get(`/admin/products?status=${status}`);
  return response.data.data;
};

/**
 * Approve or reject a product's storefront visibility.
 * @param {string} id - Product ID
 * @param {boolean} verified - true to approve, false to reject
 * @returns {Promise<Object>} Updated product document
 */
export const updateProductVerification = async (id, verified) => {
  const response = await api.put(`/admin/products/${id}/verify`, { verified });
  return response.data.data;
};

export default api;
