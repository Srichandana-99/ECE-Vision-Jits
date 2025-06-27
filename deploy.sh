#!/bin/bash

# ECE-Vision Hub Deployment Script
echo "🚀 ECE-Vision Hub Deployment Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the project
echo "🏗️  Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Update Supabase auth settings with your Vercel URL"
echo "   3. Test all features after deployment" 