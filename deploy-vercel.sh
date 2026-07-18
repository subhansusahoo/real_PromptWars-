#!/bin/bash

# HabitBreaker - Vercel Deployment Helper Script
# This script helps prepare your application for Vercel deployment

set -e

echo "🚀 HabitBreaker AI - Vercel Deployment Helper"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
        echo "Install it with: npm install -g vercel"
        return 1
    fi
    echo -e "${GREEN}✓ Vercel CLI found${NC}"
    return 0
}

# Check if code is committed
check_git_status() {
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✓ Git repository clean${NC}"
        return 0
    else
        echo -e "${RED}✗ Uncommitted changes detected${NC}"
        echo "Please commit all changes: git add . && git commit -m 'message'"
        return 1
    fi
}

# Verify TypeScript compilation
verify_build() {
    echo ""
    echo -e "${BLUE}🔨 Verifying build...${NC}"
    npm run type-check
    npm run lint
    npm run build
    echo -e "${GREEN}✓ Build successful${NC}"
}

# Prepare for deployment
prepare_deployment() {
    echo ""
    echo -e "${BLUE}📦 Preparing for deployment...${NC}"
    
    # Ensure dependencies are installed
    npm install
    
    # Generate Prisma client
    npm run prisma:generate
    
    # Build the application
    npm run build
    
    echo -e "${GREEN}✓ Deployment preparation complete${NC}"
}

# Step 1: Prerequisites
echo -e "${BLUE}Step 1: Checking Prerequisites${NC}"
echo "==============================="

check_git_status || exit 1
verify_build

# Step 2: Prepare for Deployment
echo ""
echo -e "${BLUE}Step 2: Preparing Application${NC}"
echo "=============================="

prepare_deployment

# Step 3: Deployment Instructions
echo ""
echo -e "${GREEN}✅ Application is ready for Vercel deployment!${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Push to GitHub:"
echo -e "   ${YELLOW}git push origin main${NC}"
echo ""
echo "2. Create PostgreSQL Database:"
echo "   - Go to https://vercel.com/storage (or your preferred provider)"
echo "   - Create a PostgreSQL database"
echo "   - Copy the connection string"
echo ""
echo "3. Deploy to Vercel:"
echo -e "   ${YELLOW}vercel deploy --prod${NC}"
echo ""
echo "4. Configure Environment Variables:"
echo "   - Go to your Vercel project → Settings → Environment Variables"
echo "   - Add these variables for Production:"
echo ""
echo "     DATABASE_URL=postgresql://..."
echo "     OPENAI_API_KEY=sk-..."
echo "     JWT_SECRET=..."
echo "     CORS_ORIGIN=https://your-domain.vercel.app"
echo "     APP_URL=https://your-domain.vercel.app"
echo ""
echo "5. Run Database Migrations:"
echo -e "   ${YELLOW}vercel env pull${NC}"
echo -e "   ${YELLOW}npm run prisma:migrate:prod${NC}"
echo ""
echo "6. Verify Deployment:"
echo "   - Visit https://your-project.vercel.app"
echo "   - Test registration and login"
echo "   - Test habit creation and tracking"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  - VERCEL_DEPLOYMENT.md - Comprehensive deployment guide"
echo "  - DATABASE_SETUP.md - Database configuration"
echo "  - DEPLOYMENT_CHECKLIST.md - Pre-deployment checklist"
echo ""
echo -e "${GREEN}🎉 Ready to deploy! Follow the steps above.${NC}"
echo ""
