const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    default: 'Coach Connect 2025-2026, Coach Camps, Coach Summit (Spring)'
  },
  color: {
    type: String,
    required: true,
    default: '#28b6ea',
    trim: true
  },
  hyperlink: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one banner document exists
bannerSchema.statics.getBanner = async function() {
  let banner = await this.findOne();
  if (!banner) {
    banner = await this.create({
      text: 'Coach Connect 2025-2026, Coach Camps, Coach Summit (Spring)',
      color: '#28b6ea',
      hyperlink: '',
      isActive: true
    });
  }
  return banner;
};

module.exports = mongoose.model('Banner', bannerSchema);

