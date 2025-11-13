const mongoose = require('mongoose');
const Video = require('../models/Video');
require('dotenv').config();

// REAL VIDEO DATA - Replace these with your actual Google Drive file IDs
const realVideos = [
  // Workout & Sports Category
  {
    title: "Morning Workout Routine",
    description: "A complete morning workout routine for students to start their day energized",
    category: "workout-sports",
    subcategory: "grades-3-4",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_1", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_1/view",
    duration: 300, // 5 minutes in seconds
    instructor: "Coach Sarah",
    difficulty: "beginner",
    ageGroup: "elementary",
    tags: ["morning", "workout", "energy"],
    featured: true,
    order: 1
  },
  {
    title: "Sports Conditioning",
    description: "Advanced conditioning exercises for student athletes",
    category: "workout-sports",
    subcategory: "high-school",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_2", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_2/view",
    duration: 600, // 10 minutes in seconds
    instructor: "Coach Mike",
    difficulty: "intermediate",
    ageGroup: "high",
    tags: ["sports", "conditioning", "athletics"],
    featured: false,
    order: 2
  },

  // Dance & Move Category
  {
    title: "Hip Hop Dance Basics",
    description: "Learn the fundamentals of hip hop dance",
    category: "dance-move",
    subcategory: "grades-5-8",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_3", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_3/view",
    duration: 300, // 5 minutes in seconds
    instructor: "Dance Instructor Lisa",
    difficulty: "beginner",
    ageGroup: "middle",
    tags: ["dance", "hip hop", "basics"],
    featured: true,
    order: 1
  },
  {
    title: "Contemporary Dance Flow",
    description: "Expressive contemporary dance movements",
    category: "dance-move",
    subcategory: "high-school",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_4", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_4/view",
    duration: 600, // 10 minutes in seconds
    instructor: "Dance Instructor Lisa",
    difficulty: "intermediate",
    ageGroup: "high",
    tags: ["dance", "contemporary", "expression"],
    featured: false,
    order: 2
  },

  // Yoga Category
  {
    title: "Beginner Yoga Flow",
    description: "Gentle yoga poses for beginners",
    category: "yoga",
    subcategory: "pre-k-2",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_5", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_5/view",
    instructor: "Yoga Teacher Emma",
    difficulty: "beginner",
    ageGroup: "pre-school",
    tags: ["yoga", "beginner", "gentle"],
    featured: true,
    order: 1
  },
  {
    title: "Mindful Yoga Practice",
    description: "Deep breathing and mindful yoga sequences",
    category: "yoga",
    subcategory: "grades-3-4",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_6", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_6/view",
    instructor: "Yoga Teacher Emma",
    difficulty: "intermediate",
    ageGroup: "elementary",
    tags: ["yoga", "mindful", "breathing"],
    featured: false,
    order: 2
  },

  // Mindfulness Category
  {
    title: "Meditation for Students",
    description: "Simple meditation techniques for stress relief",
    category: "mindfulness",
    subcategory: "grades-5-8",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_7", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_7/view",
    instructor: "Mindfulness Coach David",
    difficulty: "beginner",
    ageGroup: "middle",
    tags: ["meditation", "stress relief", "mindfulness"],
    featured: true,
    order: 1
  },
  {
    title: "Breathing Exercises",
    description: "Deep breathing techniques for focus and calm",
    category: "mindfulness",
    subcategory: "high-school",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_8", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_8/view",
    instructor: "Mindfulness Coach David",
    difficulty: "beginner",
    ageGroup: "high",
    tags: ["breathing", "focus", "calm"],
    featured: false,
    order: 2
  },

  // Pre-School Category
  {
    title: "Fun Movement for Little Ones",
    description: "Engaging movement activities for pre-school children",
    category: "pre-school",
    subcategory: "pre-k-2",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_9", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_9/view",
    instructor: "Early Childhood Specialist Maria",
    difficulty: "beginner",
    ageGroup: "pre-school",
    tags: ["pre-school", "movement", "fun"],
    featured: true,
    order: 1
  },
  {
    title: "Story Time Movement",
    description: "Movement activities that go with popular children's stories",
    category: "pre-school",
    subcategory: "pre-k-2",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_10", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_10/view",
    instructor: "Early Childhood Specialist Maria",
    difficulty: "beginner",
    ageGroup: "pre-school",
    tags: ["pre-school", "story time", "movement"],
    featured: false,
    order: 2
  },

  // K-12 Category
  {
    title: "Physical Education Basics",
    description: "Fundamental PE activities for K-12 students",
    category: "k-12",
    subcategory: "grades-3-4",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_11", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_11/view",
    instructor: "PE Teacher John",
    difficulty: "beginner",
    ageGroup: "elementary",
    tags: ["PE", "basics", "education"],
    featured: true,
    order: 1
  },
  {
    title: "Advanced PE Skills",
    description: "Advanced physical education skills and techniques",
    category: "k-12",
    subcategory: "high-school",
    googleDriveId: "REPLACE_WITH_REAL_FILE_ID_12", // Replace this!
    googleDriveUrl: "https://drive.google.com/file/d/REPLACE_WITH_REAL_FILE_ID_12/view",
    instructor: "PE Teacher John",
    difficulty: "intermediate",
    ageGroup: "high",
    tags: ["PE", "advanced", "skills"],
    featured: false,
    order: 2
  }
];

async function addRealVideos() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-in-schools');
    console.log('Connected to MongoDB');

    // Check if videos still have placeholder IDs
    const placeholderVideos = realVideos.filter(video => 
      video.googleDriveId.includes('REPLACE_WITH_REAL_FILE_ID')
    );

    if (placeholderVideos.length > 0) {
      console.log('\n❌ ERROR: You still have placeholder IDs!');
      console.log('Please replace the following placeholder IDs with real Google Drive file IDs:');
      
      placeholderVideos.forEach(video => {
        console.log(`  - ${video.title}: ${video.googleDriveId}`);
      });
      
      console.log('\n📝 Instructions:');
      console.log('1. Upload your videos to Google Drive');
      console.log('2. Set sharing to "Anyone with the link"');
      console.log('3. Copy the file ID from the URL');
      console.log('4. Replace the placeholder IDs in this script');
      console.log('5. Run this script again');
      
      process.exit(1);
    }

    // Clear existing videos
    await Video.deleteMany({});
    console.log('Cleared existing videos');

    // Insert real videos
    const insertedVideos = await Video.insertMany(realVideos);
    console.log(`✅ Successfully inserted ${insertedVideos.length} videos`);

    // Display the inserted videos by category and subcategory
    const categories = ['workout-sports', 'dance-move', 'yoga', 'mindfulness', 'pre-school', 'k-12'];
    
    for (const category of categories) {
      const videos = await Video.find({ category });
      console.log(`\n${category.toUpperCase()} (${videos.length} videos):`);
      
      const subcategories = ['pre-k-2', 'grades-3-4', 'grades-5-8', 'high-school'];
      for (const subcategory of subcategories) {
        const subVideos = videos.filter(v => v.subcategory === subcategory);
        if (subVideos.length > 0) {
          console.log(`  ${subcategory}:`);
          subVideos.forEach(video => {
            console.log(`    - ${video.title} (${video.instructor})`);
          });
        }
      }
    }

    console.log('\n🎉 Database populated successfully with real videos!');
    console.log('🌐 Your videos should now work properly on the website.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
}

addRealVideos();





