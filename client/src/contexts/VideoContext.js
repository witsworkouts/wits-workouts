import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axiosInstance from '../config/axios';

const VideoContext = createContext();

const initialState = {
  videos: [],
  categories: [],
  featuredVideos: [],
  currentCategory: 'featured',
  loading: false,
  error: null,
  leaderboard: [],
  currentVideo: null,
  previousState: null // Store previous state (category, subcategory, searchQuery)
};

const videoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_VIDEOS':
      return {
        ...state,
        videos: action.payload,
        loading: false,
        error: null
      };
    case 'SET_FEATURED_VIDEOS':
      return {
        ...state,
        featuredVideos: action.payload
      };
    case 'SET_CURRENT_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload
      };
    case 'SET_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      };
    case 'SET_CURRENT_VIDEO':
      return {
        ...state,
        currentVideo: action.payload
      };
    case 'TRACK_VIDEO_VIEW':
      return {
        ...state,
        videos: state.videos.map(video =>
          video._id === action.payload
            ? { ...video, viewCount: video.viewCount + 1 }
            : video
        )
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SAVE_PREVIOUS_STATE':
      return {
        ...state,
        previousState: action.payload
      };
    case 'RESTORE_PREVIOUS_STATE':
      return {
        ...state,
        previousState: null
      };
    default:
      return state;
  }
};

// Retry utility for handling rate limiting
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (error.response?.status === 429 && i < maxRetries - 1) {
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
};

