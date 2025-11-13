const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createKitAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-in-schools');
    console.log('Connected to MongoDB');

    const email = 'kit@wellnessintheschools.org';
    
    // Check if admin already exists
    const existingUser = await User.findOne({ email: email });
    
    if (existingUser) {
      // Update existing user to admin
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`✅ Updated existing user (${email}) to admin role`);
    } else {
      // Create new admin user
      const adminUser = new User({
        username: 'kit',
        email: email,
        password: 'Wellness2024!', // Default password - should be changed after first login
        schoolName: 'Wellness in the Schools',
        address: 'Wellness in the Schools',
        role: 'admin'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    console.log('\n🔑 Admin credentials:');
    console.log(`Email: ${email}`);
    console.log('Password: Wellness2024!');
    console.log('Username: kit');
    console.log('Role: admin');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createKitAdmin();

