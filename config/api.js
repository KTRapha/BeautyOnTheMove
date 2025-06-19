import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT, AUTH_TOKEN_KEY } from '@env';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL || 'https://your-backend-api.com',
  timeout: parseInt(API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token here if you have refresh token logic
        // const newToken = await refreshToken();
        // await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return api(originalRequest);
        
        // For now, just redirect to login
        // You can implement navigation to login screen here
        console.log('Token expired, redirecting to login');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear stored tokens and redirect to login
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      throw new Error('Server error. Please try again later.');
    }

    // Handle client errors
    if (error.response?.status >= 400) {
      console.error('Client error:', error.response.data);
      throw new Error(error.response.data?.message || 'Request failed');
    }

    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Authentication
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  
  // User management
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  
  // Bookings
  getBookings: () => api.get('/bookings'),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  
  // Offers
  getOffers: () => api.get('/offers'),
  getOffer: (id) => api.get(`/offers/${id}`),
  
  // Dashboard
  getDashboardStats: () => api.get('/dashboard/stats'),
};

export default api; 