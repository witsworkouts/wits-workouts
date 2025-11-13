import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../img/logo.png';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCog, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout, passwordVerified } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          onClick={handleLogoClick}
          style={{ 
            textDecoration: 'none', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            flex: '0 0 auto'
          }}
        >
          <img 
            src={logo} 
            alt="Wellness in Schools Logo" 
            style={{ 
              height: '50px', 
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} 
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="welcome-text" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
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

        {/* Mobile Hamburger Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            zIndex: 101
          }}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="mobile-menu-overlay"
            onClick={closeMobileMenu}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99
            }}
          />
        )}

        {/* Mobile Menu */}
        <div 
          className="mobile-menu"
          style={{
            position: 'fixed',
            top: '70px',
            right: mobileMenuOpen ? '0' : '-100%',
            width: '280px',
            height: 'calc(100vh - 70px)',
            background: 'rgba(44, 62, 80, 0.98)',
            backdropFilter: 'blur(10px)',
            transition: 'right 0.3s ease',
            zIndex: 100,
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'auto',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          {isAuthenticated ? (
            <>
              {/* Welcome Message */}
              <div style={{ 
                paddingBottom: '1rem', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '1rem'
              }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Welcome,
                </p>
                <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>
                  {user?.username}
                </p>
              </div>

              {/* Profile Link */}
              <Link 
                to="/profile" 
                onClick={closeMobileMenu}
                className="btn btn-secondary" 
                style={{ 
                  padding: '12px 16px', 
                  fontSize: '1rem',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaUser />
                Profile
              </Link>

              {/* Admin Link (if admin) */}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={closeMobileMenu}
                  className="btn btn-success" 
                  style={{ 
                    padding: '12px 16px', 
                    fontSize: '1rem',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaCog />
                  Admin
                </Link>
              )}

              {/* Logout Button */}
              <button 
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }} 
                className="btn btn-danger" 
                style={{ 
                  padding: '12px 16px', 
                  fontSize: '1rem',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: 'auto'
                }}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Link */}
              <Link 
                to="/login" 
                onClick={closeMobileMenu}
                className="btn btn-primary" 
                style={{ 
                  padding: '12px 16px', 
                  fontSize: '1rem',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaSignInAlt />
                Login
              </Link>

              {/* Register Link */}
              <Link 
                to="/register" 
                onClick={closeMobileMenu}
                className="btn btn-secondary" 
                style={{ 
                  padding: '12px 16px', 
                  fontSize: '1rem',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaUserPlus />
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