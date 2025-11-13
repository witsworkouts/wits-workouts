import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PasswordOnlyRoute = ({ children }) => {
  const { passwordVerified } = useAuth();

  // If password is not verified, redirect to password protection page
  if (!passwordVerified) {
    return <Navigate to="/password-protection" replace />;
  }

  // If password is verified, render the children (regardless of authentication status)
  return children;
};

export default PasswordOnlyRoute;

