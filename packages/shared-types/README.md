# Shared Types Package

This package contains all TypeScript interfaces, types, and validation schemas shared between the frontend and backend applications of the Tech Interview Platform.

## Overview

The shared types package provides:

- **TypeScript Interfaces**: Type definitions for all data models
- **API Types**: Request/response type definitions for all API endpoints
- **Validation Schemas**: Zod schemas for runtime validation
- **Utility Functions**: Helper functions for validation and data transformation

## Installation

```bash
npm install @tech-interview-platform/shared-types
```

## Usage

### Basic Types

```typescript
import { Role, Question, Roadmap, MockInterview } from '@tech-interview-platform/shared-types';

// Use the interfaces for type safety
const role: Role = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Senior Frontend Developer',
  description: 'Expert in modern frontend technologies',
  technologies: ['React', 'TypeScript', 'Next.js'],
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### API Types

```typescript
import { 
  SearchQuestionsRequest, 
  SearchQuestionsResponse,
  CreateQuestionRequest 
} from '@tech-interview-platform/shared-types';

// Frontend API calls
const searchRequest: SearchQuestionsRequest = {
  technologies: ['React', 'JavaScript'],
  difficulty: ['medium', 'hard'],
  page: 1,
  limit: 20
};

// Backend response typing
const response: SearchQuestionsResponse = {
  success: true,
  data: {
    data: questions,
    pagination: {
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5,
      hasNext: true,
      hasPrev: false
    }
  }
};
```

### Validation Schemas

```typescript
import { 
  QuestionSchema, 
  CreateQuestionRequestSchema,
  validateData,
  safeValidateData 
} from '@tech-interview-platform/shared-types';

// Validate incoming data
try {
  const validatedQuestion = validateData(QuestionSchema, rawData);
  console.log('Valid question:', validatedQuestion);
} catch (error) {
  console.error('Validation failed:', error);
}

// Safe validation with error handling
const result = safeValidateData(CreateQuestionRequestSchema, requestBody);
if (result.success) {
  // Use result.data
  console.log('Valid request:', result.data);
} else {
  // Handle result.error
  console.error('Validation errors:', result.error.errors);
}
```

### Utility Functions

```typescript
import { 
  createSuccessResponse,
  createErrorResponse,
  formatValidationError,
  transformDatabaseDates,
  calculatePagination
} from '@tech-interview-platform/shared-types';

// Create API responses
const successResponse = createSuccessResponse(data);
const errorResponse = createErrorResponse('VALIDATION_ERROR', 'Invalid input');

// Transform database dates
const transformedData = transformDatabaseDates(rawDatabaseRecord);

// Calculate pagination
const pagination = calculatePagination(1, 20, 100);
```

## File Structure

```
src/
├── index.ts          # Main exports
├── models.ts         # Core data model interfaces
├── api.ts           # API request/response types
├── common.ts        # Common types and enums
├── validation.ts    # Zod validation schemas
└── utils.ts         # Utility functions
```

## Core Models

### Role
Represents a job role (e.g., Frontend Developer, Backend Engineer)

### Roadmap
Learning path for a specific role and experience level

### Topic
Individual learning topic within a roadmap

### Question
Interview question with metadata and solutions

### MockInterview
Mock interview session with questions and scoring

### InterviewQuestion
Individual question within a mock interview

## API Types

All API endpoints have corresponding request/response types:

- **Roles API**: `GetRolesResponse`
- **Roadmaps API**: `GetRoadmapsByRoleRequest/Response`, `GetRoadmapByIdRequest/Response`
- **Questions API**: `SearchQuestionsRequest/Response`, `CreateQuestionRequest/Response`
- **Mock Interviews API**: `StartMockInterviewRequest/Response`, `SubmitAnswerRequest/Response`
- **Admin API**: `ApproveQuestionRequest/Response`, `GetPlatformStatsResponse`

## Validation Schemas

Every model and API request has a corresponding Zod schema for validation:

- Model schemas: `RoleSchema`, `QuestionSchema`, `RoadmapSchema`, etc.
- Request schemas: `CreateQuestionRequestSchema`, `SearchQuestionsRequestSchema`, etc.
- Common schemas: `UuidSchema`, `EmailSchema`, `PaginationParamsSchema`

## Enums and Constants

```typescript
import { Difficulty, QuestionType, Level, InterviewStatus } from '@tech-interview-platform/shared-types';

// Use type-safe enums
const difficulty: Difficulty = 'medium';
const questionType: QuestionType = 'coding';
const level: Level = 'senior';
const status: InterviewStatus = 'active';
```

## Best Practices

### Frontend Usage

```typescript
// Always use the shared types for API calls
import { SearchQuestionsRequest, Question } from '@tech-interview-platform/shared-types';

async function searchQuestions(params: SearchQuestionsRequest): Promise<Question[]> {
  const response = await api.get('/questions', { params });
  return response.data.data;
}
```

### Backend Usage

```typescript
// Validate incoming requests
import { CreateQuestionRequestSchema, validateData } from '@tech-interview-platform/shared-types';

app.post('/questions', async (c) => {
  try {
    const validatedData = validateData(CreateQuestionRequestSchema, await c.req.json());
    // Process validatedData...
  } catch (error) {
    return c.json(createErrorResponse('VALIDATION_ERROR', 'Invalid request data'), 400);
  }
});
```

### Database Integration

```typescript
// Transform database results to match TypeScript interfaces
import { transformDatabaseDates, Question } from '@tech-interview-platform/shared-types';

const rawQuestion = await db.select().from(questions).where(eq(questions.id, id));
const question: Question = transformDatabaseDates(rawQuestion[0]);
```

## Development

### Building

```bash
npm run build
```

### Watching for Changes

```bash
npm run dev
```

## Contributing

When adding new types or schemas:

1. Add the TypeScript interface to the appropriate file (`models.ts`, `api.ts`, etc.)
2. Create a corresponding Zod schema in `validation.ts`
3. Export both from `index.ts`
4. Update this README with usage examples
5. Run `npm run build` to ensure everything compiles

## Type Safety

This package ensures type safety across the entire application:

- Frontend components receive properly typed data
- API endpoints validate requests and responses
- Database operations use consistent types
- Validation happens at runtime with Zod schemas

All types are derived from the database schema to ensure consistency between the data layer and application layer.