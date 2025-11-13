const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function resetAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-in-schools');
    console.log('Connected to MongoDB');

    // Delete existing admin user
    await User.deleteOne({ email: 'nsbhui26@colby.edu' });
    console.log('Deleted existing admin user');

    // Create new admin user with correct credentials
    const adminUser = new User({
      username: 'admin',
      email: 'nsbhui26@colby.edu',
      password: 'admin123',
      schoolName: 'Colby College',
      address: 'Colby College, Waterville, ME',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('✅ New admin user created successfully');

    console.log('\n🔑 Admin credentials:');
    console.log('Email: nsbhui26@colby.edu');
    console.log('Password: admin123');
    console.log('Username: admin');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
}

resetAdmin(); 