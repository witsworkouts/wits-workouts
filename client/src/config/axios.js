import axios from 'axios';

// Configure axios base URL based on environment
const getBaseURL = () => {
  // In production, use the API URL from environment variable or default to same origin
  if (process.env.NODE_ENV === 'production') {
    // If REACT_APP_API_URL is set, use it (for separate frontend/backend deployment)
    // Otherwise, use relative URLs (for combined deployment)
    return process.env.REACT_APP_API_URL || '';
  }
  // In development, use proxy (defined in package.json)
  return '';
};

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
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

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

