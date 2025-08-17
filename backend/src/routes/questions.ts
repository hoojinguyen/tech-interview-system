import { Hono } from 'hono';
import { questionService, QuestionFilters } from '../services/QuestionService';
import { z } from 'zod';

const app = new Hono();

// Validation schemas
const questionIdSchema = z.string().uuid('Invalid question ID format');

const searchQuerySchema = z.object({
  search: z.string().optional(),
  technologies: z.union([z.string(), z.array(z.string())]).optional(),
  difficulty: z.union([
    z.enum(['easy', 'medium', 'hard']),
    z.array(z.enum(['easy', 'medium', 'hard']))
  ]).optional(),
  roles: z.union([z.string(), z.array(z.string())]).optional(),
  companies: z.union([z.string(), z.array(z.string())]).optional(),
  type: z.union([
    z.enum(['coding', 'conceptual', 'system-design', 'behavioral']),
    z.array(z.enum(['coding', 'conceptual', 'system-design', 'behavioral']))
  ]).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['title', 'difficulty', 'rating', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Helper function to normalize query parameters to arrays
 */
function normalizeArrayParam(param: string | string[] | undefined): string[] | undefined {
  if (!param) return undefined;
  if (Array.isArray(param)) return param;
  // Handle comma-separated values
  return param.split(',').map(item => item.trim()).filter(Boolean);
}

/**
 * GET /api/v1/questions
 * Search and filter questions with pagination
 */
app.get('/', async c => {
  try {
    console.log('🔍 Searching questions with filters');

    // Parse and validate query parameters
    const rawQuery = c.req.query();
    
    // Normalize array parameters
    const normalizedQuery = {
      ...rawQuery,
      technologies: normalizeArrayParam(rawQuery.technologies),
      difficulty: normalizeArrayParam(rawQuery.difficulty),
      roles: normalizeArrayParam(rawQuery.roles),
      companies: normalizeArrayParam(rawQuery.companies),
      type: normalizeArrayParam(rawQuery.type),
      tags: normalizeArrayParam(rawQuery.tags),
    };

    const queryValidation = searchQuerySchema.safeParse(normalizedQuery);

    if (!queryValidation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_QUERY_PARAMETERS',
            message: 'Invalid query parameters',
            details: queryValidation.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    const validatedData = queryValidation.data;
    
    // Convert normalized arrays back to proper format for QuestionFilters
    const filters: QuestionFilters = {
      search: validatedData.search,
      technologies: Array.isArray(validatedData.technologies) ? validatedData.technologies : 
                   validatedData.technologies ? [validatedData.technologies] : undefined,
      difficulty: Array.isArray(validatedData.difficulty) ? validatedData.difficulty :
                 validatedData.difficulty ? [validatedData.difficulty] : undefined,
      roles: Array.isArray(validatedData.roles) ? validatedData.roles :
             validatedData.roles ? [validatedData.roles] : undefined,
      companies: Array.isArray(validatedData.companies) ? validatedData.companies :
                validatedData.companies ? [validatedData.companies] : undefined,
      type: Array.isArray(validatedData.type) ? validatedData.type :
            validatedData.type ? [validatedData.type] : undefined,
      tags: Array.isArray(validatedData.tags) ? validatedData.tags :
            validatedData.tags ? [validatedData.tags] : undefined,
      page: validatedData.page,
      limit: validatedData.limit,
      sortBy: validatedData.sortBy,
      sortOrder: validatedData.sortOrder,
    };

    console.log('📋 Search filters:', {
      search: filters.search,
      technologies: filters.technologies?.length || 0,
      difficulty: filters.difficulty?.length || 0,
      roles: filters.roles?.length || 0,
      companies: filters.companies?.length || 0,
      type: filters.type?.length || 0,
      tags: filters.tags?.length || 0,
      page: filters.page || 1,
      limit: filters.limit || 20,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc',
    });

    const result = await questionService.searchQuestions(filters);

    return c.json({
      success: true,
      data: result,
      message: `Found ${result.questions.length} questions`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error searching questions:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'QUESTIONS_SEARCH_ERROR',
          message: 'Failed to search questions',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * GET /api/v1/questions/:id
 * Get a specific question by ID
 */
app.get('/:id', async c => {
  try {
    const questionId = c.req.param('id');

    console.log(`📝 Fetching question by ID: ${questionId}`);

    // Validate question ID
    const idValidation = questionIdSchema.safeParse(questionId);

    if (!idValidation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_QUESTION_ID',
            message: 'Invalid question ID format',
            details: idValidation.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    const question = await questionService.getQuestionById(questionId);

    if (!question) {
      return c.json(
        {
          success: false,
          error: {
            code: 'QUESTION_NOT_FOUND',
            message: `Question not found with ID: ${questionId}`,
            timestamp: new Date().toISOString(),
          },
        },
        404
      );
    }

    return c.json({
      success: true,
      data: question,
      message: 'Question retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error fetching question by ID:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'QUESTION_FETCH_ERROR',
          message: 'Failed to retrieve question',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * DELETE /api/v1/questions/cache (Admin endpoint for cache management)
 * Clear questions cache
 */
app.delete('/cache', async c => {
  try {
    const pattern = c.req.query('pattern');

    console.log(
      '🧹 Clearing questions cache',
      pattern ? `with pattern: ${pattern}` : ''
    );

    await questionService.clearCache(pattern || undefined);

    return c.json({
      success: true,
      message: 'Questions cache cleared successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error clearing questions cache:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'CACHE_CLEAR_ERROR',
          message: 'Failed to clear questions cache',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

export { app as questions };