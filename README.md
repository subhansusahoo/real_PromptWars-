// Comprehensive README
# HabitBreaker - AI-Powered Habit Breaker Application

## 🎯 Overview

**HabitBreaker** is a Gen-AI powered web application designed to help users overcome harmful habits and addictions through intelligent nudges, personalized tracking, adaptive coaching, and AI-powered support mechanisms.

### Key Features

✨ **Core Functionality**
- 🔐 Secure user authentication with JWT
- 📊 Daily habit tracking dashboard
- ⏱️ Real-time streak counter showing continuous progress
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🤖 AI-powered motivational messages (OpenAI integration)
- 🆘 Panic button with emergency support and distraction activities
- 📈 Analytics and progress tracking
- 💾 SQLite database with Prisma ORM
- ♿ WCAG accessibility compliance
- 🔒 Security best practices (password hashing, JWT, environment variables)

### Predefined Addictions
- Smoking
- Drinking  
- Masturbation
- Porn Addiction
- Stress Eating
- Social Media (bonus)
- Gaming (bonus)
- Shopping (bonus)

Users can also add custom addictions.

---

## 🏗️ Architecture

### Tech Stack

**Backend**
- Node.js + Express.js
- TypeScript
- Prisma ORM
- SQLite Database
- OpenAI API for AI features
- JWT for authentication
- bcryptjs for password hashing

**Frontend**
- React 18
- TypeScript
- Zustand for state management
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Vite for build tooling

### Project Structure

```
├── src/
│   ├── server/               # Backend code
│   │   ├── index.ts          # Server entry point
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── constants/        # Constants (addictions list)
│   │   └── utils/            # Utilities
│   ├── client/               # Frontend code
│   │   ├── main.tsx          # React entry point
│   │   ├── App.tsx           # Root component
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── stores/           # Zustand stores
│   │   ├── api/              # API client
│   │   └── styles/           # CSS files
│   └── tests/                # Test files
├── prisma/
│   └── schema.prisma         # Database schema
├── .env.example              # Environment template
├── package.json              # Dependencies
└── vite.config.ts            # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/subhansusahoo/real_PromptWars-.git
cd real_PromptWars-
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - A random string for JWT signing
- `DATABASE_URL` - SQLite database path (default: `file:./dev.db`)

4. **Initialize database**
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. **Start development server**
```bash
npm run dev
```

This starts both the backend server (port 3000) and frontend (port 5173).

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `GET /api/habits/:habitId` - Get habit details
- `PUT /api/habits/:habitId` - Update habit
- `DELETE /api/habits/:habitId` - Delete habit
- `POST /api/habits/:habitId/reset-streak` - Reset streak
- `GET /api/habits/predefined` - Get predefined addictions

### Check-ins
- `POST /api/checkins` - Create daily check-in
- `GET /api/checkins/habit/:habitId` - Get habit check-ins
- `GET /api/checkins/habit/:habitId/today` - Get today's check-in

### AI Features
- `POST /api/ai/motivational-message` - Get motivational message
- `POST /api/ai/panic-support` - Get emergency support with activities

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/stats` - Get user statistics

---

## 🧪 Testing

Run tests with:
```bash
npm run test          # Run all tests
npm run test:ui       # Run with UI
npm run test:coverage # Generate coverage report
```

Test files are located in `src/tests/` directory.

---

## 🔒 Security Features

1. **Password Security**
   - Bcryptjs with 10 salt rounds
   - Minimum 8 characters required

2. **Authentication**
   - JWT tokens with 7-day expiration
   - Token validation on all protected routes
   - Secure token storage in localStorage

3. **Data Protection**
   - Environment variables for sensitive data
   - Input validation on all endpoints
   - CORS configuration for origin restriction
   - SQL injection prevention via Prisma

4. **Accessibility**
   - WCAG 2.1 AA compliance
   - Semantic HTML
   - ARIA labels and roles
   - Keyboard navigation
   - Focus management

---

## 📊 Database Schema

### Tables

**User**
- User registration and authentication data
- Stores email, hashed password, name

**Habit**
- Tracks individual habits/addictions
- Records streak count, success/failure statistics
- Links to user

**CheckIn**
- Daily check-in records
- Tracks date, status (success/failed), optional notes
- One check-in per day per habit

**PanicLog**
- Records when panic button was used
- Stores AI-generated message and suggested activities
- Useful for understanding user's crisis patterns

**Motivation**
- Custom motivational messages per user
- Supports varied responses from AI

**Activity**
- Distraction activities for panic support
- Customizable per user

---

## 🎨 Features in Detail

### 1. Daily Tracker
- Simple success/failed check-in for each day
- Visual feedback and confirmation
- Prevents duplicate check-ins on same day

### 2. Streak Timer
- Real-time countdown showing current streak duration
- Displays days, hours, minutes, seconds
- Shows personal best streak
- Updates every second

### 3. Panic Button
- Large, prominent button for emergencies
- Triggers AI-powered support
- Provides personalized motivational message
- Suggests 3-4 distraction activities
- Activities include duration for user planning
- Modal popup with focus management

### 4. AI-Powered Coaching
- Personalized motivational messages based on:
  - Habit name and category
  - Current streak length
  - User's history
- Generated using OpenAI GPT-3.5-turbo
- Fallback messages for API failures

### 5. Dashboard Analytics
- Total habits tracking
- Success rate percentage
- Total check-ins
- Longest streak
- Visual statistics cards

### 6. Progress Charts
- Last 30 days bar chart
- Shows successful vs failed days
- Interactive Recharts visualization

---

## 🌐 Deployment

### Build for Production
```bash
npm run build
npm run start
```

This creates optimized builds for both server and client.

### Environment Setup for Production
- Use a production database (PostgreSQL recommended)
- Set secure JWT_SECRET
- Configure CORS_ORIGIN for your domain
- Use environment-specific .env files
- Enable HTTPS
- Set NODE_ENV=production

For detailed deployment guide, see DEPLOYMENT.md

---

## 📝 Code Quality

### Linting and Formatting
```bash
npm run lint          # Check for errors
npm run lint:fix      # Auto-fix linting issues
```

### Type Checking
```bash
npm run type-check    # TypeScript validation
```

### Standards
- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript strict mode enabled
- No console warnings/errors allowed

---

## 🤝 Contributing

See CONTRIBUTING.md for guidelines and instructions.

1. Create a feature branch
2. Make your changes
3. Write tests
4. Run linting and tests
5. Commit with clear messages
6. Push and create pull request

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
rm prisma/dev.db
npm run prisma:migrate
```

### API Not Responding
- Check if backend server is running: `npm run server:dev`
- Verify `OPENAI_API_KEY` is set
- Check database connection

### Frontend Not Loading
- Ensure frontend dev server is running: `npm run client:dev`
- Clear browser cache
- Check console for errors

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

Built with ❤️ for mental health and habit recovery.

AI-powered by OpenAI GPT-3.5-turbo
Frontend powered by React, Tailwind CSS, and modern web standards
