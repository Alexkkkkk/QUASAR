#!/bin/bash
set -e

echo "🌟 Building QUASAR Jetton Contracts..."

mkdir -p build

# Compile minter contract
if command -v func &> /dev/null; then
    func -o build/jetton-minter.fif -SPA contracts/jetton-minter.fc
    func -o build/jetton-wallet.fif -SPA contracts/jetton-wallet.fc
    echo "✅ Contracts compiled successfully"
else
    echo "⚠️  FunC compiler not found. Install from https://github.com/ton-blockchain/ton"
    exit 1
fi

echo "🚀 Build complete!"
