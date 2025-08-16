// Example of using shared types in client API services
import {
  Question,
  SearchQuestionsRequest,
  SearchQuestionsResponse,
  CreateQuestionRequest,
  CreateQuestionResponse,
  MockInterview,
  StartMockInterviewRequest,
  StartMockInterviewResponse,
  validateData,
  SearchQuestionsRequestSchema,
  createSuccessResponse,
  createErrorResponse
} from '@tech-interview-platform/shared-types';

// Example API service class using shared types
export class QuestionService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Search questions with proper typing
  async searchQuestions(params: SearchQuestionsRequest): Promise<Question[]> {
    // Validate request parameters
    const validatedParams = validateData(SearchQuestionsRequestSchema, params);
    
    const response = await fetch(`${this.baseUrl}/api/v1/questions?${new URLSearchParams(validatedParams as any)}`);
    const data: SearchQuestionsResponse = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch questions');
    }
    
    return data.data.data;
  }

  // Create question with validation
  async createQuestion(questionData: CreateQuestionRequest): Promise<Question> {
    const response = await fetch(`${this.baseUrl}/api/v1/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });
    
    const data: CreateQuestionResponse = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to create question');
    }
    
    return data.data;
  }

  // Get question by ID
  async getQuestionById(id: string): Promise<Question | null> {
    const response = await fetch(`${this.baseUrl}/api/v1/questions/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch question');
    }
    
    return data.data;
  }
}

// Example mock interview service
export class MockInterviewService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async startMockInterview(params: StartMockInterviewRequest): Promise<MockInterview> {
    const response = await fetch(`${this.baseUrl}/api/v1/mock-interviews/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data: StartMockInterviewResponse = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to start mock interview');
    }
    
    return data.data;
  }
}

// Example of creating type-safe API responses (for backend reference)
export function createQuestionResponse(question: Question) {
  return createSuccessResponse(question);
}

export function createQuestionErrorResponse(message: string) {
  return createErrorResponse('QUESTION_ERROR', message);
}