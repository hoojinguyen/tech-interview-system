# Tech Interview Platform - Development Commands

.PHONY: help start quick-start stop status logs clean install test

# Default target
help:
	@echo "Tech Interview Platform - Available Commands:"
	@echo ""
	@echo "🚀 Development:"
	@echo "  make start       - Start all services (full development environment)"
	@echo "  make quick       - Quick start (backend + Docker services only)"
	@echo "  make backend     - Start backend API only"
	@echo "  make stop        - Stop all services"
	@echo ""
	@echo "📊 Monitoring:"
	@echo "  make status      - Show service status"
	@echo "  make logs        - Show service logs"
	@echo "  make health      - Check API health"
	@echo ""
	@echo "🔧 Maintenance:"
	@echo "  make install     - Install all dependencies"
	@echo "  make clean       - Clean up containers and logs"
	@echo "  make test        - Run tests"
	@echo "  make lint        - Run linting"
	@echo ""
	@echo "🐳 Docker:"
	@echo "  make docker-up   - Start Docker services only"
	@echo "  make docker-down - Stop Docker services"
	@echo ""

# Start full development environment
start:
	@echo "🚀 Starting full development environment..."
	@./scripts/start-dev.sh

# Quick start (backend only)
quick:
	@echo "⚡ Quick starting backend services..."
	@./scripts/quick-start.sh

# Start backend only
backend:
	@echo "🔧 Starting backend API..."
	@docker compose up -d postgres redis
	@sleep 3
	@cd backend && bun run dev

# Stop all services
stop:
	@echo "🛑 Stopping all services..."
	@docker compose down
	@pkill -f "bun.*src/index.ts" || true
	@pkill -f "npm run dev" || true
	@echo "✅ All services stopped"

# Show service status
status:
	@echo "📊 Service Status:"
	@echo ""
	@echo "🐳 Docker Services:"
	@docker compose ps
	@echo ""
	@echo "🔍 Port Usage:"
	@lsof -i :3000,3001,3002 || echo "No services running on ports 3000-3002"

# Show logs
logs:
	@echo "📝 Service Logs:"
	@echo ""
	@echo "🐳 Docker Logs:"
	@docker compose logs --tail=50
	@echo ""
	@if [ -f "logs/backend.log" ]; then \
		echo "🔧 Backend Logs:"; \
		tail -20 logs/backend.log; \
	fi

# Check API health
health:
	@echo "🏥 Health Check:"
	@curl -s http://localhost:3002/health | jq . || echo "❌ Backend API not responding"
	@echo ""
	@curl -s http://localhost:3002/api/v1/status | jq .data || echo "❌ API status not available"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@cd backend && bun install
	@if [ -d "client" ]; then cd client && npm install; fi
	@if [ -d "admin" ]; then cd admin && npm install; fi
	@echo "✅ Dependencies installed"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	@docker compose down -v
	@rm -rf logs/*.log
	@echo "✅ Cleanup completed"

# Run tests
test:
	@echo "🧪 Running tests..."
	@cd backend && bun test

# Run linting
lint:
	@echo "🔍 Running linting..."
	@npm run lint

# Docker commands
docker-up:
	@echo "🐳 Starting Docker services..."
	@docker compose up -d postgres redis

docker-down:
	@echo "🐳 Stopping Docker services..."
	@docker compose down