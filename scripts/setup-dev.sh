#!/bin/bash

# Tech Interview Platform - Development Setup Script

set -e

echo "🚀 Setting up Tech Interview Platform for development..."

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "📋 Checking required tools..."
check_tool "node"
check_tool "npm"
check_tool "bun"
check_tool "docker"
check_tool "docker-compose"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup client app
echo "🖥️ Setting up client app..."
cd apps/client
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created client .env.local from example"
fi
npm install
cd ../..

# Setup admin app
echo "👨‍💼 Setting up admin app..."
cd apps/admin
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created admin .env.local from example"
fi
npm install
cd ../..

# Setup backend
echo "⚙️ Setting up backend..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend .env from example"
fi
bun install
cd ..

# Setup shared packages
echo "📚 Setting up shared packages..."
cd packages/shared-types
npm install
npm run build
cd ../..

# Start infrastructure services
echo "🐳 Starting infrastructure services (PostgreSQL & Redis)..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
cd backend
bun run db:migrate
bun run db:seed
cd ..

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the backend: cd backend && bun run dev"
echo "2. Start the client: cd apps/client && npm run dev"
echo "3. Start the admin: cd apps/admin && npm run dev"
echo ""
echo "🌐 URLs:"
echo "- Client: http://localhost:3000"
echo "- Admin: http://localhost:3002"
echo "- Backend API: http://localhost:3001"
echo "- Database: postgresql://tech_user:tech_password@localhost:5432/tech_interview_platform"
echo "- Redis: redis://localhost:6379"