# Security Policy

## Privacy and Telemetry

SignalMode does not phone home. There is no telemetry, no analytics, no accounts, and no backend.

After install, SignalMode makes zero network calls. The skill is a prompt, the hooks are local scripts, and `/signalmode-stats` reads a log already on your disk.

Install-time network calls:
- GitHub: to download the package via `npx signalmode`
- Your agent's own plugin registry (e.g., Claude Code's plugin system)

No other network calls are made at any time.

## Reporting a Vulnerability

To report a security vulnerability, please open a GitHub issue at:
https://github.com/wfprieto/SignalMode/issues

For sensitive vulnerabilities, use GitHub's private vulnerability reporting feature.

## Symlink Safety

All flag file writes go through `safeWriteFlag()` in `src/hooks/signalmode-config.js`, which unlinks the target path before writing to prevent symlink-clobber attacks.

## Scope

SignalMode only reads and writes files in:
- `$CLAUDE_CONFIG_DIR` (default: `~/.claude`)
- The current project directory (for `.cursorrules`, `.windsurfrules`, etc.)
- `~/.config/opencode` (for opencode installs)

It never reads or writes outside these directories.
