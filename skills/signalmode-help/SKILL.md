---
name: signalmode-help
version: 2.0.0
description: >
  Show available SignalMode skills, commands, and usage. Triggers on
  /signalmode-help or when user asks what SignalMode can do.
trigger: /signalmode-help
---

# SignalMode Help

## Trigger

`/signalmode-help`

## Output

When triggered, display the following:

---

**SignalMode** — Signal over noise. Every token counts.

| Command | What it does |
|---|---|
| `/signalmode` | Activate core signal mode (full by default) |
| `/signalmode lite` | Lite mode — no filler, full sentences |
| `/signalmode full` | Full mode — fragments OK, no narration |
| `/signalmode ultra` | Ultra mode — maximum compression |
| `/signalmode off` | Deactivate, return to normal |
| `/signalmode-compress <file>` | Compress a memory file to save tokens every session |
| `/signalmode-stats` | Show real token usage and savings for this session |
| `/signalmode-review` | Adversarial code review — find every real problem |
| `/signalmode-commit` | Write a precise conventional commit message |
| `/signalmode-refresh` | Compile session into a lean continuation handoff |
| `/signalmode-refresh lite` | Quick handoff — minimum continuation state |
| `/signalmode-refresh ultra` | Deep handoff — full audit with risks and dependencies |
| `/signalmode-basic-english` | Plain language reports for non-technical readers |
| `/signalmode-basic-english off` | Deactivate plain language mode |
| `/signalcrew` | Activate multi-agent crew (Investigator, Builder, Reviewer) |
| `/signalmode-voice` | Activate your personal voice template (customizable — edit `skills/signalmode-voice/SKILL.md`) |
| `/signalmode-voice off` | Deactivate voice template |
| `/signalmode-human` | Activate immutable anti-AI hygiene rules — do not edit this skill |
| `/signalmode-human off` | Deactivate anti-AI hygiene |
| `/signalmode-help` | Show this help |

**Platform instruction files:** See `platforms/` directory for ready-made instructions for ChatGPT, Claude, Codex, Manus, Replit, Gemini, Copilot, Cursor, and Windsurf.

---
