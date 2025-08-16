import { cors } from 'hono/cors'
import type { MiddlewareHandler } from 'hono'

export const corsMiddleware = (): MiddlewareHandler => {
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000', // Client app
    'http://localhost:3001', // Admin app
    'https://client.domain.com', // Production client
    'https://admin.domain.com'  // Production admin
  ]

  return cors({
    origin: (origin, c) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return '*'
      
      // Check if origin is in allowed list
      return allowedOrigins.includes(origin) ? origin : null
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposeHeaders: ['X-Total-Count', 'X-Page-Count'],
    credentials: true,
    maxAge: 86400 // 24 hours
  })
}