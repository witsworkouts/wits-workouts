const mongoose = require('mongoose');
const Video = require('../models/Video');
require('dotenv').config();

async function testVideoLinks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-in-schools');
    console.log('Connected to MongoDB');

    // Get all videos
    const videos = await Video.find({});
    console.log(`\n📊 Found ${videos.length} videos in database`);

    if (videos.length === 0) {
      console.log('❌ No videos found in database');
      console.log('💡 Run: node scripts/populateVideos.js to add sample videos');
      process.exit(0);
    }

    console.log('\n🔍 Testing video links...\n');

    let workingVideos = 0;
    let brokenVideos = 0;

    for (const video of videos) {
      console.log(`📹 ${video.title}`);
      console.log(`   Category: ${video.category}`);
      console.log(`   Google Drive ID: ${video.googleDriveId}`);
      console.log(`   URL: ${video.googleDriveUrl}`);
      
      // Check if it's a placeholder ID
      if (video.googleDriveId.includes('sample_id') || video.googleDriveId.includes('REPLACE_WITH_REAL_FILE_ID')) {
        console.log('   ❌ Status: PLACEHOLDER ID (will show "file does not exist")');
        brokenVideos++;
      } else {
        console.log('   ✅ Status: REAL ID (should work if file exists)');
        workingVideos++;
      }
      console.log('');
    }

    console.log('📈 Summary:');
    console.log(`   ✅ Working videos: ${workingVideos}`);
    console.log(`   ❌ Broken videos: ${brokenVideos}`);
    console.log(`   📊 Total videos: ${videos.length}`);

    if (brokenVideos > 0) {
      console.log('\n🔧 To fix broken videos:');
      console.log('1. Upload videos to Google Drive');
      console.log('2. Set sharing to "Anyone with the link"');
      console.log('3. Copy file IDs from URLs');
      console.log('4. Update the database with real IDs');
      console.log('5. Or run: node scripts/addRealVideos.js (after updating IDs)');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing video links:', error);
    process.exit(1);
  }
}

testVideoLinks();









