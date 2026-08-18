#!/bin/bash
set -e

echo "🌟 Building QUASAR Jetton (Tact)..."

mkdir -p build

# Check if tact is installed
if command -v npx &> /dev/null; then
    npx tact --config tact.config.json
    echo "✅ Contracts compiled successfully"
else
    echo "⚠️  npx not found. Install Node.js dependencies first:"
    echo "   npm install"
    exit 1
fi

echo "🚀 Build complete!"
echo "📁 Compiled files in ./build/"
