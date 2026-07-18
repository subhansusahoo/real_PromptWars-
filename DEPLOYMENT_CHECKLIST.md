# Deployment Checklist for Vercel

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] All changes committed and pushed to GitHub
- [ ] Code is on `main` or `develop` branch
- [ ] No hardcoded secrets in code
- [ ] All environment variables use `process.env`
- [ ] `.env` file is in `.gitignore`

### Testing
- [ ] Run `npm run type-check` - no TypeScript errors
- [ ] Run `npm run lint` - no linting errors
- [ ] Run `npm run test` - all tests passing
- [ ] Test locally with `npm run dev`

### Dependencies
- [ ] Run `npm install` - all dependencies resolved
- [ ] No version conflicts
- [ ] Node version 18+ specified in `.nvmrc`

### Database
- [ ] PostgreSQL database created
- [ ] Database user and password secured
- [ ] Connection string format verified
- [ ] Test connection locally

### API Keys
- [ ] OpenAI API key obtained and tested
- [ ] JWT_SECRET generated (32+ random characters)
- [ ] All keys are strong and unique

---

## 🚀 Vercel Deployment Steps

### Step 1: Connect GitHub Repository
```bash
# Ensure code is pushed
git push origin main

# Go to https://vercel.com/dashboard
# Click "New Project" → Select your repository
```

### Step 2: Configure Build Settings
When importing to Vercel:
- **Framework Preset**: Other
- **Root Directory**: ./
- **Build Command**: npm run build
- **Output Directory**: dist
- **Install Command**: npm install

### Step 3: Add Environment Variables in Vercel

In Vercel Project Settings → Environment Variables, add:

```
DATABASE_URL = postgresql://user:password@host:5432/habitbreaker
OPENAI_API_KEY = sk-...your-key...
JWT_SECRET = ...your-32-char-secret...
CORS_ORIGIN = https://your-project.vercel.app
APP_URL = https://your-project.vercel.app
NODE_ENV = production
```

### Step 4: First Deployment
- Vercel will automatically deploy when you click "Deploy"
- Check the build logs for any errors
- Wait for "✓ Build successful" message

### Step 5: Run Database Migrations

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Pull environment variables
vercel env pull

# Run migrations
npm run prisma:migrate:prod
```

**Option B: Run migrations directly**
```bash
# Get your production database URL from Vercel
DATABASE_URL="postgresql://..." npm run prisma:migrate:prod
```

### Step 6: Verify Deployment

Test these endpoints:
- [ ] `https://your-project.vercel.app/` - Should return API info
- [ ] `https://your-project.vercel.app/health` - Should return status
- [ ] `https://your-project.vercel.app/api/auth/register` - Should return error (POST required)

---

## 🧪 Post-Deployment Testing

### Test All Features

**Authentication**
- [ ] Register new user: `https://your-project.vercel.app`
- [ ] Login with credentials
- [ ] Logout works
- [ ] Token persists in localStorage

**Habit Management**
- [ ] Create new habit
- [ ] View habits list
- [ ] Update habit
- [ ] Delete habit

**Daily Tracking**
- [ ] Check-in as success
- [ ] Check-in as failed
- [ ] Prevent duplicate check-in
- [ ] View check-in history

**AI Features**
- [ ] Get motivational message
- [ ] Panic button works
- [ ] Receives activities
- [ ] Response is relevant

**Dashboard**
- [ ] View statistics
- [ ] See streak timer
- [ ] View progress chart
- [ ] Navigation works

---

## 🔧 Troubleshooting

### Build Fails
```bash
# Check locally first
npm run build

# Check TypeScript
npm run type-check

# Check linting
npm run lint

# View Vercel logs: Go to Deployment → Build Logs
```

### Database Connection Error
```bash
# Verify connection string format
# Should be: postgresql://user:password@host:port/database

# Test connection locally
DATABASE_URL="your-connection-string" npm run prisma:studio

# Regenerate Prisma client
npm run prisma:generate
```

### API 404 Errors
- Check CORS_ORIGIN environment variable
- Verify API routes are built in `dist/server`
- Check browser console for actual error

### Frontend 404 on Routes
- Clear browser cache
- Check Vite build output
- Verify all routes are in `src/client/App.tsx`

---

## 📊 Production Monitoring

### Set Up Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Monitor database performance
- [ ] Set up uptime monitoring (UptimeRobot)

### Regular Checks
- [ ] Monitor error logs daily
- [ ] Check database connection health
- [ ] Review API response times
- [ ] Monitor OpenAI API usage

---

## 🔄 Continuous Deployment

After initial setup, Vercel will:
- Auto-deploy on `main` branch push
- Create preview URLs for PRs
- Run builds automatically
- Show deployment status in GitHub

To prevent auto-deployment:
1. Go to Project Settings
2. Git
3. Uncheck "Automatically deploy on push"

---

## 🆘 Emergency Rollback

If deployment breaks production:

```bash
# Rollback to previous deployment
# 1. Go to Vercel Dashboard
# 2. Deployments
# 3. Find previous working deployment
# 4. Click "..."
# 5. Select "Promote to Production"
```

---

## 📞 Getting Help

If you encounter issues:

1. Check Vercel Build Logs (in dashboard)
2. Check Application Logs (in Vercel)
3. Review VERCEL_DEPLOYMENT.md guide
4. Check README.md for architecture details
5. Review GitHub issues and discussions

---

## ✨ After Successful Deployment

1. **Share URL**: Your app is now live at `https://your-project.vercel.app`
2. **Custom Domain** (optional):
   - Add domain in Vercel project settings
   - Update DNS records
   - Update environment variables

3. **Monitoring**: Set up alerts and monitoring
4. **Feedback**: Gather user feedback and iterate
5. **Updates**: Deploy updates by pushing to main

---

**🎉 Congratulations! Your application is now deployed to Vercel!**
