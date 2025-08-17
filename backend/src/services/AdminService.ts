import { db } from '../db/connection';
import { 
  questions, 
  roles, 
  roadmaps, 
  topics, 
  mockInterviews,
  interviewQuestions 
} from '../db/schema';
import { eq, sql, desc, count, and, gte, lte } from 'drizzle-orm';
import { cacheService, CacheKeys } from '../db/redis';

export interface ContentOverview {
  questions: {
    total: number;
    approved: number;
    pending: number;
    byDifficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    byType: {
      coding: number;
      conceptual: number;
      'system-design': number;
      behavioral: number;
    };
  };
  roadmaps: {
    total: number;
    byLevel: {
      junior: number;
      mid: number;
      senior: number;
    };
  };
  roles: {
    total: number;
  };
  mockInterviews: {
    total: number;
    completed: number;
    active: number;
    abandoned: number;
  };
}

export interface PlatformAnalytics {
  overview: {
    totalQuestions: number;
    totalRoadmaps: number;
    totalRoles: number;
    totalMockInterviews: number;
  };
  questions: {
    totalQuestions: number;
    approvedQuestions: number;
    pendingQuestions: number;
    averageRating: number;
    topTechnologies: Array<{ technology: string; count: number }>;
    questionsByDifficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    questionsByType: {
      coding: number;
      conceptual: number;
      'system-design': number;
      behavioral: number;
    };
  };
  mockInterviews: {
    totalInterviews: number;
    completedInterviews: number;
    averageScore: number;
    completionRate: number;
    interviewsByLevel: {
      junior: number;
      mid: number;
      senior: number;
    };
  };
  usage: {
    questionsViewedToday: number;
    mockInterviewsStartedToday: number;
    topRoles: Array<{ role: string; count: number }>;
  };
}

export interface QuestionUpdateData {
  title?: string;
  content?: string;
  type?: 'coding' | 'conceptual' | 'system-design' | 'behavioral';
  difficulty?: 'easy' | 'medium' | 'hard';
  technologies?: string[];
  roles?: string[];
  companies?: string[];
  tags?: string[];
  solution?: {
    explanation: string;
    codeExamples: Array<{
      language: string;
      code: string;
      explanation?: string;
    }>;
    timeComplexity: string;
    spaceComplexity: string;
    alternativeApproaches: string[];
  };
}

class AdminService {
  private readonly CACHE_TTL = 300; // 5 minutes

  /**
   * Get comprehensive content overview for admin dashboard
   */
  async getContentOverview(): Promise<ContentOverview> {
    const cacheKey = CacheKeys.admin.contentOverview();
    
    try {
      // Try to get from cache first
      const cached = await cacheService.get<ContentOverview>(cacheKey);
      if (cached) {
        console.log('📊 Content overview retrieved from cache');
        return cached;
      }

      console.log('📊 Generating content overview from database');

      // Get questions statistics
      const [questionsStats] = await db
        .select({
          total: count(),
          approved: sql<number>`COUNT(CASE WHEN ${questions.isApproved} = true THEN 1 END)`,
          pending: sql<number>`COUNT(CASE WHEN ${questions.isApproved} = false THEN 1 END)`,
          easy: sql<number>`COUNT(CASE WHEN ${questions.difficulty} = 'easy' THEN 1 END)`,
          medium: sql<number>`COUNT(CASE WHEN ${questions.difficulty} = 'medium' THEN 1 END)`,
          hard: sql<number>`COUNT(CASE WHEN ${questions.difficulty} = 'hard' THEN 1 END)`,
          coding: sql<number>`COUNT(CASE WHEN ${questions.type} = 'coding' THEN 1 END)`,
          conceptual: sql<number>`COUNT(CASE WHEN ${questions.type} = 'conceptual' THEN 1 END)`,
          systemDesign: sql<number>`COUNT(CASE WHEN ${questions.type} = 'system-design' THEN 1 END)`,
          behavioral: sql<number>`COUNT(CASE WHEN ${questions.type} = 'behavioral' THEN 1 END)`,
        })
        .from(questions);

      // Get roadmaps statistics
      const [roadmapsStats] = await db
        .select({
          total: count(),
          junior: sql<number>`COUNT(CASE WHEN ${roadmaps.level} = 'junior' THEN 1 END)`,
          mid: sql<number>`COUNT(CASE WHEN ${roadmaps.level} = 'mid' THEN 1 END)`,
          senior: sql<number>`COUNT(CASE WHEN ${roadmaps.level} = 'senior' THEN 1 END)`,
        })
        .from(roadmaps);

      // Get roles count
      const [rolesStats] = await db
        .select({ total: count() })
        .from(roles);

      // Get mock interviews statistics
      const [mockInterviewsStats] = await db
        .select({
          total: count(),
          completed: sql<number>`COUNT(CASE WHEN ${mockInterviews.status} = 'completed' THEN 1 END)`,
          active: sql<number>`COUNT(CASE WHEN ${mockInterviews.status} = 'active' THEN 1 END)`,
          abandoned: sql<number>`COUNT(CASE WHEN ${mockInterviews.status} = 'abandoned' THEN 1 END)`,
        })
        .from(mockInterviews);

      const overview: ContentOverview = {
        questions: {
          total: questionsStats.total,
          approved: questionsStats.approved,
          pending: questionsStats.pending,
          byDifficulty: {
            easy: questionsStats.easy,
            medium: questionsStats.medium,
            hard: questionsStats.hard,
          },
          byType: {
            coding: questionsStats.coding,
            conceptual: questionsStats.conceptual,
            'system-design': questionsStats.systemDesign,
            behavioral: questionsStats.behavioral,
          },
        },
        roadmaps: {
          total: roadmapsStats.total,
          byLevel: {
            junior: roadmapsStats.junior,
            mid: roadmapsStats.mid,
            senior: roadmapsStats.senior,
          },
        },
        roles: {
          total: rolesStats.total,
        },
        mockInterviews: {
          total: mockInterviewsStats.total,
          completed: mockInterviewsStats.completed,
          active: mockInterviewsStats.active,
          abandoned: mockInterviewsStats.abandoned,
        },
      };

      // Cache the result
      await cacheService.set(cacheKey, overview, this.CACHE_TTL);
      
      return overview;
    } catch (error) {
      console.error('❌ Error getting content overview:', error);
      throw error;
    }
  }

