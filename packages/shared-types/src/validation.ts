import { z } from 'zod';

// Base enum schemas
export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);
export const QuestionTypeSchema = z.enum(['coding', 'conceptual', 'system-design', 'behavioral']);
export const LevelSchema = z.enum(['junior', 'mid', 'senior']);
export const InterviewStatusSchema = z.enum(['active', 'completed', 'abandoned']);
export const ResourceTypeSchema = z.enum(['article', 'video', 'tutorial', 'documentation']);

// Common validation schemas
export const UuidSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const UrlSchema = z.string().url();

// Resource schema
export const ResourceSchema = z.object({
  title: z.string().min(1).max(200),
  url: UrlSchema,
  type: ResourceTypeSchema
});

// Code example schema
export const CodeExampleSchema = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1),
  explanation: z.string().optional()
});

// Solution schema
export const SolutionSchema = z.object({
  explanation: z.string().min(1),
  codeExamples: z.array(CodeExampleSchema),
  timeComplexity: z.string().min(1).max(100),
  spaceComplexity: z.string().min(1).max(100),
  alternativeApproaches: z.array(z.string())
});

// Interview feedback schema
export const InterviewFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  codeQuality: z.number().min(0).max(100),
  problemSolving: z.number().min(0).max(100),
  efficiency: z.number().min(0).max(100),
  aiAnalysis: z.string()
});

// User preferences schema
export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  notifications: z.boolean().optional(),
  autoSave: z.boolean().optional()
});

// User progress schema
export const UserProgressSchema = z.object({
  roadmapId: UuidSchema,
  completedTopics: z.array(UuidSchema),
  currentTopic: UuidSchema,
  lastAccessed: z.date(),
  preferences: UserPreferencesSchema
});

// Core model schemas
export const RoleSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  technologies: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const RoadmapSchema = z.object({
  id: UuidSchema,
  roleId: UuidSchema,
  level: LevelSchema,
  title: z.string().min(1).max(200),
  description: z.string().nullable(),
  estimatedHours: z.number().int().min(0),
  prerequisites: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const TopicSchema = z.object({
  id: UuidSchema,
  roadmapId: UuidSchema,
  title: z.string().min(1).max(200),
  description: z.string().nullable(),
  order: z.number().int().min(0),
  resources: z.array(ResourceSchema),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const QuestionSchema = z.object({
  id: UuidSchema,
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  type: QuestionTypeSchema,
  difficulty: DifficultySchema,
  technologies: z.array(z.string()),
  roles: z.array(z.string()),
  companies: z.array(z.string()),
  tags: z.array(z.string()),
  solution: SolutionSchema.nullable(),
  rating: z.string().regex(/^\d+(\.\d{1,2})?$/), // Decimal as string
  ratingCount: z.number().int().min(0),
  submittedBy: z.string().nullable(),
  isApproved: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const MockInterviewSchema = z.object({
  id: UuidSchema,
  roleId: UuidSchema,
  level: LevelSchema,
  status: InterviewStatusSchema,
  startTime: z.date(),
  endTime: z.date().nullable(),
  duration: z.number().int().min(0).nullable(),
  totalQuestions: z.number().int().min(0),
  completedQuestions: z.number().int().min(0),
  overallScore: z.string().regex(/^\d+(\.\d{1,2})?$/).nullable(), // Decimal as string
  createdAt: z.date(),
  updatedAt: z.date()
});

export const InterviewQuestionSchema = z.object({
  id: UuidSchema,
  mockInterviewId: UuidSchema,
  questionId: UuidSchema,
  order: z.number().int().min(0),
  timeLimit: z.number().int().min(1),
  userCode: z.string().nullable(),
  feedback: InterviewFeedbackSchema.nullable(),
  score: z.string().regex(/^\d+(\.\d{1,2})?$/).nullable(), // Decimal as string
  completedAt: z.date().nullable(),
  createdAt: z.date()
});

export const TopicQuestionSchema = z.object({
  id: UuidSchema,
  topicId: UuidSchema,
  questionId: UuidSchema,
  createdAt: z.date()
});

// API Request validation schemas
export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional()
});

export const QuestionFiltersSchema = z.object({
  technologies: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  companies: z.array(z.string()).optional(),
  difficulty: z.array(DifficultySchema).optional(),
  type: z.array(QuestionTypeSchema).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  isApproved: z.boolean().optional()
});

export const RoadmapFiltersSchema = z.object({
  roleId: UuidSchema.optional(),
  level: z.array(LevelSchema).optional(),
  technologies: z.array(z.string()).optional()
});

// API Request schemas
export const SearchQuestionsRequestSchema = QuestionFiltersSchema.extend({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['rating', 'createdAt', 'difficulty', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const CreateQuestionRequestSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  type: QuestionTypeSchema,
  difficulty: DifficultySchema,
  technologies: z.array(z.string()),
  roles: z.array(z.string()),
  companies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  solution: SolutionSchema.optional(),
  submittedBy: z.string().optional()
});

export const StartMockInterviewRequestSchema = z.object({
  roleId: UuidSchema,
  level: LevelSchema,
  questionCount: z.number().int().min(1).max(20).optional(),
  timeLimit: z.number().int().min(5).max(180).optional() // 5 minutes to 3 hours
});

export const SubmitAnswerRequestSchema = z.object({
  mockInterviewId: UuidSchema,
  questionId: UuidSchema,
  userCode: z.string()
});

export const ApproveQuestionRequestSchema = z.object({
  questionId: UuidSchema,
  approved: z.boolean(),
  feedback: z.string().optional()
});

export const UpdateQuestionRequestSchema = z.object({
  id: UuidSchema,
  title: z.string().min(1).max(300).optional(),
  content: z.string().min(1).optional(),
  type: QuestionTypeSchema.optional(),
  difficulty: DifficultySchema.optional(),
  technologies: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  companies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  solution: SolutionSchema.optional()
});

export const DeleteQuestionRequestSchema = z.object({
  id: UuidSchema
});

export const CreateRoadmapRequestSchema = z.object({
  roleId: UuidSchema,
  level: LevelSchema,
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  estimatedHours: z.number().int().min(0),
  prerequisites: z.array(z.string()).optional(),
  topics: z.array(z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    order: z.number().int().min(0),
    resources: z.array(ResourceSchema)
  }))
});

export const UpdateRoadmapRequestSchema = z.object({
  id: UuidSchema,
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  estimatedHours: z.number().int().min(0).optional(),
  prerequisites: z.array(z.string()).optional()
});

export const AutocompleteRequestSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['technologies', 'companies', 'roles', 'tags']),
  limit: z.number().int().min(1).max(50).optional()
});

