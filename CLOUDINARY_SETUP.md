# Cloudinary Setup Guide for Thumbnail Storage

This guide will help you set up Cloudinary to store thumbnails permanently in production, solving the issue where thumbnails are lost on Render redeployments.

## Why Cloudinary?

- ✅ **Free tier**: 25GB storage, 25GB bandwidth per month
- ✅ **Permanent storage**: Files persist across server redeployments
- ✅ **CDN**: Fast global delivery
- ✅ **Image optimization**: Automatic resizing and optimization
- ✅ **Easy integration**: Simple API

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"**
3. Create an account (you can use Google/GitHub to sign up)
4. Verify your email

## Step 2: Get Your Credentials

1. After signing up, you'll be taken to the **Dashboard**
2. On the dashboard, you'll see your **Account Details**:
   - **Cloud Name** (e.g., `dxyz12345`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

3. **Copy these three values** - you'll need them for environment variables

## Step 3: Add Environment Variables to Render

1. Go to **Render Dashboard** → Your Backend Service → **Environment**
2. Click **"Add Environment Variable"** and add:

   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   Replace the values with your actual Cloudinary credentials.

3. **Save** the environment variables

## Step 4: Install Dependencies

The code has been updated to use Cloudinary. After deploying, Render will automatically install the new dependency:
- `cloudinary` (the standard Cloudinary SDK)

The implementation uses Cloudinary's upload stream API directly with multer's memory storage.

## Step 5: Test the Setup

1. **Redeploy your backend** on Render (or wait for auto-deploy if you've pushed changes)
2. **Log in to your admin panel**
3. **Upload a new thumbnail** for a video
4. **Check that the thumbnail URL** is a Cloudinary URL (starts with `https://res.cloudinary.com/`)
5. **Verify the image loads** correctly

## How It Works

- **Development (local)**: If Cloudinary credentials are not set, thumbnails are stored locally in `server/uploads/thumbnails/`
- **Production (Render)**: If Cloudinary credentials are set, thumbnails are automatically uploaded to Cloudinary and stored permanently
- **Existing thumbnails**: Old thumbnails stored locally will need to be re-uploaded to Cloudinary

## Troubleshooting

### Thumbnails still not loading
- Verify environment variables are set correctly in Render
- Check Render logs for Cloudinary errors
- Ensure you've redeployed after adding environment variables

### "Invalid API credentials" error
- Double-check your Cloudinary credentials
- Make sure there are no extra spaces in the environment variables
- Verify your Cloudinary account is active

### Want to use local storage in production?
- Simply don't set the Cloudinary environment variables
- Note: Files will be lost on redeploy (as mentioned in deployment guide)

## Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month

For most use cases, the free tier is more than sufficient.

## Alternative: AWS S3

If you prefer AWS S3 instead of Cloudinary:
1. Set up an S3 bucket
2. Install `aws-sdk` and `multer-s3`
3. Update the upload configuration in `server/routes/admin.js`
4. Add AWS credentials to environment variables

Cloudinary is recommended for simplicity and the free tier.

