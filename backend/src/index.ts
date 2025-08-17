import { Hono } from 'hono'
import { checkDatabaseConnection, closeDatabaseConnection } from './db/connection'
import { cacheService } from './db/redis'
import { 
  corsMiddleware, 
  securityHeaders, 
  removeServerHeader,
  rateLimit,
  rateLimitConfigs,
  errorHandler,
  requestLogger
} from './middleware'
import { health } from './routes/health'
import { status } from './routes/status'
import { roadmaps } from './routes/roadmaps'
import { questions } from './routes/questions'
import { mockInterviews } from './routes/mock-interviews'

const app = new Hono()

// Initialize services
async function initializeServices() {
  try {
    // Connect to Redis (non-blocking in development)
    await cacheService.connect()
    const isRedisConnected = await cacheService.ping()
    if (isRedisConnected) {
      console.log('✅ Redis connected successfully')
    } else {
      console.log('⚠️ Running without Redis cache')
    }
    
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

// Global middleware (order matters!)
app.use('*', removeServerHeader())
app.use('*', securityHeaders())
app.use('*', corsMiddleware())
app.use('*', requestLogger())

// Rate limiting middleware
app.use('/api/*', rateLimit(rateLimitConfigs.general))

// Error handling
app.onError(errorHandler)

// Health and status routes
app.route('/health', health)
app.route('/api/v1/status', status)

// API routes
app.route('/api/v1/roadmaps', roadmaps)
app.route('/api/v1/questions', questions)
app.route('/api/v1/mock-interviews', mockInterviews)

// 404 handler for unmatched routes
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested endpoint was not found',
      timestamp: new Date().toISOString()
    }
  }, 404)
})

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`)
  
  try {
    await cacheService.disconnect()
    console.log('✅ Redis disconnected')
    
    await closeDatabaseConnection()
    console.log('✅ Database disconnected')
    
    console.log('✅ Graceful shutdown completed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during shutdown:', error)
    process.exit(1)
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

const port = process.env.PORT || 3002

// Initialize services and start server
initializeServices().then(() => {
  console.log(`🚀 Tech Interview Platform API`)
  console.log(`📡 Server running on port ${port}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`⚡ Powered by Bun.js + Hono`)
  console.log(`📊 Health check: http://localhost:${port}/health`)
  console.log(`📋 API status: http://localhost:${port}/api/v1/status`)
}).catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})

export default {
  port: Number(port),
  fetch: app.fetch,
}