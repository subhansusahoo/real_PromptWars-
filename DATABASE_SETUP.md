# PostgreSQL Setup Guide for Vercel Deployment

## 🗄️ Database Setup Options

Since Vercel has ephemeral storage, SQLite won't persist data. You need to use a managed PostgreSQL database.

---

## Option 1: Vercel Postgres (Recommended) 

### Quick Setup
1. Go to https://vercel.com/storage
2. Click "Create Database"
3. Select "Postgres"
4. Choose region (closest to your location)
5. Give it a name (e.g., "habitbreaker")
6. Click "Create"

### Get Connection String
1. In Vercel Postgres dashboard, click your database
2. Copy the "Postgres URL"
3. Use this as your `DATABASE_URL`

### Update prisma/schema.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Option 2: Supabase (PostgreSQL Host)

### Setup
1. Go to https://supabase.com
2. Click "New Project"
3. Give it a name
4. Set a database password
5. Choose region
6. Wait for setup (2-3 minutes)

### Get Connection String
1. Go to Project Settings → Database
2. Copy the "URI"
3. Replace `[YOUR-PASSWORD]` with your actual password
4. Use as `DATABASE_URL`

Connection string format:
```
postgresql://postgres:[password]@db.[region].supabase.co:5432/postgres
```

---

## Option 3: Railway.app

### Setup
1. Go to https://railway.app
2. Login with GitHub
3. Create new Project
4. Add PostgreSQL service
5. Create database

### Get Connection String
1. Click the PostgreSQL service
2. Go to "Data"
3. Copy the DATABASE_URL from environment

---

## Option 4: External PostgreSQL (Any Provider)

Connection string format:
```
postgresql://username:password@host:5432/database_name
```

Components:
- `username`: Database user
- `password`: Database password  
- `host`: Server hostname/IP
- `5432`: PostgreSQL port (default)
- `database_name`: Your database name

---

## 🔧 Update Project Configuration

### 1. Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

// Rest of your models stay the same...
```

### 2. Update Environment Variables

#### Locally (.env)
```
DATABASE_URL="postgresql://user:password@host:5432/habitbreaker"
```

#### Production (Vercel)
1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL` with your PostgreSQL connection string
3. Set to "Production" environment

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Create Migrations

For fresh setup (empty database):
```bash
npm run prisma:migrate

# If asked, name it: "init"
```

If migrating from SQLite:
```bash
# Reset the database (WARNING: deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name init
```

---

## 🚀 Deploy with PostgreSQL

### Before Deployment

1. **Test Locally**
```bash
DATABASE_URL="your-postgres-url" npm run dev
```

2. **Build Production**
```bash
npm run build
```

3. **Verify Migrations**
```bash
DATABASE_URL="your-postgres-url" npm run prisma:migrate
```

### Deploy to Vercel

1. Push code to GitHub
2. Vercel auto-deploys
3. Run migrations on deployed version:

```bash
# Using Vercel CLI
vercel env pull
npm run prisma:migrate:prod
```

---

## ✅ Verification Checklist

- [ ] Database created in PostgreSQL provider
- [ ] Connection string obtained
- [ ] `.env` updated with DATABASE_URL
- [ ] `prisma/schema.prisma` updated to use PostgreSQL
- [ ] `npm run prisma:generate` completed
- [ ] Migrations run successfully locally
- [ ] `npm run dev` works with new database
- [ ] Vercel environment variables set
- [ ] Database migrations run on Vercel

---

## 🔐 Connection String Security

### DO:
✅ Store connection strings in `.env` (not committed)
✅ Use Vercel's environment variables for secrets
✅ Use strong database passwords
✅ Use encrypted connections (SSL)

### DON'T:
❌ Commit connection strings to Git
❌ Share connection strings publicly
❌ Use weak passwords
❌ Store in code comments

---

## 🐛 Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Verify DATABASE_URL and ensure database is running

### SSL Certificate Error
```
Error: self signed certificate
```
**Solution**: Add `?sslmode=require` to connection string:
```
postgresql://...?sslmode=require
```

### Migration Failed
```
Error: ERROR: syntax error in SQL
```
**Solution**: 
- Check Prisma schema is valid
- Run `npm run prisma:generate`
- Clear cache: `rm -rf node_modules/.prisma`

### Too Many Connections
```
Error: FATAL: remaining connection slots reserved
```
**Solution**: Add connection pooling to URL:
```
postgresql://...?schema=public&connection_limit=5
```

---

## 📊 Performance Tuning

For production use:

### 1. Connection Pooling
Use `connection_limit` parameter:
```
postgresql://user:password@host/db?connection_limit=10
```

### 2. SSL
Always use SSL for production:
```
postgresql://user:password@host/db?sslmode=require
```

### 3. Indexes
Prisma auto-creates indexes on foreign keys. For additional queries, add to schema:
```prisma
model Habit {
  // ...
  @@index([userId])
  @@index([createdAt])
}
```

---

## 🔄 Backup Strategy

Regular backups are critical:

### Supabase
- Automatic daily backups
- Access via "Backups" tab
- Point-in-time recovery

### Railway/Vercel Postgres
- Check provider's backup documentation
- Enable automatic backups if available
- Export data regularly:

```bash
pg_dump "postgresql://..." > backup.sql
```

### Restore from Backup
```bash
psql "postgresql://..." < backup.sql
```

---

## 📝 Prisma Studio

View and edit data in UI:

```bash
DATABASE_URL="your-postgres-url" npm run prisma:studio
```

Then visit http://localhost:5555

---

## 🎯 Next Steps

1. Choose a PostgreSQL provider (Vercel Postgres recommended)
2. Create database and get connection string
3. Update local environment
4. Test locally
5. Update Vercel environment variables
6. Deploy
7. Run migrations
8. Verify all features work

---

**You're ready for production! 🚀**

Your application will now persist data reliably on Vercel with PostgreSQL.
