# 🚀 Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All code is committed to GitHub
- [ ] Build passes locally (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Linting passes (`npm run lint`)
- [ ] All features tested locally

### ✅ Environment Variables
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] Optional: `VITE_APP_NAME` and `VITE_APP_URL`

### ✅ Configuration Files
- [ ] `vercel.json` exists and is configured
- [ ] `package.json` has correct build scripts
- [ ] `vite.config.ts` is properly configured

## Deployment Steps

### 1. Deploy to Vercel
```bash
# Option A: Use deployment script
./deploy.sh

# Option B: Manual deployment
vercel --prod
```

### 2. Configure Environment Variables in Vercel
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add:
  ```
  VITE_SUPABASE_URL=https://eiynbxoxziefklhxysim.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeW5ieG94emllZmtsaHh5c2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDYwOTUsImV4cCI6MjA2NjU4MjA5NX0.B9owQKyfk4fmrBEpkvYuMF9byMI1HHzIcOirIbPq1hA
  ```

### 3. Update Supabase Settings
- Go to Supabase Dashboard → Authentication → Settings
- Update Site URL: `https://your-app.vercel.app`
- Add Redirect URLs:
  ```
  https://your-app.vercel.app/
  https://your-app.vercel.app/auth/callback
  ```

## Post-Deployment Testing

### ✅ Core Functionality
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Idea submission works
- [ ] Upvoting system works
- [ ] User connections work
- [ ] Admin dashboard accessible (if admin user)

### ✅ UI/UX Testing
- [ ] Responsive design works on mobile
- [ ] Dark/light mode switching works
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Error messages display properly
- [ ] Loading states work

### ✅ Performance
- [ ] Page load times are acceptable
- [ ] Images load correctly
- [ ] No console errors
- [ ] Real-time features work

## Troubleshooting

### Common Issues & Solutions

**Build Fails**
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Ensure TypeScript compilation passes

**Environment Variables Not Working**
- Verify variables are set in Vercel dashboard
- Check variable names start with `VITE_`
- Redeploy after adding variables

**Authentication Issues**
- Check Supabase URL and keys are correct
- Verify redirect URLs in Supabase settings
- Test with different browsers

**Routing Issues**
- Verify `vercel.json` configuration
- Check React Router setup
- Test direct URL access

## Quick Commands

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls
```

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**🎉 Your ECE-Vision Hub is now live!** 

Share your deployed URL and start connecting ECE students with innovative ideas! 