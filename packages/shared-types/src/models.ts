import { Difficulty, QuestionType, Level, InterviewStatus } from './common';

// Core data models matching backend schema
export interface Role {
  id: string;
  name: string;
  description: string | null;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Roadmap {
  id: string;
  roleId: string;
  level: Level;
  title: string;
  description: string | null;
  estimatedHours: number;
  prerequisites: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  roadmapId: string;
  title: string;
  description: string | null;
  order: number;
  resources: Resource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'tutorial' | 'documentation';
}

export interface Question {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  technologies: string[];
  roles: string[];
  companies: string[];
  tags: string[];
  solution: Solution | null;
  rating: string; // Decimal as string from database
  ratingCount: number;
  submittedBy: string | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Solution {
  explanation: string;
  codeExamples: CodeExample[];
  timeComplexity: string;
  spaceComplexity: string;
  alternativeApproaches: string[];
}

export interface CodeExample {
  language: string;
  code: string;
  explanation?: string;
}

export interface MockInterview {
  id: string;
  roleId: string;
  level: Level;
  status: InterviewStatus;
  startTime: Date;
  endTime: Date | null;
  duration: number | null; // in minutes
  totalQuestions: number;
  completedQuestions: number;
  overallScore: string | null; // Decimal as string from database
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewQuestion {
  id: string;
  mockInterviewId: string;
  questionId: string;
  order: number;
  timeLimit: number; // in minutes
  userCode: string | null;
  feedback: InterviewFeedback | null;
  score: string | null; // Decimal as string from database
  completedAt: Date | null;
  createdAt: Date;
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

export interface TopicQuestion {
  id: string;
  topicId: string;
  questionId: string;
  createdAt: Date;
}

// Extended types with relations for API responses
export interface RoleWithRoadmaps extends Role {
  roadmaps: Roadmap[];
}

export interface RoadmapWithTopics extends Roadmap {
  role: Role;
  topics: TopicWithQuestions[];
}

export interface TopicWithQuestions extends Topic {
  roadmap: Roadmap;
  questions: Question[];
}

export interface QuestionWithDetails extends Question {
  relatedTopics?: Topic[];
}

export interface MockInterviewWithDetails extends MockInterview {
  role: Role;
  questions: (InterviewQuestion & {
    question: Question;
  })[];
}