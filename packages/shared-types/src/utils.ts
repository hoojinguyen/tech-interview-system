import { z } from 'zod';

/**
 * Utility functions for validation and type checking
 */

// Helper function to validate data against a schema
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

// Helper function to safely validate data and return result with error handling
export function safeValidateData<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

// Helper to transform Zod errors into user-friendly messages
export function formatValidationError(error: z.ZodError): string {
  return error.errors
    .map(err => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
}

// Helper to create API error responses
export function createErrorResponse(code: string, message: string, details?: any) {
  return {
    success: false as const,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    }
  };
}

// Helper to create API success responses
export function createSuccessResponse<T>(data: T) {
  return {
    success: true as const,
    data
  };
}

// Helper to transform database dates to JavaScript dates
export function transformDatabaseDates<T extends Record<string, any>>(obj: T): T {
  const transformed = { ...obj };
  
  for (const [key, value] of Object.entries(transformed)) {
    if (value instanceof Date) {
      continue; // Already a Date object
    }
    
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      (transformed as any)[key] = new Date(value);
    }
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      (transformed as any)[key] = transformDatabaseDates(value);
    }
    
    if (Array.isArray(value)) {
      (transformed as any)[key] = value.map(item => 
        item && typeof item === 'object' ? transformDatabaseDates(item) : item
      );
    }
  }
  
  return transformed;
}

// Helper to convert decimal strings to numbers for display
export function parseDecimalString(decimalStr: string | null): number {
  if (!decimalStr) return 0;
  return parseFloat(decimalStr);
}

// Helper to format decimal numbers back to strings for database storage
export function formatDecimalForDatabase(num: number): string {
  return num.toFixed(2);
}

// Helper to validate UUID format
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Helper to sanitize search queries
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 200); // Limit length
}

// Helper to validate and normalize tags
export function normalizeTags(tags: string[]): string[] {
  return tags
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length <= 50)
    .slice(0, 20); // Limit number of tags
}

// Helper to validate and normalize technologies
export function normalizeTechnologies(technologies: string[]): string[] {
  return technologies
    .map(tech => tech.trim())
    .filter(tech => tech.length > 0 && tech.length <= 50)
    .slice(0, 10); // Limit number of technologies
}

// Helper to calculate pagination metadata
export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev
  };
}

// Helper to validate pagination parameters
export function validatePaginationParams(page?: number, limit?: number) {
  const validatedPage = Math.max(1, page || 1);
  const validatedLimit = Math.min(100, Math.max(1, limit || 10));
  
  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: (validatedPage - 1) * validatedLimit
  };
}