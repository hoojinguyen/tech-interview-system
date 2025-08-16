// Example of using shared types in backend route handlers
import { Hono } from 'hono';
import {
  Question,
  CreateQuestionRequest,
  CreateQuestionResponse,
  SearchQuestionsRequest,
  SearchQuestionsResponse,
  CreateQuestionRequestSchema,
  SearchQuestionsRequestSchema,
  validateData,
  safeValidateData,
  createSuccessResponse,
  createErrorResponse,
  formatValidationError,
  calculatePagination,
  validatePaginationParams
} from '@tech-interview-platform/shared-types';

const app = new Hono();

// Example route: Create question with validation
app.post('/questions', async (c) => {
  try {
    // Get request body
    const body = await c.req.json();
    
    // Validate request data using shared schema
    const validationResult = safeValidateData(CreateQuestionRequestSchema, body);
    
    if (!validationResult.success) {
      const errorMessage = formatValidationError(validationResult.error);
      return c.json(createErrorResponse('VALIDATION_ERROR', errorMessage), 400);
    }
    
    const questionData: CreateQuestionRequest = validationResult.data;
    
    // TODO: Save to database using Drizzle ORM
    // const newQuestion = await db.insert(questions).values(questionData).returning();
    
    // Mock response for example
    const mockQuestion: Question = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: questionData.title,
      content: questionData.content,
      type: questionData.type,
      difficulty: questionData.difficulty,
      technologies: questionData.technologies,
      roles: questionData.roles,
      companies: questionData.companies || [],
      tags: questionData.tags || [],
      solution: questionData.solution || null,
      rating: '0.00',
      ratingCount: 0,
      submittedBy: questionData.submittedBy || null,
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const response: CreateQuestionResponse = createSuccessResponse(mockQuestion);
    return c.json(response, 201);
    
  } catch (error) {
    console.error('Error creating question:', error);
    return c.json(createErrorResponse('INTERNAL_ERROR', 'Failed to create question'), 500);
  }
});

// Example route: Search questions with pagination
app.get('/questions', async (c) => {
  try {
    // Get query parameters
    const queryParams = c.req.query();
    
    // Convert query params to proper types
    const searchParams = {
      ...queryParams,
      page: queryParams.page ? parseInt(queryParams.page) : undefined,
      limit: queryParams.limit ? parseInt(queryParams.limit) : undefined,
      technologies: queryParams.technologies ? queryParams.technologies.split(',') : undefined,
      roles: queryParams.roles ? queryParams.roles.split(',') : undefined,
      difficulty: queryParams.difficulty ? queryParams.difficulty.split(',') : undefined,
      type: queryParams.type ? queryParams.type.split(',') : undefined,
    };
    
    // Validate search parameters
    const validationResult = safeValidateData(SearchQuestionsRequestSchema, searchParams);
    
    if (!validationResult.success) {
      const errorMessage = formatValidationError(validationResult.error);
      return c.json(createErrorResponse('VALIDATION_ERROR', errorMessage), 400);
    }
    
    const searchRequest: SearchQuestionsRequest = validationResult.data;
    
    // Validate and normalize pagination
    const { page, limit, offset } = validatePaginationParams(searchRequest.page, searchRequest.limit);
    
    // TODO: Query database with filters
    // const questions = await db.select().from(questionsTable)
    //   .where(/* build where conditions from searchRequest */)
    //   .limit(limit)
    //   .offset(offset);
    
    // Mock response for example
    const mockQuestions: Question[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Implement a debounce function',
        content: 'Write a function that debounces another function...',
        type: 'coding',
        difficulty: 'medium',
        technologies: ['JavaScript'],
        roles: ['Frontend Developer'],
        companies: ['Google'],
        tags: ['functions', 'timing'],
        solution: null,
        rating: '4.50',
        ratingCount: 10,
        submittedBy: null,
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const total = 1; // Mock total count
    const pagination = calculatePagination(page, limit, total);
    
    const response: SearchQuestionsResponse = createSuccessResponse({
      data: mockQuestions,
      pagination
    });
    
    return c.json(response);
    
  } catch (error) {
    console.error('Error searching questions:', error);
    return c.json(createErrorResponse('INTERNAL_ERROR', 'Failed to search questions'), 500);
  }
});

// Example route: Get question by ID
app.get('/questions/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return c.json(createErrorResponse('INVALID_ID', 'Invalid question ID format'), 400);
    }
    
    // TODO: Query database
    // const question = await db.select().from(questionsTable).where(eq(questionsTable.id, id));
    
    // Mock response - question not found
    return c.json(createErrorResponse('NOT_FOUND', 'Question not found'), 404);
    
  } catch (error) {
    console.error('Error fetching question:', error);
    return c.json(createErrorResponse('INTERNAL_ERROR', 'Failed to fetch question'), 500);
  }
});

export default app;