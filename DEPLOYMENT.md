// Security and deployment documentation
# Deployment Guide

## Production Deployment Checklist

- [ ] Set all environment variables
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Use production database (PostgreSQL recommended)
- [ ] Run database migrations
- [ ] Set NODE_ENV=production
- [ ] Configure monitoring/logging
- [ ] Set up automated backups
- [ ] Review security headers

## Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/habitbreaker

# Server
PORT=3000
NODE_ENV=production

# AI
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai

# Security
JWT_SECRET=your-super-secret-key-minimum-32-characters

# Application
APP_NAME=HabitBreaker
APP_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api

# CORS
CORS_ORIGIN=https://yourdomain.com
```

## Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching headers
- Database query optimization
- Connection pooling for database

## Monitoring

- Set up error tracking (Sentry)
- Enable application monitoring
- Database performance monitoring
- User activity logging
- API performance metrics

## Scaling

- Use load balancer for multiple server instances
- Implement database replication
- Use Redis for caching
- Async job queue for heavy operations

## Security Hardening

- Keep dependencies updated
- Use HTTPS/SSL certificates
- Implement rate limiting
- Enable CORS properly
- Use security headers (CSP, X-Frame-Options)
- Regular security audits

## Disaster Recovery

- Regular database backups
- Backup verification process
- Recovery time objective (RTO): 1 hour
- Recovery point objective (RPO): 15 minutes
- Document recovery procedures

For more details, see the main README.md
