#!/bin/bash

# Tech Interview Platform - Development Startup Script
# This script starts all services needed for development

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within $max_attempts seconds"
    return 1
}

# Function to cleanup on exit
cleanup() {
    print_warning "Shutting down services..."
    
    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$CLIENT_PID" ]; then
        kill $CLIENT_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$ADMIN_PID" ]; then
        kill $ADMIN_PID 2>/dev/null || true
    fi
    
    # Stop Docker services
    print_status "Stopping Docker services..."
    docker compose down
    
    print_success "Cleanup completed"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

print_status "🚀 Starting Tech Interview Platform Development Environment"
echo "=================================================="

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists bun; then
    print_error "Bun is not installed. Please install Bun first."
    print_status "Install with: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_success "All prerequisites are installed"

# Check if ports are available
print_status "Checking port availability..."

if port_in_use 3000; then
    print_warning "Port 3000 is in use. Client app may not start properly."
fi

if port_in_use 3001; then
    print_warning "Port 3001 is in use. Admin app may not start properly."
fi

if port_in_use 3002; then
    print_warning "Port 3002 is in use. Backend API may not start properly."
fi

# Start Docker services
print_status "Starting Docker services (PostgreSQL & Redis)..."
docker compose up -d postgres redis

# Wait for Docker services to be healthy
print_status "Waiting for Docker services to be ready..."
sleep 5

# Check Docker service health
if ! docker compose ps | grep -q "healthy"; then
    print_warning "Some Docker services may not be fully ready yet"
fi

# Install dependencies if needed
print_status "Installing dependencies..."

if [ ! -d "node_modules" ]; then
    print_status "Installing all dependencies with Yarn..."
    if command -v yarn >/dev/null 2>&1; then
        yarn install
    else
        print_warning "Yarn not found, falling back to npm..."
        if [ ! -d "backend/node_modules" ]; then
            cd backend && bun install && cd ..
        fi
        if [ ! -d "apps/client/node_modules" ]; then
            cd apps/client && npm install && cd ..
        fi
        if [ ! -d "apps/admin/node_modules" ]; then
            cd apps/admin && npm install && cd ..
        fi
    fi
fi

# Start Backend API
print_status "Starting Backend API (Port 3002)..."
cd backend
bun run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
wait_for_service "Backend API" "http://localhost:3002/health"

# Start Client App
if [ -d "client" ]; then
    print_status "Starting Client App (Port 3000)..."
    cd client
    npm run dev > ../logs/client.log 2>&1 &
    CLIENT_PID=$!
    cd ..
    
    # Wait for client to be ready
    sleep 3
    if port_in_use 3000; then
        print_success "Client app is starting on http://localhost:3000"
    else
        print_warning "Client app may have failed to start"
    fi
fi

# Start Admin App
if [ -d "admin" ]; then
    print_status "Starting Admin App (Port 3001)..."
    cd admin
    npm run dev > ../logs/admin.log 2>&1 &
    ADMIN_PID=$!
    cd ..
    
    # Wait for admin to be ready
    sleep 3
    if port_in_use 3001; then
        print_success "Admin app is starting on http://localhost:3001"
    else
        print_warning "Admin app may have failed to start"
    fi
fi

# Display status
echo ""
print_success "🎉 Tech Interview Platform is now running!"
echo "=================================================="
echo "📊 Backend API:    http://localhost:3002"
echo "📊 Health Check:   http://localhost:3002/health"
echo "📊 API Status:     http://localhost:3002/api/v1/status"

if [ ! -z "$CLIENT_PID" ]; then
    echo "🌐 Client App:     http://localhost:3000"
fi

if [ ! -z "$ADMIN_PID" ]; then
    echo "⚙️  Admin App:      http://localhost:3001"
fi

echo "🐳 Docker Services: docker compose ps"
echo "📝 Logs Directory:  ./logs/"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=================================================="

# Keep script running and show logs
print_status "Monitoring services... (Press Ctrl+C to stop)"

# Create logs directory if it doesn't exist
mkdir -p logs

# Follow logs in the background
tail -f logs/backend.log &
TAIL_PID=$!

# Wait for user interrupt
wait

# Cleanup will be called by trap