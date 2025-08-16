import { 
  Question, 
  Roadmap, 
  Role, 
  MockInterview, 
  InterviewQuestion,
  RoleWithRoadmaps,
  RoadmapWithTopics,
  QuestionWithDetails,
  MockInterviewWithDetails
} from './models';
import { 
  Difficulty, 
  QuestionType, 
  Level, 
  InterviewStatus,
  PaginatedResponse,
  QuestionFilters,
  RoadmapFilters,
  ApiResponse
} from './common';

// Roles API
export interface GetRolesResponse extends ApiResponse<Role[]> {}

// Roadmaps API
export interface GetRoadmapsByRoleRequest {
  role: string;
  level?: Level;
}

export interface GetRoadmapsByRoleResponse extends ApiResponse<Roadmap[]> {}

export interface GetRoadmapByIdRequest {
  id: string;
}

export interface GetRoadmapByIdResponse extends ApiResponse<RoadmapWithTopics> {}

// Questions API
export interface SearchQuestionsRequest extends QuestionFilters {
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'createdAt' | 'difficulty' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuestionsResponse extends ApiResponse<PaginatedResponse<Question>> {}

export interface GetQuestionByIdRequest {
  id: string;
}

export interface GetQuestionByIdResponse extends ApiResponse<QuestionWithDetails> {}

export interface CreateQuestionRequest {
  title: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  technologies: string[];
  roles: string[];
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
  submittedBy?: string;
}

export interface CreateQuestionResponse extends ApiResponse<Question> {}

// Mock Interviews API
export interface StartMockInterviewRequest {
  roleId: string;
  level: Level;
  questionCount?: number;
  timeLimit?: number; // in minutes
}

export interface StartMockInterviewResponse extends ApiResponse<MockInterview> {}

export interface GetMockInterviewRequest {
  id: string;
}

export interface GetMockInterviewResponse extends ApiResponse<MockInterviewWithDetails> {}

export interface SubmitAnswerRequest {
  mockInterviewId: string;
  questionId: string;
  userCode: string;
}

export interface SubmitAnswerResponse extends ApiResponse<{
  feedback: {
    score: number;
    strengths: string[];
    improvements: string[];
    codeQuality: number;
    problemSolving: number;
    efficiency: number;
    aiAnalysis: string;
  };
  nextQuestion?: Question;
  isComplete: boolean;
}> {}

export interface CompleteMockInterviewRequest {
  mockInterviewId: string;
}

export interface CompleteMockInterviewResponse extends ApiResponse<{
  overallScore: number;
  summary: {
    totalQuestions: number;
    completedQuestions: number;
    averageScore: number;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  };
}> {}

// Admin API
export interface GetPendingQuestionsRequest {
  page?: number;
  limit?: number;
}

export interface GetPendingQuestionsResponse extends ApiResponse<PaginatedResponse<Question>> {}

export interface ApproveQuestionRequest {
  questionId: string;
  approved: boolean;
  feedback?: string;
}

export interface ApproveQuestionResponse extends ApiResponse<Question> {}

export interface GetPlatformStatsResponse extends ApiResponse<{
  totalQuestions: number;
  totalRoadmaps: number;
  totalMockInterviews: number;
  pendingQuestions: number;
  averageRating: number;
  popularTechnologies: Array<{
    name: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: 'question_added' | 'question_approved' | 'mock_interview_completed';
    timestamp: Date;
    details: string;
  }>;
}> {}