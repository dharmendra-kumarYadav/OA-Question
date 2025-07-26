import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Function to handle session expiration
const handleSessionExpiration = () => {
  // Clear all authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('expiresInHours');
  localStorage.removeItem('expiresInMinutes');
  
  // Show a toast notification
  toast.info('Session expired. Please login again.');
  
  // Redirect to login page if not already there
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        handleSessionExpiration();
        return Promise.reject(new Error('Token expired'));
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 Unauthorized (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleSessionExpiration();
    }
    return Promise.reject(error);
  }
);

export default api; 