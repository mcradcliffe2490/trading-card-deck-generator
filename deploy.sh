#!/bin/bash

# Deployment script for TCG Deck Generator
echo "🚀 Starting deployment process..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Install server dependencies
echo "📦 Installing server dependencies..."
if [ -d "server" ]; then
    cd server
    npm install --only=production
    cd ..
    echo "✅ Server dependencies installed"
else
    echo "❌ Server directory not found!"
    exit 1
fi

# Copy built frontend to server public directory
echo "📁 Setting up static files..."
mkdir -p server/public
cp -r dist/* server/public/

echo "✅ Deployment build complete!"
echo "To start the server: cd server && npm start"