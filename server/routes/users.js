const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('schoolName')
    .optional()
    .notEmpty()
    .withMessage('School name cannot be empty'),
  body('address')
    .optional()
    .notEmpty()
    .withMessage('Address cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, schoolName, address } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (schoolName) updateData.schoolName = schoolName;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's video viewing stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('videosViewed.videoId', 'title category')
      .select('totalViews videosViewed');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Group videos by category
    const categoryStats = {};
    user.videosViewed.forEach(view => {
      const category = view.videoId.category;
      if (!categoryStats[category]) {
        categoryStats[category] = 0;
      }
      categoryStats[category]++;
    });

    const stats = {
      totalViews: user.totalViews,
      videosViewed: user.videosViewed.length,
      categoryBreakdown: categoryStats,
      recentViews: user.videosViewed
        .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
        .slice(0, 5)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's saved videos
router.get('/saved-videos', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('savedVideos')
      .select('savedVideos');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Filter out inactive videos
    const savedVideos = user.savedVideos.filter(video => video && video.isActive);
    res.json(savedVideos);
  } catch (error) {
    console.error('Get saved videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if a video is saved
router.get('/saved-videos/:videoId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('savedVideos');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isSaved = user.savedVideos.some(
      videoId => videoId.toString() === req.params.videoId
    );
    res.json({ isSaved });
  } catch (error) {
    console.error('Check saved video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a video
router.post('/saved-videos/:videoId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const videoId = req.params.videoId;
    
    // Check if video is already saved
    if (user.savedVideos.some(id => id.toString() === videoId)) {
      return res.json({ message: 'Video already saved', savedVideos: user.savedVideos });
    }
    
    user.savedVideos.push(videoId);
    await user.save();
    
    res.json({ message: 'Video saved successfully', savedVideos: user.savedVideos });
  } catch (error) {
    console.error('Save video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a saved video
router.delete('/saved-videos/:videoId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const videoId = req.params.videoId;
    user.savedVideos = user.savedVideos.filter(
      id => id.toString() !== videoId
    );
    await user.save();
    
    res.json({ message: 'Video removed from saved videos', savedVideos: user.savedVideos });
  } catch (error) {
    console.error('Remove saved video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 