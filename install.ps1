# SignalMode installer — PowerShell shim
# Delegates all logic to bin/install.js via npx.
# Usage: irm https://raw.githubusercontent.com/wfprieto/SignalMode/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "signalmode: Node.js is required but not found. Install from https://nodejs.org"
    exit 1
}

# Check Node version
$nodeVersion = node -e "process.stdout.write(process.versions.node.split('.')[0])"
if ([int]$nodeVersion -lt 18) {
    Write-Error "signalmode: Node.js $nodeVersion is too old. Need Node >=18. Upgrade at https://nodejs.org"
    exit 1
}

# Run installer via npx
$args = $args -join " "
Invoke-Expression "npx --yes signalmode $args"
