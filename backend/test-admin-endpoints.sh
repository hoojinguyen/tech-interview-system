#!/bin/bash

# Test script for admin endpoints
# Make sure the backend is running with: JWT_SECRET=test-secret-key bun run dev

BASE_URL="http://localhost:3002/api/v1"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLWlkIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZWNoaW50ZXJ2aWV3LnBsYXRmb3JtIiwiaWF0IjoxNzU1NDM3NjY2LCJleHAiOjE3NTU1MjQwNjYsImF1ZCI6ImFkbWluLXBhbmVsIiwiaXNzIjoidGVjaC1pbnRlcnZpZXctcGxhdGZvcm0ifQ.ci3dIT94DkX72SQw5RDfp_DCO-tH_r6dDLgPMzcGPR8"

echo "🧪 Testing Admin API Endpoints"
echo "================================"

echo ""
echo "1. Testing GET /admin/content (Content Overview)"
echo "------------------------------------------------"
curl -s -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     "$BASE_URL/admin/content" | jq '.'

echo ""
echo "2. Testing GET /admin/analytics (Platform Analytics)"
echo "---------------------------------------------------"
curl -s -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     "$BASE_URL/admin/analytics" | jq '.'

echo ""
echo "3. Testing POST /admin/approve (Approve Content)"
echo "-----------------------------------------------"
curl -s -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"type": "question", "id": "00000000-0000-0000-0000-000000000000"}' \
     "$BASE_URL/admin/approve" | jq '.'

echo ""
echo "4. Testing PUT /admin/questions/:id (Update Question)"
echo "----------------------------------------------------"
curl -s -X PUT \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "Updated Question Title", "difficulty": "medium"}' \
     "$BASE_URL/admin/questions/00000000-0000-0000-0000-000000000000" | jq '.'

echo ""
echo "5. Testing DELETE /admin/question/:id (Delete Content)"
echo "-----------------------------------------------------"
curl -s -X DELETE \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     "$BASE_URL/admin/question/00000000-0000-0000-0000-000000000000" | jq '.'

echo ""
echo "6. Testing without Authorization (Should fail)"
echo "---------------------------------------------"
curl -s -H "Content-Type: application/json" \
     "$BASE_URL/admin/content" | jq '.'

echo ""
echo "✅ Admin API endpoint tests completed!"