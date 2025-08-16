# Deployment Guide

This document outlines the deployment process for the Tech Interview Platform.

## Architecture Overview

- **Client App**: Next.js app deployed to Vercel (client.domain.com)
- **Admin App**: Next.js app deployed to Vercel (admin.domain.com)
- **Backend API**: Bun.js app deployed via Docker (api.domain.com)
- **Database**: PostgreSQL (managed service recommended)
- **Cache**: Redis (managed service recommended)

## Prerequisites

### GitHub Secrets Required

#### Vercel Deployment
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_CLIENT_PROJECT_ID`: Project ID for client app
- `VERCEL_ADMIN_PROJECT_ID`: Project ID for admin app

#### Docker Registry
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password or access token

#### Environment Variables
- `API_URL`: Backend API URL (e.g., https://api.domain.com)

### Vercel Environment Variables

#### Client App (client.domain.com)
```
NEXT_PUBLIC_API_URL=https://api.domain.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

#### Admin App (admin.domain.com)
```
NEXT_PUBLIC_API_URL=https://api.domain.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ADMIN_SECRET=your-admin-secret
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Backend Environment Variables

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=your-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
CODEINTERVIEW_API_KEY=your-codeinterview-api-key
CODERPAD_API_KEY=your-coderpad-api-key
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://client.domain.com,https://admin.domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

## Deployment Process

### Automatic Deployment

The platform uses GitHub Actions for CI/CD:

1. **On Push to `main`**: Deploys to production
2. **On Push to `develop`**: Deploys to staging
3. **On Pull Request**: Runs tests and builds

### Manual Deployment

#### Frontend Apps (Vercel)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy client app:
   ```bash
   cd apps/client
   vercel --prod
   ```

3. Deploy admin app:
   ```bash
   cd apps/admin
   vercel --prod
   ```

#### Backend (Docker)

1. Build Docker image:
   ```bash
   cd backend
   docker build -t tech-interview-backend .
   ```

2. Run locally:
   ```bash
   docker run -p 3001:3001 --env-file .env tech-interview-backend
   ```

3. Deploy to cloud provider:
   ```bash
   # Example for AWS ECS, Google Cloud Run, etc.
   docker tag tech-interview-backend your-registry/tech-interview-backend
   docker push your-registry/tech-interview-backend
   ```

## Database Setup

### PostgreSQL

1. Create database and user:
   ```sql
   CREATE DATABASE tech_interview_platform;
   CREATE USER tech_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE tech_interview_platform TO tech_user;
   ```

2. Run migrations:
   ```bash
   cd backend
   bun run db:migrate
   ```

3. Seed initial data:
   ```bash
   bun run db:seed
   ```

### Redis

Set up Redis instance with the following recommended configuration:
- Memory: 1GB minimum
- Persistence: RDB snapshots enabled
- Maxmemory policy: allkeys-lru

## Monitoring and Health Checks

### Health Check Endpoints

- Backend: `GET /health`
- Client: `GET /api/health`
- Admin: `GET /api/health`

### Monitoring Setup

1. **Application Monitoring**: Sentry for error tracking
2. **Performance Monitoring**: Vercel Analytics for frontend
3. **Infrastructure Monitoring**: Cloud provider monitoring
4. **Database Monitoring**: Connection pooling and query performance

## Security Considerations

### SSL/TLS
- All domains must use HTTPS
- Vercel provides automatic SSL certificates
- Backend should use SSL termination at load balancer

### Environment Variables
- Never commit `.env` files
- Use secure secret management
- Rotate secrets regularly

### CORS Configuration
- Restrict origins to known domains
- Update CORS_ORIGINS environment variable

## Scaling Considerations

### Frontend
- Vercel handles automatic scaling
- Enable Edge Functions for global performance

### Backend
- Use horizontal scaling with load balancer
- Implement connection pooling for database
- Use Redis for session storage and caching

### Database
- Use read replicas for scaling reads
- Implement proper indexing
- Monitor query performance

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify environment variables are set
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database user has proper permissions

3. **API Integration Failures**
   - Verify external API keys
   - Check rate limits
   - Review CORS configuration

### Logs and Debugging

- **Frontend**: Vercel Function Logs
- **Backend**: Application logs via Sentry or cloud provider
- **Database**: Query logs and performance metrics

## Rollback Procedures

### Frontend
```bash
# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Backend
```bash
# Deploy previous Docker image version
docker pull your-registry/tech-interview-backend:previous-tag
# Update deployment with previous image
```

### Database
- Use database backups for data recovery
- Keep migration rollback scripts ready
- Test rollback procedures in staging

## Performance Optimization

### Frontend
- Enable Vercel Edge Network
- Implement proper caching headers
- Use Next.js Image Optimization

### Backend
- Implement Redis caching
- Use database connection pooling
- Enable gzip compression

### Database
- Regular VACUUM and ANALYZE
- Monitor slow queries
- Implement proper indexing strategy