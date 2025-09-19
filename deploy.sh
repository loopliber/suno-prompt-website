#!/bin/bash

# Deployment script for Vercel
# Run this script to deploy your Suno prompt website to Vercel

echo "🚀 Deploying Suno Prompt Website to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Your website should now be live on Vercel."