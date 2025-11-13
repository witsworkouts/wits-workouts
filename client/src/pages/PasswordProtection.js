import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../config/axios';
import logo from '../img/logo-initial.png';
import backgroundImage from '../img/background.png';

const PasswordProtection = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const navigate = useNavigate();
  const { verifyPassword } = useAuth();

  // Check if password protection is enabled on mount
  useEffect(() => {
    const checkProtectionStatus = async () => {
      try {
        // Try with empty password - if protection is disabled, it will verify
        const res = await axiosInstance.post('/api/site-settings/verify-password', { password: '' });
        if (res.data.verified) {
          // Protection is disabled, auto-verify and redirect
          verifyPassword();
          navigate('/login');
        }
      } catch (error) {
        // If error, protection is likely enabled, show the form
      } finally {
        setCheckingStatus(false);
      }
    };
    checkProtectionStatus();
  }, [navigate, verifyPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axiosInstance.post('/api/site-settings/verify-password', { password });
      
      if (res.data.verified) {
        // Store that the user has entered the correct password
        verifyPassword();
        // Redirect to login/signup page
        navigate('/login');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Incorrect password. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
    
    setIsLoading(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  if (checkingStatus) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: '2rem',
          width: '100%',
          padding: '0 1rem',
          boxSizing: 'border-box'
        }}>
          <img 
            src={logo} 
            alt="Wellness in Schools Logo" 
            style={{ 
              height: '100px', 
              width: 'auto',
              maxWidth: 'calc(100% - 2rem)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              margin: '0 auto'
            }} 
          />
        </div>

        {/* Title */}
        <h1 style={{
          color: '#333',
          marginBottom: '1rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Content Protected
        </h1>

        {/* Description */}
        <p style={{
          color: '#666',
          marginBottom: '2rem',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          This content from <strong>Wellness in the Schools</strong> is password protected. 
          Please enter the password to continue.
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              color: '#e74c3c',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'white',
              background: isLoading || !password.trim() 
                ? '#bdc3c7' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px',
              cursor: isLoading || !password.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!isLoading && password.trim()) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && password.trim()) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          color: '#999',
          fontSize: '0.9rem',
          margin: 0
        }}>
          Need help? Contact your administrator.
        </p>
      </div>
    </div>
  );
};

export default PasswordProtection;
