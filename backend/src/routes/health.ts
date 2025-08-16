import { Hono } from 'hono'
import { checkDatabaseConnection } from '../db/connection'
import { cacheService } from '../db/redis'
import { asyncHandler } from '../middleware'

const health = new Hono()

// Basic health check endpoint
health.get('/', asyncHandler(async (c) => {
  return c.json({
    success: true,
    message: 'Tech Interview Platform API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
}))

// Detailed health check with service status
health.get('/detailed', asyncHandler(async (c) => {
  const startTime = Date.now()
  
  // Check database connection
  const dbStart = Date.now()
  const dbStatus = await checkDatabaseConnection()
  const dbResponseTime = Date.now() - dbStart
  
  // Check Redis connection
  const redisStart = Date.now()
  const redisStatus = await cacheService.ping()
  const redisResponseTime = Date.now() - redisStart
  
  // Check memory usage
  const memoryUsage = process.memoryUsage()
  
  const totalResponseTime = Date.now() - startTime
  
  const healthData = {
    success: true,
    message: 'Detailed health check completed',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: {
        status: dbStatus ? 'healthy' : 'unhealthy',
        responseTime: `${dbResponseTime}ms`
      },
      redis: {
        status: redisStatus ? 'healthy' : 'unhealthy',
        responseTime: `${redisResponseTime}ms`
      }
    },
    system: {
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      cpu: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      }
    },
    responseTime: `${totalResponseTime}ms`
  }
  
  // Return 503 if any critical service is down
  const allServicesHealthy = dbStatus && redisStatus
  const statusCode = allServicesHealthy ? 200 : 503
  
  return c.json(healthData, statusCode)
}))

// Readiness probe (for Kubernetes/Docker)
health.get('/ready', asyncHandler(async (c) => {
  const dbStatus = await checkDatabaseConnection()
  const redisStatus = await cacheService.ping()
  
  if (dbStatus && redisStatus) {
    return c.json({
      success: true,
      message: 'Service is ready',
      timestamp: new Date().toISOString()
    })
  } else {
    return c.json({
      success: false,
      message: 'Service is not ready',
      timestamp: new Date().toISOString(),
      issues: {
        database: !dbStatus ? 'Database connection failed' : null,
        redis: !redisStatus ? 'Redis connection failed' : null
      }
    }, 503)
  }
}))

// Liveness probe (for Kubernetes/Docker)
health.get('/live', asyncHandler(async (c) => {
  return c.json({
    success: true,
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
}))

export { health }