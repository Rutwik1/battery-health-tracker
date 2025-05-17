#!/bin/bash
set -o errexit

echo "📁 Current directory: $(pwd)"
ls -la

# Build client
echo "🔧 Installing client dependencies..."
cd client
npm install

echo "🏗️ Building frontend..."
npm run build

cd ..

# Move build to expected location (root/dist)
if [ -d "./client/dist" ]; then
  echo "✅ Build successful, moving dist/ to root"
  cp -r ./client/dist ./dist
else
  echo "❌ Build failed — client/dist not found"
  exit 1
fi

echo "📦 Final dist folder contents:"
ls -la ./dist
