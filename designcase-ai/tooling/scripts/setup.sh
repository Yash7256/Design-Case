#!/bin/bash

# DesignCase AI Setup Script
# Initializes the entire development environment

set -e

echo "🚀 DesignCase AI - Development Setup"
echo "===================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 18+ first."
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "⚠️  pnpm is not installed. Installing pnpm..."
  npm install -g pnpm@8.15.0
fi

echo "✓ Prerequisites check passed"
echo ""

# Copy .env files
echo "📝 Setting up environment variables..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✓ Created .env.local (please update with your credentials)"
else
  echo "✓ .env.local already exists"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✓ Dependencies installed"
echo ""

# Start Docker services
echo "🐳 Starting Docker services..."
if command -v docker &> /dev/null; then
  docker-compose up -d
  echo "✓ Docker services started"
  echo "   - PostgreSQL: localhost:5432"
  echo "   - Redis: localhost:6379"
else
  echo "⚠️  Docker is not installed. Please start PostgreSQL and Redis manually."
fi
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd apps/api
pnpm db:generate
cd ../..
echo "✓ Prisma client generated"
echo ""

# Run migrations
echo "📊 Running database migrations..."
pnpm db:push
echo "✓ Database migrations completed"
echo ""

# Seed database
echo "🌱 Seeding database..."
pnpm db:seed || true
echo "✓ Database seeded"
echo ""

echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Update .env.local with your Supabase and API credentials"
echo "   2. Run 'pnpm dev' to start development servers"
echo "   3. Frontend: http://localhost:3000"
echo "   4. Backend: http://localhost:4000"
echo "   5. Database: pnpm db:studio"
echo ""
echo "📖 Documentation: See README.md for more information"
