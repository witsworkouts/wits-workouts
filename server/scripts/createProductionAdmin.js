const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

/**
 * Script to create an admin user in production
 * 
 * Usage:
 *   node server/scripts/createProductionAdmin.js
 * 
 * Or with custom credentials:
 *   EMAIL=your-email@example.com PASSWORD=your-password USERNAME=admin node server/scripts/createProductionAdmin.js
 */
async function createProductionAdmin() {
  try {
    // Get credentials from environment variables or use defaults
    const email = process.env.EMAIL || 'kit@wellnessintheschools.org';
    const password = process.env.PASSWORD || 'Wellness2025!';
    const username = process.env.USERNAME || 'kit';
    const schoolName = process.env.SCHOOL_NAME || 'Wellness in Schools';
    const address = process.env.ADDRESS || 'New York, NY';

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ Error: MONGODB_URI environment variable is not set');
      console.error('Please set MONGODB_URI in your environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: username }]
    });
    
    if (existingUser) {
      // Update existing user to admin
      existingUser.role = 'admin';
      existingUser.password = password; // Will be hashed by pre-save hook
      await existingUser.save();
      console.log(`✅ Updated existing user (${email}) to admin role`);
    } else {
      // Create new admin user
      const adminUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: password, // Will be hashed by pre-save hook
        schoolName: schoolName,
        address: address,
        role: 'admin'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    console.log('\n🔑 Admin credentials:');
    console.log(`Email: ${email.toLowerCase()}`);
    console.log(`Password: ${password}`);
    console.log(`Username: ${username}`);
    console.log(`Role: admin`);
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
    console.log('⚠️  Delete this script or secure it after use!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === 11000) {
      console.error('   A user with this email or username already exists');
    }
    process.exit(1);
  }
}

createProductionAdmin();

