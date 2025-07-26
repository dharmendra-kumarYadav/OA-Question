import api from './api';
import { toast } from 'react-toastify';

const SIGNUP_URL = '/signup';
const LOGIN_URL = '/login';

// ✅ Signup API
export const signup = async (signupData) => {
  try {
    const response = await api.post(SIGNUP_URL, signupData);
    toast.success('Signup successful!');
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data || 'Signup failed. Please try again.';

    if (status === 400) {
      toast.error('Password and Confirm Password do not match.');
    } else if (status === 409) {
      toast.error('User with this email already exists.');
    } else {
      toast.error(`Signup failed: ${message}`);
    }

    console.error('Signup error:', message);
    throw error;
  }
};

// ✅ Login API
export const login = async (loginData) => {
  try {
    const response = await api.post(LOGIN_URL, loginData);
    toast.success('Login successful!');
    // Store token and role
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    
    // Store expiration time (could be in hours or minutes)
    if (response.data.expiresInHours) {
      localStorage.setItem('expiresInHours', response.data.expiresInHours);
      localStorage.removeItem('expiresInMinutes');
    } else if (response.data.expiresInMinutes) {
      localStorage.setItem('expiresInMinutes', response.data.expiresInMinutes);
      localStorage.removeItem('expiresInHours');
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data || 'Invalid email or password.';
    toast.error(`${message}`);
    console.error('Login error:', message);
    throw error;
  }
};
