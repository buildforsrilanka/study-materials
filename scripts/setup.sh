#!/bin/bash

# Pre-commit hook setup script
# This script helps developers set up their environment for development

set -e

echo "🚀 Setting up Study Materials Platform development environment..."
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "  Node.js version: $NODE_VERSION"

# Install dependencies
echo "✓ Installing dependencies..."
npm install

# Setup Husky
echo "✓ Setting up Git hooks with Husky..."
npm run prepare

# Make hooks executable (for Unix-based systems)
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
  chmod +x .husky/pre-commit
  chmod +x .husky/commit-msg
  chmod +x .husky/prepare-commit-msg
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Copy .env.example to .env.local"
echo "  2. Fill in your Supabase credentials in .env.local"
echo "  3. Run 'npm run dev' to start the development server"
echo ""
echo "📚 Documentation:"
echo "  - README: https://github.com/buildforsrilanka/study-materials/blob/main/README.md"
echo "  - Contributing: https://github.com/buildforsrilanka/study-materials/blob/main/CONTRIBUTING.md"
echo ""
