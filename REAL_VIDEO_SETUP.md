# Real Video Setup Guide for Wellness in Schools

## 🎯 **Current Problem**
Your videos are showing "Sorry, the file you have requested does not exist" because the database contains placeholder IDs instead of real Google Drive file IDs.

## 🔧 **Solution: Set Up Real Videos**

### **Step 1: Prepare Your Google Drive Videos**

1. **Upload Videos to Google Drive**
   - Go to [drive.google.com](https://drive.google.com)
   - Create a folder called "Wellness in Schools Videos"
   - Upload your video files to this folder

2. **Set Sharing Permissions**
   - Right-click on each video file
   - Select "Share" → "Get link"
   - Change from "Restricted" to "Anyone with the link"
   - Set permission to "Viewer"
   - Click "Done"

### **Step 2: Get the Correct File ID**

**Method 1: From Share Link**
```
Original Share Link: https://drive.google.com/file/d/1ABC123DEF456/view?usp=sharing
File ID: 1ABC123DEF456
```

**Method 2: From URL Bar**
```
When viewing a file in Google Drive, the URL shows:
https://drive.google.com/file/d/FILE_ID_HERE/view
```

### **Step 3: Update the Database**

Run this script to add real videos:

```bash
cd server
node scripts/addRealVideos.js
```

### **Step 4: Video Categories & Subcategories**

Based on your design, organize videos into these categories:

#### **Main Categories:**
- **Pre-School** → Subcategories: Pre-K - 2, Grades 3-4, Grades 5-8, High School
- **K-12** → Subcategories: Pre-K - 2, Grades 3-4, Grades 5-8, High School  
- **Yoga** → Subcategories: Pre-K - 2, Grades 3-4, Grades 5-8, High School
- **Workout & Sports** → Subcategories: Pre-K - 2, Grades 3-4, Grades 5-8, High School
- **Dance & Move** → Subcategories: Pre-K - 2, Grades 3-4, Grades 5-8, High School
- **Mindfulness** → Subcategories: Pre-K - 2, Grades 3-4, Grades 5-8, High School

## 📝 **Example Video Entry**

```javascript
{
  title: "Morning Workout Routine",
  description: "A complete morning workout routine for students to start their day energized",
  category: "workout-sports",
  subcategory: "grades-3-4", // New field for subcategories
  googleDriveId: "1ABC123DEF456", // REAL file ID from Google Drive
  googleDriveUrl: "https://drive.google.com/file/d/1ABC123DEF456/view",
  instructor: "Coach Sarah",
  difficulty: "beginner",
  ageGroup: "elementary",
  tags: ["morning", "workout", "energy"],
  featured: true,
  order: 1
}
```

## 🚀 **Quick Fix Script**

I'll create a script that will:
1. Clear existing placeholder videos
2. Add real videos with proper Google Drive IDs
3. Include subcategory support
4. Set up proper video embedding

## ⚠️ **Important Notes**

- **File IDs are unique**: Each video has a different ID
- **Sharing must be public**: Videos must be accessible to anyone with the link
- **File format**: MP4, MOV, AVI work best
- **File size**: Keep under 500MB for better performance

## 🔍 **Testing Your Videos**

After setup:
1. Go to your website
2. Click on a video category
3. Click "Play" on a video
4. Video should open in a modal with proper playback
5. Use arrow keys or navigation arrows to move between videos

---

**Need Help?** If you have specific video files ready, share their Google Drive share links and I can help you set them up correctly!









