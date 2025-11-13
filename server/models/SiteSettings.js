const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const siteSettingsSchema = new mongoose.Schema({
  sitePassword: {
    type: String,
    required: true,
    default: 'wellness2024'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
siteSettingsSchema.pre('save', async function(next) {
  if (!this.isModified('sitePassword')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.sitePassword = await bcrypt.hash(this.sitePassword, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
siteSettingsSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.sitePassword);
};

// Ensure only one site settings document exists
siteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      sitePassword: 'wellness2024',
      isActive: true
    });
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

