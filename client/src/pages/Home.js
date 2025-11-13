import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVideo } from '../contexts/VideoContext';
import HorizontalVideoGrid from '../components/HorizontalVideoGrid';
import CategoryTabs from '../components/CategoryTabs';
import Leaderboard from '../components/Leaderboard';
import ChatBubble from '../components/ChatBubble';
import ScrollingBanner from '../components/ScrollingBanner';
import logo from '../img/logo.png';

const Home = () => {
  const { 
    videos, 
    categories, 
    currentCategory, 
    loading, 
    error, 
    leaderboard,
    loadVideosByCategory,
    loadVideosByCategoryAndSubcategory,
    loadFeaturedVideos,
    loadSavedVideos,
    searchVideos,
    clearError,
    savePreviousState,
    previousState,
    clearPreviousState
  } = useVideo();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('pre-k-2-5min');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // Restore search query and subcategory when state is restored
  useEffect(() => {
    if (previousState) {
      if (previousState.searchQuery) {
        setSearchQuery(previousState.searchQuery);
      }
      if (previousState.subcategory) {
        setActiveSubcategory(previousState.subcategory);
      }
      // Clear previousState after reading it (with a small delay to ensure state is set)
      setTimeout(() => {
        clearPreviousState();
      }, 100);
    }
  }, [previousState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fallback categories if the API fails
  const fallbackCategories = [
    { id: 'workout-sports', name: 'Workout & Sports', color: '#FF6B35' },
    { id: 'dance-move', name: 'Dance & Move', color: '#4ECDC4' },
    { id: 'yoga', name: 'Yoga', color: '#45B7D1' },
    { id: 'mindfulness', name: 'Mindfulness', color: '#8cc63e' }
  ];

  // Use fallback categories if the API categories are empty
  const displayCategories = categories && categories.length > 0 ? categories : fallbackCategories;

  useEffect(() => {
    // Only load featured videos on mount if:
    // 1. We haven't loaded initial videos yet
    // 2. There's no previous state to restore
    // 3. We're not restoring from a video player
    if (!hasLoadedInitial && !previousState && !location.state?.restoring) {
      loadFeaturedVideos();
      setHasLoadedInitial(true);
    } else if (location.state?.restoring) {
      // If we're restoring, mark as loaded so we don't load featured videos
      setHasLoadedInitial(true);
    }
  }, [hasLoadedInitial, previousState, location.state]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryChange = (category) => {
    if (category === 'featured') {
      loadFeaturedVideos();
      // Also need to update the current category in the context
      // This will be handled by the loadFeaturedVideos function
    } else if (category === 'saved') {
      loadSavedVideos();
      // This will be handled by the loadSavedVideos function
    } else {
      loadVideosByCategory(category);
    }
  };

  const handleVideoClick = (videoId) => {
    // Save current state before navigating
    savePreviousState({
      category: currentCategory,
      subcategory: activeSubcategory,
      searchQuery: searchQuery
    });
    navigate(`/video/${videoId}`);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchVideos(searchQuery);
    } else {
      // If search is cleared, reload featured videos
      loadFeaturedVideos();
    }
  };

  const handleSubcategoryChange = (subcategory, category) => {
    setActiveSubcategory(subcategory);
    // Use the provided category or fall back to currentCategory
    const categoryToUse = category || currentCategory;
    // Filter videos based on subcategory and duration
    if (categoryToUse && categoryToUse !== 'featured' && categoryToUse !== 'saved') {
      loadVideosByCategoryAndSubcategory(categoryToUse, subcategory);
    }
  };

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={clearError} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Scrolling Banner */}
      <ScrollingBanner />
      
      {/* Header with branding */}
      <div 
        className="center-logo-container"
        style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: '0 1rem',
          boxSizing: 'border-box'
        }}
      >
        <img 
          src={logo} 
          alt="Wellness in Schools Logo" 
          className="center-logo"
          style={{ 
            height: '120px', 
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
          }} 
        />
      </div>

      {/* Category Tabs and Leaderboard Toggle */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
        width: '100%'
      }}>
        {/* Category Tabs */}
        <div style={{ width: '100%', padding: '0' }}>
          <CategoryTabs 
            categories={displayCategories}
            currentCategory={currentCategory}
            onCategoryChange={handleCategoryChange}
            activeSubcategory={activeSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
          />
        </div>
        
        {/* Leaderboard Toggle Button */}
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '25px',
            border: showLeaderboard ? '2px solid #f7981e' : '2px solid #FF6B35',
            background: showLeaderboard 
              ? 'linear-gradient(45deg, #f7981e, #FF6B35)' 
              : 'linear-gradient(45deg, #FF6B35, #f7981e)',
            color: 'white',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = showLeaderboard 
              ? '0 8px 25px rgba(247, 152, 30, 0.5)' 
              : '0 8px 25px rgba(255, 107, 53, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🏆 {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
        </button>
      </div>

      {/* Leaderboard - Only show when toggled */}
      {showLeaderboard && (
        <div style={{ marginBottom: '2rem' }}>
          <Leaderboard leaderboard={leaderboard} />
        </div>
      )}

      {/* Search Bar */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'inline-block' }}>
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '300px', marginRight: '1rem' }}
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {searchQuery && (
            <button 
              type="button"
              onClick={() => {
                setSearchQuery('');
                loadFeaturedVideos();
              }}
              className="btn btn-danger"
              style={{ marginLeft: '0.5rem' }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Main Content - Centered */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : currentCategory === 'saved' 
                ? 'Saved Videos' 
                : 'Videos of the Week!'}
          </h2>
          
          {loading ? (
            <div className="loading">Loading videos...</div>
          ) : (
            <HorizontalVideoGrid
              videos={videos}
              onVideoClick={handleVideoClick}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem' }}>
        <h3>WELLNESS IN THE SCHOOLS</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <img 
            src={logo} 
            alt="Wellness in Schools Logo" 
            style={{ 
              height: '40px', 
              width: 'auto',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} 
          />
        </div>
      </div>

      {/* Chat Bubble */}
      <ChatBubble />
    </div>
  );
};

export default Home; 