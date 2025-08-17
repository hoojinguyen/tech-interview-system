import { Hono } from 'hono';
import { z } from 'zod';
import { adminService, QuestionUpdateData } from '../services/AdminService';
import { jwtAuth, requireAdmin } from '../middleware/auth';

const app = new Hono();

// Apply JWT authentication and admin authorization to all admin routes
app.use('*', jwtAuth());
app.use('*', requireAdmin());

// Validation schemas
const questionIdSchema = z.string().uuid('Invalid question ID format');
const contentTypeSchema = z.enum(['question', 'roadmap', 'role']);
const contentIdSchema = z.string().uuid('Invalid content ID format');

const approveRequestSchema = z.object({
  type: z.enum(['question']),
  id: z.string().uuid('Invalid ID format'),
});

const questionUpdateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  content: z.string().min(1).optional(),
  type: z.enum(['coding', 'conceptual', 'system-design', 'behavioral']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  technologies: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  companies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  solution: z.object({
    explanation: z.string(),
    codeExamples: z.array(z.object({
      language: z.string(),
      code: z.string(),
      explanation: z.string().optional(),
    })),
    timeComplexity: z.string(),
    spaceComplexity: z.string(),
    alternativeApproaches: z.array(z.string()),
  }).optional(),
});

/**
 * GET /api/v1/admin/content
 * Get content overview and management data
 */
app.get('/content', async c => {
  try {
    const user = c.get('user');
    console.log(`📊 Admin ${user.email} requesting content overview`);

    const contentOverview = await adminService.getContentOverview();

    return c.json({
      success: true,
      data: contentOverview,
      message: 'Content overview retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error getting content overview:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'CONTENT_OVERVIEW_ERROR',
          message: 'Failed to retrieve content overview',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * POST /api/v1/admin/approve
 * Approve content (currently supports questions)
 */
app.post('/approve', async c => {
  try {
    const user = c.get('user');
    const body = await c.req.json();

    console.log(`✅ Admin ${user.email} approving content:`, body);

    // Validate request body
    const validation = approveRequestSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_APPROVE_REQUEST',
            message: 'Invalid approval request',
            details: validation.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    const { type, id } = validation.data;

    // Currently only support question approval
    if (type === 'question') {
      const success = await adminService.approveQuestion(id);

      if (!success) {
        return c.json(
          {
            success: false,
            error: {
              code: 'QUESTION_NOT_FOUND',
              message: `Question not found with ID: ${id}`,
              timestamp: new Date().toISOString(),
            },
          },
          404
        );
      }

      return c.json({
        success: true,
        message: `Question approved successfully`,
        data: { type, id },
        timestamp: new Date().toISOString(),
      });
    }

    return c.json(
      {
        success: false,
        error: {
          code: 'UNSUPPORTED_CONTENT_TYPE',
          message: `Content type '${type}' approval not yet supported`,
          timestamp: new Date().toISOString(),
        },
      },
      400
    );
  } catch (error) {
    console.error('❌ Error approving content:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'CONTENT_APPROVAL_ERROR',
          message: 'Failed to approve content',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * DELETE /api/v1/admin/:type/:id
 * Delete content by type and ID
 */
app.delete('/:type/:id', async c => {
  try {
    const user = c.get('user');
    const type = c.req.param('type');
    const id = c.req.param('id');

    console.log(`🗑️ Admin ${user.email} deleting ${type}: ${id}`);

    // Validate content type
    const typeValidation = contentTypeSchema.safeParse(type);
    if (!typeValidation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_CONTENT_TYPE',
            message: `Invalid content type: ${type}. Must be one of: question, roadmap, role`,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    // Validate content ID
    const idValidation = contentIdSchema.safeParse(id);
    if (!idValidation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_CONTENT_ID',
            message: 'Invalid content ID format',
            details: idValidation.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    const success = await adminService.deleteContent(
      typeValidation.data,
      idValidation.data
    );

    if (!success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'CONTENT_NOT_FOUND',
            message: `${type} not found with ID: ${id}`,
            timestamp: new Date().toISOString(),
          },
        },
        404
      );
    }

    return c.json({
      success: true,
      message: `${type} deleted successfully`,
      data: { type, id },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error deleting content:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'CONTENT_DELETE_ERROR',
          message: 'Failed to delete content',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * PUT /api/v1/admin/questions/:id
 * Update a question
 */
app.put('/questions/:id', async c => {
  try {
    const user = c.get('user');
    const questionId = c.req.param('id');
    const body = await c.req.json();

    console.log(`📝 Admin ${user.email} updating question: ${questionId}`);

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

    // Validate update data
    const updateValidation = questionUpdateSchema.safeParse(body);
    if (!updateValidation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_UPDATE_DATA',
            message: 'Invalid question update data',
            details: updateValidation.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    const updateData: QuestionUpdateData = updateValidation.data;
    const success = await adminService.updateQuestion(questionId, updateData);

    if (!success) {
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
      message: 'Question updated successfully',
      data: { id: questionId, ...updateData },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error updating question:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'QUESTION_UPDATE_ERROR',
          message: 'Failed to update question',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * GET /api/v1/admin/analytics
 * Get platform analytics and metrics
 */
app.get('/analytics', async c => {
  try {
    const user = c.get('user');
    console.log(`📈 Admin ${user.email} requesting platform analytics`);

    const analytics = await adminService.getPlatformAnalytics();

    return c.json({
      success: true,
      data: analytics,
      message: 'Platform analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error getting platform analytics:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'ANALYTICS_ERROR',
          message: 'Failed to retrieve platform analytics',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

export { app as admin };