# Vercel Deployment Guide for HabitBreaker AI

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

1. **GitHub Account** - Your code must be on GitHub
2. **Vercel Account** - Sign up at https://vercel.com
3. **Database** - PostgreSQL or any Vercel-compatible database
4. **OpenAI API Key** - For AI features
5. **JWT Secret** - Random 32+ character string

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub on the `main` branch:

```bash
# Verify you're on main
git checkout main

# Ensure everything is committed
git status

# Push to GitHub
git push origin main
```

### Step 2: Set Up PostgreSQL Database

Since Vercel has ephemeral storage, SQLite won't work. Use one of these:

**Option A: Vercel Postgres (Recommended)**
- Go to https://vercel.com/storage
- Create a new PostgreSQL database
- Note the connection string

**Option B: External PostgreSQL**
- Use services like:
  - Railway.app
  - Supabase
  - Neon
  - AWS RDS
  - Google Cloud SQL

Get your PostgreSQL connection string in the format:
```
postgresql://user:password@host:port/database
```

### Step 3: Connect Vercel to GitHub

1. Visit https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Find and select your `real_PromptWars-` repository
5. Click "Import"

### Step 4: Configure Environment Variables

In Vercel project settings, go to **Settings** → **Environment Variables**:

Add these variables for **Production**:

```
DATABASE_URL = postgresql://user:password@host:port/habitbreaker
OPENAI_API_KEY = sk-your-openai-key
JWT_SECRET = your-random-32-character-secret-string
CORS_ORIGIN = https://your-project.vercel.app
APP_URL = https://your-project.vercel.app
NODE_ENV = production
```

### Step 5: Database Migration

After deployment, run database migrations:

```bash
# Using Vercel CLI
vercel env pull  # Pulls environment variables locally

# Run migrations
npm run prisma:migrate

# Or connect directly to your production database:
DATABASE_URL="your-postgres-connection-string" npm run prisma:migrate
```

### Step 6: Deploy!

Vercel will automatically:
1. Install dependencies
2. Build your application
3. Deploy to CDN
4. Provide you with a URL

You can also manually deploy:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
vercel deploy --prod
```

---

## 🔧 Configuration Details

### vercel.json Settings

The `vercel.json` file configures:
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: `dist`
- Environment variables mapping
- Function memory: 1024 MB
- Maximum duration: 60 seconds

### Build Process

Vercel will:
1. Run `npm install`
2. Run `npm run build` which:
   - Builds backend: `npm run build:server` (TypeScript → JavaScript)
   - Builds frontend: `npm run build:client` (Vite build)
3. Deploy the `dist` folder

### Environment Variable Mapping

In `vercel.json`, variables are prefixed with `@` to indicate they should be loaded from Vercel's environment:

```json
"env": {
  "DATABASE_URL": "@DATABASE_URL",
  "OPENAI_API_KEY": "@OPENAI_API_KEY"
}
```

---

## 📦 What Gets Deployed

After build:
- **Frontend**: Built React app in `dist/client`
- **Backend**: Compiled Node.js server in `dist/server`
- **Assets**: CSS, images, fonts
- **API**: Express server routes

---

## 🔐 Security Checklist

Before going live, verify:

- ✅ Environment variables are set in Vercel (not in code)
- ✅ JWT_SECRET is a strong, random string
- ✅ Database connection string is secure
- ✅ CORS_ORIGIN is set to your domain
- ✅ HTTPS is enabled (automatic on Vercel)
- ✅ All sensitive keys are removed from `.env` files committed to Git

---

## 🌐 Custom Domain

To use your own domain:

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Update DNS records according to Vercel's instructions
4. Update environment variables:
   - `APP_URL` → your domain
   - `CORS_ORIGIN` → your domain

---

## 🔗 Important URLs

After deployment:
- **Main App**: `https://your-project.vercel.app`
- **API Base**: `https://your-project.vercel.app/api`
- **Health Check**: `https://your-project.vercel.app/health`

---

## ⚡ Performance Optimizations

The deployment is optimized for:
- **Serverless Functions**: Auto-scaling
- **CDN**: Global edge caching
- **Database Connection Pooling**: To handle multiple connections
- **Request Size Limit**: 10MB for JSON/URL-encoded

---

## 🐛 Troubleshooting

### Build Fails

Check build logs in Vercel dashboard:
1. Go to project
2. Click "Deployments"
3. Click latest deployment
4. Check "Build Logs"

Common issues:
- Missing environment variables → Add to Vercel
- TypeScript errors → Run `npm run type-check` locally
- Prisma errors → Run `npm run prisma:generate` locally

### Database Connection Error

If you get database errors:

```bash
# Verify connection string
vercel env pull

# Test locally:
DATABASE_URL="your-connection-string" npm run prisma:studio

# Check Prisma client:
npm run prisma:generate
```

### CORS Issues

If frontend can't reach API:

1. Check `CORS_ORIGIN` in Vercel environment
2. Should match your deployed URL exactly
3. Verify API requests use correct base URL

### 404 Errors

For frontend routes (like `/habits`):
- Make sure frontend routing is handled correctly
- Vite build should include necessary configuration

---

## 📊 Monitoring

Set up monitoring for:
- **Errors**: Vercel provides error tracking
- **Performance**: Use Vercel Analytics
- **Uptime**: Use external service like UptimeRobot

---

## 🔄 Continuous Deployment

After initial setup, Vercel will automatically:
- Deploy on every push to `main` branch
- Run builds and tests
- Provide preview URLs for PRs
- Show deployment status in GitHub

---

## 🚫 Switching from SQLite

If you previously used SQLite:

1. **Export data** from SQLite (if needed)
2. **Update** `DATABASE_URL` in `.env` to PostgreSQL
3. **Run** `npm run prisma:migrate` to set up schema
4. **Import** data if needed
5. **Deploy** to Vercel

---

## 💡 Pro Tips

1. **Test locally first**:
   ```bash
   DATABASE_URL="your-postgres-url" npm run dev
   ```

2. **Monitor deployment**:
   ```bash
   vercel deploy --prod --with-cache
   ```

3. **View logs in real-time**:
   ```bash
   vercel logs
   ```

4. **Rollback if needed**:
   - Go to Vercel dashboard
   - Deployments
   - Click previous deployment → "Promote to Production"

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Express.js Guide: https://expressjs.com
- Troubleshooting: Check Vercel dashboard → Deployments → Build Logs

---

## 🎉 Next Steps

After successful deployment:

1. Test all features:
   - User registration
   - Habit creation
   - Check-ins
   - Panic button
   - AI features

2. Monitor performance:
   - Check Vercel Analytics
   - Monitor database queries
   - Set up error tracking

3. Share with users:
   - Share your deployed URL
   - Gather feedback
   - Iterate and improve

---

**Your application is now live on Vercel! 🚀**

For questions, refer to the README.md or check Vercel's documentation.
