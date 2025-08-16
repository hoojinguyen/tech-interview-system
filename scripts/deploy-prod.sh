#!/bin/bash

# Tech Interview Platform - Production Deployment Script

set -e

echo "🚀 Deploying Tech Interview Platform to production..."

# Check if required environment variables are set
check_env_var() {
    if [ -z "${!1}" ]; then
        echo "❌ Environment variable $1 is not set"
        exit 1
    fi
}

echo "📋 Checking required environment variables..."
check_env_var "VERCEL_TOKEN"
check_env_var "VERCEL_ORG_ID"
check_env_var "VERCEL_CLIENT_PROJECT_ID"
check_env_var "VERCEL_ADMIN_PROJECT_ID"
check_env_var "DOCKER_USERNAME"
check_env_var "DOCKER_PASSWORD"

# Build and test
echo "🔨 Building and testing applications..."

# Test backend
echo "🧪 Testing backend..."
cd backend
bun test
cd ..

# Build client app
echo "🖥️ Building client app..."
cd apps/client
npm run build
cd ../..

# Build admin app
echo "👨‍💼 Building admin app..."
cd apps/admin
npm run build
cd ../..

# Build and push Docker image
echo "🐳 Building and pushing Docker image..."
cd backend
docker build -t $DOCKER_USERNAME/tech-interview-backend:latest .
echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
docker push $DOCKER_USERNAME/tech-interview-backend:latest
cd ..

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."

# Deploy client
echo "🖥️ Deploying client app..."
cd apps/client
npx vercel --token $VERCEL_TOKEN --prod --yes
cd ../..

# Deploy admin
echo "👨‍💼 Deploying admin app..."
cd apps/admin
npx vercel --token $VERCEL_TOKEN --prod --yes
cd ../..

echo "✅ Production deployment complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update your cloud provider to use the new Docker image:"
echo "   $DOCKER_USERNAME/tech-interview-backend:latest"
echo "2. Run database migrations on production"
echo "3. Verify all services are running correctly"
echo "4. Update DNS records if needed"