const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['workout-sports', 'dance-move', 'yoga', 'mindfulness']
  },
  subcategory: {
    type: String,
    enum: ['pre-k-2', 'grades-3-4', 'grades-5-8', 'high-school'],
    default: 'pre-k-2'
  },
  googleDriveId: {
    type: String,
    required: true,
    unique: true
  },
  googleDriveUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number // in seconds
  },
  instructor: {
    type: String,
    trim: true
  },
  ageGroup: {
    type: String,
    enum: ['pre-school', 'elementary', 'middle', 'high', 'all'],
    default: 'all'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
videoSchema.index({ category: 1, isActive: 1 });
videoSchema.index({ featured: 1, isActive: 1 });
videoSchema.index({ viewCount: -1 });

// Method to increment view count
videoSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Static method to get videos by category
videoSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category, 
    isActive: true 
  }).sort({ order: 1, createdAt: -1 });
};

// Static method to get featured videos
videoSchema.statics.getFeatured = function() {
  return this.find({ 
    featured: true, 
    isActive: true 
  }).sort({ order: 1, createdAt: -1 });
};

module.exports = mongoose.model('Video', videoSchema); 