const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Configure nodemailer transporter
const getEmailTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  if (emailService === 'workspace' || emailService === 'google-workspace') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS || process.env.GOOGLE_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else if (emailService === 'zoho') {
    return nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS || process.env.ZOHO_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else if (emailService === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (emailService === 'mailgun') {
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
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
};

const transporter = getEmailTransporter();

// Validation middleware
const validateContactForm = [
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject is required and must be less than 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message is required and must be less than 2000 characters')
];

// POST /api/contact - Submit contact form
router.post('/', validateContactForm, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { subject, message } = req.body;

    // Email content
    const emailFrom = process.env.EMAIL_FROM || 'noreply@wellnessintheschools.org';
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    const fromAddress = (emailService === 'sendgrid' || emailService === 'mailgun' || emailService === 'zoho' || emailService === 'workspace' || emailService === 'google-workspace')
      ? `Wellness in Schools <${emailFrom}>`
      : process.env.EMAIL_USER;
    
    const mailOptions = {
      from: fromAddress,
      to: process.env.CONTACT_EMAIL || 'kit@wellnessintheschools.org',
      subject: `Wellness in Schools Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This message was sent from the Wellness in Schools platform contact form.</em></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

module.exports = router;
