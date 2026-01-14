#!/bin/bash

# Setup Verification Script for Zenly Backend
# This script checks if all required files and dependencies are in place

echo "🔍 Zenly Backend - Setup Verification"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark="${GREEN}✓${NC}"
cross_mark="${RED}✗${NC}"
warning="${YELLOW}⚠${NC}"

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    node_version=$(node -v)
    echo -e "${check_mark} Node.js installed: $node_version"
else
    echo -e "${cross_mark} Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    npm_version=$(npm -v)
    echo -e "${check_mark} npm installed: $npm_version"
else
    echo -e "${cross_mark} npm not found"
    exit 1
fi

# Check PostgreSQL
echo ""
echo "🗄️  Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    psql_version=$(psql --version)
    echo -e "${check_mark} PostgreSQL installed: $psql_version"
else
    echo -e "${warning} PostgreSQL not found. You'll need it for the database."
fi

# Check package.json
echo ""
echo "📄 Checking project files..."
if [ -f "package.json" ]; then
    echo -e "${check_mark} package.json exists"
else
    echo -e "${cross_mark} package.json not found"
    exit 1
fi

# Check node_modules
if [ -d "node_modules" ]; then
    echo -e "${check_mark} node_modules exists"
else
    echo -e "${warning} node_modules not found. Run: npm install"
fi

# Check .env
if [ -f ".env" ]; then
    echo -e "${check_mark} .env exists"
else
    echo -e "${warning} .env not found. Copy from .env.example"
fi

# Check Prisma schema
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${check_mark} prisma/schema.prisma exists"
else
    echo -e "${cross_mark} Prisma schema not found"
    exit 1
fi

# Check source files
echo ""
echo "💻 Checking source code..."
required_files=(
    "src/main.ts"
    "src/app.module.ts"
    "src/prisma.service.ts"
    "src/auth/auth.module.ts"
    "src/users/users.module.ts"
    "src/friends/friends.module.ts"
    "src/location/location.module.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${check_mark} $file"
    else
        echo -e "${cross_mark} $file not found"
    fi
done

# Check TypeScript config
echo ""
echo "⚙️  Checking configuration..."
config_files=(
    "tsconfig.json"
    "nest-cli.json"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${check_mark} $file"
    else
        echo -e "${cross_mark} $file not found"
    fi
done

# Check documentation
echo ""
echo "📚 Checking documentation..."
doc_files=(
    "README.md"
    "API_DOCS.md"
    "QUICKSTART.md"
    "DEVELOPMENT.md"
    "SUMMARY.md"
    "PROJECT_STRUCTURE.md"
)

doc_count=0
for file in "${doc_files[@]}"; do
    if [ -f "$file" ]; then
        ((doc_count++))
    fi
done

echo -e "${check_mark} $doc_count/6 documentation files present"

# Summary
echo ""
echo "======================================"
echo "📊 Summary"
echo "======================================"

if [ -d "node_modules" ] && [ -f ".env" ]; then
    echo -e "${GREEN}Status: Ready to start!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update .env with your database credentials"
    echo "2. Run: npm run prisma:generate"
    echo "3. Run: npm run prisma:migrate"
    echo "4. Run: npm run start:dev"
else
    echo -e "${YELLOW}Status: Setup required${NC}"
    echo ""
    echo "Next steps:"
    if [ ! -d "node_modules" ]; then
        echo "1. Run: npm install"
    fi
    if [ ! -f ".env" ]; then
        echo "2. Run: cp .env.example .env"
        echo "3. Update .env with your database credentials"
    fi
    echo "4. Run: npm run prisma:generate"
    echo "5. Run: npm run prisma:migrate"
    echo "6. Run: npm run start:dev"
fi

echo ""
echo "📖 For help, read: README.md or QUICKSTART.md"
echo ""

