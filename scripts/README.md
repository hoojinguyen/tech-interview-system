# Development Scripts

This directory contains scripts to easily run and manage the Tech Interview Platform development environment.

## 🚀 Quick Start Commands

### Option 1: Using Make (Recommended)
```bash
# Show all available commands
make help

# Quick start (backend + Docker services only)
make quick

# Full development environment
make start

# Stop all services
make stop

# Check service status
make status

# View logs
make logs

# Health check
make health
```

### Option 2: Using npm/bun scripts
```bash
# Quick start
npm run start:quick

# Full development environment  
npm run start

# Backend only
npm run dev:backend-only
```

### Option 3: Direct script execution
```bash
# Quick start
./scripts/quick-start.sh

# Full development environment
./scripts/start-dev.sh

# Setup development environment
./scripts/setup-dev.sh
```

## 📋 Available Scripts

### `start-dev.sh`
**Full development environment startup**
- Starts Docker services (PostgreSQL, Redis)
- Starts Backend API (port 3002)
- Starts Client app (port 3000) if available
- Starts Admin app (port 3001) if available
- Provides comprehensive logging and monitoring
- Handles graceful shutdown

### `quick-start.sh`
**Minimal startup for backend development**
- Starts Docker services (PostgreSQL, Redis)
- Starts Backend API (port 3002)
- Lightweight and fast startup
- Perfect for API development and testing

### `setup-dev.sh`
**One-time development environment setup**
- Creates necessary directories
- Sets up environment files
- Installs dependencies
- Pulls Docker images
- Makes scripts executable

## 🔧 What Each Command Does

| Command | Docker Services | Backend API | Client App | Admin App | Use Case |
|---------|----------------|-------------|------------|-----------|----------|
| `make quick` | ✅ | ✅ | ❌ | ❌ | API development |
| `make start` | ✅ | ✅ | ✅ | ✅ | Full stack development |
| `make backend` | ✅ | ✅ | ❌ | ❌ | Backend only |
| `npm run dev:backend-only` | ✅ | ✅ | ❌ | ❌ | Backend only |

## 📊 Service URLs

When services are running, you can access:

- **Backend API**: http://localhost:3002
- **Health Check**: http://localhost:3002/health
- **API Status**: http://localhost:3002/api/v1/status
- **Client App**: http://localhost:3000 (if available)
- **Admin App**: http://localhost:3001 (if available)

## 🐳 Docker Services

The scripts automatically manage these Docker services:
- **PostgreSQL**: Database (port 5432)
- **Redis**: Cache and rate limiting (port 6379)

## 📝 Logging

Logs are stored in the `logs/` directory:
- `backend.log` - Backend API logs
- `client.log` - Client app logs (if available)
- `admin.log` - Admin app logs (if available)

## 🛠️ Troubleshooting

### Port Already in Use
If you get port conflicts:
```bash
# Check what's using the ports
make status

# Stop all services
make stop

# Or manually kill processes
pkill -f "bun.*src/index.ts"
pkill -f "npm run dev"
```

### Docker Issues
```bash
# Reset Docker services
make docker-down
make docker-up

# Or clean everything
make clean
```

### Dependencies Issues
```bash
# Reinstall dependencies
make install

# Or manually
cd backend && bun install
cd client && npm install  # if exists
cd admin && npm install   # if exists
```

## 🔍 Prerequisites

Make sure you have installed:
- **Docker** - For PostgreSQL and Redis
- **Bun** - For backend development
- **Node.js** - For client/admin apps (if available)

## 🎯 Recommended Workflow

1. **First time setup**:
   ```bash
   ./scripts/setup-dev.sh
   ```

2. **Daily development**:
   ```bash
   make quick  # For backend development
   # or
   make start  # For full stack development
   ```

3. **Testing the API**:
   ```bash
   make health  # Check if API is working
   make logs    # View recent logs
   ```

4. **End of day**:
   ```bash
   make stop    # Stop all services
   ```