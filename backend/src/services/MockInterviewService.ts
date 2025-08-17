import { db } from '../db/connection';
import {
  mockInterviews,
  interviewQuestions,
  questions,
  roles,
} from '../db/schema';
import { eq, and, sql, inArray, lt } from 'drizzle-orm';
import { cacheService, CacheKeys } from '../db/redis';

export interface StartMockInterviewRequest {
  roleId: string;
  level: 'junior' | 'mid' | 'senior';
  questionCount?: number;
  timeLimit?: number; // in minutes per question
}

export interface MockInterviewSession {
  id: string;
  roleId: string;
  level: 'junior' | 'mid' | 'senior';
  status: 'active' | 'completed' | 'abandoned';
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  totalQuestions: number;
  completedQuestions: number;
  overallScore: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockInterviewWithDetails extends MockInterviewSession {
  role: {
    id: string;
    name: string;
    description: string | null;
  };
  questions: Array<{
    id: string;
    questionId: string;
    order: number;
    timeLimit: number;
    userCode: string | null;
    feedback: InterviewFeedback | null;
    score: string | null;
    completedAt: Date | null;
    question: {
      id: string;
      title: string;
      content: string;
      type: 'coding' | 'conceptual' | 'system-design' | 'behavioral';
      difficulty: 'easy' | 'medium' | 'hard';
      technologies: string[];
    };
  }>;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  codeQuality: number;
  problemSolving: number;
  efficiency: number;
  aiAnalysis: string;
}

export interface SubmitAnswerRequest {
  mockInterviewId: string;
  questionId: string;
  userCode: string;
}

export interface SubmitAnswerResponse {
  feedback: InterviewFeedback;
  nextQuestion?: {
    id: string;
    title: string;
    content: string;
    type: 'coding' | 'conceptual' | 'system-design' | 'behavioral';
    difficulty: 'easy' | 'medium' | 'hard';
    technologies: string[];
  };
  isComplete: boolean;
}

export interface MockInterviewSummary {
  overallScore: number;
  summary: {
    totalQuestions: number;
    completedQuestions: number;
    averageScore: number;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  };
}

export class MockInterviewService {
  private static readonly CACHE_TTL = {
    INTERVIEW_SESSION: 3600, // 1 hour
    INTERVIEW_QUESTIONS: 1800, // 30 minutes
  };

  private static readonly DEFAULT_QUESTION_COUNT = 5;
  private static readonly DEFAULT_TIME_LIMIT = 30; // minutes per question
  private static readonly MAX_QUESTION_COUNT = 10;
  private static readonly SESSION_TIMEOUT = 120; // 2 hours in minutes

  /**
   * Start a new mock interview session
   */
  async startMockInterview(
    request: StartMockInterviewRequest
  ): Promise<MockInterviewSession> {
    const {
      roleId,
      level,
      questionCount = MockInterviewService.DEFAULT_QUESTION_COUNT,
      timeLimit = MockInterviewService.DEFAULT_TIME_LIMIT,
    } = request;

    // Validate role exists
    const roleData = await db
      .select({ id: roles.id, name: roles.name })
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (roleData.length === 0) {
      throw new Error('Role not found');
    }

    // Validate question count
    const validQuestionCount = Math.min(
      Math.max(1, questionCount),
      MockInterviewService.MAX_QUESTION_COUNT
    );

    // Get suitable questions for the role and level
    const suitableQuestions = await this.getSuitableQuestions(
      roleId,
      level,
      validQuestionCount
    );

    if (suitableQuestions.length === 0) {
      throw new Error('No suitable questions found for this role and level');
    }

    // Create mock interview session
    const [mockInterview] = await db
      .insert(mockInterviews)
      .values({
        roleId,
        level,
        status: 'active',
        startTime: new Date(),
        totalQuestions: suitableQuestions.length,
        completedQuestions: 0,
      })
      .returning();

    // Create interview questions
    const interviewQuestionData = suitableQuestions.map((question, index) => ({
      mockInterviewId: mockInterview.id,
      questionId: question.id,
      order: index + 1,
      timeLimit,
    }));

    await db.insert(interviewQuestions).values(interviewQuestionData);

    // Cache the session
    const cacheKey = CacheKeys.mockInterviewById(mockInterview.id);
    try {
      await cacheService.set(
        cacheKey,
        mockInterview,
        MockInterviewService.CACHE_TTL.INTERVIEW_SESSION
      );
    } catch (error) {
      console.warn('Failed to cache mock interview session:', error);
    }

    return {
      id: mockInterview.id,
      roleId: mockInterview.roleId,
      level: mockInterview.level,
      status: mockInterview.status,
      startTime: mockInterview.startTime,
      endTime: mockInterview.endTime,
      duration: mockInterview.duration,
      totalQuestions: mockInterview.totalQuestions || 0,
      completedQuestions: mockInterview.completedQuestions || 0,
      overallScore: mockInterview.overallScore,
      createdAt: mockInterview.createdAt,
      updatedAt: mockInterview.updatedAt,
    };
  }

