const mongoose = require('mongoose');
const Video = require('../models/Video');
require('dotenv').config();

// Sample video data based on the Google Drive folder structure
const sampleVideos = [
  // Workout & Sports Category
  {
    title: "Morning Workout Routine",
    description: "A complete morning workout routine for students to start their day energized",
    category: "workout-sports",
    googleDriveId: "sample_id_1",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_1/view",
    instructor: "Coach Sarah",
    difficulty: "beginner",
    ageGroup: "all",
    tags: ["morning", "workout", "energy"],
    featured: true,
    order: 1
  },
  {
    title: "Sports Conditioning",
    description: "Advanced conditioning exercises for student athletes",
    category: "workout-sports",
    googleDriveId: "sample_id_2",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_2/view",
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
    googleDriveId: "sample_id_3",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_3/view",
    instructor: "Dance Instructor Lisa",
    difficulty: "beginner",
    ageGroup: "all",
    tags: ["dance", "hip hop", "basics"],
    featured: true,
    order: 1
  },
  {
    title: "Contemporary Dance Flow",
    description: "Expressive contemporary dance movements",
    category: "dance-move",
    googleDriveId: "sample_id_4",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_4/view",
    instructor: "Dance Instructor Lisa",
    difficulty: "intermediate",
    ageGroup: "middle",
    tags: ["dance", "contemporary", "expression"],
    featured: false,
    order: 2
  },

  // Yoga Category
  {
    title: "Beginner Yoga Flow",
    description: "Gentle yoga poses for beginners",
    category: "yoga",
    googleDriveId: "sample_id_5",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_5/view",
    instructor: "Yoga Teacher Emma",
    difficulty: "beginner",
    ageGroup: "all",
    tags: ["yoga", "beginner", "gentle"],
    featured: true,
    order: 1
  },
  {
    title: "Mindful Yoga Practice",
    description: "Deep breathing and mindful yoga sequences",
    category: "yoga",
    googleDriveId: "sample_id_6",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_6/view",
    instructor: "Yoga Teacher Emma",
    difficulty: "intermediate",
    ageGroup: "all",
    tags: ["yoga", "mindful", "breathing"],
    featured: false,
    order: 2
  },

  // Mindfulness Category
  {
    title: "Meditation for Students",
    description: "Simple meditation techniques for stress relief",
    category: "mindfulness",
    googleDriveId: "sample_id_7",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_7/view",
    instructor: "Mindfulness Coach David",
    difficulty: "beginner",
    ageGroup: "all",
    tags: ["meditation", "stress relief", "mindfulness"],
    featured: true,
    order: 1
  },
  {
    title: "Breathing Exercises",
    description: "Deep breathing techniques for focus and calm",
    category: "mindfulness",
    googleDriveId: "sample_id_8",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_8/view",
    instructor: "Mindfulness Coach David",
    difficulty: "beginner",
    ageGroup: "all",
    tags: ["breathing", "focus", "calm"],
    featured: false,
    order: 2
  },

  // Pre-School Category
  {
    title: "Fun Movement for Little Ones",
    description: "Engaging movement activities for pre-school children",
    category: "pre-school",
    googleDriveId: "sample_id_9",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_9/view",
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
    googleDriveId: "sample_id_10",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_10/view",
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
    googleDriveId: "sample_id_11",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_11/view",
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
    googleDriveId: "sample_id_12",
    googleDriveUrl: "https://drive.google.com/file/d/sample_id_12/view",
    instructor: "PE Teacher John",
    difficulty: "intermediate",
    ageGroup: "high",
    tags: ["PE", "advanced", "skills"],
    featured: false,
    order: 2
  }
];

async function populateVideos() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-in-schools');
    console.log('Connected to MongoDB');

    // Clear existing videos
    await Video.deleteMany({});
    console.log('Cleared existing videos');

    // Insert sample videos
    const insertedVideos = await Video.insertMany(sampleVideos);
    console.log(`Successfully inserted ${insertedVideos.length} videos`);

    // Display the inserted videos by category
    const categories = ['workout-sports', 'dance-move', 'yoga', 'mindfulness', 'pre-school', 'k-12'];
    
    for (const category of categories) {
      const videos = await Video.find({ category });
      console.log(`\n${category.toUpperCase()} (${videos.length} videos):`);
      videos.forEach(video => {
        console.log(`  - ${video.title} (${video.instructor})`);
      });
    }

    console.log('\nDatabase populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateVideos(); 