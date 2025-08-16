import type { ErrorHandler, Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
    timestamp: string
    requestId?: string
  }
}

export class AppError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code || this.getDefaultCode(statusCode)
    this.details = details
    this.name = 'AppError'
  }

  private getDefaultCode(statusCode: number): string {
    switch (statusCode) {
      case 400: return 'BAD_REQUEST'
      case 401: return 'UNAUTHORIZED'
      case 403: return 'FORBIDDEN'
      case 404: return 'NOT_FOUND'
      case 409: return 'CONFLICT'
      case 422: return 'VALIDATION_ERROR'
      case 429: return 'RATE_LIMIT_EXCEEDED'
      case 500: return 'INTERNAL_SERVER_ERROR'
      case 502: return 'BAD_GATEWAY'
      case 503: return 'SERVICE_UNAVAILABLE'
      default: return 'UNKNOWN_ERROR'
    }
  }
}

export const errorHandler: ErrorHandler = (err: Error, c: Context) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: c.req.url,
    method: c.req.method,
    timestamp: new Date().toISOString()
  })

  // Generate request ID for tracking
  const requestId = c.req.header('x-request-id') || 
                   Math.random().toString(36).substring(2, 15)

  // Handle different error types
  if (err instanceof AppError) {
    const response: ApiError = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
        requestId
      }
    }
    return c.json(response, err.statusCode as any)
  }

  if (err instanceof HTTPException) {
    const response: ApiError = {
      success: false,
      error: {
        code: 'HTTP_EXCEPTION',
        message: err.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    }
    return c.json(response, err.status)
  }

  // Handle validation errors (Zod)
  if (err.name === 'ZodError') {
    const response: ApiError = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: (err as any).errors,
        timestamp: new Date().toISOString(),
        requestId
      }
    }
    return c.json(response, 400)
  }

  // Handle database errors
  if (err.message.includes('duplicate key') || err.message.includes('unique constraint')) {
    const response: ApiError = {
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'Resource already exists',
        timestamp: new Date().toISOString(),
        requestId
      }
    }
    return c.json(response, 409)
  }

  // Default error response
  const response: ApiError = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
      timestamp: new Date().toISOString(),
      requestId
    }
  }

  return c.json(response, 500)
}

// Async error wrapper for route handlers
export const asyncHandler = (fn: (c: Context) => Promise<any>) => {
  return (c: Context) => {
    return Promise.resolve(fn(c)).catch((error) => {
      throw error
    })
  }
}