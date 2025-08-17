import { Hono } from 'hono';
import { roadmapService } from '../services/RoadmapService';
import { z } from 'zod';

const app = new Hono();

// Validation schemas
const levelSchema = z.enum(['junior', 'mid', 'senior']);
const roleParamSchema = z.string().min(1).max(100);
const roadmapIdSchema = z.string().uuid();

/**
 * GET /api/v1/roadmaps/roles
 * Get all available roles with their roadmap summaries
 */
app.get('/roles', async c => {
  try {
    console.log('📋 Fetching all roles with roadmaps');

    const roles = await roadmapService.getAllRoles();

    return c.json({
      success: true,
      data: {
        roles,
        total: roles.length,
      },
      message: 'Roles retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error fetching roles:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'ROLES_FETCH_ERROR',
          message: 'Failed to retrieve roles',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * GET /api/v1/roadmaps/id/:id
 * Get a specific roadmap by ID
 */
app.get('/id/:id', async c => {
  try {
    const roadmapId = c.req.param('id');

    console.log(`🗺️ Fetching roadmap by ID: ${roadmapId}`);

    // Validate roadmap ID
    const idValidation = roadmapIdSchema.safeParse(roadmapId);

    if (!idValidation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_ROADMAP_ID',
            message: 'Invalid roadmap ID format',
            details: idValidation.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    const roadmap = await roadmapService.getRoadmapById(roadmapId);

    if (!roadmap) {
      return c.json(
        {
          success: false,
          error: {
            code: 'ROADMAP_NOT_FOUND',
            message: `Roadmap not found with ID: ${roadmapId}`,
            timestamp: new Date().toISOString(),
          },
        },
        404
      );
    }

    return c.json({
      success: true,
      data: roadmap,
      message: 'Roadmap retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error fetching roadmap by ID:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'ROADMAP_FETCH_ERROR',
          message: 'Failed to retrieve roadmap',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * DELETE /api/v1/roadmaps/cache (Admin endpoint for cache management)
 * Clear roadmap cache
 */
app.delete('/cache', async c => {
  try {
    const pattern = c.req.query('pattern');

    console.log(
      '🧹 Clearing roadmap cache',
      pattern ? `with pattern: ${pattern}` : ''
    );

    await roadmapService.clearCache(pattern || undefined);

    return c.json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error clearing cache:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'CACHE_CLEAR_ERROR',
          message: 'Failed to clear cache',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

/**
 * GET /api/v1/roadmaps/:role/:level
 * Get a specific roadmap by role name and level
 */
app.get('/:role/:level', async c => {
  try {
    const role = c.req.param('role');
    const level = c.req.param('level');

    console.log(`🗺️ Fetching roadmap for ${role}:${level}`);

    // Validate parameters
    const roleValidation = roleParamSchema.safeParse(role);
    const levelValidation = levelSchema.safeParse(level);

    if (!roleValidation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_ROLE',
            message: 'Invalid role parameter',
            details: roleValidation.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    if (!levelValidation.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_LEVEL',
            message:
              'Invalid level parameter. Must be one of: junior, mid, senior',
            details: levelValidation.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        400
      );
    }

    // Decode URL-encoded role name (e.g., "frontend-developer" -> "Frontend Developer")
    const decodedRole = decodeURIComponent(role)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const roadmap = await roadmapService.getRoadmapByRoleAndLevel(
      decodedRole,
      levelValidation.data
    );

    if (!roadmap) {
      return c.json(
        {
          success: false,
          error: {
            code: 'ROADMAP_NOT_FOUND',
            message: `Roadmap not found for role "${decodedRole}" at level "${level}"`,
            timestamp: new Date().toISOString(),
          },
        },
        404
      );
    }

    return c.json({
      success: true,
      data: roadmap,
      message: 'Roadmap retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error fetching roadmap:', error);

    return c.json(
      {
        success: false,
        error: {
          code: 'ROADMAP_FETCH_ERROR',
          message: 'Failed to retrieve roadmap',
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

export { app as roadmaps };
