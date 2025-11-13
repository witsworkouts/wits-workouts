# Deployment Guide for Wellness in Schools

This guide will walk you through deploying your Wellness in Schools application to Render.com with your GoDaddy domain (wits-workouts.com).

## Prerequisites

- ✅ GoDaddy domain: `wits-workouts.com`
- ✅ Render.com Professional account
- ✅ MongoDB Atlas account (for production database)
- ✅ Google Workspace account (for email)
- ✅ GitHub account (for code repository)

## Quick Start

If you prefer, you can use the `render.yaml` file included in this repository for easier deployment. However, this guide will walk you through manual setup for better understanding.

---

## Step 1: Set Up MongoDB Atlas (Production Database)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account (M0 cluster is free)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a cloud provider and region (choose closest to your users)
   - Click "Create"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add Render's IP ranges)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<username>` and `<password>` with your database user credentials
   - Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wellness-in-schools?retryWrites=true&w=majority`
   - **Save this connection string** - you'll need it for Render

---

## Step 2: Prepare Your Code for Production

### 2.1 Update Environment Variables

Create a `.env` file in the `server` directory with production values (this is just for reference - you'll add these to Render):

```env
# Server Configuration
PORT=10000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wellness-in-schools?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-very-secure

# Email Configuration (Google Workspace)
EMAIL_SERVICE=workspace
EMAIL_USER=noreply@wellnessintheschools.org
EMAIL_PASS=your-google-app-password
EMAIL_FROM=noreply@wellnessintheschools.org

# Contact Form Email
CONTACT_EMAIL=kit@wellnessintheschools.org

# Client URL (your domain)
CLIENT_URL=https://wits-workouts.com
```

### 2.2 Commit Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   cd /home/nafis/Desktop/Wellness-In-Schools
   git init
   git add .
   git commit -m "Initial commit - ready for deployment"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Create a new repository (e.g., `wellness-in-schools`)
   - **Don't** initialize with README

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wellness-in-schools.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign in with your account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `wellness-in-schools` repository

3. **Configure Backend Service**
   - **Name**: `wellness-in-schools-api` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose based on your needs (Starter plan is fine to start)
   - **Auto-Deploy**: `Yes` (deploys automatically on git push)

4. **Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   PORT=10000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wellness-in-schools?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_SERVICE=workspace
   EMAIL_USER=noreply@wellnessintheschools.org
   EMAIL_PASS=your-google-app-password
   EMAIL_FROM=noreply@wellnessintheschools.org
   CONTACT_EMAIL=kit@wellnessintheschools.org
   CLIENT_URL=https://wits-workouts.com
   ```

5. **Create Service**
   - Click "Create Web Service"
   - Render will start building and deploying
   - Wait for deployment to complete
   - **Note the URL**: `https://wellness-in-schools-api.onrender.com` (or similar)

---

## Step 4: Deploy Frontend to Render

1. **Create New Static Site**
   - In Render dashboard, click "New +" → "Static Site"
   - Connect the same GitHub repository

2. **Configure Static Site**
   - **Name**: `wellness-in-schools` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `NODE_OPTIONS=--openssl-legacy-provider npm install && NODE_OPTIONS=--openssl-legacy-provider npm run build`
   - **Publish Directory**: `build`
   - **Auto-Deploy**: `Yes` (deploys automatically on git push)
   
   **Note**: The `_redirects` file in `client/public/` is automatically included in the build and ensures that all routes (like `/login`, `/register`, etc.) serve `index.html` so React Router can handle client-side routing. This prevents "Not Found" errors when reloading pages.

3. **Environment Variables**
   Add these environment variables:
   ```
   REACT_APP_API_URL=https://wellness-in-schools-api.onrender.com
   NODE_OPTIONS=--openssl-legacy-provider
   ```
   
   **Note**: The `NODE_OPTIONS=--openssl-legacy-provider` is required because `react-scripts` 4.0.3 is not compatible with Node.js v17+. This flag enables legacy OpenSSL algorithms.

4. **Create Static Site**
   - Click "Create Static Site"
   - Wait for build to complete
   - **Note the URL**: `https://wellness-in-schools.onrender.com` (or similar)

---

## Step 5: Configure Frontend API Connection

The frontend needs to know where the backend API is. We have two options:

