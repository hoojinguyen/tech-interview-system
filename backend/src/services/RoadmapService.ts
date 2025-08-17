import { db } from '../db/connection';
import {
  roles,
  roadmaps,
  topics,
  topicQuestions,
  questions,
} from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { cacheService, CacheKeys } from '../db/redis';

export interface RoleWithRoadmaps {
  id: string;
  name: string;
  description: string | null;
  technologies: string[];
  roadmaps: {
    junior?: RoadmapSummary;
    mid?: RoadmapSummary;
    senior?: RoadmapSummary;
  };
}

export interface RoadmapSummary {
  id: string;
  level: 'junior' | 'mid' | 'senior';
  title: string;
  description: string | null;
  estimatedHours: number | null;
  topicCount: number;
}

export interface RoadmapDetail {
  id: string;
  roleId: string;
  roleName: string;
  level: 'junior' | 'mid' | 'senior';
  title: string;
  description: string | null;
  estimatedHours: number | null;
  prerequisites: string[];
  topics: TopicDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TopicDetail {
  id: string;
  title: string;
  description: string | null;
  order: number;
  resources: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'documentation' | 'tutorial';
  }>;
  questionCount: number;
  questions: Array<{
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    type: 'coding' | 'conceptual' | 'system-design' | 'behavioral';
  }>;
}

export class RoadmapService {
  private static readonly CACHE_TTL = {
    ROLES: 3600, // 1 hour
    ROADMAP: 1800, // 30 minutes
  };

