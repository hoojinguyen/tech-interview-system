#!/bin/bash

# Quick start script - minimal setup
set -e

echo "🚀 Quick Starting Tech Interview Platform..."

# Start Docker services
echo "📦 Starting Docker services..."
docker compose up -d postgres redis

# Wait a moment for services to start
sleep 3

# Start backend
echo "🔧 Starting Backend API..."
cd backend
bun run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

echo ""
echo "✅ Services started!"
echo "📊 Backend API: http://localhost:3002/health"
echo "📊 API Status:  http://localhost:3002/api/v1/status"
echo ""
echo "Press Ctrl+C to stop"

# Wait for user interrupt
trap 'echo "Stopping services..."; kill $BACKEND_PID 2>/dev/null; docker compose down; exit 0' SIGINT SIGTERM

wait $BACKEND_PID