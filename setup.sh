#!/bin/bash

# HabitBreaker AI - Development Setup Script
# This script automates the setup process

set -e

echo "🚀 HabitBreaker AI - Development Setup"
echo "========================================"
echo ""

# Check Node.js installation
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+."
    exit 1
fi
echo "✓ Node.js $(node -v) installed"

# Check npm installation
echo "✓ Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✓ npm $(npm -v) installed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment variables
echo ""
echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file (copy of .env.example)"
    echo "⚠️  Please edit .env and add your OpenAI API key:"
    echo "   OPENAI_API_KEY=your_key_here"
else
    echo "✓ .env file already exists"
fi

# Initialize database
echo ""
echo "💾 Initializing database..."
npm run prisma:generate
npm run prisma:migrate

# Build information
echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Edit .env and add your OPENAI_API_KEY"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview and features"
echo "- CONTRIBUTING.md - How to contribute"
echo "- DEPLOYMENT.md - Production deployment guide"
echo "- CHANGELOG.md - Version history"
echo ""
echo "🆘 Need help?"
echo "- Check README.md for detailed information"
echo "- See CONTRIBUTING.md for development guidelines"
echo ""