  /**
   * Get mock interview details with questions
   */
  async getMockInterviewById(
    interviewId: string
  ): Promise<MockInterviewWithDetails | null> {
    const cacheKey = CacheKeys.mockInterviewWithDetails(interviewId);

    try {
      // Try to get from cache first
      const cached = await cacheService.get<MockInterviewWithDetails>(cacheKey);
      if (cached) {
        console.log(
          `📦 Returning cached mock interview data for ID: ${interviewId}`
        );
        return cached;
      }
    } catch (error) {
      console.warn(
        'Cache get failed for mock interview, proceeding with database query:',
        error
      );
    }

    // Get mock interview with role details
    const interviewData = await db
      .select({
        interview: mockInterviews,
        role: {
          id: roles.id,
          name: roles.name,
          description: roles.description,
        },
      })
      .from(mockInterviews)
      .innerJoin(roles, eq(mockInterviews.roleId, roles.id))
      .where(eq(mockInterviews.id, interviewId))
      .limit(1);

    if (interviewData.length === 0) {
      return null;
    }

    const { interview, role } = interviewData[0];

    // Get interview questions with question details
    const questionsData = await db
      .select({
        interviewQuestion: interviewQuestions,
        question: {
          id: questions.id,
          title: questions.title,
          content: questions.content,
          type: questions.type,
          difficulty: questions.difficulty,
          technologies: questions.technologies,
        },
      })
      .from(interviewQuestions)
      .innerJoin(questions, eq(interviewQuestions.questionId, questions.id))
      .where(eq(interviewQuestions.mockInterviewId, interviewId))
      .orderBy(interviewQuestions.order);

    const result: MockInterviewWithDetails = {
      id: interview.id,
      roleId: interview.roleId,
      level: interview.level,
      status: interview.status,
      startTime: interview.startTime,
      endTime: interview.endTime,
      duration: interview.duration,
      totalQuestions: interview.totalQuestions || 0,
      completedQuestions: interview.completedQuestions || 0,
      overallScore: interview.overallScore,
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
      role,
      questions: questionsData.map(({ interviewQuestion, question }) => ({
        id: interviewQuestion.id,
        questionId: interviewQuestion.questionId,
        order: interviewQuestion.order,
        timeLimit:
          interviewQuestion.timeLimit ||
          MockInterviewService.DEFAULT_TIME_LIMIT,
        userCode: interviewQuestion.userCode,
        feedback: interviewQuestion.feedback,
        score: interviewQuestion.score,
        completedAt: interviewQuestion.completedAt,
        question: {
          id: question.id,
          title: question.title,
          content: question.content,
          type: question.type,
          difficulty: question.difficulty,
          technologies: question.technologies || [],
        },
      })),
    };

    // Cache the result
    try {
      await cacheService.set(
        cacheKey,
        result,
        MockInterviewService.CACHE_TTL.INTERVIEW_QUESTIONS
      );
    } catch (error) {
      console.warn('Failed to cache mock interview details:', error);
    }

    return result;
  }

