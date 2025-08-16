import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { 
  roles, 
  roadmaps, 
  topics, 
  questions, 
  mockInterviews, 
  interviewQuestions,
  topicQuestions 
} from './schema';

// Select types (for reading from database)
export type Role = InferSelectModel<typeof roles>;
export type Roadmap = InferSelectModel<typeof roadmaps>;
export type Topic = InferSelectModel<typeof topics>;
export type Question = InferSelectModel<typeof questions>;
export type MockInterview = InferSelectModel<typeof mockInterviews>;
export type InterviewQuestion = InferSelectModel<typeof interviewQuestions>;
export type TopicQuestion = InferSelectModel<typeof topicQuestions>;

// Insert types (for writing to database)
export type NewRole = InferInsertModel<typeof roles>;
export type NewRoadmap = InferInsertModel<typeof roadmaps>;
export type NewTopic = InferInsertModel<typeof topics>;
export type NewQuestion = InferInsertModel<typeof questions>;
export type NewMockInterview = InferInsertModel<typeof mockInterviews>;
export type NewInterviewQuestion = InferInsertModel<typeof interviewQuestions>;
export type NewTopicQuestion = InferInsertModel<typeof topicQuestions>;

// Extended types with relations
export type RoleWithRoadmaps = Role & {
  roadmaps: Roadmap[];
};

export type RoadmapWithTopics = Roadmap & {
  role: Role;
  topics: Topic[];
};

export type TopicWithQuestions = Topic & {
  roadmap: Roadmap;
  topicQuestions: (TopicQuestion & {
    question: Question;
  })[];
};

export type QuestionWithDetails = Question & {
  interviewQuestions?: InterviewQuestion[];
  topicQuestions?: TopicQuestion[];
};

export type MockInterviewWithDetails = MockInterview & {
  role: Role;
  interviewQuestions: (InterviewQuestion & {
    question: Question;
  })[];
};

// Enum types
export type Level = 'junior' | 'mid' | 'senior';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'coding' | 'conceptual' | 'system-design' | 'behavioral';
export type InterviewStatus = 'active' | 'completed' | 'abandoned';

// API response types
export type ApiResponse<T = any> = {
  success: true;
  data: T;
  message?: string;
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

// Pagination types
export type PaginationParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Filter types
export type QuestionFilters = {
  technologies?: string[];
  roles?: string[];
  companies?: string[];
  difficulty?: Difficulty[];
  type?: QuestionType[];
  tags?: string[];
  search?: string;
  isApproved?: boolean;
};

export type RoadmapFilters = {
  roleId?: string;
  level?: Level[];
  technologies?: string[];
};

// Cache types
export type CacheOptions = {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
};