### Option A: Separate Frontend/Backend (Recommended for Professional Plan)

If deploying frontend and backend separately:

1. **Update axios imports** to use the configured instance (already created in `client/src/config/axios.js`)
2. **Set environment variable** in Render Static Site:
   ```
   REACT_APP_API_URL=https://wellness-in-schools-api.onrender.com
   ```

### Option B: Combined Deployment (Simpler)

If you want to serve frontend from backend (already configured in `server/index.js`):

1. **Deploy only the backend** (skip frontend static site)
2. **Build frontend** and it will be served from the backend
3. **Set CLIENT_URL** to your domain in backend environment variables

**For this guide, we'll use Option A (separate deployments).**

**Note**: The code has been updated to use `axiosInstance` from `config/axios.js` which automatically handles the API URL based on environment variables. All axios imports have been updated throughout the codebase.

---

## Step 6: Configure Custom Domain in Render

### 6.1 Add Domain to Backend Service

1. Go to your backend service in Render dashboard
2. Click "Settings" → "Custom Domains"
3. Click "Add Custom Domain"
4. Enter: `api.wits-workouts.com` (or `backend.wits-workouts.com`)
5. Render will provide DNS records - **copy these** (you'll need them for GoDaddy)

### 6.2 Add Domain to Frontend Static Site

1. Go to your frontend static site in Render dashboard
2. Click "Settings" → "Custom Domains"
3. Click "Add Custom Domain"
4. Enter: `wits-workouts.com` and `www.wits-workouts.com`
5. Render will provide DNS records - **copy these**

---

## Step 7: Configure DNS in GoDaddy

1. **Log in to GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Sign in and go to "My Products"
   - Click "DNS" next to your domain

2. **Add DNS Records**
   
   **Important**: GoDaddy doesn't support CNAME for root domain (`@`). You have two options:
   
   **Option A: Use A Records (Recommended)**
   - Go to Render dashboard → Your Frontend Service → Settings → Custom Domains
   - Render will provide A record IP addresses (usually 2-4 IP addresses)
   - **IMPORTANT**: In GoDaddy, you need to:
     1. **Remove any existing A records** for `@` that point to GoDaddy's parking page
     2. **Add new A records** for each IP address Render provides:
        - **Type**: A
        - **Name**: `@` (or leave blank - this is the root domain)
        - **Value**: Each IP address from Render (add one record per IP)
        - **TTL**: 600
     3. **Make sure you're NOT using GoDaddy's "Parked Domain" or "Coming Soon" page**
   
   - For `www`:
     - **Type**: CNAME
     - **Name**: `www`
     - **Value**: The Render-provided CNAME (e.g., `wellness-in-schools.onrender.com`)
     - **TTL**: 3600

   **Option B: Use www only (Simpler)**
   - Point only `www.wits-workouts.com` to Render
   - Set up redirect from root domain to www in Render or GoDaddy
   
   **For API subdomain** (if using separate backend):
   - **Important**: First add `api.wits-workouts.com` as a custom domain in Render (Step 6.1)
   - Render will provide the exact DNS record to use (usually a CNAME)
   - In GoDaddy, add the record:
     - **Type**: CNAME (or A record if Render specifies)
     - **Name**: `api` (or `backend`)
     - **Value**: Use the exact value Render provides (e.g., `wits-workouts-api.onrender.com` or an IP address)
     - **TTL**: 3600

3. **Wait for DNS Propagation**
   - DNS changes can take 24-48 hours, but usually happen within 1-2 hours
   - Check propagation: [whatsmydns.net](https://www.whatsmydns.net)

---

## Step 7.5: Verify DNS Propagation (Before Step 8)

**How long to wait:**
- ⏱️ **Usually**: 1-2 hours
- ⏱️ **Maximum**: 24-48 hours (rare)
- ⏱️ **Minimum**: 15-30 minutes (sometimes faster)

**How to know you're ready for Step 8:**

### 1. Check DNS Propagation
Visit [whatsmydns.net](https://www.whatsmydns.net) and check:
- `wits-workouts.com` - Should show your Render IP addresses
- `www.wits-workouts.com` - Should show your Render CNAME
- `api.wits-workouts.com` - Should show your backend Render URL

### 2. Test Domain Access
Try accessing your domains directly in a browser:

- **Frontend**: `https://wits-workouts.com` or `https://www.wits-workouts.com`
  - ✅ **Ready if**: Site loads (even if it shows errors, that's fine - it means DNS is working)
  - ❌ **Not ready if**: "This site can't be reached" or DNS error

- **Backend API**: `https://api.wits-workouts.com/api/health`
  - ✅ **Ready if**: You see `{"status":"OK","message":"Wellness in Schools API is running"}` or similar JSON
  - ❌ **Not ready if**: "This site can't be reached" or DNS error

### 3. Check SSL Certificate Status
- Go to Render Dashboard → Your Services → Settings → Custom Domains
- ✅ **Ready if**: SSL certificate shows "Active" or "Provisioned" (green checkmark)
- ⏳ **Wait if**: SSL shows "Pending" or "Provisioning" (this happens automatically after DNS propagates)

### 4. Quick Test Commands
You can also test from your terminal:
```bash
# Test frontend domain
curl -I https://wits-workouts.com

# Test API domain
curl https://api.wits-workouts.com/api/health
```

**✅ You're ready for Step 8 when:**
- DNS has propagated (checked via whatsmydns.net)
- You can access `https://wits-workouts.com` (even if it shows errors)
- You can access `https://api.wits-workouts.com/api/health` and get a response
- SSL certificates are active in Render dashboard

**⏳ Still waiting if:**
- DNS lookup fails
- "This site can't be reached" errors
- SSL certificate still pending

---

## Step 8: Update Environment Variables After Domain Setup

Once your domain is live and verified, update environment variables:

### Backend Service:
```
CLIENT_URL=https://wits-workouts.com
```
**Important**: 
- Don't include a trailing slash (use `https://wits-workouts.com` not `https://wits-workouts.com/`)
- The CORS configuration automatically allows both `www.wits-workouts.com` and `wits-workouts.com`, so either will work

### Frontend Static Site:
```
REACT_APP_API_URL=https://api.wits-workouts.com
```
(Or if using same domain: `REACT_APP_API_URL=https://wits-workouts.com`)

---

## Step 9: SSL Certificate (Automatic)

Render automatically provisions SSL certificates via Let's Encrypt for custom domains. This happens automatically once DNS is configured correctly.

---

## Step 10: Final Configuration

### 10.1 Update CORS in Backend

The backend CORS is already configured to use `CLIENT_URL` environment variable, so it should work automatically.

### 10.2 Test Your Deployment

1. Visit `https://wits-workouts.com`
2. Test login/registration
3. Test admin panel
4. Test video playback
5. Test password reset email

### 10.3 Create Admin Account

You need at least one admin account to manage the site. Here are three ways to create one:

#### Option 1: Using Render Shell (Recommended - Easiest)

1. **Go to Render Dashboard** → Your Backend Service → **Shell** tab (or click "Shell" in the left sidebar)
2. **Open the Shell** (click "Open Shell" or use the terminal)
3. **Navigate to the server directory** (if root directory is set to `server`, you're already there):
   ```bash
   # If root directory is the project root:
   cd server
   # If root directory is already set to 'server' in Render, skip this step
   ```
4. **Run the script**:
   ```bash
   node scripts/createProductionAdmin.js
   ```
5. **Or with custom credentials**:
   ```bash
   EMAIL=your-email@example.com PASSWORD=YourSecurePassword123 USERNAME=admin node scripts/createProductionAdmin.js
   ```
6. **Note the credentials** displayed and **change the password after first login**

#### Option 2: Run Script Locally with Production Database

1. **Set your production MONGODB_URI** locally:
   ```bash
   export MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wellness-in-schools?retryWrites=true&w=majority"
   ```
2. **Run the script**:
   ```bash
   cd server
   node scripts/createProductionAdmin.js
   ```
3. **Or with custom credentials**:
   ```bash
   MONGODB_URI="your-connection-string" EMAIL=your-email@example.com PASSWORD=YourPassword node scripts/createProductionAdmin.js
   ```

#### Option 3: Use Existing Scripts

You can also use the existing scripts:
- `createKitAdmin.js` - Creates admin with email `kit@wellnessintheschools.org`
- `createAdmin.js` - Creates admin with email `nsbhui26@colby.edu`

**Important Security Notes:**
- ⚠️ Change the default password immediately after first login
- ⚠️ The script uses environment variables, so your production MONGODB_URI is already available in Render
- ⚠️ After creating the admin, you can use the admin panel to create additional admins

---

## Step 11: File Uploads (Important!)

**Note**: Render's filesystem is ephemeral. Uploaded files (thumbnails) will be lost on redeploy.

### Solutions:

1. **Use Cloud Storage** (Recommended):
   - Set up AWS S3, Cloudinary, or similar
   - Update multer configuration to upload directly to cloud storage
   - Update thumbnail URLs to use cloud storage URLs

2. **Use Render Disk** (Temporary):
   - Render provides persistent disk storage
   - Configure multer to use persistent disk path
   - **Note**: This is not recommended for production

For now, the app will work, but uploaded thumbnails may be lost on redeploy.

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check Render logs for errors

### Frontend can't connect to backend / CORS errors
- Verify `REACT_APP_API_URL` is set correctly in frontend environment variables
- Check CORS settings in backend - the code now automatically allows both `www` and non-`www` versions
- **CORS Error Fix**: If you get "CORS header 'Access-Control-Allow-Origin' does not match" error:
  - Make sure `CLIENT_URL` in backend matches your frontend domain (with or without www)
  - The backend now automatically allows both versions (www and non-www)
  - Check Render logs for "CORS blocked origin" messages to see what origin is being rejected
  - Ensure `CLIENT_URL` doesn't have a trailing slash: use `https://wits-workouts.com` not `https://wits-workouts.com/`
- Verify backend is running and accessible

### Domain not working / Seeing GoDaddy "Launching Soon" or "Parked Domain" page
- **Problem**: You see GoDaddy's default "Launching Soon" or "Parked Domain" page instead of your site
- **Solution**:
  1. **Go to GoDaddy DNS settings** → Your Domain → DNS
  2. **Check for A records** with Name `@` (or blank)
  3. **Remove any A records** that point to GoDaddy IPs (like `50.63.202.1` or similar)
  4. **Get Render IP addresses**:
     - Go to Render Dashboard → Your Frontend Service → Settings → Custom Domains
     - Look for `wits-workouts.com` - it will show A record IP addresses
  5. **Add new A records** in GoDaddy:
     - Type: A
     - Name: `@` (or leave blank)
     - Value: Each IP address from Render (add one record per IP - usually 2-4 IPs)
     - TTL: 600
  6. **Disable GoDaddy Parking** (if enabled):
     - In GoDaddy, go to your domain settings
     - Look for "Parked Domain" or "Coming Soon" page settings
     - Disable/turn off any parking page features
  7. **Wait 15-60 minutes** for DNS to update
  8. **Test**: Visit `https://wits-workouts.com` - should now show your site
- **Alternative**: If you can't get A records working, use `www.wits-workouts.com` only and set up a redirect
- Wait for DNS propagation (up to 48 hours, usually 1-2 hours)
- Verify DNS records in GoDaddy match Render's requirements
- Check SSL certificate status in Render dashboard

### Email not working
- Verify Google Workspace app password is correct
- Check `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS` are set
- Test email configuration

### Frontend build fails with "digital envelope routines::unsupported" error
- This error occurs when using older `react-scripts` (v4.x) with Node.js v17+
- **Solution**: Update the build command in Render to:
  ```
  NODE_OPTIONS=--openssl-legacy-provider npm install && NODE_OPTIONS=--openssl-legacy-provider npm run build
  ```
- **Alternative**: Add `NODE_OPTIONS=--openssl-legacy-provider` as an environment variable in Render
- **Long-term fix**: Upgrade `react-scripts` to v5.x in `package.json` (requires testing)

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and accessible
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render (or served from backend)
- [ ] Custom domain configured
- [ ] DNS records updated in GoDaddy
- [ ] SSL certificate active (automatic)
- [ ] Environment variables set correctly
- [ ] Admin account created
- [ ] Test all features (login, videos, admin panel)
- [ ] Email functionality tested
- [ ] File uploads configured (if needed)

---

## Support

If you encounter issues:
1. Check Render logs (Dashboard → Your Service → Logs)
2. Check MongoDB Atlas logs
3. Verify environment variables
4. Test API endpoints directly

Good luck with your deployment! 🚀
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
grep
