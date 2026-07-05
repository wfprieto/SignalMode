# SignalMode — Maintainer Guide

This file is for agents and maintainers working on the SignalMode codebase itself.

## Architecture

```
SignalMode/
├── bin/install.js          — Installer. Single source of truth for agent detection and install.
├── platforms/              — Ready-made instruction files for top 10 AI platforms.
├── skills/                 — All skill SKILL.md files. Edit here, never in synced copies.
│   ├── signalmode/         — Core signal skill.
│   ├── signalmode-compress/— Compression skill + Python scripts.
│   ├── signalmode-stats/   — Stats skill (delivered by hook).
│   ├── signalmode-review/  — Code review skill.
│   ├── signalmode-commit/  — Commit message skill.
│   ├── signalmode-help/    — Help skill.
│   ├── signalmode-basic-english/ — Plain language report skill.
│   ├── signalmode-refresh/ — Session handoff skill.
│   └── signalcrew/         — Multi-agent crew skill.
├── src/hooks/              — Claude Code hooks (JS).
│   ├── signalmode-activate.js    — SessionStart hook.
│   ├── signalmode-mode-tracker.js— PreToolUse hook for /signalmode commands.
│   ├── signalmode-config.js      — Shared config utilities.
│   └── signalcrew-model-overrides.js — Per-agent model overrides.
├── agents/                 — SignalCrew agent definition files.
└── tests/                  — Test suite.
```

## Key Rules for Agents Working Here

- Edit `skills/<name>/SKILL.md` for behavior changes. Never edit synced copies.
- Edit `src/hooks/signalmode-activate.js` for auto-activation rule changes.
- `bin/install.js` is the only installer source. Never add per-OS install logic to the shell shims.
- Hook files must silent-fail on all filesystem errors. Never let a hook crash block session start.
- Any new flag file write must go through `safeWriteFlag()` in `signalmode-config.js`.
- Hooks must respect `CLAUDE_CONFIG_DIR` env var, not hardcode `~/.claude`.
- Any settings.json read must handle JSONC comments (use `readSettings()` if available).
- README is the most important file for user-facing impact. Keep it accurate and current.
- Benchmark and eval numbers must be real. Never fabricate or estimate.
- Per-skill human docs live in `skills/<name>/README.md`. LLM-facing body is in `SKILL.md`. Do not merge them.

## Adding a New Agent

Edit the `PROVIDERS` array in `bin/install.js`. Each entry needs:
- `id` — unique identifier (kebab-case)
- `label` — human-readable name
- `detect` — detection clause spec (`command:foo||dir:~/.bar`)
- `mech` — install mechanism
- `soft: true` — if detection is best-effort (config-dir-only)

Run `node bin/install.js --list` to confirm the new row renders correctly.

## Adding a New Skill

1. Create `skills/<name>/SKILL.md` with the skill definition.
2. Create `skills/<name>/README.md` with human-readable documentation.
3. Add the skill trigger to `skills/signalmode-help/SKILL.md`.
4. Add `@./skills/<name>/SKILL.md` to `AGENTS.md`.
5. Update `README.md` skills table.

## Evals

`evals/` contains a three-arm harness:
- `__baseline__` — no system prompt
- `__terse__` — "Answer concisely."
- `<skill>` — "Answer concisely.\n\n{SKILL.md}"

Honest delta = **skill vs terse**, not skill vs baseline.

## Privacy

SignalMode does not phone home. No telemetry, no analytics, no accounts, no backend. Install-time fetches (GitHub plus agent registries) are the only network calls.
