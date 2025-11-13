# Contact Form Setup Guide

## 🎯 **New Feature: Contact Form**

The chat icon at the bottom right of the page now opens a contact form that allows users to send messages directly to **nsbhui26@colby.edu**.

## ✨ **Features:**

- **Subject Field**: Required field for message subject
- **Message Body**: Required field for the actual message
- **Form Validation**: Both fields must be filled to enable submit button
- **Email Delivery**: Messages are sent via email to the specified address
- **Success/Error Feedback**: Users get immediate feedback on submission
- **Auto-close**: Form automatically closes after successful submission

## 🔧 **Backend Setup:**

### **1. Email Configuration**

The contact form requires email credentials to be set up in your `.env` file:

```bash
# In server/.env file
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### **2. Gmail App Password Setup**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Wellness in Schools"
   - Copy the 16-character password

### **3. Update .env File**

```bash
cd server
# Create .env file if it doesn't exist
cp env.example .env

# Edit .env file with your credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

## 🚀 **How It Works:**

1. **User clicks the chat icon** (bottom right)
2. **Contact form opens** with subject and message fields
3. **Form validation** ensures both fields are filled
4. **Submit button** sends data to `/api/contact` endpoint
5. **Backend processes** the form and sends email
6. **User gets feedback** (success/error message)
7. **Form auto-closes** after successful submission

## 📧 **Email Format:**

Emails sent to **nsbhui26@colby.edu** include:
- **Subject**: "Wellness in Schools Contact: [User's Subject]"
- **Content**: User's message with proper formatting
- **Footer**: Indication that it came from the platform

## 🧪 **Testing:**

1. **Start the server**: `cd server && npm start`
2. **Start the client**: `cd client && npm start`
3. **Click the chat icon** on any page
4. **Fill out the form** and submit
5. **Check the email** at nsbhui26@colby.edu

## ⚠️ **Important Notes:**

- **Never commit .env file** to git (already in .gitignore)
- **Use App Password, not regular Gmail password**
- **Gmail account must have 2FA enabled**
- **Server must be restarted** after adding .env file

## 🆘 **Troubleshooting:**

### **Email Not Sending:**
- Check server console for email errors
- Verify .env file has correct credentials
- Ensure Gmail app password is correct
- Check if 2FA is enabled on Gmail account

### **Form Not Working:**
- Check browser console for errors
- Verify server is running on correct port
- Check if contact route is properly loaded

---

**Need Help?** Check the server console for detailed error messages!













