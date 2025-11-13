import React, { useState, useEffect } from 'react';
import { FaUsers, FaVideo, FaChartBar, FaCog, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../config/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalViews: 0
  });
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showEditVideo, setShowEditVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    category: 'workout-sports',
    subcategory: ['pre-k-2'], // Array of subcategories
    googleDriveUrl: '',
    instructor: '',
    duration: 300, // 5 minutes in seconds
    tags: '',
    featured: false,
    thumbnailUrl: ''
  });

  const [editVideo, setEditVideo] = useState({
    title: '',
    description: '',
    category: 'workout-sports',
    subcategory: ['pre-k-2'], // Array of subcategories
    googleDriveUrl: '',
    instructor: '',
    duration: 300, // 5 minutes in seconds
    tags: '',
    featured: false,
    thumbnailUrl: ''
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState(null);
  const [editThumbnailPreview, setEditThumbnailPreview] = useState(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [bannerSettings, setBannerSettings] = useState({
    text: 'Coach Connect 2025-2026, Coach Camps, Coach Summit (Spring)',
    color: '#28b6ea',
    hyperlink: '',
    isActive: true
  });
  const [bannerLoading, setBannerLoading] = useState(false);
  
  const [sitePasswordSettings, setSitePasswordSettings] = useState({
    newPassword: '',
    confirmPassword: '',
    isActive: true
  });
  const [sitePasswordLoading, setSitePasswordLoading] = useState(false);

  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    address: ''
  });
  const [createAdminLoading, setCreateAdminLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FaChartBar /> },
    { id: 'users', name: 'Users', icon: <FaUsers /> },
    { id: 'videos', name: 'Videos', icon: <FaVideo /> },
    { id: 'settings', name: 'Settings', icon: <FaCog /> }
  ];

  const categories = [
    { id: 'workout-sports', name: 'Workout & Sports' },
    { id: 'dance-move', name: 'Dance & Move' },
    { id: 'yoga', name: 'Yoga' },
    { id: 'mindfulness', name: 'Mindfulness' }
  ];

  const subcategories = [
    { id: 'pre-k-2', name: 'Pre-K - 2' },
    { id: 'grades-3-4', name: 'Grades 3-4' },
    { id: 'grades-5-8', name: 'Grades 5-8' },
    { id: 'high-school', name: 'High School' }
  ];

  const durations = [
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 900, label: '15 minutes' },
    { value: 1200, label: '20 minutes' }
  ];

  useEffect(() => {
    if (activeTab === 'videos') {
      loadVideos();
    } else if (activeTab === 'overview') {
      loadAnalytics();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'settings') {
      loadBannerSettings();
      loadSitePasswordSettings();
    }
  }, [activeTab]);

  const loadAnalytics = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/analytics');
      setAnalytics({
        totalUsers: response.data.totalUsers,
        totalVideos: response.data.totalVideos,
        totalViews: response.data.totalViews
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadVideos = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const loadBannerSettings = async () => {
    try {
      const response = await axiosInstance.get('/api/banner');
      setBannerSettings(response.data);
    } catch (error) {
      console.error('Error loading banner settings:', error);
    }
  };

  const loadSitePasswordSettings = async () => {
    try {
      const response = await axiosInstance.get('/api/site-settings');
      setSitePasswordSettings(prev => ({
        ...prev,
        isActive: response.data.isActive
      }));
    } catch (error) {
      console.error('Error loading site password settings:', error);
    }
  };

  const updateSitePassword = async (e) => {
    e.preventDefault();
    
    if (sitePasswordSettings.newPassword !== sitePasswordSettings.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (sitePasswordSettings.newPassword.length < 4) {
      alert('Password must be at least 4 characters long');
      return;
    }

    setSitePasswordLoading(true);
    try {
      await axiosInstance.put('/api/site-settings/password', {
        newPassword: sitePasswordSettings.newPassword
      });
      setSitePasswordSettings({
        newPassword: '',
        confirmPassword: '',
        isActive: sitePasswordSettings.isActive
      });
      alert('Site password updated successfully!');
    } catch (error) {
      console.error('Error updating site password:', error);
      alert(error.response?.data?.message || 'Failed to update site password');
    } finally {
      setSitePasswordLoading(false);
    }
  };

  const togglePasswordProtection = async () => {
    try {
      const response = await axiosInstance.put('/api/site-settings/toggle');
      setSitePasswordSettings(prev => ({
        ...prev,
        isActive: response.data.isActive
      }));
      alert(`Password protection ${response.data.isActive ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling password protection:', error);
      alert(error.response?.data?.message || 'Failed to toggle password protection');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newAdmin.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setCreateAdminLoading(true);
    try {
      const { confirmPassword, ...adminData } = newAdmin;
      await axiosInstance.post('/api/admin/users', {
        ...adminData,
        role: 'admin'
      });
      alert('Admin user created successfully!');
      setShowCreateAdmin(false);
      setNewAdmin({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        schoolName: '',
        address: ''
      });
      loadUsers();
    } catch (error) {
      console.error('Error creating admin:', error);
      alert(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to create admin user');
    } finally {
      setCreateAdminLoading(false);
    }
  };

  const updateBannerSettings = async (e) => {
    e.preventDefault();
    setBannerLoading(true);
    try {
      const response = await axiosInstance.put('/api/banner', bannerSettings);
      setBannerSettings(response.data);
      alert('Banner settings updated successfully!');
    } catch (error) {
      console.error('Error updating banner settings:', error);
      alert(error.response?.data?.message || 'Failed to update banner settings');
    } finally {
      setBannerLoading(false);
    }
  };

  const handleThumbnailUpload = async (file, isEdit = false) => {
    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);

      const response = await axiosInstance.post('/api/admin/videos/upload-thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const thumbnailUrl = response.data.thumbnailUrl;
      
      if (isEdit) {
        setEditVideo({ ...editVideo, thumbnailUrl });
      } else {
        setNewVideo({ ...newVideo, thumbnailUrl });
      }

      return thumbnailUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert(error.response?.data?.message || 'Failed to upload thumbnail');
      return null;
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleThumbnailChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditThumbnailPreview(reader.result);
          setEditThumbnailFile(file);
        } else {
          setThumbnailPreview(reader.result);
          setThumbnailFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Form submitted with data:', newVideo);
      
      // Validate required fields
      if (!newVideo.title.trim()) {
        alert('Please enter a video title');
        setLoading(false);
        return;
      }
      
      if (!newVideo.googleDriveUrl.trim()) {
        alert('Please enter a Google Drive URL');
        setLoading(false);
        return;
      }
      
      // Extract Google Drive ID from URL
      const driveId = extractDriveId(newVideo.googleDriveUrl);
      console.log('Extracted Drive ID:', driveId);
      
      if (!driveId) {
        alert('Could not extract Google Drive ID from the provided URL. Please check the URL format.');
        setLoading(false);
        return;
      }

      // Upload thumbnail if a file was selected
      let thumbnailUrl = newVideo.thumbnailUrl;
      if (thumbnailFile) {
        thumbnailUrl = await handleThumbnailUpload(thumbnailFile, false);
        if (!thumbnailUrl) {
          setLoading(false);
          return;
        }
      }

      // Validate that at least one subcategory is selected
      if (!newVideo.subcategory || newVideo.subcategory.length === 0) {
        alert('Please select at least one subcategory');
        setLoading(false);
        return;
      }
      
      const videoData = {
        ...newVideo,
        googleDriveId: driveId,
        tags: newVideo.tags ? newVideo.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        duration: parseInt(newVideo.duration) || 300,
        thumbnailUrl: thumbnailUrl || undefined
      };

      console.log('Sending video data:', videoData);
      const response = await axiosInstance.post('/api/admin/videos', videoData);
      console.log('Video added successfully:', response.data);
      
      alert('Video added successfully!');
      setShowAddVideo(false);
      setNewVideo({
        title: '',
        description: '',
        category: 'workout-sports',
        subcategory: ['pre-k-2'],
        googleDriveUrl: '',
        instructor: '',
        duration: 300,
        tags: '',
        featured: false,
        thumbnailUrl: ''
      });
      setThumbnailFile(null);
      setThumbnailPreview(null);
      loadVideos();
    } catch (error) {
      console.error('Error adding video:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error adding video: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractDriveId = (url) => {
    if (!url) return '';
    
    // Handle different Google Drive URL formats
    const patterns = [
      /\/d\/([a-zA-Z0-9-_]+)/,  // Standard format: /d/ID
      /id=([a-zA-Z0-9-_]+)/,    // Alternative format: ?id=ID
      /file\/d\/([a-zA-Z0-9-_]+)/  // Another format: /file/d/ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    // If no pattern matches, return the original URL
    console.warn('Could not extract Google Drive ID from URL:', url);
    return url;
  };

  const deleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axiosInstance.delete(`/api/admin/videos/${id}`);
        loadVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const startEditVideo = (video) => {
    setEditingVideo(video);
    setEditVideo({
      title: video.title,
      description: video.description || '',
      category: video.category,
      subcategory: Array.isArray(video.subcategory) ? video.subcategory : [video.subcategory || 'pre-k-2'],
      googleDriveUrl: video.googleDriveUrl,
      instructor: video.instructor || '',
      duration: video.duration || 300,
      tags: video.tags ? video.tags.join(', ') : '',
      featured: video.featured || false,
      thumbnailUrl: video.thumbnailUrl || ''
    });
    // Set preview if thumbnail exists
    if (video.thumbnailUrl) {
      // If it's already a full URL, use it; otherwise use relative path
      const thumbnailUrl = video.thumbnailUrl.startsWith('http') 
        ? video.thumbnailUrl 
        : video.thumbnailUrl;
      setEditThumbnailPreview(thumbnailUrl);
    } else {
      setEditThumbnailPreview(null);
    }
    setEditThumbnailFile(null);
    setShowEditVideo(true);
  };

  const handleEditVideo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload thumbnail if a new file was selected
      let thumbnailUrl = editVideo.thumbnailUrl;
      if (editThumbnailFile) {
        thumbnailUrl = await handleThumbnailUpload(editThumbnailFile, true);
        if (!thumbnailUrl) {
          setLoading(false);
          return;
        }
      }

      // Validate that at least one subcategory is selected
      if (!editVideo.subcategory || editVideo.subcategory.length === 0) {
        alert('Please select at least one subcategory');
        setLoading(false);
        return;
      }
      
      const videoData = {
        ...editVideo,
        tags: editVideo.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        thumbnailUrl: thumbnailUrl || undefined
      };

      await axiosInstance.put(`/api/admin/videos/${editingVideo._id}`, videoData);
      alert('Video updated successfully!');
      setShowEditVideo(false);
      setEditingVideo(null);
      setEditVideo({
        title: '',
        description: '',
        category: 'workout-sports',
        subcategory: ['pre-k-2'],
        googleDriveUrl: '',
        instructor: '',
        duration: 300,
        tags: '',
        featured: false,
        thumbnailUrl: ''
      });
      setEditThumbnailFile(null);
      setEditThumbnailPreview(null);
      loadVideos();
    } catch (error) {
      console.error('Error updating video:', error);
      alert(`Error updating video: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <FaCog style={{ fontSize: '3rem', color: '#45B7D1', marginBottom: '1rem' }} />
          <h2>Admin Dashboard</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Manage users, videos, and view analytics
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-success' : 'btn-secondary'}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '12px 20px'
              }}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'overview' && (
            <div>
              <h3>Dashboard Overview</h3>
              <p>Welcome to the admin dashboard! This is where you can manage all aspects of the Wellness in Schools platform.</p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem', 
                marginTop: '2rem' 
              }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <FaUsers style={{ fontSize: '2rem', color: '#FF6B35', marginBottom: '1rem' }} />
                  <h4>Total Users</h4>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF6B35' }}>{analytics.totalUsers}</p>
                </div>
                
                <div className="card" style={{ textAlign: 'center' }}>
                  <FaVideo style={{ fontSize: '2rem', color: '#4ECDC4', marginBottom: '1rem' }} />
                  <h4>Total Videos</h4>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ECDC4' }}>{analytics.totalVideos}</p>
                </div>
                
                <div className="card" style={{ textAlign: 'center' }}>
                  <FaChartBar style={{ fontSize: '2rem', color: '#45B7D1', marginBottom: '1rem' }} />
                  <h4>Total Views</h4>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#45B7D1' }}>{analytics.totalViews}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>User Management</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setShowCreateAdmin(true)}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FaPlus /> Create Admin
                  </button>
                  <button
                    onClick={loadUsers}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  >
                    Refresh
                  </button>
                </div>
              </div>
              <p>Manage user accounts, view statistics, and monitor activity.</p>
              
              {/* Search Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Search by username, email, or school name..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '12px 16px',
                    borderRadius: '25px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6B35';
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                />
              </div>
              
              {/* Filter users based on search query */}
              {(() => {
                const filteredUsers = users.filter(user => {
                  const searchLower = userSearchQuery.toLowerCase();
                  return (
                    user.username?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.schoolName?.toLowerCase().includes(searchLower)
                  );
                });
                
                return filteredUsers.length > 0 ? (
                <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.1)', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontWeight: '600' }}>Username</th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontWeight: '600' }}>Email</th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontWeight: '600' }}>School Name</th>
                        <th style={{ padding: '1rem', textAlign: 'center', color: '#fff', fontWeight: '600' }}>Role</th>
                        <th style={{ padding: '1rem', textAlign: 'center', color: '#fff', fontWeight: '600' }}>Total Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr 
                          key={user._id} 
                          style={{ 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.parentElement.style.background = 'rgba(255, 255, 255, 0.05)'}
                          onMouseLeave={(e) => e.target.parentElement.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'}
                        >
                          <td style={{ padding: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>{user.username}</td>
                          <td style={{ padding: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>{user.email || 'N/A'}</td>
                          <td style={{ padding: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>{user.schoolName || 'N/A'}</td>
                          <td style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              background: user.role === 'admin' 
                                ? 'linear-gradient(45deg, #FF6B35, #f7981e)' 
                                : 'rgba(255, 255, 255, 0.2)',
                              color: 'white'
                            }}>
                              {user.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>
                            {user.totalViews || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                ) : filteredUsers.length === 0 && userSearchQuery ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <FaUsers style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                    <p>No users found matching your search.</p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <FaUsers style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                    <p>No users found.</p>
                  </div>
                )
              })()}

              {/* Create Admin Modal */}
              {showCreateAdmin && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2000,
                  padding: '2rem'
                }}>
                  <div style={{
                    background: 'rgba(44, 62, 80, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '2rem',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ color: '#fff', margin: 0 }}>Create Admin User</h3>
                      <button
                        onClick={() => {
                          setShowCreateAdmin(false);
                          setNewAdmin({
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            schoolName: '',
                            address: ''
                          });
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          padding: '0',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <form onSubmit={handleCreateAdmin}>
                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          value={newAdmin.username}
                          onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                          className="form-input"
                          placeholder="Enter username"
                          required
                          minLength={3}
                          maxLength={30}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          className="form-input"
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                          className="form-input"
                          placeholder="Enter password (min 6 characters)"
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          value={newAdmin.confirmPassword}
                          onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                          className="form-input"
                          placeholder="Confirm password"
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">School Name</label>
                        <input
                          type="text"
                          value={newAdmin.schoolName}
                          onChange={(e) => setNewAdmin({ ...newAdmin, schoolName: e.target.value })}
                          className="form-input"
                          placeholder="Enter school name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          value={newAdmin.address}
                          onChange={(e) => setNewAdmin({ ...newAdmin, address: e.target.value })}
                          className="form-input"
                          placeholder="Enter address"
                          required
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={createAdminLoading}
                          style={{ flex: 1 }}
                        >
                          {createAdminLoading ? 'Creating...' : 'Create Admin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateAdmin(false);
                            setNewAdmin({
                              username: '',
                              email: '',
                              password: '',
                              confirmPassword: '',
                              schoolName: '',
                              address: ''
                            });
                          }}
                          className="btn btn-secondary"
                          style={{ flex: 1 }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Video Management</h3>
                <button
                  onClick={() => setShowAddVideo(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <FaPlus />
                  Add Video
                </button>
              </div>

              {showAddVideo && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                  <h4>Add New Video</h4>
                  <form onSubmit={handleAddVideo}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          value={newVideo.title}
                          onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          value={newVideo.category}
                          onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
                          className="form-input"
                          required
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Subcategory (Select all that apply)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {subcategories.map(sub => (
                            <label key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={newVideo.subcategory.includes(sub.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewVideo({
                                      ...newVideo,
                                      subcategory: [...newVideo.subcategory, sub.id]
                                    });
                                  } else {
                                    setNewVideo({
                                      ...newVideo,
                                      subcategory: newVideo.subcategory.filter(s => s !== sub.id)
                                    });
                                  }
                                }}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <span>{sub.name}</span>
                            </label>
                          ))}
                        </div>
                        {newVideo.subcategory.length === 0 && (
                          <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Please select at least one subcategory
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Duration</label>
                        <select
                          value={newVideo.duration}
                          onChange={(e) => setNewVideo({...newVideo, duration: parseInt(e.target.value)})}
                          className="form-input"
                          required
                        >
                          {durations.map(dur => (
                            <option key={dur.value} value={dur.value}>{dur.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Google Drive URL</label>
                        <input
                          type="url"
                          value={newVideo.googleDriveUrl}
                          onChange={(e) => setNewVideo({...newVideo, googleDriveUrl: e.target.value})}
                          className="form-input"
                          placeholder="https://drive.google.com/file/d/..."
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Instructor</label>
                        <input
                          type="text"
                          value={newVideo.instructor}
                          onChange={(e) => setNewVideo({...newVideo, instructor: e.target.value})}
                          className="form-input"
                        />
                      </div>


                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        value={newVideo.description}
                        onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                        className="form-input"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={newVideo.tags}
                        onChange={(e) => setNewVideo({...newVideo, tags: e.target.value})}
                        className="form-input"
                        placeholder="workout, morning, energy"
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Thumbnail (optional)</label>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={(e) => handleThumbnailChange(e, false)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '1rem',
                              cursor: 'pointer'
                            }}
                          />
                          <small style={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginTop: '0.5rem' }}>
                            Upload a custom thumbnail (JPEG, PNG, GIF, or WebP, max 5MB). If not provided, the default video thumbnail will be used.
                          </small>
                        </div>
                        {thumbnailPreview && (
                          <div style={{ 
                            width: '150px', 
                            height: '100px', 
                            borderRadius: '5px',
                            overflow: 'hidden',
                            border: '2px solid rgba(255, 255, 255, 0.3)'
                          }}>
                            <img 
                              src={thumbnailPreview} 
                              alt="Thumbnail preview" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }} 
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={newVideo.featured}
                          onChange={(e) => setNewVideo({...newVideo, featured: e.target.checked})}
                        />
                        Featured Video
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Video'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddVideo(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showEditVideo && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                  <h4>Edit Video: {editingVideo?.title}</h4>
                  <form onSubmit={handleEditVideo}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          value={editVideo.title}
                          onChange={(e) => setEditVideo({...editVideo, title: e.target.value})}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          value={editVideo.category}
                          onChange={(e) => setEditVideo({...editVideo, category: e.target.value})}
                          className="form-input"
                          required
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Subcategory (Select all that apply)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {subcategories.map(sub => (
                            <label key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={editVideo.subcategory.includes(sub.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditVideo({
                                      ...editVideo,
                                      subcategory: [...editVideo.subcategory, sub.id]
                                    });
                                  } else {
                                    setEditVideo({
                                      ...editVideo,
                                      subcategory: editVideo.subcategory.filter(s => s !== sub.id)
                                    });
                                  }
                                }}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <span>{sub.name}</span>
                            </label>
                          ))}
                        </div>
                        {editVideo.subcategory.length === 0 && (
                          <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Please select at least one subcategory
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Duration</label>
                        <select
                          value={editVideo.duration}
                          onChange={(e) => setEditVideo({...editVideo, duration: parseInt(e.target.value)})}
                          className="form-input"
                          required
                        >
                          {durations.map(dur => (
                            <option key={dur.value} value={dur.value}>{dur.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Google Drive URL</label>
                        <input
                          type="url"
                          value={editVideo.googleDriveUrl}
                          onChange={(e) => setEditVideo({...editVideo, googleDriveUrl: e.target.value})}
                          className="form-input"
                          placeholder="https://drive.google.com/file/d/..."
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Instructor</label>
                        <input
                          type="text"
                          value={editVideo.instructor}
                          onChange={(e) => setEditVideo({...editVideo, instructor: e.target.value})}
                          className="form-input"
                        />
                      </div>

                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        value={editVideo.description}
                        onChange={(e) => setEditVideo({...editVideo, description: e.target.value})}
                        className="form-input"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={editVideo.tags}
                        onChange={(e) => setEditVideo({...editVideo, tags: e.target.value})}
                        className="form-input"
                        placeholder="workout, morning, energy"
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Thumbnail (optional)</label>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={(e) => handleThumbnailChange(e, true)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '1rem',
                              cursor: 'pointer'
                            }}
                          />
                          <small style={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginTop: '0.5rem' }}>
                            Upload a new thumbnail to replace the current one (JPEG, PNG, GIF, or WebP, max 5MB). If not provided, the current thumbnail will be kept.
                          </small>
                        </div>
                        {editThumbnailPreview && (
                          <div style={{ 
                            width: '150px', 
                            height: '100px', 
                            borderRadius: '5px',
                            overflow: 'hidden',
                            border: '2px solid rgba(255, 255, 255, 0.3)'
                          }}>
                            <img 
                              src={editThumbnailPreview.startsWith('data:') || editThumbnailPreview.startsWith('http') 
                                ? editThumbnailPreview 
                                : editThumbnailPreview} 
                              alt="Thumbnail preview" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }} 
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={editVideo.featured}
                          onChange={(e) => setEditVideo({...editVideo, featured: e.target.checked})}
                        />
                        Featured Video
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Video'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditVideo(false);
                          setEditingVideo(null);
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div>
                <h4>Current Videos ({videos.length})</h4>
                {videos.length > 0 ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {videos.map((video) => (
                      <div key={video._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h5>{video.title}</h5>
                          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                            {video.category} • {Array.isArray(video.subcategory) ? video.subcategory.join(', ') : (video.subcategory || 'pre-k-2')} • {video.duration ? Math.round(video.duration / 60) + 'min' : '5min'} • {video.instructor}
                          </p>
                          <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {video.description}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => startEditVideo(video)}
                            className="btn btn-secondary"
                            style={{ padding: '8px 12px' }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteVideo(video._id)}
                            className="btn btn-danger"
                            style={{ padding: '8px 12px' }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <FaVideo style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                    <p>No videos found. Add your first video!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3>Platform Settings</h3>
              <p>Configure platform settings and preferences.</p>
              
              {/* Banner Settings */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '2rem',
                marginTop: '2rem'
              }}>
                <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Scrolling Banner Configuration</h4>
                <form onSubmit={updateBannerSettings}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '600' }}>
                      Banner Text:
                    </label>
                    <input
                      type="text"
                      value={bannerSettings.text}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, text: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                        background: '#fff',
                        color: '#333'
                      }}
                      placeholder="Coach Connect 2025-2026, Coach Camps, Coach Summit (Spring)"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '600' }}>
                      Banner Color (Hex):
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={bannerSettings.color}
                        onChange={(e) => setBannerSettings({ ...bannerSettings, color: e.target.value })}
                        style={{
                          width: '60px',
                          height: '40px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                          cursor: 'pointer'
                        }}
                      />
                      <input
                        type="text"
                        value={bannerSettings.color}
                        onChange={(e) => setBannerSettings({ ...bannerSettings, color: e.target.value })}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                          fontSize: '1rem',
                          background: '#fff',
                          color: '#333'
                        }}
                        placeholder="#28b6ea"
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '600' }}>
                      Hyperlink (optional):
                    </label>
                    <input
                      type="url"
                      value={bannerSettings.hyperlink}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, hyperlink: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                        background: '#fff',
                        color: '#333'
                      }}
                      placeholder="https://example.com"
                    />
                    <small style={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginTop: '0.5rem' }}>
                      Leave empty if you don't want the banner to be clickable
                    </small>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bannerSettings.isActive}
                        onChange={(e) => setBannerSettings({ ...bannerSettings, isActive: e.target.checked })}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <span>Show Banner</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={bannerLoading}
                    style={{
                      padding: '12px 24px',
                      background: bannerLoading ? '#666' : 'linear-gradient(45deg, #28b6ea, #28b6eadd)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: bannerLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {bannerLoading ? 'Updating...' : 'Update Banner Settings'}
                  </button>
                </form>

                {/* Preview */}
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <h5 style={{ marginBottom: '1rem', color: '#fff' }}>Preview:</h5>
                  <div
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      background: bannerSettings.color,
                      color: 'white',
                      padding: '12px 0',
                      borderRadius: '5px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {bannerSettings.hyperlink ? (
                      <a
                        href={bannerSettings.hyperlink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '1rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        {bannerSettings.text}
                      </a>
                    ) : (
                      <span style={{
                        fontWeight: '600',
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {bannerSettings.text}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Site Password Protection Settings */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '2rem',
                marginTop: '2rem'
              }}>
                <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Site Password Protection</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  This password protects the entire site. Users must enter this password before accessing the platform.
                </p>
                
                <form onSubmit={updateSitePassword}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '600' }}>
                      New Password:
                    </label>
                    <input
                      type="password"
                      value={sitePasswordSettings.newPassword}
                      onChange={(e) => setSitePasswordSettings({ ...sitePasswordSettings, newPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                        background: '#fff',
                        color: '#333'
                      }}
                      placeholder="Enter new password"
                      minLength={4}
                      required
                    />
                    <small style={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginTop: '0.5rem' }}>
                      Minimum 4 characters
                    </small>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '600' }}>
                      Confirm Password:
                    </label>
                    <input
                      type="password"
                      value={sitePasswordSettings.confirmPassword}
                      onChange={(e) => setSitePasswordSettings({ ...sitePasswordSettings, confirmPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                        background: '#fff',
                        color: '#333'
                      }}
                      placeholder="Confirm new password"
                      minLength={4}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={sitePasswordSettings.isActive}
                        onChange={togglePasswordProtection}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <span>Enable Password Protection</span>
                    </label>
                    <small style={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginTop: '0.5rem', marginLeft: '30px' }}>
                      When disabled, users can access the site without entering a password
                    </small>
                  </div>

                  <button
                    type="submit"
                    disabled={sitePasswordLoading || !sitePasswordSettings.newPassword || !sitePasswordSettings.confirmPassword}
                    style={{
                      padding: '12px 24px',
                      background: sitePasswordLoading || !sitePasswordSettings.newPassword || !sitePasswordSettings.confirmPassword 
                        ? '#666' 
                        : 'linear-gradient(45deg, #28b6ea, #28b6eadd)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: sitePasswordLoading || !sitePasswordSettings.newPassword || !sitePasswordSettings.confirmPassword 
                        ? 'not-allowed' 
                        : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {sitePasswordLoading ? 'Updating...' : 'Update Site Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 