  /**
   * Get all available roles with their roadmap summaries
   */
  async getAllRoles(): Promise<RoleWithRoadmaps[]> {
    const cacheKey = CacheKeys.allRoles();

    try {
      // Try to get from cache first
      const cached = await cacheService.get<RoleWithRoadmaps[]>(cacheKey);
      if (cached) {
        console.log('📦 Returning cached roles data');
        return cached;
      }
    } catch (error) {
      console.warn(
        'Cache get failed for roles, proceeding with database query:',
        error
      );
    }

    // Query database
    const rolesData = await db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        technologies: roles.technologies,
      })
      .from(roles)
      .orderBy(roles.name);

    // Get roadmaps for each role
    const rolesWithRoadmaps: RoleWithRoadmaps[] = [];

    for (const role of rolesData) {
      const roleRoadmaps = await db
        .select({
          id: roadmaps.id,
          level: roadmaps.level,
          title: roadmaps.title,
          description: roadmaps.description,
          estimatedHours: roadmaps.estimatedHours,
        })
        .from(roadmaps)
        .where(eq(roadmaps.roleId, role.id))
        .orderBy(roadmaps.level);

      // Get topic counts for each roadmap
      const roadmapSummaries: Record<string, RoadmapSummary> = {};

      for (const roadmap of roleRoadmaps) {
        const topicCount = await db
          .select({ count: topics.id })
          .from(topics)
          .where(eq(topics.roadmapId, roadmap.id));

        roadmapSummaries[roadmap.level] = {
          id: roadmap.id,
          level: roadmap.level,
          title: roadmap.title,
          description: roadmap.description,
          estimatedHours: roadmap.estimatedHours,
          topicCount: topicCount.length,
        };
      }

      rolesWithRoadmaps.push({
        id: role.id,
        name: role.name,
        description: role.description,
        technologies: role.technologies || [],
        roadmaps: roadmapSummaries,
      });
    }

    // Cache the result
    try {
      await cacheService.set(
        cacheKey,
        rolesWithRoadmaps,
        RoadmapService.CACHE_TTL.ROLES
      );
      console.log('💾 Cached roles data');
    } catch (error) {
      console.warn('Failed to cache roles data:', error);
    }

    return rolesWithRoadmaps;
  }

  /**
   * Get a specific roadmap by role name and level
   */
  async getRoadmapByRoleAndLevel(
    roleName: string,
    level: 'junior' | 'mid' | 'senior'
  ): Promise<RoadmapDetail | null> {
    const cacheKey = CacheKeys.roadmapsByRole(roleName, level);

    try {
      // Try to get from cache first
      const cached = await cacheService.get<RoadmapDetail>(cacheKey);
      if (cached) {
        console.log(
          `📦 Returning cached roadmap data for ${roleName}:${level}`
        );
        return cached;
      }
    } catch (error) {
      console.warn(
        'Cache get failed for roadmap, proceeding with database query:',
        error
      );
    }

    // Query database
    const roadmapData = await db
      .select({
        roadmapId: roadmaps.id,
        roleId: roadmaps.roleId,
        roleName: roles.name,
        level: roadmaps.level,
        title: roadmaps.title,
        description: roadmaps.description,
        estimatedHours: roadmaps.estimatedHours,
        prerequisites: roadmaps.prerequisites,
        createdAt: roadmaps.createdAt,
        updatedAt: roadmaps.updatedAt,
      })
      .from(roadmaps)
      .innerJoin(roles, eq(roadmaps.roleId, roles.id))
      .where(and(eq(roles.name, roleName), eq(roadmaps.level, level)))
      .limit(1);

    if (roadmapData.length === 0) {
      return null;
    }

    const roadmap = roadmapData[0];

    // Get topics with their questions
    const topicsData = await db
      .select({
        id: topics.id,
        title: topics.title,
        description: topics.description,
        order: topics.order,
        resources: topics.resources,
      })
      .from(topics)
      .where(eq(topics.roadmapId, roadmap.roadmapId))
      .orderBy(topics.order);

    // Get questions for each topic
    const topicsWithQuestions: TopicDetail[] = [];

    for (const topic of topicsData) {
      const topicQuestionsData = await db
        .select({
          id: questions.id,
          title: questions.title,
          difficulty: questions.difficulty,
          type: questions.type,
        })
        .from(questions)
        .innerJoin(topicQuestions, eq(questions.id, topicQuestions.questionId))
        .where(eq(topicQuestions.topicId, topic.id))
        .orderBy(questions.title);

      topicsWithQuestions.push({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        order: topic.order,
        resources: topic.resources || [],
        questionCount: topicQuestionsData.length,
        questions: topicQuestionsData,
      });
    }

    const roadmapDetail: RoadmapDetail = {
      id: roadmap.roadmapId,
      roleId: roadmap.roleId,
      roleName: roadmap.roleName,
      level: roadmap.level,
      title: roadmap.title,
      description: roadmap.description,
      estimatedHours: roadmap.estimatedHours,
      prerequisites: roadmap.prerequisites || [],
      topics: topicsWithQuestions,
      createdAt: roadmap.createdAt,
      updatedAt: roadmap.updatedAt,
    };

    // Cache the result
    try {
      await cacheService.set(
        cacheKey,
        roadmapDetail,
        RoadmapService.CACHE_TTL.ROADMAP
      );
      console.log(`💾 Cached roadmap data for ${roleName}:${level}`);
    } catch (error) {
      console.warn('Failed to cache roadmap data:', error);
    }

    return roadmapDetail;
  }

  /**
   * Get a specific roadmap by ID
   */
  async getRoadmapById(roadmapId: string): Promise<RoadmapDetail | null> {
    const cacheKey = CacheKeys.roadmapById(roadmapId);

    try {
      // Try to get from cache first
      const cached = await cacheService.get<RoadmapDetail>(cacheKey);
      if (cached) {
        console.log(`📦 Returning cached roadmap data for ID: ${roadmapId}`);
        return cached;
      }
    } catch (error) {
      console.warn(
        'Cache get failed for roadmap by ID, proceeding with database query:',
        error
      );
    }

    // Query database
    const roadmapData = await db
      .select({
        roadmapId: roadmaps.id,
        roleId: roadmaps.roleId,
        roleName: roles.name,
        level: roadmaps.level,
        title: roadmaps.title,
        description: roadmaps.description,
        estimatedHours: roadmaps.estimatedHours,
        prerequisites: roadmaps.prerequisites,
        createdAt: roadmaps.createdAt,
        updatedAt: roadmaps.updatedAt,
      })
      .from(roadmaps)
      .innerJoin(roles, eq(roadmaps.roleId, roles.id))
      .where(eq(roadmaps.id, roadmapId))
      .limit(1);

    if (roadmapData.length === 0) {
      return null;
    }

    const roadmap = roadmapData[0];

    // Get topics with their questions
    const topicsData = await db
      .select({
        id: topics.id,
        title: topics.title,
        description: topics.description,
        order: topics.order,
        resources: topics.resources,
      })
      .from(topics)
      .where(eq(topics.roadmapId, roadmap.roadmapId))
      .orderBy(topics.order);

    // Get questions for each topic
    const topicsWithQuestions: TopicDetail[] = [];

    for (const topic of topicsData) {
      const topicQuestionsData = await db
        .select({
          id: questions.id,
          title: questions.title,
          difficulty: questions.difficulty,
          type: questions.type,
        })
        .from(questions)
        .innerJoin(topicQuestions, eq(questions.id, topicQuestions.questionId))
        .where(eq(topicQuestions.topicId, topic.id))
        .orderBy(questions.title);

      topicsWithQuestions.push({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        order: topic.order,
        resources: topic.resources || [],
        questionCount: topicQuestionsData.length,
        questions: topicQuestionsData,
      });
    }

    const roadmapDetail: RoadmapDetail = {
      id: roadmap.roadmapId,
      roleId: roadmap.roleId,
      roleName: roadmap.roleName,
      level: roadmap.level,
      title: roadmap.title,
      description: roadmap.description,
      estimatedHours: roadmap.estimatedHours,
      prerequisites: roadmap.prerequisites || [],
      topics: topicsWithQuestions,
      createdAt: roadmap.createdAt,
      updatedAt: roadmap.updatedAt,
    };

    // Cache the result
    try {
      await cacheService.set(
        cacheKey,
        roadmapDetail,
        RoadmapService.CACHE_TTL.ROADMAP
      );
      console.log(`💾 Cached roadmap data for ID: ${roadmapId}`);
    } catch (error) {
      console.warn('Failed to cache roadmap data:', error);
    }

    return roadmapDetail;
  }

  /**
   * Clear cache for roadmaps (useful for admin operations)
   */
  async clearCache(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        await cacheService.delPattern(pattern);
      } else {
        // Clear all roadmap-related cache
        await cacheService.delPattern('roadmaps:*');
        await cacheService.delPattern('roadmap:*');
        await cacheService.del(CacheKeys.allRoles());
      }
      console.log('🧹 Cleared roadmap cache');
    } catch (error) {
      console.error('Failed to clear roadmap cache:', error);
    }
  }
}

export const roadmapService = new RoadmapService();
