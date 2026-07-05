# SignalMode Hooks

Claude Code hooks for SignalMode. These run automatically on session events.

## Files

| File | Hook type | Purpose |
|---|---|---|
| `signalmode-activate.js` | SessionStart | Writes flag file, emits ruleset |
| `signalmode-mode-tracker.js` | PreToolUse | Intercepts /signalmode commands |
| `signalmode-config.js` | Utility | Shared config read/write |
| `signalcrew-model-overrides.js` | Utility | Per-agent model overrides |
| `signalmode-statusline.sh` | Shell | Statusline badge for bash/zsh |

## Installation

Hooks are installed automatically by `npx signalmode` for Claude Code.

For manual install, add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/signalmode-activate.js" }]
      }
    ],
    "PreToolUse": [
      {
        "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/signalmode-mode-tracker.js" }]
      }
    ]
  }
}
```

## Rules

- Hooks must silent-fail on all filesystem errors. Never let a hook crash block session start.
- All flag file writes go through `safeWriteFlag()` in `signalmode-config.js`.
- Hooks must respect `CLAUDE_CONFIG_DIR` env var, not hardcode `~/.claude`.
