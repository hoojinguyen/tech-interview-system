import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { checkDatabaseConnection, closeDatabaseConnection } from './db/connection'
import { cacheService } from './db/redis'

const app = new Hono()

// Initialize services
async function initializeServices() {
  try {
    // Connect to Redis
    await cacheService.connect()
    console.log('✅ Redis connected successfully')
    
    // Check database connection
    const dbConnected = await checkDatabaseConnection()
    if (dbConnected) {
      console.log('✅ Database connected successfully')
    } else {
      console.error('❌ Database connection failed')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Failed to initialize services:', error)
    process.exit(1)
  }
}

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check endpoint with database and Redis status
app.get('/health', async (c) => {
  const dbStatus = await checkDatabaseConnection()
  const redisStatus = await cacheService.ping()
  
  return c.json({ 
    success: true, 
    message: 'Tech Interview Platform API is running',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus ? 'connected' : 'disconnected',
      redis: redisStatus ? 'connected' : 'disconnected'
    }
  })
})

// API routes
app.get('/api/v1/status', (c) => {
  return c.json({
    success: true,
    data: {
      service: 'Tech Interview Platform API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  })
})

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  await cacheService.disconnect()
  await closeDatabaseConnection()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  await cacheService.disconnect()
  await closeDatabaseConnection()
  process.exit(0)
})

const port = process.env.PORT || 3002

// Initialize services and start server
initializeServices().then(() => {
  console.log(`🚀 Server running on port ${port}`)
}).catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})

export default {
  port: Number(port),
  fetch: app.fetch,
}