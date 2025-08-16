import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    success: true, 
    message: 'Tech Interview Platform API is running',
    timestamp: new Date().toISOString()
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

const port = process.env.PORT || 3002
console.log(`🚀 Server running on port ${port}`)

export default {
  port: Number(port),
  fetch: app.fetch,
}