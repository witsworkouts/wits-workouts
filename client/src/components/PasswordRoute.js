import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PasswordRoute = ({ children }) => {
  const { passwordVerified } = useAuth();

  // If password is not verified, redirect to password protection page
  // The password protection page will check if protection is enabled
  if (!passwordVerified) {
    return <Navigate to="/password-protection" replace />;
  }

  // If password is verified, render the children (allow access to home page without authentication)
  return children;
};

export default PasswordRoute;

