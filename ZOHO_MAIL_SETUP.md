# Zoho Mail Setup Guide (FREE Custom Domain Email)

This guide will help you set up **free** custom domain email using Zoho Mail, so you can send emails from `noreply@wellnessintheschools.org` for free!

## Why Zoho Mail?

- ✅ **100% FREE** (up to 5 users)
- ✅ Custom domain email support
- ✅ SMTP access included
- ✅ No trial period - permanently free
- ✅ 5GB storage per user
- ✅ Professional email addresses

## Step 1: Sign Up for Zoho Mail

1. Go to [Zoho Mail](https://www.zoho.com/mail/)
2. Click **"Sign Up Now"** or **"Get Started"**
3. Choose **"Mail for Your Domain"** (not personal email)
4. Enter your domain: `wellnessintheschools.org`
5. Create your Zoho account (use any email for the Zoho account itself)

## Step 2: Verify Domain Ownership

Zoho needs to verify that you own the domain:

1. After signing up, you'll be taken to the domain verification page
2. Zoho will provide **DNS records** (TXT and MX records) to add to your domain
3. Go to your domain registrar (where you bought `wellnessintheschools.org`)
4. Access your DNS settings
5. Add the DNS records Zoho provided:
   - **TXT record** (for verification)
   - **MX records** (for email routing)
6. Wait for DNS propagation (usually 15 minutes to 24 hours)
7. Click **"Verify"** in Zoho dashboard

**Note**: DNS changes can take time. Zoho will email you when verification is complete.

## Step 3: Create the noreply Email Account

1. Once domain is verified, go to **"Users"** in Zoho Mail dashboard
2. Click **"Add User"** or **"Create User"**
3. Enter:
   - **Email**: `noreply@wellnessintheschools.org`
   - **Password**: Create a strong password (you'll use this to generate an app password)
   - **Display Name**: Wellness in Schools
4. Click **"Create"**

## Step 4: Generate App Password

Zoho requires an app password (not your regular password) for SMTP:

1. Log in to Zoho Mail with `noreply@wellnessintheschools.org`
2. Go to **Settings** → **Security** → **App Passwords**
3. Click **"Generate New Password"**
4. Give it a name: "Wellness in Schools App"
5. Click **"Generate"**
6. **IMPORTANT**: Copy the app password immediately - you won't see it again!

The app password will look something like: `abcd1234efgh5678`

## Step 5: Update Your .env File

Add these lines to your `.env` file in the `server/` directory:

```env
EMAIL_SERVICE=zoho
EMAIL_USER=noreply@wellnessintheschools.org
EMAIL_PASS=your_app_password_here
EMAIL_FROM=noreply@wellnessintheschools.org
```

Replace `your_app_password_here` with the app password you generated in Step 4.

## Step 6: Test the Configuration

1. Restart your server:
   ```bash
   cd server
   npm start
   ```

2. Check the server console - you should see:
   ```
   Email server (zoho) is ready to send messages
   ```

3. Test password reset:
   - Go to login page
   - Click "Forgot Password?"
   - Enter an email address
   - Check if email arrives from `noreply@wellnessintheschools.org`

## Troubleshooting

### "Domain not verified" error

- Make sure you added all DNS records (TXT and MX) correctly
- Wait for DNS propagation (can take up to 24 hours)
- Double-check DNS records match exactly what Zoho provided
- Check Zoho dashboard for verification status

### "Authentication failed" error

- Make sure you're using the **app password**, not your regular password
- Verify `EMAIL_USER` is the full email: `noreply@wellnessintheschools.org`
- Check that `EMAIL_PASS` is the app password (starts with letters/numbers, no spaces)

### "Connection timeout" error

- Check your firewall isn't blocking port 587
- Verify SMTP settings:
  - Host: `smtp.zoho.com`
  - Port: `587`
  - Security: `TLS`

### Emails going to spam

- Set up SPF and DKIM records (Zoho provides these in DNS settings)
- Add Zoho's SPF record to your domain DNS
- Add Zoho's DKIM records to your domain DNS
- Wait for DNS propagation

## Zoho Mail Free Tier Limits

- ✅ **5 users** (email accounts) per domain
- ✅ **5GB storage** per user
- ✅ **25MB attachment** size limit
- ✅ **Unlimited emails** (reasonable use)
- ✅ **No expiration** - free forever

## Alternative: If You Don't Own the Domain

If you don't have access to DNS settings for `wellnessintheschools.org`, you have a few options:

1. **Contact your domain administrator** to add the DNS records
2. **Use Gmail** with display name (emails will show as "Wellness in Schools <your-gmail>")
3. **Use a subdomain** you control (e.g., `noreply@mail.wellnessintheschools.org`)

## Need Help?

- [Zoho Mail Documentation](https://www.zoho.com/mail/help/)
- [Zoho Mail Support](https://help.zoho.com/portal/en/kb/mail)
- [Zoho SMTP Settings](https://www.zoho.com/mail/help/zoho-mail-smtp-configuration.html)

## Summary

With Zoho Mail, you get:
- ✅ Free custom domain email
- ✅ Professional email address: `noreply@wellnessintheschools.org`
- ✅ No trial period - free forever
- ✅ SMTP access for your application
- ✅ Up to 5 email accounts

This is the best free solution for sending emails from your custom domain!

