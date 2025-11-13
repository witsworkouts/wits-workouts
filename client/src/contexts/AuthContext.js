import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axiosInstance from '../config/axios';

const AuthContext = createContext();

// Check if password verification is still valid (expires after 24 hours)
const getPasswordVerifiedStatus = () => {
  const verified = localStorage.getItem('passwordVerified');
  const verifiedTimestamp = localStorage.getItem('passwordVerifiedTimestamp');
  
  if (verified !== 'true' || !verifiedTimestamp) {
    return false;
  }
  
  // Check if verification is older than 24 hours
  const now = Date.now();
  const timestamp = parseInt(verifiedTimestamp, 10);
  const hoursSinceVerification = (now - timestamp) / (1000 * 60 * 60);
  
  if (hoursSinceVerification > 24) {
    // Expired - clear it
    localStorage.removeItem('passwordVerified');
    localStorage.removeItem('passwordVerifiedTimestamp');
    return false;
  }
  
  return true;
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
  passwordVerified: getPasswordVerifiedStatus()
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'PASSWORD_VERIFIED':
      return {
        ...state,
        passwordVerified: true
      };
    case 'PASSWORD_RESET':
      return {
        ...state,
        passwordVerified: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Token is handled by axios interceptor in config/axios.js
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axiosInstance.get('/api/auth/me');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: res.data, token: state.token }
          });
        } catch (error) {
          dispatch({ type: 'AUTH_FAIL', payload: 'Token invalid' });
        }
      } else {
        dispatch({ type: 'AUTH_FAIL', payload: null });
      }
    };

    loadUser();
  }, [state.token]);

  // Register user
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await axiosInstance.post('/api/auth/register', userData);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: res.data
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: res.data
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = () => {
    // Clear password verification when logging out
    localStorage.removeItem('passwordVerified');
    localStorage.removeItem('passwordVerifiedTimestamp');
    dispatch({ type: 'LOGOUT' });
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axiosInstance.put('/api/users/profile', userData);
      dispatch({ type: 'UPDATE_USER', payload: res.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      return { success: false, error: message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await axiosInstance.post('/api/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      await axiosInstance.post(`/api/auth/reset-password/${token}`, { password });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Password verification functions
  const verifyPassword = () => {
    localStorage.setItem('passwordVerified', 'true');
    localStorage.setItem('passwordVerifiedTimestamp', Date.now().toString());
    dispatch({ type: 'PASSWORD_VERIFIED' });
  };

  const resetPasswordVerification = () => {
    localStorage.removeItem('passwordVerified');
    localStorage.removeItem('passwordVerifiedTimestamp');
    dispatch({ type: 'PASSWORD_RESET' });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    passwordVerified: state.passwordVerified,
    register,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    clearError,
    verifyPassword,
    resetPasswordVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 