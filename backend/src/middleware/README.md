# Middleware Documentation

This directory contains all the middleware components for the Tech Interview Platform API.

## Middleware Components

### 1. CORS Middleware (`cors.ts`)
- Configures Cross-Origin Resource Sharing
- Supports multiple origins (client and admin apps)
- Includes credentials support and proper headers
- Environment-based origin configuration

### 2. Security Headers (`security.ts`)
- Adds essential security headers
- Implements Content Security Policy
- Removes server information leakage
- Protects against XSS, clickjacking, and MIME sniffing

### 3. Rate Limiting (`rateLimit.ts`)
- Redis-based rate limiting
- Multiple rate limit configurations for different endpoints
- Graceful fallback when Redis is unavailable
- Configurable time windows and request limits

### 4. Error Handling (`errorHandler.ts`)
- Centralized error handling
- Structured error responses
- Request ID tracking
- Environment-aware error details
- Support for custom AppError class

### 5. Request Logging (`requestLogger.ts`)
- Colored console logging
- Request/response time tracking
- IP address and User-Agent logging
- Request ID generation and tracking
- Slow request detection

## Usage

```typescript
import { 
  corsMiddleware, 
  securityHeaders, 
  rateLimit,
  errorHandler,
  requestLogger 
} from './middleware'

// Apply middleware in order
app.use('*', securityHeaders())
app.use('*', corsMiddleware())
app.use('*', requestLogger())
app.use('/api/*', rateLimit(rateLimitConfigs.general))
app.onError(errorHandler)
```

## Rate Limit Configurations

- **General**: 100 requests per 15 minutes
- **Strict**: 10 requests per minute
- **Auth**: 5 requests per 15 minutes
- **Mock Interview**: 20 requests per hour

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},
    "timestamp": "2025-08-16T17:00:00.000Z",
    "requestId": "abc123"
  }
}
```