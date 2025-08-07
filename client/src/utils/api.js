import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryName) => api.get(`/products/category/${categoryName}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// Admin API
export const adminAPI = {
  // Products
  createProduct: (productData) => api.post('/admin/product', productData),
  updateProduct: (id, productData) => api.put(`/admin/product/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/product/${id}`),
  getAllProducts: () => api.get('/admin/products'),
  
  // Categories
  createCategory: (categoryData) => api.post('/admin/category', categoryData),
  
  // Orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/order/${id}/status`, { status }),
  
  // Stats
  getStats: () => api.get('/admin/stats'),
};

// Config API
export const configAPI = {
  getSiteName: () => api.get('/config/site-name'),
  updateSiteName: (siteName) => api.put('/config/site-name', { site_name: siteName }),
  getConfig: () => api.get('/config'),
  updateConfig: (configData) => api.put('/config', configData),
};

export default api;
