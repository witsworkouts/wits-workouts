# Google Workspace Email Setup Guide

If you already have Google Workspace for `wellnessintheschools.org`, you can use it to send emails from `noreply@wellnessintheschools.org` **without paying extra** (as long as you have available user slots).

## Cost Clarification

- ✅ **No extra cost** if you have available user slots in your Google Workspace plan
- ❌ **Additional cost** only if you're at your user limit and need to upgrade your plan
- Most Google Workspace plans include multiple users, so you likely have available slots

## Step 1: Create the noreply Email Account

1. Log in to your **Google Workspace Admin Console**
   - Go to [admin.google.com](https://admin.google.com)
   - Sign in with your admin account

2. Go to **Users** → **Add new user**

3. Create the email account:
   - **First name**: Wellness
   - **Last name**: in Schools
   - **Primary email**: `noreply@wellnessintheschools.org`
   - **Password**: Create a strong password (you'll use this to generate an app password)

4. Click **Add New User** or **Save**

## Step 2: Enable 2-Factor Authentication

1. Log in to the new email account: `noreply@wellnessintheschools.org`
2. Go to [myaccount.google.com](https://myaccount.google.com)
3. Navigate to **Security** → **2-Step Verification**
4. Follow the setup process to enable 2FA

**Note**: 2FA is required to generate app passwords for SMTP.

## Step 3: Generate App Password

1. While logged in as `noreply@wellnessintheschools.org`, go to [myaccount.google.com](https://myaccount.google.com)
2. Go to **Security** → **App passwords**
3. You may need to sign in again
4. Select **Mail** and **Other (Custom name)**
5. Name it: "Wellness in Schools App"
6. Click **Generate**
7. **IMPORTANT**: Copy the 16-character app password immediately - you won't see it again!

The app password will look like: `abcd efgh ijkl mnop` (remove spaces when using it)

## Step 4: Update Your .env File

Add these lines to your `.env` file in the `server/` directory:

```env
EMAIL_SERVICE=workspace
EMAIL_USER=noreply@wellnessintheschools.org
EMAIL_PASS=your_16_character_app_password_here
EMAIL_FROM=noreply@wellnessintheschools.org
```

Replace `your_16_character_app_password_here` with the app password from Step 3 (remove spaces).

## Step 5: Test the Configuration

1. Restart your server:
   ```bash
   cd server
   npm start
   ```

2. Check the server console - you should see:
   ```
   Email server (workspace) is ready to send messages
   ```

3. Test password reset:
   - Go to login page
   - Click "Forgot Password?"
   - Enter an email address
   - Check if email arrives from `noreply@wellnessintheschools.org`

## Troubleshooting

### "Authentication failed" error

- Make sure you're using the **app password**, not the regular password
- Verify 2FA is enabled on the account
- Check that `EMAIL_USER` is the full email: `noreply@wellnessintheschools.org`
- Remove any spaces from the app password

### "User not found" error

- Verify the email account exists in Google Workspace Admin Console
- Make sure the account is active (not suspended)
- Check that you can log in to the email account normally

### "Connection timeout" error

- Check your firewall isn't blocking port 587
- Verify SMTP settings:
  - Host: `smtp.gmail.com`
  - Port: `587`
  - Security: `TLS`

### Emails going to spam

- Set up SPF and DKIM records (Google Workspace usually handles this automatically)
- Check Google Workspace Admin Console → Apps → Google Workspace → Gmail → Routing
- Verify domain authentication status

## Important Notes

1. **Use App Password**: Always use an app password, never your regular account password
2. **2FA Required**: App passwords require 2FA to be enabled
3. **No Extra Cost**: Creating a new user only costs money if you're at your plan's user limit
4. **User Limit**: Check your Google Workspace plan to see how many users you can have

## Alternative: Use Existing User

If you don't want to create a new user, you can use an existing Google Workspace email account:

1. Use an existing email (e.g., `admin@wellnessintheschools.org`)
2. Generate an app password for that account
3. Update `.env`:
   ```env
   EMAIL_SERVICE=workspace
   EMAIL_USER=admin@wellnessintheschools.org
   EMAIL_PASS=app_password_here
   EMAIL_FROM=noreply@wellnessintheschools.org
   ```

Note: The email will still show as coming from `admin@wellnessintheschools.org` (the authenticated account), but with "Wellness in Schools" as the display name.

## Summary

If you already have Google Workspace:
- ✅ Create `noreply@wellnessintheschools.org` as a new user (free if you have available slots)
- ✅ Generate an app password
- ✅ Configure your `.env` file
- ✅ Start sending emails from your custom domain!

This is the easiest solution if you already have Google Workspace set up!

