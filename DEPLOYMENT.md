# Vercel Deployment Guide for ECE-Vision Hub

This guide will help you deploy your ECE-Vision Hub React application to Vercel.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project**: Your Supabase project should be set up and running

## Step 1: Prepare Your Repository

Make sure your repository contains:
- ✅ `package.json` with build scripts
- ✅ `vite.config.ts` for Vite configuration
- ✅ `vercel.json` for Vercel configuration
- ✅ Environment variables configured

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Your Repository**
   - Connect your GitHub account if not already connected
   - Select your ECE-Vision Hub repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=https://eiynbxoxziefklhxysim.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeW5ieG94emllZmtsaHh5c2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDYwOTUsImV4cCI6MjA2NjU4MjA5NX0.B9owQKyfk4fmrBEpkvYuMF9byMI1HHzIcOirIbPq1hA
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Set environment variables when prompted

## Step 3: Configure Supabase for Production

### Update Supabase Auth Settings

1. **Go to Supabase Dashboard**
   - Visit your project dashboard
   - Navigate to Authentication > Settings

2. **Update Site URL**
   - Add your Vercel domain to "Site URL"
   - Example: `https://your-app.vercel.app`

3. **Update Redirect URLs**
   - Add redirect URLs for authentication:
     ```
     https://your-app.vercel.app/
     https://your-app.vercel.app/auth/callback
     ```

### Update RLS Policies (if needed)

Make sure your Row Level Security policies are configured for production:

```sql
-- Example: Allow authenticated users to read profiles
CREATE POLICY "Users can view profiles" ON profiles
FOR SELECT USING (auth.role() = 'authenticated');

-- Example: Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);
```

## Step 4: Test Your Deployment

1. **Check Authentication**
   - Test user registration and login
   - Verify email confirmation works
   - Test password reset functionality

2. **Test Core Features**
   - Idea submission and editing
   - Upvoting system
   - User connections
   - Achievement system

3. **Check Responsive Design**
   - Test on mobile devices
   - Verify all components work correctly

## Step 5: Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your Vercel project settings
   - Click "Domains"
   - Add your custom domain

2. **Update Supabase Settings**
   - Update Site URL and redirect URLs in Supabase
   - Include your custom domain

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Environment Variables**
   - Make sure all `VITE_*` variables are set in Vercel
   - Check that variables are accessible in the browser

3. **Routing Issues**
   - Verify `vercel.json` is configured correctly
   - Check that React Router is working

4. **Supabase Connection**
   - Verify Supabase URL and keys are correct
   - Check CORS settings in Supabase
   - Ensure RLS policies are configured

### Useful Commands

```bash
# Test build locally
npm run build

# Preview build locally
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Lint code
npm run lint
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJ...` |
| `VITE_APP_NAME` | Application name | `ECE-Vision Hub` |
| `VITE_APP_URL` | Your app's URL | `https://your-app.vercel.app` |

## Post-Deployment Checklist

- [ ] Authentication works correctly
- [ ] All features are functional
- [ ] Mobile responsiveness is good
- [ ] Performance is acceptable
- [ ] Error handling works
- [ ] Analytics are set up (if needed)
- [ ] Monitoring is configured (if needed)

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review Supabase logs
3. Test locally with production environment variables
4. Check browser console for errors

Your ECE-Vision Hub should now be successfully deployed on Vercel! 🚀 