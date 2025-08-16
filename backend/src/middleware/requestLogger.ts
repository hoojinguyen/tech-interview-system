import type { MiddlewareHandler } from 'hono'

interface LogEntry {
  timestamp: string
  method: string
  url: string
  status: number
  duration: number
  userAgent?: string
  ip?: string
  requestId?: string
}

export const requestLogger = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = Date.now()
    const requestId = c.req.header('x-request-id') || 
                     Math.random().toString(36).substring(2, 15)
    
    // Add request ID to context for use in other middleware
    c.set('requestId', requestId)
    
    // Get client information
    const ip = c.req.header('x-forwarded-for') || 
               c.req.header('x-real-ip') || 
               'unknown'
    const userAgent = c.req.header('user-agent')
    
    await next()
    
    const duration = Date.now() - start
    const status = c.res.status
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      method: c.req.method,
      url: c.req.url,
      status,
      duration,
      userAgent,
      ip,
      requestId
    }
    
    // Color code based on status
    const statusColor = getStatusColor(status)
    const methodColor = getMethodColor(c.req.method)
    
    // Log format: [timestamp] METHOD /path - STATUS (duration ms) [IP]
    console.log(
      `[${logEntry.timestamp}] ` +
      `${methodColor}${c.req.method}\x1b[0m ` +
      `${c.req.url} - ` +
      `${statusColor}${status}\x1b[0m ` +
      `(${duration}ms) ` +
      `[${ip}] ` +
      `{${requestId}}`
    )
    
    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      console.warn(`⚠️  Slow request detected: ${c.req.method} ${c.req.url} took ${duration}ms`)
    }
    
    // Log errors
    if (status >= 400) {
      console.error(`❌ Error response: ${c.req.method} ${c.req.url} returned ${status}`)
    }
    
    // Add response headers
    c.header('X-Request-ID', requestId)
    c.header('X-Response-Time', `${duration}ms`)
  }
}

function getStatusColor(status: number): string {
  if (status >= 500) return '\x1b[31m' // Red
  if (status >= 400) return '\x1b[33m' // Yellow
  if (status >= 300) return '\x1b[36m' // Cyan
  if (status >= 200) return '\x1b[32m' // Green
  return '\x1b[37m' // White
}

function getMethodColor(method: string): string {
  switch (method) {
    case 'GET': return '\x1b[32m'    // Green
    case 'POST': return '\x1b[33m'   // Yellow
    case 'PUT': return '\x1b[34m'    // Blue
    case 'DELETE': return '\x1b[31m' // Red
    case 'PATCH': return '\x1b[35m'  // Magenta
    default: return '\x1b[37m'       // White
  }
}