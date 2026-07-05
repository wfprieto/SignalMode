#!/usr/bin/env bash
# SignalMode installer — shell shim
# Delegates all logic to bin/install.js via npx.
# Usage: curl -fsSL https://raw.githubusercontent.com/wfprieto/SignalMode/main/install.sh | bash
set -euo pipefail

REPO="wfprieto/SignalMode"
PKG="signalmode"

# Check for Node.js
if ! command -v node &>/dev/null; then
  echo "signalmode: Node.js is required but not found."
  echo "  Install Node.js (>=18) from https://nodejs.org and re-run."
  exit 1
fi

# Check Node version
NODE_MAJOR=$(node -e 'process.stdout.write(process.versions.node.split(".")[0])')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "signalmode: Node.js $NODE_MAJOR is too old. Need Node >=18."
  echo "  Upgrade at https://nodejs.org"
  exit 1
fi

# Run installer via npx
exec npx --yes "$PKG" "$@"
