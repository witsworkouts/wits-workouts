# Wellness in Schools - Video Platform

A modern web application for schools to access and track wellness videos. Built with React frontend and Node.js backend, featuring user authentication, video categorization, and admin analytics.

## Features

### For Users
- **User Registration & Authentication**: Create accounts with username, email, password, school name, and address
- **Video Categories**: Browse videos by categories (Workout & Sports, Dance & Move, Yoga, Mindfulness, Pre-School, K-12)
- **Video Player**: Enlarged video view with Google Drive integration
- **Navigation**: Arrow controls to navigate between videos
- **Leaderboard**: View top users by video views
- **Password Recovery**: Email-based password reset functionality
- **Profile Management**: Update profile information and change passwords

### For Administrators
- **User Management**: View all users, their details, and video viewing statistics
- **Video Management**: Add, edit, and delete videos with Google Drive links
- **Analytics Dashboard**: Comprehensive analytics on user activity and video performance
- **User Activity Tracking**: Monitor which users are viewing which videos
- **Statistics**: View counts, user engagement, and category performance

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **CSS3** - Custom styling with modern design

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality
- **Express Validator** - Input validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Google Drive account for video hosting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Wellness-In-Schools
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/wellness-in-schools
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Email Configuration (for password reset)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Usage

### Setting up Google Drive Videos

1. Upload your videos to Google Drive
2. Set sharing permissions to "Anyone with the link can view"
3. Copy the sharing link
4. Use the admin panel to add videos with the Google Drive URL

### Creating an Admin User

1. Register a regular user account
2. Manually update the user's role to 'admin' in the database:
   ```javascript
   // In MongoDB shell or MongoDB Compass
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Password reset
- `GET /api/auth/me` - Get current user

#### Videos
- `GET /api/videos/categories` - Get all categories
- `GET /api/videos/category/:category` - Get videos by category
- `GET /api/videos/featured` - Get featured videos
- `GET /api/videos/:id` - Get single video
- `POST /api/videos/:id/view` - Track video view
- `GET /api/videos/leaderboard/top` - Get leaderboard

#### Admin (requires admin role)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get analytics data
- `POST /api/admin/videos` - Add new video
- `PUT /api/admin/videos/:id` - Update video
- `DELETE /api/admin/videos/:id` - Delete video

## Project Structure

```
Wellness-In-Schools/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── index.js            # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Update environment variables for production

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update the API base URL in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
