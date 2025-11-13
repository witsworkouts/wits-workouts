const express = require('express');
const { body, validationResult } = require('express-validator');
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');

const router = express.Router();

// Get site settings (public - for password verification)
router.post('/verify-password', [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;
    const settings = await SiteSettings.getSettings();

    if (!settings.isActive) {
      return res.json({ verified: true }); // If protection is disabled, always verify
    }

    const isMatch = await settings.comparePassword(password);
    
    if (isMatch) {
      res.json({ verified: true });
    } else {
      res.status(401).json({ verified: false, message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Verify password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get site settings (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const settings = await SiteSettings.getSettings();
    // Don't send the hashed password
    res.json({
      isActive: settings.isActive,
      hasPassword: !!settings.sitePassword
    });
  } catch (error) {
    console.error('Get site settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update site password (admin only)
router.put('/password', auth, [
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { newPassword } = req.body;
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = await SiteSettings.create({
        sitePassword: newPassword,
        isActive: true
      });
    } else {
      settings.sitePassword = newPassword;
      await settings.save();
    }

    res.json({ message: 'Site password updated successfully' });
  } catch (error) {
    console.error('Update site password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle password protection (admin only)
router.put('/toggle', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const settings = await SiteSettings.getSettings();
    settings.isActive = !settings.isActive;
    await settings.save();

    res.json({ 
      message: `Password protection ${settings.isActive ? 'enabled' : 'disabled'}`,
      isActive: settings.isActive
    });
  } catch (error) {
    console.error('Toggle password protection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

