#!/bin/bash
# Debug: Show directory structure
echo "Current directory structure:"
find . -type f -name "index.html" | sort

# Install dependencies
npm install

# Build the client
echo "Building client..."
npm run build:client

# Build the server
echo "Building server..."
npm run build:server

# Debug: Show output directory
echo "Output directory structure:"
ls -la dist