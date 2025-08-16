# Database Setup and Configuration

This directory contains the database configuration, schema definitions, and utilities for the Tech Interview Platform backend.

## Overview

The database layer uses:
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Redis** for caching frequently accessed data
- **Drizzle Kit** for migrations and schema management

## Directory Structure

```
src/db/
├── README.md           # This file
├── connection.ts       # Database connection configuration
├── schema.ts          # Drizzle schema definitions
├── types.ts           # TypeScript types for database models
├── redis.ts           # Redis cache service configuration
├── migrate.ts         # Migration runner utility
├── seed.ts            # Database seeding script
├── index.ts           # Main exports
└── migrations/        # Generated migration files
    └── 0000_*.sql     # SQL migration files
```

## Environment Variables

Create a `.env` file in the backend root with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tech_interview_platform

# Redis Configuration  
REDIS_URL=redis://localhost:6379

# Other configurations...
```

## Database Schema

The database includes the following main entities:

### Core Tables
- **roles** - Job roles (Frontend Developer, Backend Developer, etc.)
- **roadmaps** - Learning roadmaps for each role and level
- **topics** - Individual topics within roadmaps
- **questions** - Interview questions with solutions and metadata
- **mock_interviews** - Mock interview sessions
- **interview_questions** - Questions used in specific mock interviews
- **topic_questions** - Junction table linking topics to questions

### Key Features
- **UUID primary keys** for all tables
- **JSONB columns** for flexible metadata storage
- **Enum types** for consistent data validation
- **Foreign key constraints** with cascade deletes where appropriate
- **Timestamps** for audit trails

## Available Scripts

### Migration Commands
```bash
# Generate new migration from schema changes
bun run db:generate

# Run pending migrations
bun run db:migrate

# Push schema directly to database (development only)
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio

# Drop all tables (destructive!)
bun run db:drop
```

### Data Management
```bash
# Seed database with initial data
bun run db:seed
```

## Usage Examples

### Basic Database Operations
```typescript
import { db } from './db';
import { roles, questions } from './db/schema';
import { eq } from 'drizzle-orm';

// Insert a new role
const newRole = await db.insert(roles).values({
  name: 'Frontend Developer',
  description: 'Specializes in UI/UX development',
  technologies: ['JavaScript', 'React', 'CSS']
}).returning();

// Query questions with filters
const frontendQuestions = await db
  .select()
  .from(questions)
  .where(eq(questions.isApproved, true));
```

### Using the Cache Service
```typescript
import { cacheService, CacheKeys } from './db/redis';

// Cache a roadmap
await cacheService.set(
  CacheKeys.roadmapById('123'),
  roadmapData,
  3600 // 1 hour TTL
);

// Retrieve from cache
const cachedRoadmap = await cacheService.get(
  CacheKeys.roadmapById('123')
);
```

## Database Setup Instructions

### 1. Install PostgreSQL
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb tech_interview_platform
```

### 2. Install Redis
```bash
# macOS with Homebrew
brew install redis
brew services start redis
```

### 3. Run Migrations
```bash
# Generate and run initial migration
bun run db:generate
bun run db:migrate

# Seed with initial data
bun run db:seed
```

### 4. Verify Setup
```bash
# Start the development server
bun run dev

# Check health endpoint
curl http://localhost:3002/health
```

## Development Workflow

1. **Schema Changes**: Modify `schema.ts` with new tables or columns
2. **Generate Migration**: Run `bun run db:generate` to create migration files
3. **Review Migration**: Check the generated SQL in `migrations/` directory
4. **Apply Migration**: Run `bun run db:migrate` to apply changes
5. **Update Types**: TypeScript types are automatically inferred from schema
6. **Test Changes**: Use Drizzle Studio (`bun run db:studio`) to inspect data

## Production Considerations

- Use connection pooling for high-traffic scenarios
- Set up read replicas for query optimization
- Configure Redis clustering for cache high availability
- Implement proper backup and recovery procedures
- Monitor query performance and optimize indexes
- Use environment-specific database URLs
- Enable SSL connections for production databases

## Troubleshooting

### Common Issues

**Migration Errors**
- Ensure database is running and accessible
- Check DATABASE_URL environment variable
- Verify schema syntax in `schema.ts`

**Redis Connection Issues**
- Confirm Redis server is running
- Check REDIS_URL environment variable
- Verify network connectivity

**Type Errors**
- Regenerate types after schema changes
- Ensure drizzle-orm version compatibility
- Check import paths in application code