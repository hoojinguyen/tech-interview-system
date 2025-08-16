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

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'coding' | 'conceptual' | 'system-design' | 'behavioral';
export type Level = 'junior' | 'mid' | 'senior';