  /**
   * Submit an answer for a question in a mock interview
   */
  async submitAnswer(
    request: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> {
    const { mockInterviewId, questionId, userCode } = request;

    // Validate interview exists and is active
    const interviewData = await db
      .select()
      .from(mockInterviews)
      .where(eq(mockInterviews.id, mockInterviewId))
      .limit(1);

    if (interviewData.length === 0) {
      throw new Error('Mock interview not found');
    }

    const interview = interviewData[0];

    if (interview.status !== 'active') {
      throw new Error('Mock interview is not active');
    }

    // Check for session timeout
    const sessionDuration = Date.now() - interview.startTime.getTime();
    const timeoutMs = MockInterviewService.SESSION_TIMEOUT * 60 * 1000;

    if (sessionDuration > timeoutMs) {
      // Mark interview as abandoned
      await db
        .update(mockInterviews)
        .set({
          status: 'abandoned',
          endTime: new Date(),
          duration: Math.floor(sessionDuration / (1000 * 60)),
          updatedAt: new Date(),
        })
        .where(eq(mockInterviews.id, mockInterviewId));

      throw new Error('Mock interview session has timed out');
    }

    // Find the specific interview question
    const interviewQuestionData = await db
      .select()
      .from(interviewQuestions)
      .where(
        and(
          eq(interviewQuestions.mockInterviewId, mockInterviewId),
          eq(interviewQuestions.questionId, questionId)
        )
      )
      .limit(1);

    if (interviewQuestionData.length === 0) {
      throw new Error('Question not found in this interview');
    }

    const interviewQuestion = interviewQuestionData[0];

    // Check if already completed
    if (interviewQuestion.completedAt) {
      throw new Error('Question already completed');
    }

    // Generate AI feedback (mock implementation for now)
    const feedback = await this.generateAIFeedback(questionId, userCode);

    // Update the interview question with user code and feedback
    await db
      .update(interviewQuestions)
      .set({
        userCode,
        feedback,
        score: feedback.score.toString(),
        completedAt: new Date(),
      })
      .where(eq(interviewQuestions.id, interviewQuestion.id));

    // Update interview progress
    const completedCount = (interview.completedQuestions || 0) + 1;
    const isComplete = completedCount >= (interview.totalQuestions || 0);

    if (isComplete) {
      // Calculate overall score and complete the interview
      const allScores = await db
        .select({ score: interviewQuestions.score })
        .from(interviewQuestions)
        .where(eq(interviewQuestions.mockInterviewId, mockInterviewId));

      const scores = allScores
        .map(s => parseFloat(s.score || '0'))
        .filter(s => !isNaN(s));

      const overallScore =
        scores.length > 0
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : 0;

      await db
        .update(mockInterviews)
        .set({
          status: 'completed',
          endTime: new Date(),
          duration: Math.floor(sessionDuration / (1000 * 60)),
          completedQuestions: completedCount,
          overallScore: overallScore.toString(),
          updatedAt: new Date(),
        })
        .where(eq(mockInterviews.id, mockInterviewId));
    } else {
      await db
        .update(mockInterviews)
        .set({
          completedQuestions: completedCount,
          updatedAt: new Date(),
        })
        .where(eq(mockInterviews.id, mockInterviewId));
    }

    // Get next question if not complete
    let nextQuestion = undefined;
    if (!isComplete) {
      const nextQuestionData = await db
        .select({
          interviewQuestion: interviewQuestions,
          question: {
            id: questions.id,
            title: questions.title,
            content: questions.content,
            type: questions.type,
            difficulty: questions.difficulty,
            technologies: questions.technologies,
          },
        })
        .from(interviewQuestions)
        .innerJoin(questions, eq(interviewQuestions.questionId, questions.id))
        .where(
          and(
            eq(interviewQuestions.mockInterviewId, mockInterviewId),
            sql`${interviewQuestions.completedAt} IS NULL`
          )
        )
        .orderBy(interviewQuestions.order)
        .limit(1);

      if (nextQuestionData.length > 0) {
        const { question } = nextQuestionData[0];
        nextQuestion = {
          id: question.id,
          title: question.title,
          content: question.content,
          type: question.type,
          difficulty: question.difficulty,
          technologies: question.technologies || [],
        };
      }
    }

    // Clear cache for this interview
    await this.clearInterviewCache(mockInterviewId);

    return {
      feedback,
      nextQuestion,
      isComplete,
    };
  }

  /**
   * Get feedback for a completed mock interview
   */
  async getInterviewFeedback(
    interviewId: string
  ): Promise<MockInterviewSummary> {
    // Get interview details
    const interviewData = await db
      .select()
      .from(mockInterviews)
      .where(eq(mockInterviews.id, interviewId))
      .limit(1);

    if (interviewData.length === 0) {
      throw new Error('Mock interview not found');
    }

    const interview = interviewData[0];

    if (interview.status !== 'completed') {
      throw new Error('Mock interview is not completed yet');
    }

    // Get all feedback from interview questions
    const feedbackData = await db
      .select({
        feedback: interviewQuestions.feedback,
        score: interviewQuestions.score,
      })
      .from(interviewQuestions)
      .where(eq(interviewQuestions.mockInterviewId, interviewId));

    const feedbacks = feedbackData
      .map(f => f.feedback)
      .filter(f => f !== null) as InterviewFeedback[];

    const scores = feedbackData
      .map(f => parseFloat(f.score || '0'))
      .filter(s => !isNaN(s));

    // Aggregate feedback
    const averageScore =
      scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 0;

    const allStrengths = feedbacks.flatMap(f => f.strengths);
    const allImprovements = feedbacks.flatMap(f => f.improvements);

    // Get unique strengths and improvements
    const uniqueStrengths = [...new Set(allStrengths)];
    const uniqueImprovements = [...new Set(allImprovements)];

    // Generate recommendations based on performance
    const recommendations = this.generateRecommendations(
      averageScore,
      uniqueImprovements
    );

    return {
      overallScore: parseFloat(interview.overallScore || '0'),
      summary: {
        totalQuestions: interview.totalQuestions || 0,
        completedQuestions: interview.completedQuestions || 0,
        averageScore,
        strengths: uniqueStrengths,
        areasForImprovement: uniqueImprovements,
        recommendations,
      },
    };
  }

  /**
   * Get suitable questions for a role and level
   */
  private async getSuitableQuestions(
    roleId: string,
    level: 'junior' | 'mid' | 'senior',
    count: number
  ): Promise<Array<{ id: string; title: string; difficulty: string }>> {
    // Get role name to filter questions
    const roleData = await db
      .select({ name: roles.name })
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (roleData.length === 0) {
      return [];
    }

    const roleName = roleData[0].name;

    // Define difficulty distribution based on level
    let difficultyFilter: ('easy' | 'medium' | 'hard')[];
    switch (level) {
      case 'junior':
        difficultyFilter = ['easy', 'medium'];
        break;
      case 'mid':
        difficultyFilter = ['easy', 'medium', 'hard'];
        break;
      case 'senior':
        difficultyFilter = ['medium', 'hard'];
        break;
      default:
        difficultyFilter = ['easy', 'medium', 'hard'];
    }

    // Get questions that match the role and difficulty
    const suitableQuestions = await db
      .select({
        id: questions.id,
        title: questions.title,
        difficulty: questions.difficulty,
      })
      .from(questions)
      .where(
        and(
          eq(questions.isApproved, true),
          inArray(questions.difficulty, difficultyFilter),
          sql`${questions.roles} @> ${JSON.stringify([roleName])}`
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(count * 2); // Get more than needed to have variety

    // Shuffle and return the requested count
    const shuffled = suitableQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Generate AI feedback for a submitted answer (mock implementation)
   */
  private async generateAIFeedback(
    questionId: string,
    userCode: string
  ): Promise<InterviewFeedback> {
    // This is a mock implementation. In a real scenario, this would call OpenAI API
    // For now, we'll generate realistic-looking feedback based on code analysis
    
    // Log the question ID for debugging purposes
    console.log(`🤖 Generating AI feedback for question: ${questionId}`);

    const codeLength = userCode.length;
    const hasComments = userCode.includes('//') || userCode.includes('/*');
    const hasProperNaming = /[a-zA-Z][a-zA-Z0-9]*/.test(userCode);
    const hasErrorHandling =
      userCode.includes('try') ||
      userCode.includes('catch') ||
      userCode.includes('if');

    // Generate scores based on simple heuristics
    let codeQuality = 60;
    let problemSolving = 70;
    let efficiency = 65;

    if (hasComments) codeQuality += 10;
    if (hasProperNaming) codeQuality += 10;
    if (hasErrorHandling) problemSolving += 15;
    if (codeLength > 100) efficiency += 10;

    // Ensure scores are within bounds
    codeQuality = Math.min(100, Math.max(0, codeQuality));
    problemSolving = Math.min(100, Math.max(0, problemSolving));
    efficiency = Math.min(100, Math.max(0, efficiency));

    const overallScore = (codeQuality + problemSolving + efficiency) / 3;

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (codeQuality >= 80) strengths.push('Clean and readable code structure');
    if (problemSolving >= 80) strengths.push('Strong problem-solving approach');
    if (efficiency >= 80) strengths.push('Efficient algorithm implementation');
    if (hasComments) strengths.push('Good code documentation');

    if (codeQuality < 70)
      improvements.push('Improve code readability and structure');
    if (problemSolving < 70)
      improvements.push('Work on problem decomposition skills');
    if (efficiency < 70)
      improvements.push('Consider more efficient algorithms');
    if (!hasComments)
      improvements.push('Add comments to explain complex logic');

    // Default feedback if no specific areas identified
    if (strengths.length === 0) {
      strengths.push('Attempted to solve the problem');
    }
    if (improvements.length === 0) {
      improvements.push('Continue practicing coding problems');
    }

    return {
      score: Math.round(overallScore),
      strengths,
      improvements,
      codeQuality: Math.round(codeQuality),
      problemSolving: Math.round(problemSolving),
      efficiency: Math.round(efficiency),
      aiAnalysis: `The solution demonstrates ${overallScore >= 80 ? 'strong' : overallScore >= 60 ? 'adequate' : 'basic'} understanding of the problem. ${
        overallScore >= 80
          ? 'Excellent work with clean implementation and good practices.'
          : overallScore >= 60
            ? 'Good effort with room for improvement in code quality and efficiency.'
            : 'Keep practicing to improve problem-solving and coding skills.'
      }`,
    };
  }

  /**
   * Generate recommendations based on performance
   */
  private generateRecommendations(
    averageScore: number,
    improvements: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (averageScore >= 80) {
      recommendations.push(
        'Excellent performance! Consider practicing system design questions.'
      );
      recommendations.push('Focus on advanced algorithms and data structures.');
    } else if (averageScore >= 60) {
      recommendations.push(
        'Good foundation. Practice more coding problems daily.'
      );
      recommendations.push(
        'Review fundamental algorithms and time complexity analysis.'
      );
    } else {
      recommendations.push(
        'Focus on basic programming concepts and problem-solving patterns.'
      );
      recommendations.push(
        'Practice simple coding problems before attempting complex ones.'
      );
    }

    // Add specific recommendations based on improvement areas
    if (improvements.some(i => i.includes('readability'))) {
      recommendations.push('Study clean code principles and best practices.');
    }
    if (improvements.some(i => i.includes('efficiency'))) {
      recommendations.push(
        'Learn about algorithm optimization and Big O notation.'
      );
    }
    if (improvements.some(i => i.includes('problem'))) {
      recommendations.push(
        'Practice breaking down complex problems into smaller parts.'
      );
    }

    return recommendations;
  }

  /**
   * Clear cache for a specific interview
   */
  private async clearInterviewCache(interviewId: string): Promise<void> {
    try {
      await cacheService.del(CacheKeys.mockInterviewById(interviewId));
      await cacheService.del(CacheKeys.mockInterviewWithDetails(interviewId));
    } catch (error) {
      console.warn('Failed to clear interview cache:', error);
    }
  }

  /**
   * Clean up abandoned sessions (should be called periodically)
   */
  async cleanupAbandonedSessions(): Promise<number> {
    const timeoutMs = MockInterviewService.SESSION_TIMEOUT * 60 * 1000;
    const cutoffTime = new Date(Date.now() - timeoutMs);

    try {
      // First, get the count of sessions to be cleaned up
      const sessionsToCleanup = await db
        .select({ id: mockInterviews.id })
        .from(mockInterviews)
        .where(
          and(
            eq(mockInterviews.status, 'active'),
            lt(mockInterviews.startTime, cutoffTime)
          )
        );

      if (sessionsToCleanup.length === 0) {
        return 0;
      }

      // Update the sessions
      await db
        .update(mockInterviews)
        .set({
          status: 'abandoned',
          endTime: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(mockInterviews.status, 'active'),
            lt(mockInterviews.startTime, cutoffTime)
          )
        );

      return sessionsToCleanup.length;
    } catch (error) {
      console.error('Error in cleanupAbandonedSessions:', error);
      return 0;
    }
  }
}

export const mockInterviewService = new MockInterviewService();
