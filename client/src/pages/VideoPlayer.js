import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideo } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentVideo, getVideo, trackVideoView, videos, restorePreviousState } = useVideo();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadVideo = async () => {
      const video = await getVideo(id);
      if (video && isAuthenticated) {
        try {
          await trackVideoView(id);
        } catch (error) {
          console.error('Error tracking video view:', error);
        }
      }
    };
    loadVideo();
  }, [id, isAuthenticated]);

  const handleClose = async () => {
    // Restore previous state before navigating back
    await restorePreviousState();
    // Navigate with state to indicate we're restoring
    navigate('/', { state: { restoring: true } });
  };

  const getEmbedUrl = (driveUrl) => {
    const fileId = driveUrl.match(/\/d\/(.+?)(\/|$)/)?.[1];
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return driveUrl;
  };

  if (!currentVideo) {
    return (
      <div className="loading">
        Loading video...
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      zIndex: 1000,
      overflow: 'auto'
    }}>
      {/* Back Button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(0, 0, 0, 0.7)',
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1001,
          fontSize: '1rem',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
        }}
      >
        <FaArrowLeft /> Back
      </button>


      {/* Video Content - Full Screen */}
      <div style={{ 
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '2rem'
      }}>
        {/* Video Player - Full Screen */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '100%',
          height: 'calc(100vh - 200px)',
          minHeight: '500px',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <iframe
            src={getEmbedUrl(currentVideo.googleDriveUrl)}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={currentVideo.title}
            style={{
              border: 'none'
            }}
          />
        </div>

        {/* Video Info - Below Video */}
        <div style={{ 
          width: '100%',
          maxWidth: '1200px',
          marginTop: '2rem',
          padding: '0 2rem',
          color: 'white',
          textAlign: 'left'
        }}>
          <h1 style={{ 
            marginBottom: '1rem', 
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            textAlign: 'left',
            textTransform: 'none'
          }}>
            {currentVideo.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1.5rem', 
            fontSize: '0.95rem',
            marginBottom: '1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'left'
          }}>
            {currentVideo.instructor && (
              <span>
                <strong>Instructor:</strong> {currentVideo.instructor}
              </span>
            )}
            {currentVideo.duration && (
              <span>
                <strong>Duration:</strong> {Math.round(currentVideo.duration / 60)} minutes
              </span>
            )}
            {user?.role === 'admin' && (
              <span>
                <strong>Views:</strong> {currentVideo.viewCount || 0}
              </span>
            )}
          </div>

          {currentVideo.description && (
            <p style={{ 
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '1rem',
              textAlign: 'left'
            }}>
              {currentVideo.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 