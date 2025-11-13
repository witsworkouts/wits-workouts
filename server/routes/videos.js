const express = require('express');
const { body, validationResult } = require('express-validator');
const Video = require('../models/Video');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all videos by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { subcategory } = req.query;
    
    let query = { category, isActive: true };
    if (subcategory) {
      // Support both single subcategory (for backward compatibility) and array
      // If subcategory is an array, use $in operator
      if (Array.isArray(subcategory)) {
        query.subcategory = { $in: subcategory };
      } else {
        query.subcategory = subcategory;
      }
    }
    
    const videos = await Video.find(query).sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Get videos by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured videos
router.get('/featured', async (req, res) => {
  try {
    const videos = await Video.getFeatured();
    res.json(videos);
  } catch (error) {
    console.error('Get featured videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get videos by subcategory
router.get('/subcategory/:subcategory', async (req, res) => {
  try {
    const { subcategory } = req.params;
    // Support array of subcategories (comma-separated) or single subcategory
    const subcategories = subcategory.includes(',') 
      ? subcategory.split(',').map(s => s.trim())
      : [subcategory];
    
    const videos = await Video.find({ 
      subcategory: { $in: subcategories },
      isActive: true 
    }).sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Get videos by subcategory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'workout-sports', name: 'Workout & Sports', color: '#28b6ea' },
      { id: 'dance-move', name: 'Dance & Move', color: '#8cc63e' },
      { id: 'yoga', name: 'Yoga', color: '#f7981e' },
      { id: 'mindfulness', name: 'Mindfulness', color: '#8cc63e' }
    ];
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track video view (requires authentication)
router.post('/:id/view', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment video view count
    await video.incrementViewCount();
    
    // Add view to user's history
    await user.addVideoView(id);

    res.json({ message: 'View tracked successfully' });
  } catch (error) {
    console.error('Track video view error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find({ isActive: true })
      .select('username schoolName totalViews')
      .sort({ totalViews: -1 })
      .limit(limit);
    
    res.json(users);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's video history
router.get('/history/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('videosViewed.videoId')
      .select('videosViewed');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.videosViewed);
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search videos
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const videos = await Video.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { instructor: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }
      ]
    }).sort({ featured: -1, viewCount: -1 });

    res.json(videos);
  } catch (error) {
    console.error('Search videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 