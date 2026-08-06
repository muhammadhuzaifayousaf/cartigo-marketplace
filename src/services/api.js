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
 * Fetch a seller's approved products for their public profile.
 * @param {string} sellerId - The seller's user ID
 * @returns {Promise<Array>} Array of transformed product objects
 */
export const fetchSellerPublicProducts = async (sellerId) => {
  const response = await api.get(`/products?seller=${sellerId}`);
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
 * Update a single order item's tracking status (the seller who owns that item,
 * or admin). Each item has its own independent status.
 * @param {string} id - Order ID
 * @param {string} itemId - Order item ID
 * @param {string} status - Pending | Confirmed | In Transit | Arrived | Delivered | Cancelled
 * @param {string} [trackingNumber] - Optional tracking number
 * @returns {Promise<Object>} Updated order document (with computed overallStatus)
 */
export const updateItemStatus = async (id, itemId, status, trackingNumber) => {
  const response = await api.put(`/orders/${id}/items/${itemId}/status`, { status, trackingNumber });
  return response.data.data;
};

/**
 * Cancel the authenticated customer's own order.
 * Only allowed while every item is still "Pending" (before any seller confirms).
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Updated order document
 */
export const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data.data;
};

/**
 * Cancel a single item on the customer's own order.
 * Only allowed while that item is still "Pending".
 * @param {string} orderId - Order ID
 * @param {string} itemId - Order item ID
 * @returns {Promise<Object>} Updated order document
 */
export const cancelItem = async (orderId, itemId) => {
  const response = await api.patch(`/orders/${orderId}/items/${itemId}/cancel`);
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

/* ── Profile endpoints ────────────────────────────────────────────────────── */

/**
 * Fetch the authenticated user's own full profile (private).
 * @returns {Promise<Object>} User document (without password)
 */
export const fetchMyProfile = async () => {
  const response = await api.get('/users/me');
  return response.data.data;
};

/**
 * Update the authenticated user's own editable profile fields (private).
 * @param {Object} payload - Role-dependent editable fields
 * @returns {Promise<Object>} Updated user document
 */
export const updateMyProfile = async (payload) => {
  const response = await api.put('/users/me', payload);
  return response.data.data;
};

/**
 * Upload/replace the authenticated user's avatar (private, multipart).
 * @param {File} file - Image file (jpg/png/webp, up to 5MB)
 * @returns {Promise<Object>} Updated user document
 */
export const uploadMyAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.put('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

/**
 * Fetch a user's public profile card (public).
 * @param {string} id - User ID
 * @returns {Promise<Object>} Public profile (customer or seller shape)
 */
export const fetchPublicProfile = async (id) => {
  const response = await api.get(`/users/${id}/public`);
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
