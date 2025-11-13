import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../config/axios';

const PasswordRoute = ({ children }) => {
  const { passwordVerified } = useAuth();
  const [checking, setChecking] = useState(true);
  const [protectionEnabled, setProtectionEnabled] = useState(true);

  // Check with server if password protection is enabled
  useEffect(() => {
    const checkProtectionStatus = async () => {
      try {
        const res = await axiosInstance.get('/api/site-settings/protection-status');
        setProtectionEnabled(res.data.isActive);
        
        // If protection is disabled, auto-verify
        if (!res.data.isActive) {
          // Protection is disabled, allow access
          setChecking(false);
        } else {
          // Protection is enabled, check if password is verified
          setChecking(false);
        }
      } catch (error) {
        console.error('Error checking protection status:', error);
        // On error, assume protection is enabled for security
        setProtectionEnabled(true);
        setChecking(false);
      }
    };

    checkProtectionStatus();
  }, []);

  // Show loading while checking
  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#333', fontSize: '1.1rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If protection is disabled, allow access
  if (!protectionEnabled) {
    return children;
  }

  // If protection is enabled but password is not verified, redirect to password protection page
  if (!passwordVerified) {
    return <Navigate to="/password-protection" replace />;
  }

  // If password is verified, render the children
  return children;
};

export default PasswordRoute;

