import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

interface JWTPayload {
  userId: string;
  role: 'admin' | 'user';
  email: string;
  iat?: number;
  exp?: number;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

/**
 * JWT Authentication middleware
 * Validates JWT tokens and sets user context
 */
export const jwtAuth = () => {
  return async (c: Context, next: Next) => {
    try {
      const authHeader = c.req.header('Authorization');
      
      if (!authHeader) {
        throw new AppError('Authorization header is required', 401, 'MISSING_AUTH_HEADER');
      }

      if (!authHeader.startsWith('Bearer ')) {
        throw new AppError('Invalid authorization header format', 401, 'INVALID_AUTH_FORMAT');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      if (!token) {
        throw new AppError('JWT token is required', 401, 'MISSING_TOKEN');
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('❌ JWT_SECRET environment variable is not set');
        throw new AppError('Server configuration error', 500, 'SERVER_CONFIG_ERROR');
      }

      // Verify and decode the JWT token
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
      
      // Set user context for downstream handlers
      c.set('user', decoded);
      
      console.log(`✅ Authenticated user: ${decoded.email} (${decoded.role})`);
      
      await next();
    } catch (error) {
      console.error('❌ JWT Authentication failed:', error);
      
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid JWT token', 401, 'INVALID_TOKEN');
      }
      
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('JWT token has expired', 401, 'TOKEN_EXPIRED');
      }
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError('Authentication failed', 401, 'AUTH_FAILED');
    }
  };
};

/**
 * Admin role authorization middleware
 * Ensures the authenticated user has admin privileges
 */
export const requireAdmin = () => {
  return async (c: Context, next: Next) => {
    try {
      const user = c.get('user');
      
      if (!user) {
        throw new AppError('User context not found', 401, 'USER_CONTEXT_MISSING');
      }
      
      if (user.role !== 'admin') {
        console.warn(`⚠️ Access denied for user ${user.email}: insufficient privileges (${user.role})`);
        throw new AppError('Admin privileges required', 403, 'INSUFFICIENT_PRIVILEGES');
      }
      
      console.log(`✅ Admin access granted for user: ${user.email}`);
      
      await next();
    } catch (error) {
      console.error('❌ Admin authorization failed:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError('Authorization failed', 403, 'AUTHORIZATION_FAILED');
    }
  };
};

/**
 * Utility function to generate JWT tokens (for testing/seeding)
 */
export const generateJWT = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(payload, jwtSecret, {
    expiresIn: '24h', // Token expires in 24 hours
    issuer: 'tech-interview-platform',
    audience: 'admin-panel'
  });
};

/**
 * Utility function to verify JWT tokens
 */
export const verifyJWT = (token: string): JWTPayload => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.verify(token, jwtSecret) as JWTPayload;
};