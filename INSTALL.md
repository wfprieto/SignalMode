# SignalMode — Install Matrix

## Quick Install

```bash
npx signalmode
```

Auto-detects installed AI coding agents and installs SignalMode for each one.

---

## Platform Matrix

| Agent | Auto-detect | Install method | Always-on | Platform file |
|---|---|---|---|---|
| **Claude Code** | `claude` on PATH | Plugin install | Yes (hooks) | `platforms/claudecode.md` |
| **Cursor** | `cursor` on PATH or `~/.cursor` | `.cursorrules` | Yes | `platforms/cursor.md` |
| **Windsurf** | `windsurf` on PATH or `~/.codeium` | `.windsurfrules` | Yes | `platforms/windsurf.md` |
| **GitHub Copilot** | `gh` on PATH or VSCode extension | `.github/copilot-instructions.md` | Yes | `platforms/copilot.md` |
| **opencode** | `opencode` on PATH | Plugin install | Yes | — |
| **Aider** | `aider` on PATH | `CONVENTIONS.md` | Yes | — |
| **Codex CLI** | `codex` on PATH | System prompt | Per-session | `platforms/codex.md` |
| **ChatGPT** | Manual | Custom Instructions | Yes | `platforms/chatgpt.md` |
| **Claude (web)** | Manual | System Prompt | Yes | `platforms/claude.md` |
| **Gemini** | Manual | System Instructions | Yes | `platforms/gemini.md` |
| **Manus** | Manual | Project Instructions | Yes | `platforms/manus.md` |
| **Replit** | `~/.replit` dir (soft) | AI instructions | Yes | `platforms/replit.md` |
| **Continue** | VSCode/Cursor extension | System prompt | Per-session | — |
| **Cline** | VSCode extension | System prompt | Per-session | — |
| **All (Full Signal)** | Manual | Any system prompt | Yes | `platforms/full-signal.md` |

---

## Manual Install — Platform Files

For agents without auto-detection, copy the content from the relevant platform file into your agent's system prompt or custom instructions:

```bash
cat platforms/chatgpt.md     # ChatGPT Custom Instructions
cat platforms/claude.md      # Claude System Prompt
cat platforms/gemini.md      # Gemini System Instructions
cat platforms/manus.md       # Manus Project Instructions
cat platforms/replit.md      # Replit AI Instructions
cat platforms/codex.md       # Codex System Prompt
cat platforms/claudecode.md  # Claude Code (manual fallback)
```

---

## Want it always on?

For agents without hook systems, add the contents of `skills/signalmode/SKILL.md` directly to your agent's system prompt or project instructions. This ensures SignalMode is active from the first message of every session.

---

## Install Options

```bash
npx signalmode --only cursor           # Install only for Cursor
npx signalmode --only claude-code      # Install only for Claude Code
npx signalmode --only copilot          # Install only for Copilot
npx signalmode --dry-run               # Preview without installing
npx signalmode --force                 # Overwrite existing files
npx signalmode --list                  # List all supported agents
npx signalmode --help                  # Show all options
```

---

## Uninstall

```bash
npx signalmode --uninstall
```

Or manually:
- Claude Code: `claude plugin uninstall signalmode`
- Cursor: delete `.cursorrules`
- Windsurf: delete `.windsurfrules`
- Copilot: delete `.github/copilot-instructions.md`

---

## Windows

```powershell
irm https://raw.githubusercontent.com/wfprieto/SignalMode/main/install.ps1 | iex
```

Or with options:
```powershell
irm https://raw.githubusercontent.com/wfprieto/SignalMode/main/install.ps1 | iex; signalmode --only cursor
```
