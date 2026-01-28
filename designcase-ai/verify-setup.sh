#!/bin/bash

# DesignCase AI - Project Verification Script
# Verifies that Phase 1 setup is complete and working

set -e

echo "🔍 DesignCase AI - Project Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} File exists: $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Missing file: $1"
        ((FAILED++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directory exists: $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Missing directory: $1"
        ((FAILED++))
    fi
}

echo "📋 Checking Project Structure..."
echo ""

# Root files
check_file "package.json"
check_file "turbo.json"
check_file ".gitignore"
check_file ".env.example"
check_file ".prettierrc"
check_file ".eslintrc.json"
check_file "docker-compose.yml"

echo ""
echo "📚 Checking Documentation..."
check_file "README.md"
check_file "GETTING_STARTED.md"
check_file "QUICK_START.md"
check_file "ROADMAP.md"
check_file "CONTRIBUTING.md"
check_file "PHASE_1_COMPLETE.md"
check_file "PROJECT_SUMMARY.md"
check_file "CHECKLIST.md"

echo ""
echo "📱 Checking Frontend Structure..."
check_dir "apps/web"
check_file "apps/web/package.json"
check_file "apps/web/next.config.js"
check_file "apps/web/tailwind.config.ts"
check_file "apps/web/tsconfig.json"
check_dir "apps/web/app"
check_dir "apps/web/components"
check_dir "apps/web/lib"

echo ""
echo "🔌 Checking Backend Structure..."
check_dir "apps/api"
check_file "apps/api/package.json"
check_file "apps/api/tsconfig.json"
check_dir "apps/api/src"
check_dir "apps/api/prisma"
check_file "apps/api/prisma/schema.prisma"
check_file "apps/api/prisma/seed.ts"

echo ""
echo "📦 Checking Shared Packages..."
check_dir "packages/types"
check_dir "packages/ui"
check_dir "packages/utils"
check_dir "packages/config"

echo ""
echo "🛠️  Checking Tooling..."
check_dir "tooling/.github/workflows"
check_file "tooling/.github/workflows/ci.yml"
check_dir "tooling/scripts"

echo ""
echo "========================================"
echo "✅ Verification Results:"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Project structure is complete.${NC}"
    echo ""
    echo "📝 Next steps:"
    echo "1. Read GETTING_STARTED.md"
    echo "2. Run: cp .env.example .env.local"
    echo "3. Add your Supabase and Anthropic keys to .env.local"
    echo "4. Run: pnpm install"
    echo "5. Run: docker-compose up -d"
    echo "6. Run: pnpm setup"
    echo "7. Run: pnpm dev"
    echo ""
    echo "Your app will be ready at:"
    echo "  🌐 Frontend: http://localhost:3000"
    echo "  🔌 API: http://localhost:4000"
    echo "  📊 Database: Run 'pnpm db:studio'"
else
    echo -e "${RED}⚠️  Some files are missing. Please check above.${NC}"
    exit 1
fi
