#!/bin/bash

# DesignCase AI - Authentication Setup Script
# This script helps set up Supabase environment variables

set -e

echo "=================================="
echo "DesignCase AI - Auth Setup"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "apps/web/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Check if .env.local already exists
if [ -f "apps/web/.env.local" ]; then
    echo "⚠️  apps/web/.env.local already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping environment setup"
        exit 0
    fi
fi

echo "📋 Please get your Supabase credentials from:"
echo "   https://app.supabase.com → Your Project → Settings → API"
echo ""

# Prompt for credentials
read -p "Enter NEXT_PUBLIC_SUPABASE_URL (e.g., https://xxx.supabase.co): " supabase_url

if [ -z "$supabase_url" ]; then
    echo "❌ Supabase URL cannot be empty"
    exit 1
fi

read -p "Enter NEXT_PUBLIC_SUPABASE_ANON_KEY: " anon_key

if [ -z "$anon_key" ]; then
    echo "❌ Anon key cannot be empty"
    exit 1
fi

read -p "Enter SUPABASE_SERVICE_ROLE_KEY: " service_role_key

if [ -z "$service_role_key" ]; then
    echo "❌ Service role key cannot be empty"
    exit 1
fi

# Create .env.local
cat > apps/web/.env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key
SUPABASE_SERVICE_ROLE_KEY=$service_role_key

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000
EOF

echo ""
echo "✅ Environment variables configured!"
echo "   File: apps/web/.env.local"
echo ""

# Check for dependencies
echo "📦 Checking dependencies..."
cd apps/web

if ! npm list @supabase/ssr > /dev/null 2>&1; then
    echo "Installing @supabase/ssr..."
    npm install @supabase/ssr
fi

if ! npm list @supabase/supabase-js > /dev/null 2>&1; then
    echo "Installing @supabase/supabase-js..."
    npm install @supabase/supabase-js
fi

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🚀 Next steps:"
echo "   1. cd apps/web"
echo "   2. npm run dev"
echo "   3. Open http://localhost:3000"
echo "   4. Try signing up at /signup"
echo ""
echo "📖 For more info: see QUICK_START_AUTH.md or AUTH_SETUP.md"
