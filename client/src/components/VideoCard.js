import React, { useState, useEffect } from 'react';
import { FaPlay, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import axiosInstance from '../config/axios';

const VideoCard = ({ video, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { currentCategory, loadSavedVideos } = useVideo();
  
  // Check if video is saved on mount
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!isAuthenticated || !video._id) return;
      
      try {
        const res = await axiosInstance.get(`/api/users/saved-videos/${video._id}`);
        setIsSaved(res.data.isSaved);
      } catch (error) {
        // If error, assume not saved
        setIsSaved(false);
      }
    };
    
    checkIfSaved();
  }, [isAuthenticated, video._id]);
  
  const handleClick = () => {
    onClick(video._id);
  };
  
  const handleSaveClick = async (e) => {
    e.stopPropagation(); // Prevent triggering the video card click
    
    if (!isAuthenticated) {
      alert('Please log in to save videos');
      return;
    }
    
    setIsSaving(true);
    try {
      if (isSaved) {
        // Remove from saved videos
        await axiosInstance.delete(`/api/users/saved-videos/${video._id}`);
        setIsSaved(false);
        
        // If we're on the saved videos page, reload the saved videos list
        if (currentCategory === 'saved') {
          await loadSavedVideos();
        }
      } else {
        // Save video
        await axiosInstance.post(`/api/users/saved-videos/${video._id}`);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving/unsaving video:', error);
      alert(error.response?.data?.message || 'Failed to save/unsave video');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate thumbnail from Google Drive URL
  const getThumbnailUrl = () => {
    // If we have a custom thumbnail URL, use it
    if (video.thumbnailUrl) {
      return video.thumbnailUrl;
    }
    
    // Try to generate thumbnail from Google Drive URL
    const fileId = video.googleDriveUrl?.match(/\/d\/(.+?)(\/|$)/)?.[1];
    if (fileId) {
      // Use Google Drive's thumbnail service
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w300-h200`;
    }
    
    // Fallback to a simple colored background with text
    return null;
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Create a fallback thumbnail with video info
  const renderFallbackThumbnail = () => {
    const categoryColors = {
      'workout-sports': '#28b6ea',
      'dance-move': '#8cc63e',
      'yoga': '#f7981e',
      'mindfulness': '#8cc63e',
      'pre-school': '#FFEAA7',
      'k-12': '#DDA0DD'
    };
    
    const bgColor = categoryColors[video.category] || '#2c3e50';
    
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
          textAlign: 'center',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: '600',
          borderRadius: '0'
        }}
      >
        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
          {video.category === 'yoga' ? '🧘' : 
           video.category === 'workout-sports' ? '💪' :
           video.category === 'dance-move' ? '💃' :
           video.category === 'mindfulness' ? '🧠' :
           video.category === 'pre-school' ? '👶' : '🎓'}
        </div>
        <div style={{ fontSize: '0.6rem', opacity: 0.9 }}>
          {video.category.replace('-', ' ').toUpperCase()}
        </div>
      </div>
    );
  };

  return (
    <div className="video-card" onClick={handleClick} style={{ position: 'relative' }}>
      <div className="video-thumbnail">
        {!imageError && getThumbnailUrl() ? (
          <img 
            src={getThumbnailUrl()} 
            alt={video.title}
            onError={handleImageError}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '0'
            }}
          />
        ) : (
          renderFallbackThumbnail()
        )}
        <div className="play-button">
          <FaPlay />
        </div>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          {video.instructor && (
            <p>Instructor: {video.instructor}</p>
          )}
          {video.duration && (
            <p>Duration: {Math.round(video.duration / 60)} minutes</p>
          )}
          {user?.role === 'admin' && (
            <p>Views: {video.viewCount || 0}</p>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <button
          className="save-video-button"
          onClick={handleSaveClick}
          onMouseEnter={(e) => {
            setShowTooltip(true);
            if (!isSaving) {
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            setShowTooltip(false);
            e.currentTarget.style.transform = 'scale(1)';
          }}
          disabled={isSaving}
          style={{
            position: 'absolute',
            bottom: '25px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            cursor: isSaving ? 'wait' : 'pointer',
            fontSize: '1.3rem',
            transition: 'all 0.3s ease',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px'
          }}
        >
          {isSaved ? (
            <FaHeart 
              style={{ 
                color: '#ff4757',
                transition: 'all 0.3s ease',
                fill: '#ff4757'
              }} 
            />
          ) : (
            <FaRegHeart 
              style={{ 
                color: '#ff4757',
                transition: 'all 0.3s ease'
              }} 
            />
          )}
          {showTooltip && (
            <span
              className="save-tooltip"
              style={{
                position: 'absolute',
                bottom: '50px',
                right: '0',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 11
              }}
            >
              {isSaved ? 'Remove from saved videos' : 'Save Video'}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default VideoCard; 