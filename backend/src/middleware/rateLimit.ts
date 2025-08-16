import type { MiddlewareHandler } from 'hono';
import { redisClient } from '../db/redis';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (c: any) => string;
}

export const rateLimit = (options: RateLimitOptions): MiddlewareHandler => {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    keyGenerator = c =>
      c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
  } = options;

  return async (c, next) => {
    const key = `rate_limit:${keyGenerator(c)}`;
    const window = Math.floor(Date.now() / windowMs);
    const redisKey = `${key}:${window}`;

    try {
      // Check if Redis is connected
      if (!redisClient.isOpen) {
        console.warn('Redis not connected, skipping rate limiting');
        await next();
        return;
      }

      // Get current count
      const current = await redisClient.get(redisKey);
      const count = current ? parseInt(current, 10) : 0;

      // Check if limit exceeded
      if (count >= maxRequests) {
        return c.json(
          {
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message,
              retryAfter: windowMs - (Date.now() % windowMs),
            },
          },
          429
        );
      }

      // Continue with request
      await next();

      // Only increment if request was successful (if skipSuccessfulRequests is false)
      // or always increment (if skipSuccessfulRequests is true)
      const shouldIncrement = !skipSuccessfulRequests || c.res.status < 400;

      if (shouldIncrement) {
        // Increment counter and set expiration
        const newCount = count + 1;
        await redisClient.setEx(
          redisKey,
          Math.ceil(windowMs / 1000),
          newCount.toString()
        );
      }

      // Add rate limit headers
      c.header('X-RateLimit-Limit', maxRequests.toString());
      c.header(
        'X-RateLimit-Remaining',
        Math.max(0, maxRequests - count - 1).toString()
      );
      c.header(
        'X-RateLimit-Reset',
        (Date.now() + (windowMs - (Date.now() % windowMs))).toString()
      );
    } catch (error) {
      console.error('Rate limiting error:', error);
      // If Redis is down, allow the request to continue
      await next();
    }
  };
};

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // General API rate limit
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many requests from this IP, please try again later.',
  },

  // Strict rate limit for resource-intensive operations
  strict: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    message:
      'Rate limit exceeded for this operation, please wait before trying again.',
  },

  // Auth-related endpoints (login, register)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.',
  },

  // Mock interview endpoints
  mockInterview: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // 20 mock interviews per hour
    message:
      'Mock interview rate limit exceeded, please wait before starting another session.',
  },
};
