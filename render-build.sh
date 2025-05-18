#!/bin/bash
# Show current directory and files
echo "Current directory: $(pwd)"
ls -la

# Install dependencies
npm install

# Run the build
npm run build

# Debug: Show where files were output
echo "After build - checking for dist directory:"
ls -la
find . -name "dist" -type d

# If dist directory exists but is in the wrong place, copy it
if [ -d "./client/dist" ] && [ ! -d "./dist" ]; then
  echo "Found dist in client folder, copying to root"
  cp -r ./client/dist ./dist
fi

if [ -d "./dist" ]; then
  echo "dist directory contents:"
  ls -la ./dist
else
  echo "dist directory not found!"
  exit 1
fi