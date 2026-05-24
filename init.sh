#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "Working directory: $ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node command not found." >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm command not found." >&2
  exit 1
fi

echo "Node: $(node --version)"
echo "pnpm: $(pnpm --version)"

if [ ! -d node_modules ]; then
  echo "Error: node_modules directory not found. Run pnpm install first." >&2
  exit 1
fi

echo "Running lint before starting dev server..."
if pnpm lint; then
  echo "Lint passed. Starting development server..."
else
  status=$?
  echo "Lint failed with exit code $status." >&2
  echo "Known lint failures are tracked in progress.md and feature-list.json." >&2
  echo "Development server will still be started so existing behavior can be inspected." >&2
fi

exec pnpm dev
