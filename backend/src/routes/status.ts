import { Hono } from 'hono'
import { asyncHandler } from '../middleware'

const status = new Hono()

// API status endpoint
status.get('/', asyncHandler(async (c) => {
  return c.json({
    success: true,
    data: {
      service: 'Tech Interview Platform API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      features: {
        roadmaps: 'available',
        questions: 'available',
        mockInterviews: 'available',
        admin: 'available'
      },
      endpoints: {
        health: '/health',
        api: '/api/v1',
        documentation: '/docs' // Future endpoint
      }
    }
  })
}))

// API version information
status.get('/version', asyncHandler(async (c) => {
  return c.json({
    success: true,
    data: {
      version: '1.0.0',
      apiVersion: 'v1',
      buildDate: new Date().toISOString(),
      commit: process.env.GIT_COMMIT || 'unknown',
      branch: process.env.GIT_BRANCH || 'unknown'
    }
  })
}))

// API capabilities
status.get('/capabilities', asyncHandler(async (c) => {
  return c.json({
    success: true,
    data: {
      features: [
        'role-based-roadmaps',
        'question-bank',
        'mock-interviews',
        'ai-feedback',
        'content-management'
      ],
      integrations: [
        'openai-gpt',
        'code-interview-apis',
        'redis-cache',
        'postgresql-database'
      ],
      rateLimit: {
        general: '100 requests per 15 minutes',
        auth: '5 requests per 15 minutes',
        mockInterview: '20 requests per hour'
      }
    }
  })
}))

export { status }