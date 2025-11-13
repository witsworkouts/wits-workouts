const express = require('express');
const { body, validationResult } = require('express-validator');
const Banner = require('../models/Banner');
const auth = require('../middleware/auth');

const router = express.Router();

// Get banner settings (public)
router.get('/', async (req, res) => {
  try {
    const banner = await Banner.getBanner();
    res.json(banner);
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update banner settings (admin only)
router.put('/', auth, [
  body('text')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Banner text cannot be empty'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color code'),
  body('hyperlink')
    .optional()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
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

    const { text, color, hyperlink, isActive } = req.body;
    const updateData = {};

    if (text !== undefined) updateData.text = text;
    if (color !== undefined) updateData.color = color;
    if (hyperlink !== undefined) updateData.hyperlink = hyperlink;
    if (isActive !== undefined) updateData.isActive = isActive;

    let banner = await Banner.findOne();
    if (!banner) {
      banner = await Banner.create({
        text: text || 'Coach Connect 2025-2026, Coach Camps, Coach Summit (Spring)',
        color: color || '#28b6ea',
        hyperlink: hyperlink || '',
        isActive: isActive !== undefined ? isActive : true
      });
    } else {
      Object.assign(banner, updateData);
      await banner.save();
    }

    res.json(banner);
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

