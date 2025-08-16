import type { MiddlewareHandler } from 'hono';

export const securityHeaders = (): MiddlewareHandler => {
  return async (c, next) => {
    // Set security headers
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('X-XSS-Protection', '1; mode=block');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Content Security Policy for API responses
    c.header(
      'Content-Security-Policy',
      "default-src 'none'; frame-ancestors 'none';"
    );

    // Remove server information
    c.header('Server', 'Tech Interview Platform API');

    await next();
  };
};

export const removeServerHeader = (): MiddlewareHandler => {
  return async (c, next) => {
    await next();
    // Remove any server headers that might leak information
    c.res.headers.delete('X-Powered-By');
  };
};
