import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import PasswordRoute from './components/PasswordRoute';
import PasswordOnlyRoute from './components/PasswordOnlyRoute';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import VideoPlayer from './pages/VideoPlayer';
import PasswordProtection from './pages/PasswordProtection';

// Styles
import './App.css';
import backgroundImage from './img/background.png';

function App() {
  useEffect(() => {
    // Set the background image dynamically
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
  }, []);

  return (
    <AuthProvider>
      <VideoProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Password Protection Route - No Navbar */}
              <Route path="/password-protection" element={<PasswordProtection />} />
              
              {/* Login/Register Routes - Accessible after password verification only */}
              <Route path="/login" element={
                <PasswordOnlyRoute>
                  <Navbar />
                  <main className="main-content">
                    <Login />
                  </main>
                </PasswordOnlyRoute>
              } />
              <Route path="/register" element={
                <PasswordOnlyRoute>
                  <Navbar />
                  <main className="main-content">
                    <Register />
                  </main>
                </PasswordOnlyRoute>
              } />
              <Route path="/forgot-password" element={
                <PasswordOnlyRoute>
                  <Navbar />
                  <main className="main-content">
                    <ForgotPassword />
                  </main>
                </PasswordOnlyRoute>
              } />
              <Route path="/reset-password/:token" element={
                <PasswordOnlyRoute>
                  <Navbar />
                  <main className="main-content">
                    <ResetPassword />
                  </main>
                </PasswordOnlyRoute>
              } />
              
              {/* All other routes require both password verification AND authentication */}
              <Route path="/*" element={
                <PasswordRoute>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      {/* Home and Video Player require authentication */}
                      <Route 
                        path="/" 
                        element={
                          <PrivateRoute>
                            <Home />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="/video/:id" 
                        element={
                          <PrivateRoute>
                            <VideoPlayer />
                          </PrivateRoute>
                        } 
                      />
                      
                      {/* Protected Routes */}
                      <Route 
                        path="/profile" 
                        element={
                          <PrivateRoute>
                            <Profile />
                          </PrivateRoute>
                        } 
                      />
                      
                      {/* Admin Routes */}
                      <Route 
                        path="/admin/*" 
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        } 
                      />
                      
                      {/* Catch all route - redirect to login if not authenticated */}
                      <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                  </main>
                </PasswordRoute>
              } />
            </Routes>
          </div>
        </Router>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App; 