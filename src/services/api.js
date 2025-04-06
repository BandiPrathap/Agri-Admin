import axios from 'axios';
import { toast } from 'react-toastify';

// const API_URL = 'https://raythu-admin.vercel.app';
const API_URL = 'http://localhost:5000';;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast.error(error.response.data.message || 'An error occurred');
    } else {
      toast.error('Network error. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default {
  // Category endpoints
  getCategories() {
    return api.get('/category');
  },
  addCategory(category) {
    return api.post('/category', category);
  },

  // Virus endpoints
  getViruses() {
    return api.get('/virus');
  },
  getVirusesByCategory(categoryId) {
    return api.get(`/virus/category/${categoryId}`);
  },
  addVirus(virus) {
    return api.post('/virus', virus);
  },

  // Product endpoints
  getProducts() {
    return api.get('/product');
  },
  getProductsByCategory(categoryId) {
    return api.get(`/product/category/${categoryId}`);
  },
  getProductsByVirus(virusId) {
    return api.get(`/product/virus/${virusId}`);
  },
  addProduct(product) {
    return api.post('/products', product);
  },
  updateProduct(id, product) {
    return api.put(`/product/${id}`, product);
  },
  deleteProduct(id) {
    return api.delete(`/product/${id}`);
  },
};