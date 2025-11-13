import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../img/logo.png';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout, passwordVerified } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/password-protection');
  };

  // Check if password verification is still valid (within 24 hours)
  const isPasswordVerificationValid = () => {
    const verified = localStorage.getItem('passwordVerified');
    const verifiedTimestamp = localStorage.getItem('passwordVerifiedTimestamp');
    
    if (verified !== 'true' || !verifiedTimestamp) {
      return false;
    }
    
    // Check if verification is older than 24 hours
    const now = Date.now();
    const timestamp = parseInt(verifiedTimestamp, 10);
    const hoursSinceVerification = (now - timestamp) / (1000 * 60 * 60);
    
    return hoursSinceVerification <= 24;
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    
    // If user is authenticated, navigate to home
    if (isAuthenticated) {
      navigate('/');
      return;
    }
    
    // If user is not authenticated, check password verification status
    if (isPasswordVerificationValid()) {
      // Password verification is still valid (within 24 hours), go to login page
      navigate('/login');
    } else {
      // Password verification expired or doesn't exist, go to password protection
      navigate('/password-protection');
    }
  };

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          onClick={handleLogoClick}
          style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <img 
            src={logo} 
            alt="Wellness in Schools Logo" 
            style={{ 
              height: '50px', 
              width: 'auto',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} 
          />
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Welcome, {user?.username}!
                </span>
                
                {/* Profile Link */}
                <Link to="/profile" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  Profile
                </Link>

                {/* Admin Link (if admin) */}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-success" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    <FaCog style={{ marginRight: '0.5rem' }} />
                    Admin
                  </Link>
                )}

                {/* Logout Button */}
                <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Login Link */}
              <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                <FaSignInAlt style={{ marginRight: '0.5rem' }} />
                Login
              </Link>

              {/* Register Link */}
              <Link to="/register" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                <FaUserPlus style={{ marginRight: '0.5rem' }} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 