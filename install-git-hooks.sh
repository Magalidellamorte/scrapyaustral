#!/bin/bash

# Git Hooks Installation Script for Scrapy Laravel Backend
# This script installs the pre-push hook to ensure code quality

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${BLUE}${BOLD}🔧 Installing Git Hooks for Laravel Backend...${RESET}"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo -e "${RED}❌ Not in a Git repository! Please run this from the project root.${RESET}"
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Install pre-push hook
if [ -f "pre-push-laravel" ]; then
  cp pre-push-laravel .git/hooks/pre-push
  chmod +x .git/hooks/pre-push
  echo -e "${GREEN}✅ Pre-push hook installed successfully!${RESET}"
else
  echo -e "${RED}❌ pre-push-laravel script not found!${RESET}"
  exit 1
fi

echo ""
echo -e "${YELLOW}📋 What this hook does:${RESET}"
echo "   • Prevents direct pushes to main/master/dev/develop branches"
echo "   • Validates composer.json"
echo "   • Checks PHP syntax"
echo "   • Runs PHP-CS-Fixer formatting check"
echo "   • Runs PHPStan static analysis"
echo "   • Validates Laravel configuration"
echo "   • (Optional) Runs PHPUnit tests"

echo ""
echo -e "${YELLOW}💡 Usage:${RESET}"
echo "   The hook will run automatically on 'git push'"
echo "   To bypass the hook (not recommended): git push --no-verify"

echo ""
echo -e "${YELLOW}🛠️  Setup commands for development:${RESET}"
echo "   cd backend"
echo "   composer install"
echo "   cp .env.example .env"
echo "   php artisan key:generate"

echo ""
echo -e "${GREEN}${BOLD}🎉 Git hooks installation complete!${RESET}"
echo -e "${GREEN}Your Laravel code will now be checked before each push.${RESET}"
echo ""
