# Email Setup Guide for Password Recovery

## 🚨 **Current Issue:**
Password recovery is not working because email credentials are not configured.

## 🔧 **Solution: Set Up Gmail for Password Recovery**

### **Step 1: Create a .env file in the server directory**

Create a file called `.env` in the `server/` directory with these contents:

```bash
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/wellness-in-schools

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (REQUIRED for password recovery)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Client URL (for password reset links)
CLIENT_URL=http://localhost:3000
```

### **Step 2: Get Gmail App Password**

1. **Go to your Google Account settings**
2. **Enable 2-Factor Authentication** (if not already enabled)
3. **Generate an App Password**:
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Wellness in Schools"
   - Copy the generated 16-character password

### **Step 3: Update .env file**

Replace the placeholder values:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: The 16-character app password (not your regular Gmail password)

### **Step 4: Restart the server**

After creating the .env file, restart your server:
```bash
cd server
npm start
```

## ✅ **What This Fixes:**

- **Password recovery emails** will be sent
- **Reset password links** will work
- **User account recovery** will function properly

## 🧪 **Test the Fix:**

1. **Go to Login page**
2. **Click "Forgot Password?"**
3. **Enter your email** (saadiqnafis@gmail.com)
4. **Check your email** for the reset link
5. **Click the link** to reset your password

## ⚠️ **Important Notes:**

- **Never commit .env to git** (it's already in .gitignore)
- **Use App Password, not regular password**
- **Gmail account must have 2FA enabled**
- **Server must be restarted** after adding .env

## 🆘 **If Still Not Working:**

Check the server console for email errors:
```bash
cd server
npm start
```

Look for "Email server is ready" or error messages.

---

**Need Help?** Share any error messages from the server console!








