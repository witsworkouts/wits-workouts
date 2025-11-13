# Video Setup Guide for Wellness in Schools

## 🎯 Current Status
✅ Database populated with sample videos  
✅ Admin user created (nsbhui26@colby.edu / admin123)  
✅ Admin dashboard ready for video management  

## 📁 Your Google Drive Structure
Your videos are organized in this Google Drive folder:
`https://drive.google.com/drive/folders/1SYHHQQDDPIC2XIrz_gDTrjXMZBrt2qOi`

The folders match our categories:
- Workout & Sports
- Dance & Move  
- Yoga
- Mindfulness
- Pre-School
- K-12

## 🚀 How to Add Your Real Videos

### Method 1: Using the Admin Dashboard (Recommended)

1. **Login as Admin**
   - Go to: `http://localhost:3000/login`
   - Email: `nsbhui26@colby.edu`
   - Password: `admin123`

2. **Access Admin Dashboard**
   - Click "Admin" button in the navbar
   - Go to "Videos" tab
   - Click "Add Video" button

3. **Add Videos from Each Category**
   For each video in your Google Drive:

   **Required Fields:**
   - **Title**: Descriptive name of the video
   - **Category**: Select the matching category
   - **Google Drive URL**: Copy the sharing link from Google Drive
   - **Description**: Brief description of the video content

   **Optional Fields:**
   - **Instructor**: Name of the instructor/teacher
   - **Age Group**: Pre-School/Elementary/Middle/High/All
   - **Tags**: Comma-separated keywords
   - **Featured**: Check if it should appear in featured videos

4. **Getting Google Drive URLs**
   - Open your Google Drive folder
   - Right-click on a video file
   - Select "Share" → "Copy link"
   - Make sure sharing is set to "Anyone with the link can view"
   - Paste the URL in the "Google Drive URL" field

### Method 2: Bulk Import Script (Advanced)

If you have many videos, I can create a script to bulk import them. You would need to:
1. Create a CSV file with video details
2. Run a bulk import script
3. The script would automatically extract Drive IDs and populate the database

## 📋 Video Categories and Examples

### Workout & Sports
- Morning exercise routines
- Sports conditioning
- Physical fitness activities
- Team sports drills

### Dance & Move
- Hip hop dance tutorials
- Contemporary dance
- Movement activities
- Dance fitness

### Yoga
- Beginner yoga poses
- Mindful yoga sequences
- Breathing exercises
- Relaxation techniques

### Mindfulness
- Meditation sessions
- Stress relief techniques
- Focus exercises
- Mindful breathing

### Pre-School
- Fun movement activities
- Story-based movement
- Simple dance routines
- Interactive games

### K-12
- Physical education lessons
- Sports skills training
- Fitness assessments
- Health education

## 🔧 Technical Details

### Google Drive Integration
- Videos are embedded using Google Drive's preview feature
- URLs are automatically converted to embed format
- No need to download or re-upload videos

### Video Format Support
- MP4 (recommended)
- MOV
- AVI
- WebM
- Other formats supported by Google Drive

### File Size Considerations
- Google Drive has a 5TB limit per file
- For web streaming, keep files under 500MB for best performance
- Consider compressing videos if they're very large

## 🎨 Customization Options

### Thumbnails
- You can add custom thumbnail URLs
- If not provided, the system generates placeholder thumbnails

### Video Ordering
- Videos are displayed by the "order" field
- Featured videos appear first
- You can reorder videos in the admin panel

### Categories
- The 6 main categories are fixed
- You can add subcategories using tags
- Videos can belong to multiple categories via tags

## 🚨 Important Notes

1. **Sharing Permissions**: Make sure all videos are set to "Anyone with the link can view"
2. **File Names**: Use descriptive file names that match the video content
3. **Organization**: Keep your Google Drive folders organized by category
4. **Backup**: Consider backing up your video metadata in case of database issues

## 🆘 Troubleshooting

### Videos Not Playing
- Check that sharing permissions are correct
- Verify the Google Drive URL is valid
- Try opening the URL in an incognito window

### Admin Access Issues
- Make sure you're logged in with the admin account
- Check that the user role is set to 'admin' in the database
- Try logging out and back in

### Database Issues
- Run `npm run populate` to reset sample data
- Run `npm run create-admin` to recreate admin user
- Check MongoDB connection in `.env` file

## 📞 Next Steps

1. **Start with a few videos** from each category to test the system
2. **Add descriptions and metadata** to make videos searchable
3. **Test video playback** on different devices
4. **Set up featured videos** for the homepage
5. **Invite users** to test the platform

## 🎉 Success!

Once you've added your videos, users will be able to:
- Browse videos by category
- Search for specific content
- Watch videos in full-screen mode
- Navigate between videos with arrow controls
- Track their viewing progress
- Compete on the leaderboard

The platform is now ready to serve your wellness content to schools! 