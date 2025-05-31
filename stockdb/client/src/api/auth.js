import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Registration failed';
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};

// Add other API calls that need authentication
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch user profile';
  }
};