  /**
   * Approve a question (set isApproved to true)
   */
  async approveQuestion(questionId: string): Promise<boolean> {
    try {
      console.log(`✅ Approving question: ${questionId}`);

      const result = await db
        .update(questions)
        .set({ 
          isApproved: true,
          updatedAt: new Date()
        })
        .where(eq(questions.id, questionId))
        .returning({ id: questions.id });

      if (result.length === 0) {
        console.warn(`⚠️ Question not found for approval: ${questionId}`);
        return false;
      }

      // Clear related caches
      await this.clearContentCaches();

      console.log(`✅ Question approved successfully: ${questionId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error approving question ${questionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete content by type and ID
   */
  async deleteContent(type: 'question' | 'roadmap' | 'role', id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting ${type}: ${id}`);

      let result;
      
      switch (type) {
        case 'question':
          result = await db
            .delete(questions)
            .where(eq(questions.id, id))
            .returning({ id: questions.id });
          break;
          
        case 'roadmap':
          result = await db
            .delete(roadmaps)
            .where(eq(roadmaps.id, id))
            .returning({ id: roadmaps.id });
          break;
          
        case 'role':
          result = await db
            .delete(roles)
            .where(eq(roles.id, id))
            .returning({ id: roles.id });
          break;
          
        default:
          throw new Error(`Unsupported content type: ${type}`);
      }

      if (result.length === 0) {
        console.warn(`⚠️ ${type} not found for deletion: ${id}`);
        return false;
      }

      // Clear related caches
      await this.clearContentCaches();

      console.log(`✅ ${type} deleted successfully: ${id}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting ${type} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a question
   */
  async updateQuestion(questionId: string, updateData: QuestionUpdateData): Promise<boolean> {
    try {
      console.log(`📝 Updating question: ${questionId}`);

      const result = await db
        .update(questions)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(questions.id, questionId))
        .returning({ id: questions.id });

      if (result.length === 0) {
        console.warn(`⚠️ Question not found for update: ${questionId}`);
        return false;
      }

      // Clear related caches
      await this.clearContentCaches();

      console.log(`✅ Question updated successfully: ${questionId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error updating question ${questionId}:`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive platform analytics
   */
  async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    const cacheKey = CacheKeys.admin.analytics();
    
    try {
      // Try to get from cache first
      const cached = await cacheService.get<PlatformAnalytics>(cacheKey);
      if (cached) {
        console.log('📈 Platform analytics retrieved from cache');
        return cached;
      }

      console.log('📈 Generating platform analytics from database');

      // Get overview statistics - using separate queries for simplicity
      const [questionsCount] = await db.select({ count: count() }).from(questions);
      const [roadmapsCount] = await db.select({ count: count() }).from(roadmaps);
      const [rolesCount] = await db.select({ count: count() }).from(roles);
      const [mockInterviewsCount] = await db.select({ count: count() }).from(mockInterviews);

      const overview = {
        totalQuestions: questionsCount.count,
        totalRoadmaps: roadmapsCount.count,
        totalRoles: rolesCount.count,
        totalMockInterviews: mockInterviewsCount.count,
      };

      // Get detailed question statistics
      const [questionStats] = await db
        .select({
          totalQuestions: count(),
          approvedQuestions: sql<number>`COUNT(CASE WHEN ${questions.isApproved} = true THEN 1 END)`,
          pendingQuestions: sql<number>`COUNT(CASE WHEN ${questions.isApproved} = false THEN 1 END)`,
          averageRating: sql<number>`AVG(CAST(${questions.rating} AS DECIMAL))`,
          easy: sql<number>`COUNT(CASE WHEN ${questions.difficulty} = 'easy' THEN 1 END)`,
          medium: sql<number>`COUNT(CASE WHEN ${questions.difficulty} = 'medium' THEN 1 END)`,
          hard: sql<number>`COUNT(CASE WHEN ${questions.difficulty} = 'hard' THEN 1 END)`,
          coding: sql<number>`COUNT(CASE WHEN ${questions.type} = 'coding' THEN 1 END)`,
          conceptual: sql<number>`COUNT(CASE WHEN ${questions.type} = 'conceptual' THEN 1 END)`,
          systemDesign: sql<number>`COUNT(CASE WHEN ${questions.type} = 'system-design' THEN 1 END)`,
          behavioral: sql<number>`COUNT(CASE WHEN ${questions.type} = 'behavioral' THEN 1 END)`,
        })
        .from(questions);

      // Get mock interview statistics
      const [mockInterviewStats] = await db
        .select({
          totalInterviews: count(),
          completedInterviews: sql<number>`COUNT(CASE WHEN ${mockInterviews.status} = 'completed' THEN 1 END)`,
          averageScore: sql<number>`AVG(CAST(${mockInterviews.overallScore} AS DECIMAL))`,
          junior: sql<number>`COUNT(CASE WHEN ${mockInterviews.level} = 'junior' THEN 1 END)`,
          mid: sql<number>`COUNT(CASE WHEN ${mockInterviews.level} = 'mid' THEN 1 END)`,
          senior: sql<number>`COUNT(CASE WHEN ${mockInterviews.level} = 'senior' THEN 1 END)`,
        })
        .from(mockInterviews);

      // Calculate completion rate
      const completionRate = mockInterviewStats.totalInterviews > 0 
        ? (mockInterviewStats.completedInterviews / mockInterviewStats.totalInterviews) * 100 
        : 0;

      // Get today's usage statistics (simplified for MVP)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [todayStats] = await db
        .select({
          mockInterviewsStartedToday: sql<number>`COUNT(CASE WHEN ${mockInterviews.createdAt} >= ${today.toISOString()} THEN 1 END)`,
        })
        .from(mockInterviews);

      const analytics: PlatformAnalytics = {
        overview: {
          totalQuestions: overview.totalQuestions,
          totalRoadmaps: overview.totalRoadmaps,
          totalRoles: overview.totalRoles,
          totalMockInterviews: overview.totalMockInterviews,
        },
        questions: {
          totalQuestions: questionStats.totalQuestions,
          approvedQuestions: questionStats.approvedQuestions,
          pendingQuestions: questionStats.pendingQuestions,
          averageRating: Number(questionStats.averageRating) || 0,
          topTechnologies: [], // TODO: Implement technology aggregation
          questionsByDifficulty: {
            easy: questionStats.easy,
            medium: questionStats.medium,
            hard: questionStats.hard,
          },
          questionsByType: {
            coding: questionStats.coding,
            conceptual: questionStats.conceptual,
            'system-design': questionStats.systemDesign,
            behavioral: questionStats.behavioral,
          },
        },
        mockInterviews: {
          totalInterviews: mockInterviewStats.totalInterviews,
          completedInterviews: mockInterviewStats.completedInterviews,
          averageScore: Number(mockInterviewStats.averageScore) || 0,
          completionRate: Math.round(completionRate * 100) / 100,
          interviewsByLevel: {
            junior: mockInterviewStats.junior,
            mid: mockInterviewStats.mid,
            senior: mockInterviewStats.senior,
          },
        },
        usage: {
          questionsViewedToday: 0, // TODO: Implement view tracking
          mockInterviewsStartedToday: todayStats.mockInterviewsStartedToday,
          topRoles: [], // TODO: Implement role popularity tracking
        },
      };

      // Cache the result
      await cacheService.set(cacheKey, analytics, this.CACHE_TTL);
      
      return analytics;
    } catch (error) {
      console.error('❌ Error getting platform analytics:', error);
      throw error;
    }
  }

  /**
   * Clear all content-related caches
   */
  private async clearContentCaches(): Promise<void> {
    try {
      const patterns = [
        CacheKeys.admin.contentOverview(),
        CacheKeys.admin.analytics(),
        'questions:*',
        'roadmaps:*',
        'roles:*'
      ];

      for (const pattern of patterns) {
        await cacheService.del(pattern);
      }

      console.log('🧹 Content caches cleared');
    } catch (error) {
      console.error('❌ Error clearing content caches:', error);
      // Don't throw - cache clearing failure shouldn't break the main operation
    }
  }
}

export const adminService = new AdminService();