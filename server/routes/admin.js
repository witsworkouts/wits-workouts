const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for thumbnail uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/thumbnails');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `thumbnail-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Apply auth middleware to all admin routes
router.use(auth);
router.use(auth.admin);

// Get all users with their video viewing stats
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('username email schoolName address totalViews videosViewed createdAt role')
      .sort({ totalViews: -1 });
    
    // Map users to include count of videos watched
    const usersWithCount = users.map(user => ({
      ...user.toObject(),
      videosWatchedCount: user.videosViewed?.length || 0
    }));
    
    res.json(usersWithCount);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details with video history
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('videosViewed.videoId')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics dashboard data
router.get('/analytics', async (req, res) => {
  try {
    const [
      totalUsers,
      totalVideos,
      totalViews,
      topUsers,
      topVideos,
      recentActivity
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Video.countDocuments({ isActive: true }),
      User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$totalViews' } } }
      ]),
      User.find({ isActive: true })
        .select('username schoolName totalViews')
        .sort({ totalViews: -1 })
        .limit(5),
      Video.find({ isActive: true })
        .select('title category viewCount')
        .sort({ viewCount: -1 })
        .limit(5),
      User.find({ isActive: true })
        .select('username schoolName createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    const analytics = {
      totalUsers,
      totalVideos,
      totalViews: totalViews[0]?.total || 0,
      topUsers,
      topVideos,
      recentActivity
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload thumbnail endpoint
router.post('/videos/upload-thumbnail', upload.single('thumbnail'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the URL path for the uploaded thumbnail
    const thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    res.json({ 
      message: 'Thumbnail uploaded successfully',
      thumbnailUrl: thumbnailUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({ message: 'Error uploading thumbnail', error: error.message });
  }
});

// Add new video
router.post('/videos', [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').isIn(['workout-sports', 'dance-move', 'yoga', 'mindfulness'])
    .withMessage('Invalid category'),
  body('googleDriveId').notEmpty().withMessage('Google Drive ID is required'),
  body('googleDriveUrl').optional().isURL().withMessage('Invalid Google Drive URL format')
], async (req, res) => {
  try {
    console.log('Received video data:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const video = new Video(req.body);
    console.log('Creating video:', video);
    
    await video.save();
    console.log('Video saved successfully:', video._id);

    res.status(201).json(video);
  } catch (error) {
    console.error('Add video error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A video with this Google Drive ID already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update video
router.put('/videos/:id', [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').isIn(['workout-sports', 'dance-move', 'yoga', 'mindfulness'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete video
router.delete('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all videos with admin details
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 });
    
    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create admin user
router.post('/users', [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('schoolName')
    .notEmpty()
    .withMessage('School name is required'),
  body('address')
    .notEmpty()
    .withMessage('Address is required'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, schoolName, address, role = 'admin' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'User with this email already exists' 
          : 'User with this username already exists' 
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      schoolName,
      address,
      role
    });

    await newUser.save();

    res.status(201).json({ 
      message: `${role === 'admin' ? 'Admin' : 'User'} created successfully`,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        schoolName: newUser.schoolName,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Deactivate/activate user
router.patch('/users/:userId/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `User ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video viewing statistics
router.get('/stats/video-views', async (req, res) => {
  try {
    const stats = await Video.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          totalViews: { $sum: '$viewCount' },
          videoCount: { $sum: 1 },
          avgViews: { $avg: '$viewCount' }
        }
      },
      { $sort: { totalViews: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Get video stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user activity by date range
router.get('/stats/user-activity', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const activity = await User.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          newUsers: { $sum: 1 },
          totalViews: { $sum: '$totalViews' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(activity);
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 