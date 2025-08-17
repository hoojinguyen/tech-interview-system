import { db } from '../db/connection';
import { questions, roles, topicQuestions, topics } from '../db/schema';
import { eq, and, or, ilike, inArray, sql, desc, asc } from 'drizzle-orm';
import { cacheService, CacheKeys } from '../db/redis';

export interface QuestionFilters {
  search?: string;
  technologies?: string[];
  difficulty?: ('easy' | 'medium' | 'hard')[];
  roles?: string[];
  companies?: string[];
  type?: ('coding' | 'conceptual' | 'system-design' | 'behavioral')[];
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'difficulty' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface QuestionSummary {
  id: string;
  title: string;
  type: 'coding' | 'conceptual' | 'system-design' | 'behavioral';
  difficulty: 'easy' | 'medium' | 'hard';
  technologies: string[];
  roles: string[];
  companies: string[];
  tags: string[];
  rating: string;
  ratingCount: number;
  createdAt: Date;
}

export interface QuestionDetail {
  id: string;
  title: string;
  content: string;
  type: 'coding' | 'conceptual' | 'system-design' | 'behavioral';
  difficulty: 'easy' | 'medium' | 'hard';
  technologies: string[];
  roles: string[];
  companies: string[];
  tags: string[];
  solution: {
    explanation: string;
    codeExamples: Array<{
      language: string;
      code: string;
      explanation?: string;
    }>;
    timeComplexity: string;
    spaceComplexity: string;
    alternativeApproaches: string[];
  } | null;
  rating: string;
  ratingCount: number;
  submittedBy: string | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionSearchResult {
  questions: QuestionSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    availableTechnologies: string[];
    availableRoles: string[];
    availableCompanies: string[];
    availableTags: string[];
  };
}

export class QuestionService {
  private static readonly CACHE_TTL = {
    QUESTION_DETAIL: 1800, // 30 minutes
    QUESTION_SEARCH: 600, // 10 minutes
    FILTER_OPTIONS: 3600, // 1 hour
  };

  private static readonly DEFAULT_LIMIT = 20;
  private static readonly MAX_LIMIT = 100;

  /**
   * Search and filter questions with pagination
   */
  async searchQuestions(filters: QuestionFilters): Promise<QuestionSearchResult> {
    const cacheKey = CacheKeys.questionsByFilter(filters);

    try {
      // Try to get from cache first
      const cached = await cacheService.get<QuestionSearchResult>(cacheKey);
      if (cached) {
        console.log('📦 Returning cached questions search result');
        return cached;
      }
    } catch (error) {
      console.warn('Cache get failed for questions search, proceeding with database query:', error);
    }

    // Normalize and validate pagination parameters
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(
      Math.max(1, filters.limit || QuestionService.DEFAULT_LIMIT),
      QuestionService.MAX_LIMIT
    );
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    // Only show approved questions
    whereConditions.push(eq(questions.isApproved, true));

    // Full-text search on title and content
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      whereConditions.push(
        or(
          ilike(questions.title, searchTerm),
          ilike(questions.content, searchTerm)
        )
      );
    }

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty.length > 0) {
      whereConditions.push(inArray(questions.difficulty, filters.difficulty));
    }

    // Filter by question type
    if (filters.type && filters.type.length > 0) {
      whereConditions.push(inArray(questions.type, filters.type));
    }

    // Filter by technologies (JSON array contains)
    if (filters.technologies && filters.technologies.length > 0) {
      const techConditions = filters.technologies.map(tech =>
        sql`${questions.technologies} @> ${JSON.stringify([tech])}`
      );
      whereConditions.push(or(...techConditions));
    }

    // Filter by roles (JSON array contains)
    if (filters.roles && filters.roles.length > 0) {
      const roleConditions = filters.roles.map(role =>
        sql`${questions.roles} @> ${JSON.stringify([role])}`
      );
      whereConditions.push(or(...roleConditions));
    }

    // Filter by companies (JSON array contains)
    if (filters.companies && filters.companies.length > 0) {
      const companyConditions = filters.companies.map(company =>
        sql`${questions.companies} @> ${JSON.stringify([company])}`
      );
      whereConditions.push(or(...companyConditions));
    }

