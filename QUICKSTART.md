# Quick Start Guide for HabitBreaker AI

## ⚡ 5-Minute Setup

### Step 1: Clone & Install
```bash
git clone https://github.com/subhansusahoo/real_PromptWars-.git
cd real_PromptWars-
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### Step 3: Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 4: Start Development
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

---

## 📁 Project Structure Overview

```
HabitBreaker/
├── src/
│   ├── server/          # Backend (Express + Node.js)
│   ├── client/          # Frontend (React + TypeScript)
│   └── tests/           # Test files
├── prisma/              # Database schema
├── package.json         # Dependencies
└── README.md            # Full documentation
```

---

## 🚀 Development Commands

```bash
# Start both frontend and backend
npm run dev

# Backend only (port 3000)
npm run server:dev

# Frontend only (port 5173)
npm run client:dev

# Build for production
npm run build

# Run tests
npm run test

# Check code quality
npm run lint

# Format code
npm run lint:fix

# Database operations
npm run prisma:studio  # Visual database explorer
npm run prisma:migrate # Run migrations
```

---

## 🔑 Key Features to Try

1. **Register & Login**
   - Create an account on `/register`
   - Sign in with your credentials

2. **Create a Habit**
   - Go to `/habits`
   - Create a new habit (select from predefined or custom)

3. **Daily Tracking**
   - Click on a habit to view details
   - Mark your daily progress (success/failed)

4. **Panic Button**
   - Click the 🆘 panic button for AI support
   - Get motivational messages and activities

5. **View Stats**
   - See your progress on the dashboard
   - Check charts and streaks

---

## 🛠️ Troubleshooting

### Issue: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database error
```bash
rm prisma/dev.db
npm run prisma:migrate
```

### Issue: Frontend not loading
```bash
# Kill any existing process on port 5173
npm run client:dev
```

### Issue: API errors
- Ensure backend is running: `npm run server:dev`
- Check .env file has OPENAI_API_KEY
- Verify database is initialized

---

## 📚 Learn More

- [Full README](./README.md) - Comprehensive documentation
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Deployment Guide](./DEPLOYMENT.md) - Production setup
- [Changelog](./CHANGELOG.md) - What's new

---

## 🆘 Need Help?

1. Check the README.md for detailed information
2. Look at existing issues on GitHub
3. Read the CONTRIBUTING.md guide
4. Create a new issue with your question

---

## 📝 Default Test Account

You can create your own account during registration. For testing:
- Email: test@example.com
- Password: TestPassword123

---

**Happy habit breaking! 🎉**

Start your journey to better health today!
