import { pgTable, uuid, varchar, text, integer, jsonb, decimal, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const levelEnum = pgEnum('level', ['junior', 'mid', 'senior']);
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const questionTypeEnum = pgEnum('question_type', ['coding', 'conceptual', 'system-design', 'behavioral']);
export const interviewStatusEnum = pgEnum('interview_status', ['active', 'completed', 'abandoned']);

// Roles table
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  technologies: jsonb('technologies').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Roadmaps table
export const roadmaps = pgTable('roadmaps', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  level: levelEnum('level').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  estimatedHours: integer('estimated_hours').default(0),
  prerequisites: jsonb('prerequisites').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Topics table
export const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  roadmapId: uuid('roadmap_id').references(() => roadmaps.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  order: integer('order').notNull().default(0),
  resources: jsonb('resources').$type<Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'documentation' | 'tutorial';
  }>>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Questions table
export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 300 }).notNull(),
  content: text('content').notNull(),
  type: questionTypeEnum('type').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  technologies: jsonb('technologies').$type<string[]>().default([]),
  roles: jsonb('roles').$type<string[]>().default([]),
  companies: jsonb('companies').$type<string[]>().default([]),
  tags: jsonb('tags').$type<string[]>().default([]),
  solution: jsonb('solution').$type<{
    explanation: string;
    codeExamples: Array<{
      language: string;
      code: string;
      explanation?: string;
    }>;
    timeComplexity: string;
    spaceComplexity: string;
    alternativeApproaches: string[];
  }>(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  ratingCount: integer('rating_count').default(0),
  submittedBy: varchar('submitted_by', { length: 100 }),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Mock interviews table
export const mockInterviews = pgTable('mock_interviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').references(() => roles.id).notNull(),
  level: levelEnum('level').notNull(),
  status: interviewStatusEnum('status').default('active').notNull(),
  startTime: timestamp('start_time').defaultNow().notNull(),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // in minutes
  totalQuestions: integer('total_questions').default(0),
  completedQuestions: integer('completed_questions').default(0),
  overallScore: decimal('overall_score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Interview questions table (junction table for mock interviews and questions)
export const interviewQuestions = pgTable('interview_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  mockInterviewId: uuid('mock_interview_id').references(() => mockInterviews.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  order: integer('order').notNull(),
  timeLimit: integer('time_limit').default(30), // in minutes
  userCode: text('user_code'),
  feedback: jsonb('feedback').$type<{
    score: number;
    strengths: string[];
    improvements: string[];
    codeQuality: number;
    problemSolving: number;
    efficiency: number;
    aiAnalysis: string;
  }>(),
  score: decimal('score', { precision: 5, scale: 2 }),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Topic questions junction table
export const topicQuestions = pgTable('topic_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  topicId: uuid('topic_id').references(() => topics.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  roadmaps: many(roadmaps),
  mockInterviews: many(mockInterviews)
}));

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  role: one(roles, {
    fields: [roadmaps.roleId],
    references: [roles.id]
  }),
  topics: many(topics)
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  roadmap: one(roadmaps, {
    fields: [topics.roadmapId],
    references: [roadmaps.id]
  }),
  topicQuestions: many(topicQuestions)
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  interviewQuestions: many(interviewQuestions),
  topicQuestions: many(topicQuestions)
}));

export const mockInterviewsRelations = relations(mockInterviews, ({ one, many }) => ({
  role: one(roles, {
    fields: [mockInterviews.roleId],
    references: [roles.id]
  }),
  interviewQuestions: many(interviewQuestions)
}));

export const interviewQuestionsRelations = relations(interviewQuestions, ({ one }) => ({
  mockInterview: one(mockInterviews, {
    fields: [interviewQuestions.mockInterviewId],
    references: [mockInterviews.id]
  }),
  question: one(questions, {
    fields: [interviewQuestions.questionId],
    references: [questions.id]
  })
}));

export const topicQuestionsRelations = relations(topicQuestions, ({ one }) => ({
  topic: one(topics, {
    fields: [topicQuestions.topicId],
    references: [topics.id]
  }),
  question: one(questions, {
    fields: [topicQuestions.questionId],
    references: [questions.id]
  })
}));