    // Filter by tags (JSON array contains)
    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags.map(tag =>
        sql`${questions.tags} @> ${JSON.stringify([tag])}`
      );
      whereConditions.push(or(...tagConditions));
    }

    // Build order by clause
    let orderBy;
    const sortOrder = filters.sortOrder === 'desc' ? desc : asc;
    
    switch (filters.sortBy) {
      case 'difficulty':
        // Custom ordering for difficulty: easy -> medium -> hard
        orderBy = sql`
          CASE ${questions.difficulty}
            WHEN 'easy' THEN 1
            WHEN 'medium' THEN 2
            WHEN 'hard' THEN 3
          END ${filters.sortOrder === 'desc' ? sql`DESC` : sql`ASC`}
        `;
        break;
      case 'rating':
        orderBy = sortOrder(questions.rating);
        break;
      case 'title':
        orderBy = sortOrder(questions.title);
        break;
      case 'createdAt':
      default:
        orderBy = sortOrder(questions.createdAt);
        break;
    }

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(questions)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const [totalResult] = await totalCountQuery;
    const total = totalResult.count;

    // Get questions with pagination
    const questionsQuery = db
      .select({
        id: questions.id,
        title: questions.title,
        type: questions.type,
        difficulty: questions.difficulty,
        technologies: questions.technologies,
        roles: questions.roles,
        companies: questions.companies,
        tags: questions.tags,
        rating: questions.rating,
        ratingCount: questions.ratingCount,
        createdAt: questions.createdAt,
      })
      .from(questions)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const questionsData = await questionsQuery;

    // Get filter options for the frontend
    const filterOptions = await this.getFilterOptions();

    // Build pagination info
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    const result: QuestionSearchResult = {
      questions: questionsData.map(q => ({
        id: q.id,
        title: q.title,
        type: q.type,
        difficulty: q.difficulty,
        technologies: q.technologies || [],
        roles: q.roles || [],
        companies: q.companies || [],
        tags: q.tags || [],
        rating: q.rating || '0',
        ratingCount: q.ratingCount || 0,
        createdAt: q.createdAt,
      })),
      pagination,
      filters: filterOptions,
    };

    // Cache the result
    try {
      await cacheService.set(
        cacheKey,
        result,
        QuestionService.CACHE_TTL.QUESTION_SEARCH
      );
      console.log('💾 Cached questions search result');
    } catch (error) {
      console.warn('Failed to cache questions search result:', error);
    }

    return result;
  }

  /**
   * Get a specific question by ID
   */
  async getQuestionById(questionId: string): Promise<QuestionDetail | null> {
    const cacheKey = CacheKeys.questionById(questionId);

    try {
      // Try to get from cache first
      const cached = await cacheService.get<QuestionDetail>(cacheKey);
      if (cached) {
        console.log(`📦 Returning cached question data for ID: ${questionId}`);
        return cached;
      }
    } catch (error) {
      console.warn('Cache get failed for question, proceeding with database query:', error);
    }

    // Query database
    const questionData = await db
      .select()
      .from(questions)
      .where(and(eq(questions.id, questionId), eq(questions.isApproved, true)))
      .limit(1);

    if (questionData.length === 0) {
      return null;
    }

    const question = questionData[0];

    const questionDetail: QuestionDetail = {
      id: question.id,
      title: question.title,
      content: question.content,
      type: question.type,
      difficulty: question.difficulty,
      technologies: question.technologies || [],
      roles: question.roles || [],
      companies: question.companies || [],
      tags: question.tags || [],
      solution: question.solution,
      rating: question.rating || '0',
      ratingCount: question.ratingCount || 0,
      submittedBy: question.submittedBy,
      isApproved: question.isApproved ?? false,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };

    // Cache the result
    try {
      await cacheService.set(
        cacheKey,
        questionDetail,
        QuestionService.CACHE_TTL.QUESTION_DETAIL
      );
      console.log(`💾 Cached question data for ID: ${questionId}`);
    } catch (error) {
      console.warn('Failed to cache question data:', error);
    }

    return questionDetail;
  }

  /**
   * Get available filter options for the frontend
   */
  private async getFilterOptions(): Promise<{
    availableTechnologies: string[];
    availableRoles: string[];
    availableCompanies: string[];
    availableTags: string[];
  }> {
    const cacheKey = 'questions:filter-options';

    try {
      // Try to get from cache first
      const cached = await cacheService.get<{
        availableTechnologies: string[];
        availableRoles: string[];
        availableCompanies: string[];
        availableTags: string[];
      }>(cacheKey);
      if (cached) {
        console.log('📦 Returning cached filter options');
        return cached;
      }
    } catch (error) {
      console.warn('Cache get failed for filter options, proceeding with database query:', error);
    }

    // Get all unique values from approved questions
    const filterData = await db
      .select({
        technologies: questions.technologies,
        roles: questions.roles,
        companies: questions.companies,
        tags: questions.tags,
      })
      .from(questions)
      .where(eq(questions.isApproved, true));

    // Extract unique values from JSON arrays
    const technologiesSet = new Set<string>();
    const rolesSet = new Set<string>();
    const companiesSet = new Set<string>();
    const tagsSet = new Set<string>();

    filterData.forEach(item => {
      (item.technologies || []).forEach(tech => technologiesSet.add(tech));
      (item.roles || []).forEach(role => rolesSet.add(role));
      (item.companies || []).forEach(company => companiesSet.add(company));
      (item.tags || []).forEach(tag => tagsSet.add(tag));
    });

    const result = {
      availableTechnologies: Array.from(technologiesSet).sort(),
      availableRoles: Array.from(rolesSet).sort(),
      availableCompanies: Array.from(companiesSet).sort(),
      availableTags: Array.from(tagsSet).sort(),
    };

    // Cache the result
    try {
      await cacheService.set(
        cacheKey,
        result,
        QuestionService.CACHE_TTL.FILTER_OPTIONS
      );
      console.log('💾 Cached filter options');
    } catch (error) {
      console.warn('Failed to cache filter options:', error);
    }

    return result;
  }

  /**
   * Clear cache for questions (useful for admin operations)
   */
  async clearCache(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        await cacheService.delPattern(pattern);
      } else {
        // Clear all question-related cache
        await cacheService.delPattern('questions:*');
        await cacheService.delPattern('question:*');
      }
      console.log('🧹 Cleared questions cache');
    } catch (error) {
      console.error('Failed to clear questions cache:', error);
    }
  }
}

export const questionService = new QuestionService();