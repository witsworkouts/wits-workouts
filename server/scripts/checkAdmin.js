const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-in-schools');
    console.log('Connected to MongoDB');

    // Check for admin user
    const adminUser = await User.findOne({ email: 'nsbhui26@colby.edu' });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   School: ${adminUser.schoolName}`);
      console.log(`   Created: ${adminUser.createdAt}`);
      console.log(`   Active: ${adminUser.isActive}`);
    } else {
      console.log('❌ Admin user not found');
    }

    // Check all users
    const allUsers = await User.find({}).select('email username role isActive');
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.username}) - Role: ${user.role} - Active: ${user.isActive}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking admin:', error);
    process.exit(1);
  }
}

checkAdmin(); 