export const BulkApproveQuestionsRequestSchema = z.object({
  questionIds: z.array(UuidSchema).min(1).max(100),
  approved: z.boolean(),
  feedback: z.string().optional()
});

export const GetAnalyticsRequestSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  metrics: z.array(z.enum(['questions', 'interviews', 'users', 'ratings'])).optional()
});

// API Response validation schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.any().optional(),
      timestamp: z.string()
    }).optional()
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean()
    })
  });

// Extended model schemas with relations
export const RoleWithRoadmapsSchema = RoleSchema.extend({
  roadmaps: z.array(RoadmapSchema)
});

export const TopicWithQuestionsSchema = TopicSchema.extend({
  roadmap: RoadmapSchema,
  questions: z.array(QuestionSchema)
});

export const RoadmapWithTopicsSchema = RoadmapSchema.extend({
  role: RoleSchema,
  topics: z.array(TopicWithQuestionsSchema)
});

export const QuestionWithDetailsSchema = QuestionSchema.extend({
  relatedTopics: z.array(TopicSchema).optional()
});

export const MockInterviewWithDetailsSchema = MockInterviewSchema.extend({
  role: RoleSchema,
  questions: z.array(InterviewQuestionSchema.extend({
    question: QuestionSchema
  }))
});

// Type inference from schemas - using 'Validated' prefix to avoid conflicts
export type ValidatedDifficulty = z.infer<typeof DifficultySchema>;
export type ValidatedQuestionType = z.infer<typeof QuestionTypeSchema>;
export type ValidatedLevel = z.infer<typeof LevelSchema>;
export type ValidatedInterviewStatus = z.infer<typeof InterviewStatusSchema>;
export type ValidatedResource = z.infer<typeof ResourceSchema>;
export type ValidatedCodeExample = z.infer<typeof CodeExampleSchema>;
export type ValidatedSolution = z.infer<typeof SolutionSchema>;
export type ValidatedInterviewFeedback = z.infer<typeof InterviewFeedbackSchema>;
export type ValidatedUserPreferences = z.infer<typeof UserPreferencesSchema>;
export type ValidatedUserProgress = z.infer<typeof UserProgressSchema>;

// Validated model types
export type ValidatedRole = z.infer<typeof RoleSchema>;
export type ValidatedRoadmap = z.infer<typeof RoadmapSchema>;
export type ValidatedTopic = z.infer<typeof TopicSchema>;
export type ValidatedQuestion = z.infer<typeof QuestionSchema>;
export type ValidatedMockInterview = z.infer<typeof MockInterviewSchema>;
export type ValidatedInterviewQuestion = z.infer<typeof InterviewQuestionSchema>;
export type ValidatedTopicQuestion = z.infer<typeof TopicQuestionSchema>;

// Validated API Request types
export type ValidatedSearchQuestionsRequest = z.infer<typeof SearchQuestionsRequestSchema>;
export type ValidatedCreateQuestionRequest = z.infer<typeof CreateQuestionRequestSchema>;
export type ValidatedStartMockInterviewRequest = z.infer<typeof StartMockInterviewRequestSchema>;
export type ValidatedSubmitAnswerRequest = z.infer<typeof SubmitAnswerRequestSchema>;
export type ValidatedApproveQuestionRequest = z.infer<typeof ApproveQuestionRequestSchema>;
export type ValidatedUpdateQuestionRequest = z.infer<typeof UpdateQuestionRequestSchema>;
export type ValidatedDeleteQuestionRequest = z.infer<typeof DeleteQuestionRequestSchema>;
export type ValidatedCreateRoadmapRequest = z.infer<typeof CreateRoadmapRequestSchema>;
export type ValidatedUpdateRoadmapRequest = z.infer<typeof UpdateRoadmapRequestSchema>;
export type ValidatedAutocompleteRequest = z.infer<typeof AutocompleteRequestSchema>;
export type ValidatedBulkApproveQuestionsRequest = z.infer<typeof BulkApproveQuestionsRequestSchema>;
export type ValidatedGetAnalyticsRequest = z.infer<typeof GetAnalyticsRequestSchema>;

// Validated extended model types
export type ValidatedRoleWithRoadmaps = z.infer<typeof RoleWithRoadmapsSchema>;
export type ValidatedTopicWithQuestions = z.infer<typeof TopicWithQuestionsSchema>;
export type ValidatedRoadmapWithTopics = z.infer<typeof RoadmapWithTopicsSchema>;
export type ValidatedQuestionWithDetails = z.infer<typeof QuestionWithDetailsSchema>;
export type ValidatedMockInterviewWithDetails = z.infer<typeof MockInterviewWithDetailsSchema>;