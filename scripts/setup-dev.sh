#!/bin/bash

# Development Environment Setup Script
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_status "🔧 Setting up Tech Interview Platform development environment..."

# Create necessary directories
print_status "Creating directories..."
mkdir -p logs
mkdir -p scripts

# Make scripts executable
print_status "Making scripts executable..."
chmod +x scripts/*.sh

# Create environment files if they don't exist
print_status "Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    print_status "Creating backend .env file..."
    cp backend/.env.example backend/.env
    print_warning "Please update backend/.env with your configuration"
fi

# Install dependencies
print_status "Installing dependencies..."
cd backend && bun install && cd ..

if [ -d "client" ]; then
    cd client && npm install && cd ..
fi

if [ -d "admin" ]; then
    cd admin && npm install && cd ..
fi

# Pull Docker images
print_status "Pulling Docker images..."
docker compose pull

print_success "✅ Development environment setup completed!"
echo ""
echo "🚀 Quick start commands:"
echo "  make start       - Start full development environment"
echo "  make quick       - Quick start (backend only)"
echo "  npm run start    - Start full development environment"
echo "  ./scripts/start-dev.sh - Start with detailed logging"
echo ""
echo "📖 Run 'make help' for all available commands"