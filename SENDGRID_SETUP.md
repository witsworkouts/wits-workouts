# SendGrid Email Setup Guide

This guide will help you set up SendGrid to send emails from `noreply@wellnessintheschools.org`.

## Step 1: Create a SendGrid Account

1. Go to [SendGrid.com](https://sendgrid.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Create an API Key

1. Log in to your SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Give it a name (e.g., "Wellness in Schools")
5. Select **Full Access** or **Restricted Access** with "Mail Send" permissions
6. Click **Create & View**
7. **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!

## Step 3: Verify Your Domain (Required for custom "from" address)

To send emails from `noreply@wellnessintheschools.org`, you need to verify your domain:

1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Select your DNS provider (or choose "Other" if not listed)
4. Enter your domain: `wellnessintheschools.org`
5. SendGrid will provide DNS records (CNAME records) to add to your domain
6. Add these records to your domain's DNS settings
7. Click **Verify** in SendGrid dashboard

**Note**: DNS propagation can take 24-48 hours. SendGrid will send you an email when verification is complete.

### Alternative: Use Single Sender Verification (Faster, but less secure)

If you can't verify the entire domain:

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Enter:
   - **From Email Address**: `noreply@wellnessintheschools.org`
   - **From Name**: Wellness in Schools
   - **Reply To**: (optional)
   - **Company Address**: (your address)
4. Click **Create**
5. Check your email and click the verification link

## Step 4: Update Your .env File

Add these lines to your `.env` file in the `server/` directory:

```env
# Email Service Configuration
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.your_actual_api_key_here
EMAIL_FROM=noreply@wellnessintheschools.org
```

Replace `SG.your_actual_api_key_here` with the API key you copied in Step 2.

## Step 5: Test the Configuration

1. Restart your server:
   ```bash
   cd server
   npm start
   ```

2. Try the password reset functionality:
   - Go to the login page
   - Click "Forgot Password?"
   - Enter an email address
   - Check if the email arrives from `noreply@wellnessintheschools.org`

## Troubleshooting

### Emails not sending

1. **Check API Key**: Make sure `SENDGRID_API_KEY` is correct in your `.env` file
2. **Check Domain Verification**: Ensure your domain is verified in SendGrid
3. **Check Server Logs**: Look for error messages in your server console
4. **Check SendGrid Dashboard**: Go to Activity → Check for failed sends and reasons

### "Domain not verified" error

- Make sure you've completed domain verification (Step 3)
- Wait for DNS propagation (can take up to 48 hours)
- Double-check that DNS records are correct

### Rate Limits

SendGrid Free Tier allows:
- **100 emails/day** for the first 30 days
- **40,000 emails** for the first 30 days (total)
- After 30 days: **100 emails/day** permanently

For production, consider upgrading to a paid plan.

## Alternative: Using Gmail (Current Setup)

If you want to keep using Gmail temporarily:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@wellnessintheschools.org
```

Note: With Gmail, emails will still show as coming from your Gmail address, but with "Wellness in Schools" as the display name.

## Need Help?

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid Support](https://support.sendgrid.com/)



