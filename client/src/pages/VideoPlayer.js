import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideo } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentVideo, getVideo, trackVideoView, restorePreviousState } = useVideo();
  const { isAuthenticated, user } = useAuth();
  const viewTrackedRef = useRef(false);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const currentVideoIdRef = useRef(null);
  const isTrackingRef = useRef(false);

  useEffect(() => {
    // Only reset if video ID actually changed
    if (currentVideoIdRef.current !== id) {
      // Clean up previous video's timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      // Reset tracking state for new video
      viewTrackedRef.current = false;
      startTimeRef.current = null;
      isTrackingRef.current = false;
      currentVideoIdRef.current = id;
    }

    const loadVideo = async () => {
      try {
        const video = await getVideo(id);
        if (video && isAuthenticated && !isTrackingRef.current) {
          // Start tracking time when video loads
          startTimeRef.current = Date.now();
          viewTrackedRef.current = false;
          isTrackingRef.current = true;

          // Set up timer to track view after 1 minute (60 seconds)
          timerRef.current = setTimeout(async () => {
            // Double-check we're still on the same video and haven't tracked yet
            if (currentVideoIdRef.current === id && !viewTrackedRef.current && isAuthenticated) {
              try {
                await trackVideoView(id);
                viewTrackedRef.current = true;
              } catch (error) {
                // Silently handle 429 errors (rate limiting) - don't spam console
                if (error.response?.status !== 429) {
                  console.error('Error tracking video view:', error);
                }
              }
            }
          }, 60000); // 60 seconds = 1 minute
        }
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };
    
    loadVideo();

    // Cleanup: track view if user leaves after watching for at least 1 minute
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      // If user has been on page for at least 1 minute and view hasn't been tracked yet
      if (currentVideoIdRef.current === id && 
          startTimeRef.current && 
          !viewTrackedRef.current && 
          isAuthenticated &&
          isTrackingRef.current) {
        const timeSpent = Date.now() - startTimeRef.current;
        if (timeSpent >= 60000) { // 60 seconds
          trackVideoView(id).catch(error => {
            // Silently handle 429 errors
            if (error.response?.status !== 429) {
              console.error('Error tracking video view on unmount:', error);
            }
          });
        }
      }
      
      // Reset tracking flag when component unmounts
      isTrackingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]); // Intentionally excluding getVideo and trackVideoView to prevent unnecessary re-runs

  const handleClose = async () => {
    // Restore previous state before navigating back
    await restorePreviousState();
    // Navigate with state to indicate we're restoring
    navigate('/', { state: { restoring: true } });
  };

  const extractYouTubeId = (url) => {
    if (!url) return '';

    // Bare ID
    const bareIdMatch = url.match(/^[a-zA-Z0-9_-]{8,}$/);
    if (bareIdMatch) {
      return bareIdMatch[0];
    }

    const patterns = [
      /[?&]v=([^&#]+)/,
      /youtu\.be\/([^&#?/]+)/,
      /youtube\.com\/embed\/([^&#?/]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return '';
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';

    // Prefer YouTube if possible
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    }

    // Backwards compatibility: Google Drive preview
    const fileId = url.match(/\/d\/(.+?)(\/|$)/)?.[1];
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return url;
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
              border: 'none',
              pointerEvents: 'auto'
            }}
          />
          {/* Overlay to block pop-out button in top-right corner */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '60px',
              zIndex: 10,
              pointerEvents: 'auto',
              cursor: 'default'
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
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