// Common types used across the platform
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

// Enum types matching backend schema
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'coding' | 'conceptual' | 'system-design' | 'behavioral';
export type Level = 'junior' | 'mid' | 'senior';
export type InterviewStatus = 'active' | 'completed' | 'abandoned';

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter types
export interface QuestionFilters {
  technologies?: string[];
  roles?: string[];
  companies?: string[];
  difficulty?: Difficulty[];
  type?: QuestionType[];
  tags?: string[];
  search?: string;
  isApproved?: boolean;
}

export interface RoadmapFilters {
  roleId?: string;
  level?: Level[];
  technologies?: string[];
}

// User progress tracking (local storage)
export interface UserProgress {
  roadmapId: string;
  completedTopics: string[];
  currentTopic: string;
  lastAccessed: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: boolean;
  autoSave?: boolean;
}