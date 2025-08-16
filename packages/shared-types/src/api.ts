import { Question, Roadmap, Role } from './models';
import { Difficulty, QuestionType, Level } from './common';

// API request/response types
export interface GetRolesResponse {
  roles: Role[];
}

export interface GetRoadmapRequest {
  role: string;
  level: Level;
}

export interface GetRoadmapResponse {
  roadmap: Roadmap;
}

export interface SearchQuestionsRequest {
  query?: string;
  technologies?: string[];
  difficulty?: Difficulty;
  type?: QuestionType;
  roles?: string[];
  companies?: string[];
  page?: number;
  limit?: number;
}

export interface SearchQuestionsResponse {
  questions: Question[];
  total: number;
  page: number;
  limit: number;
}

export interface GetQuestionResponse {
  question: Question;
}