export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/videos/categories');
      dispatch({ type: 'SET_CATEGORIES', payload: res.data });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  // Load featured videos
  const loadFeaturedVideos = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await retryRequest(() => axiosInstance.get('/api/videos/featured'));
      dispatch({ type: 'SET_FEATURED_VIDEOS', payload: res.data });
      dispatch({ type: 'SET_CURRENT_CATEGORY', payload: 'featured' });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error loading featured videos:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Handle rate limiting error specifically
      if (error.response?.status === 429) {
        dispatch({ type: 'SET_ERROR', payload: 'Too many requests. Please wait a moment and refresh the page.' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load videos. Please try again.' });
      }
      
      // Set empty array to prevent infinite loading
      dispatch({ type: 'SET_FEATURED_VIDEOS', payload: [] });
    }
  }, []);

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/videos/leaderboard/top?limit=10');
      dispatch({ type: 'SET_LEADERBOARD', payload: res.data });
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    loadFeaturedVideos();
    loadLeaderboard();
  }, [loadCategories, loadFeaturedVideos]);

  // Load videos by category
  const loadVideosByCategory = async (category, clearVideos = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_CURRENT_CATEGORY', payload: category });
    try {
      if (clearVideos) {
        // If clearVideos is true, just set category without loading videos
        dispatch({ type: 'SET_VIDEOS', payload: [] });
        dispatch({ type: 'SET_LOADING', payload: false });
      } else {
        const res = await retryRequest(() => axiosInstance.get(`/api/videos/category/${category}`));
        dispatch({ type: 'SET_VIDEOS', payload: res.data });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      let message = 'Failed to load videos';
      
      if (error.response?.status === 429) {
        message = 'Too many requests. Please wait a moment and refresh the page.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      // Set empty array to prevent infinite loading
      dispatch({ type: 'SET_VIDEOS', payload: [] });
    }
  };

  // Load videos by category and subcategory with duration filtering
  const loadVideosByCategoryAndSubcategory = async (category, subcategoryWithDuration) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let subcategory, duration;
      
      // For Mindfulness category, subcategory is just the grade level (no duration)
      if (category === 'mindfulness') {
        subcategory = subcategoryWithDuration; // Just the grade level (e.g., "pre-k-2")
        duration = null; // No duration filtering for Mindfulness
      } else {
        // For other categories, parse subcategory and duration from combined string (e.g., "pre-k-2-5min")
        const lastDashIndex = subcategoryWithDuration.lastIndexOf('-');
        subcategory = subcategoryWithDuration.substring(0, lastDashIndex);
        const durationStr = subcategoryWithDuration.substring(lastDashIndex + 1);
        duration = parseInt(durationStr.replace('min', ''));
      }
      
      // Get all videos for the category first
      const res = await axiosInstance.get(`/api/videos/category/${category}`);
      let videos = res.data;
      
      // Filter by subcategory (support both array and single value for backward compatibility)
      if (subcategory) {
        videos = videos.filter(video => {
          const videoSubcategories = Array.isArray(video.subcategory) 
            ? video.subcategory 
            : [video.subcategory];
          return videoSubcategories.includes(subcategory);
        });
      }
      
      // Filter by duration (within 1 minute tolerance) - skip for Mindfulness
      if (duration && category !== 'mindfulness') {
        videos = videos.filter(video => {
          if (!video.duration) {
            // If no duration is set, assume it's a 5-minute video for now
            // This is a temporary fallback until all videos have duration values
            return duration === 5;
          }
          const videoDurationMinutes = video.duration / 60;
          return Math.abs(videoDurationMinutes - duration) <= 1; // 1 minute tolerance
        });
      }
      
      dispatch({ type: 'SET_VIDEOS', payload: videos });
      dispatch({ type: 'SET_CURRENT_CATEGORY', payload: category });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load videos';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      // Set empty array to prevent infinite loading
      dispatch({ type: 'SET_VIDEOS', payload: [] });
    }
  };

  // Get single video
  const getVideo = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axiosInstance.get(`/api/videos/${id}`);
      dispatch({ type: 'SET_CURRENT_VIDEO', payload: res.data });
      dispatch({ type: 'SET_LOADING', payload: false });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load video';
      dispatch({ type: 'SET_ERROR', payload: message });
      return null;
    }
  };

  // Track video view
  const trackVideoView = async (videoId) => {
    try {
      await axiosInstance.post(`/api/videos/${videoId}/view`);
      dispatch({ type: 'TRACK_VIDEO_VIEW', payload: videoId });
      
      // Reload leaderboard after view
      await loadLeaderboard();
    } catch (error) {
      console.error('Error tracking video view:', error);
    }
  };

  // Search videos
  const searchVideos = async (query) => {
    if (!query.trim()) {
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await retryRequest(() => axiosInstance.get(`/api/videos/search/${encodeURIComponent(query)}`));
      dispatch({ type: 'SET_VIDEOS', payload: res.data });
      dispatch({ type: 'SET_CURRENT_CATEGORY', payload: 'search' });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Search failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load saved videos
  const loadSavedVideos = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axiosInstance.get('/api/users/saved-videos');
      dispatch({ type: 'SET_VIDEOS', payload: res.data });
      dispatch({ type: 'SET_CURRENT_CATEGORY', payload: 'saved' });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      let message = 'Failed to load saved videos';
      
      if (error.response?.status === 401) {
        message = 'Please log in to view saved videos';
      } else if (error.response?.status === 429) {
        message = 'Too many requests. Please wait a moment and refresh the page.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      // Set empty array to prevent infinite loading
      dispatch({ type: 'SET_VIDEOS', payload: [] });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Save previous state before navigating to video
  const savePreviousState = (stateData) => {
    dispatch({ type: 'SAVE_PREVIOUS_STATE', payload: stateData });
  };

  // Clear previous state (called by Home component after reading it)
  const clearPreviousState = () => {
    dispatch({ type: 'RESTORE_PREVIOUS_STATE' });
  };

  // Restore previous state
  const restorePreviousState = async () => {
    const prevState = state.previousState;
    if (!prevState) {
      // If no previous state, go to featured
      await loadFeaturedVideos();
      return;
    }

    // Restore based on state type (don't clear previousState yet - let Home component read it)
    try {
      if (prevState.searchQuery) {
        await searchVideos(prevState.searchQuery);
      } else if (prevState.subcategory && prevState.category) {
        await loadVideosByCategoryAndSubcategory(prevState.category, prevState.subcategory);
      } else if (prevState.category === 'saved') {
        await loadSavedVideos();
      } else if (prevState.category === 'featured') {
        await loadFeaturedVideos();
      } else if (prevState.category) {
        await loadVideosByCategory(prevState.category);
      } else {
        await loadFeaturedVideos();
      }
    } catch (error) {
      console.error('Error restoring previous state:', error);
      // Fallback to featured videos if restoration fails
      await loadFeaturedVideos();
    }
    
    // Note: previousState will be cleared by Home component after reading it
  };

  // Get current videos based on category
  const getCurrentVideos = () => {
    if (state.currentCategory === 'featured') {
      return state.featuredVideos;
    }
    if (state.currentCategory === 'saved') {
      return state.videos;
    }
    return state.videos;
  };

  const value = {
    videos: getCurrentVideos(),
    categories: state.categories,
    featuredVideos: state.featuredVideos,
    currentCategory: state.currentCategory,
    loading: state.loading,
    error: state.error,
    leaderboard: state.leaderboard,
    currentVideo: state.currentVideo,
    previousState: state.previousState,
    loadVideosByCategory,
    loadVideosByCategoryAndSubcategory,
    loadFeaturedVideos,
    loadSavedVideos,
    loadLeaderboard,
    getVideo,
    trackVideoView,
    searchVideos,
    clearError,
    savePreviousState,
    restorePreviousState,
    clearPreviousState
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}; 