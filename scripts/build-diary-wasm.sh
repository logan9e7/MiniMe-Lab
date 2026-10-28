#!/usr/bin/env bash
set -euo pipefail
# Requires Emscripten SDK (emcc/em++) installed locally or in CI.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/frontend/public/wasm"
emcc "$ROOT/backend/cpp/diary_wasm.cpp" -std=c++17 -O3 \
  -s STANDALONE_WASM=0 -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  -s EXPORTED_FUNCTIONS='["_cycle_stats","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='[]' \
  -o "$ROOT/frontend/public/wasm/diary_math.js"
echo "Build generated diary_math.wasm; verify exports before enabling runtime."
