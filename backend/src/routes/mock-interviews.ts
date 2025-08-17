import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { mockInterviewService } from '../services';

const mockInterviews = new Hono();

// Validation schemas
const startMockInterviewSchema = z.object({
  roleId: z.string().uuid('Invalid role ID format'),
  level: z.enum(['junior', 'mid', 'senior'], {
    errorMap: () => ({ message: 'Level must be junior, mid, or senior' })
  }),
  questionCount: z.number().int().min(1).max(10).optional(),
  timeLimit: z.number().int().min(5).max(120).optional(), // 5 minutes to 2 hours per question
});

const submitAnswerSchema = z.object({
  questionId: z.string().uuid('Invalid question ID format'),
  userCode: z.string().min(1, 'User code cannot be empty'),
});

const mockInterviewIdSchema = z.object({
  id: z.string().uuid('Invalid mock interview ID format'),
});

/**
 * POST /start - Start a new mock interview session
 */
mockInterviews.post(
  '/start',
  zValidator('json', startMockInterviewSchema),
  async (c) => {
    try {
      const { roleId, level, questionCount, timeLimit } = c.req.valid('json');

      console.log(`🎤 Starting mock interview for role: ${roleId}, level: ${level}`);

      const mockInterview = await mockInterviewService.startMockInterview({
        roleId,
        level,
        questionCount,
        timeLimit,
      });

      return c.json({
        success: true,
        data: mockInterview,
        message: 'Mock interview started successfully',
      });
    } catch (error) {
      console.error('❌ Error starting mock interview:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Handle specific error cases
      if (errorMessage.includes('Role not found')) {
        return c.json({
          success: false,
          error: {
            code: 'ROLE_NOT_FOUND',
            message: 'The specified role was not found',
            timestamp: new Date().toISOString(),
          },
        }, 404);
      }

      if (errorMessage.includes('No suitable questions found')) {
        return c.json({
          success: false,
          error: {
            code: 'NO_QUESTIONS_AVAILABLE',
            message: 'No suitable questions found for this role and level',
            timestamp: new Date().toISOString(),
          },
        }, 400);
      }

      return c.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to start mock interview',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
          timestamp: new Date().toISOString(),
        },
      }, 500);
    }
  }
);

/**
 * GET /:id - Get mock interview details
 */
mockInterviews.get(
  '/:id',
  zValidator('param', mockInterviewIdSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');

      console.log(`📋 Getting mock interview details for ID: ${id}`);

      const mockInterview = await mockInterviewService.getMockInterviewById(id);

      if (!mockInterview) {
        return c.json({
          success: false,
          error: {
            code: 'INTERVIEW_NOT_FOUND',
            message: 'Mock interview not found',
            timestamp: new Date().toISOString(),
          },
        }, 404);
      }

      return c.json({
        success: true,
        data: mockInterview,
      });
    } catch (error) {
      console.error('❌ Error getting mock interview:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return c.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get mock interview details',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
          timestamp: new Date().toISOString(),
        },
      }, 500);
    }
  }
);

/**
 * POST /:id/submit - Submit an answer for a question in the mock interview
 */
mockInterviews.post(
  '/:id/submit',
  zValidator('param', mockInterviewIdSchema),
  zValidator('json', submitAnswerSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const { questionId, userCode } = c.req.valid('json');

      console.log(`📝 Submitting answer for interview: ${id}, question: ${questionId}`);

      const result = await mockInterviewService.submitAnswer({
        mockInterviewId: id,
        questionId,
        userCode,
      });

      return c.json({
        success: true,
        data: result,
        message: result.isComplete 
          ? 'Mock interview completed successfully' 
          : 'Answer submitted successfully',
      });
    } catch (error) {
      console.error('❌ Error submitting answer:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      // Handle specific error cases
      if (errorMessage.includes('Mock interview not found')) {
        return c.json({
          success: false,
          error: {
            code: 'INTERVIEW_NOT_FOUND',
            message: 'Mock interview not found',
            timestamp: new Date().toISOString(),
          },
        }, 404);
      }

      if (errorMessage.includes('not active')) {
        return c.json({
          success: false,
          error: {
            code: 'INTERVIEW_NOT_ACTIVE',
            message: 'Mock interview is not active',
            timestamp: new Date().toISOString(),
          },
        }, 400);
      }

      if (errorMessage.includes('timed out')) {
        return c.json({
          success: false,
          error: {
            code: 'SESSION_TIMEOUT',
            message: 'Mock interview session has timed out',
            timestamp: new Date().toISOString(),
          },
        }, 408);
      }

      if (errorMessage.includes('Question not found')) {
        return c.json({
          success: false,
          error: {
            code: 'QUESTION_NOT_FOUND',
            message: 'Question not found in this interview',
            timestamp: new Date().toISOString(),
          },
        }, 404);
      }

      if (errorMessage.includes('already completed')) {
        return c.json({
          success: false,
          error: {
            code: 'QUESTION_ALREADY_COMPLETED',
            message: 'Question has already been completed',
            timestamp: new Date().toISOString(),
          },
        }, 400);
      }

      return c.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to submit answer',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
          timestamp: new Date().toISOString(),
        },
      }, 500);
    }
  }
);

/**
 * GET /:id/feedback - Get comprehensive feedback for a completed mock interview
 */
mockInterviews.get(
  '/:id/feedback',
  zValidator('param', mockInterviewIdSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');

      console.log(`📊 Getting feedback for mock interview: ${id}`);

      const feedback = await mockInterviewService.getInterviewFeedback(id);

      return c.json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      console.error('❌ Error getting interview feedback:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      // Handle specific error cases
      if (errorMessage.includes('Mock interview not found')) {
        return c.json({
          success: false,
          error: {
            code: 'INTERVIEW_NOT_FOUND',
            message: 'Mock interview not found',
            timestamp: new Date().toISOString(),
          },
        }, 404);
      }

      if (errorMessage.includes('not completed')) {
        return c.json({
          success: false,
          error: {
            code: 'INTERVIEW_NOT_COMPLETED',
            message: 'Mock interview is not completed yet',
            timestamp: new Date().toISOString(),
          },
        }, 400);
      }

      return c.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get interview feedback',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
          timestamp: new Date().toISOString(),
        },
      }, 500);
    }
  }
);

/**
 * POST /cleanup - Admin endpoint to cleanup abandoned sessions
 */
mockInterviews.post('/cleanup', async (c) => {
  try {
    console.log('🧹 Cleaning up abandoned mock interview sessions');

    const cleanedCount = await mockInterviewService.cleanupAbandonedSessions();

    return c.json({
      success: true,
      data: {
        cleanedSessions: cleanedCount,
      },
      message: `Cleaned up ${cleanedCount} abandoned sessions`,
    });
  } catch (error) {
    console.error('❌ Error cleaning up sessions:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to cleanup abandoned sessions',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        timestamp: new Date().toISOString(),
      },
    }, 500);
  }
});

export { mockInterviews };