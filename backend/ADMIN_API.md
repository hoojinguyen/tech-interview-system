# Admin API Documentation

This document describes the admin API endpoints for the Tech Interview Platform backend.

## Authentication

All admin endpoints require JWT authentication with admin role privileges.

### Headers Required
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Generating Admin Tokens

For development/testing, you can generate admin tokens using:

```bash
# Set JWT_SECRET environment variable
export JWT_SECRET=your-secret-key

# Generate admin token
bun run admin:token
```

## Endpoints

### 1. GET /api/v1/admin/content

Get comprehensive content overview for admin dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": {
      "total": 1250,
      "approved": 1100,
      "pending": 150,
      "byDifficulty": {
        "easy": 400,
        "medium": 600,
        "hard": 250
      },
      "byType": {
        "coding": 800,
        "conceptual": 300,
        "system-design": 100,
        "behavioral": 50
      }
    },
    "roadmaps": {
      "total": 45,
      "byLevel": {
        "junior": 15,
        "mid": 20,
        "senior": 10
      }
    },
    "roles": {
      "total": 12
    },
    "mockInterviews": {
      "total": 5000,
      "completed": 4200,
      "active": 300,
      "abandoned": 500
    }
  },
  "message": "Content overview retrieved successfully",
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

### 2. POST /api/v1/admin/approve

Approve content (currently supports questions).

**Request Body:**
```json
{
  "type": "question",
  "id": "uuid-of-question"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Question approved successfully",
  "data": {
    "type": "question",
    "id": "uuid-of-question"
  },
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

### 3. DELETE /api/v1/admin/:type/:id

Delete content by type and ID.

**Parameters:**
- `type`: Content type (`question`, `roadmap`, `role`)
- `id`: UUID of the content to delete

**Example:**
```
DELETE /api/v1/admin/question/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "success": true,
  "message": "question deleted successfully",
  "data": {
    "type": "question",
    "id": "123e4567-e89b-12d3-a456-426614174000"
  },
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

### 4. PUT /api/v1/admin/questions/:id

Update a question.

**Parameters:**
- `id`: UUID of the question to update

**Request Body (all fields optional):**
```json
{
  "title": "Updated Question Title",
  "content": "Updated question content...",
  "type": "coding",
  "difficulty": "medium",
  "technologies": ["JavaScript", "React"],
  "roles": ["Frontend Developer"],
  "companies": ["Google", "Facebook"],
  "tags": ["algorithms", "data-structures"],
  "solution": {
    "explanation": "Solution explanation...",
    "codeExamples": [
      {
        "language": "javascript",
        "code": "function solution() { ... }",
        "explanation": "Code explanation..."
      }
    ],
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "alternativeApproaches": ["Alternative approach 1", "Alternative approach 2"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Question updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated Question Title",
    "difficulty": "medium"
  },
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

### 5. GET /api/v1/admin/analytics

Get comprehensive platform analytics and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalQuestions": 1250,
      "totalRoadmaps": 45,
      "totalRoles": 12,
      "totalMockInterviews": 5000
    },
    "questions": {
      "totalQuestions": 1250,
      "approvedQuestions": 1100,
      "pendingQuestions": 150,
      "averageRating": 4.2,
      "topTechnologies": [
        { "technology": "JavaScript", "count": 300 },
        { "technology": "Python", "count": 250 }
      ],
      "questionsByDifficulty": {
        "easy": 400,
        "medium": 600,
        "hard": 250
      },
      "questionsByType": {
        "coding": 800,
        "conceptual": 300,
        "system-design": 100,
        "behavioral": 50
      }
    },
    "mockInterviews": {
      "totalInterviews": 5000,
      "completedInterviews": 4200,
      "averageScore": 75.5,
      "completionRate": 84.0,
      "interviewsByLevel": {
        "junior": 2000,
        "mid": 2500,
        "senior": 500
      }
    },
    "usage": {
      "questionsViewedToday": 1500,
      "mockInterviewsStartedToday": 45,
      "topRoles": [
        { "role": "Frontend Developer", "count": 1200 },
        { "role": "Backend Developer", "count": 1000 }
      ]
    }
  },
  "message": "Platform analytics retrieved successfully",
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details (optional)",
    "timestamp": "2024-01-17T10:30:00.000Z"
  }
}
```

### Common Error Codes

- `MISSING_AUTH_HEADER`: Authorization header is missing
- `INVALID_AUTH_FORMAT`: Authorization header format is invalid
- `MISSING_TOKEN`: JWT token is missing
- `INVALID_TOKEN`: JWT token is invalid or malformed
- `TOKEN_EXPIRED`: JWT token has expired
- `INSUFFICIENT_PRIVILEGES`: User doesn't have admin privileges
- `INVALID_QUESTION_ID`: Question ID format is invalid
- `QUESTION_NOT_FOUND`: Question not found with given ID
- `INVALID_CONTENT_TYPE`: Invalid content type for deletion
- `CONTENT_NOT_FOUND`: Content not found with given ID
- `INVALID_UPDATE_DATA`: Invalid data provided for update

## Testing

Use the provided test script to verify all endpoints:

```bash
# Make sure backend is running
JWT_SECRET=test-secret-key bun run dev

# Run tests (in another terminal)
./test-admin-endpoints.sh
```

## Security Notes

1. **JWT Secret**: Always use a strong, unique JWT secret in production
2. **Token Expiration**: Tokens expire in 24 hours by default
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Admin endpoints are subject to rate limiting
5. **Audit Logging**: All admin actions are logged for audit purposes

## Cache Management

Admin operations automatically clear relevant caches to ensure data consistency:

- Content overview cache is cleared after approvals/deletions/updates
- Analytics cache is cleared after content changes
- Question-specific caches are cleared after question updates

Cache TTL is set to 5 minutes for admin data to balance performance and freshness.