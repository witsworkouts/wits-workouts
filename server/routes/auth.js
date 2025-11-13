const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure email transporter
// Supports Gmail, Google Workspace, Zoho Mail (free custom domain), SendGrid, Mailgun, and other SMTP services
const getEmailTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail'; // 'gmail', 'workspace', 'zoho', 'sendgrid', 'mailgun', or 'smtp'
  
  if (emailService === 'workspace' || emailService === 'google-workspace') {
    // Google Workspace configuration (custom domain email)
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || process.env.EMAIL_FROM, // Full email: noreply@wellnessintheschools.org
        pass: process.env.EMAIL_PASS || process.env.GOOGLE_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else if (emailService === 'zoho') {
    // Zoho Mail configuration (free custom domain email)
    return nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || process.env.EMAIL_FROM, // Use the full email address
        pass: process.env.EMAIL_PASS || process.env.ZOHO_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else if (emailService === 'sendgrid') {
    // SendGrid configuration
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey', // SendGrid uses 'apikey' as the username
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (emailService === 'mailgun') {
    // Mailgun configuration
    return nodemailer.createTransport({
      host: process.env.MAILGUN_SMTP_HOST || 'smtp.mailgun.org',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILGUN_SMTP_USER,
        pass: process.env.MAILGUN_SMTP_PASSWORD
      }
    });
  } else {
    // Default: Gmail or custom SMTP
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
};

const transporter = getEmailTransporter();

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email transporter error:', error);
    console.error('Email configuration issue. Please check:');
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    if (emailService === 'workspace' || emailService === 'google-workspace') {
      console.error('- EMAIL_USER (full email: noreply@wellnessintheschools.org) in .env file');
      console.error('- EMAIL_PASS or GOOGLE_APP_PASSWORD (app password, not regular password) in .env file');
      console.error('- 2FA enabled on the Google Workspace account');
      console.error('- App password generated in Google Account settings');
    } else if (emailService === 'zoho') {
      console.error('- EMAIL_USER (full email: noreply@wellnessintheschools.org) in .env file');
      console.error('- EMAIL_PASS or ZOHO_APP_PASSWORD in .env file');
      console.error('- Domain configured in Zoho Mail');
    } else if (emailService === 'sendgrid') {
      console.error('- SENDGRID_API_KEY in .env file');
      console.error('- Domain verification in SendGrid dashboard');
    } else if (emailService === 'mailgun') {
      console.error('- MAILGUN_SMTP_USER and MAILGUN_SMTP_PASSWORD in .env file');
      console.error('- Domain verification in Mailgun dashboard');
    } else {
      console.error('- EMAIL_USER and EMAIL_PASS in .env file');
      console.error('- Email service settings (Gmail, Outlook, etc.)');
      console.error('- App password if using Gmail');
    }
  } else {
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    console.log(`Email server (${emailService}) is ready to send messages`);
  }
});

// Register user
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('schoolName')
    .notEmpty()
    .withMessage('School name is required'),
  body('address')
    .notEmpty()
    .withMessage('Address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, schoolName, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      schoolName,
      address
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        schoolName: user.schoolName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        schoolName: user.schoolName,
        role: user.role,
        totalViews: user.totalViews
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const emailFrom = process.env.EMAIL_FROM || 'noreply@wellnessintheschools.org';
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    // For SendGrid, Mailgun, Zoho, and Google Workspace, use the custom from address
    // For regular Gmail, use the authenticated email but with display name
    const fromAddress = (emailService === 'sendgrid' || emailService === 'mailgun' || emailService === 'zoho' || emailService === 'workspace' || emailService === 'google-workspace')
      ? `Wellness in Schools <${emailFrom}>`
      : `Wellness in Schools <${process.env.EMAIL_USER || emailFrom}>`;
    
    const mailOptions = {
      from: fromAddress,
      replyTo: emailFrom,
      to: user.email,
      subject: 'Password Reset - Wellness in Schools',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.username},</p>
        <p>You requested a password reset for your Wellness in Schools account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      res.status(500).json({ message: 'Email authentication failed. Please check email configuration.' });
    } else if (error.code === 'ECONNECTION') {
      res.status(500).json({ message: 'Email service connection failed. Please try again later.' });
    } else {
      res.status(500).json({ message: 'Failed to send password reset email. Please try again.' });
    }
  }
});

// Reset password
router.post('/reset-password/:token', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 