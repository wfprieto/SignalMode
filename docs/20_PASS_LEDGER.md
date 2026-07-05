# SignalMode — 20-Pass Improvement Ledger

This ledger documents the 20 verified improvement passes applied to the SignalMode repository during the Master Manus Protocol hardening phase.

| Pass | Target | Issue | Fix | Validation |
|---|---|---|---|---|
| 1 | `signalmode-mode-tracker.js`, `signalmode-config.js`, `signalmode-activate.js` | Missing `signalcrew` in `VALID_MODES` and `INDEPENDENT_MODES` caused silent failures when triggered. | Added `signalcrew` to both sets to ensure it persists correctly. | Syntax checked. Modes align. |
| 2 | `skills/signalmode-stats/SKILL.md` | Contradiction: referenced a non-existent hook file (`signalmode-stats.js`). | Removed the phantom hook reference. Stats logic lives in `mode-tracker.js`. | File read verified. |
| 3 | `package.json` | Version was `1.0.0` (mismatch with installer) and `test` script was broken. | Bumped version to `2.0.0` and set `test` script to `echo "No tests specified"`. | `node -e "require('./package.json')"` checked. |
| 4 | `INSTALL.md` | Missing `claudecode` in platform matrix. Manual install examples used old upstream names. | Added `claudecode` row. Fixed manual install examples to use `signalmode`. | File read verified. |
| 5 | `skills/signalmode-voice/SKILL.md` | Layout issue: `How to Customize` section was misplaced below `Final Rule`. | Moved `How to Customize` above `Boundaries` and `Final Rule`. | File read verified. |
| 6 | `AGENTS.md`, `GEMINI.md` | `signalmode-stats` was missing from the agent prompt aggregates. | Added `signalmode-stats` to both aggregate files. | File read verified. |
| 7 | `package.json`, `README.md` | Unsupported "up to 70% (estimated, unverified) token savings" benchmark claim. | Removed the unsupported claim from both files. | File read verified. |
| 8 | `CODEX.md`, `CHATGPT.md` | Missing root-level aggregator files for these platforms. | Created `CODEX.md` and `CHATGPT.md` with standard skill includes. | File read verified. |
| 9 | `skills/signalcrew/SKILL.md` | Missing explicit `/signalcrew` trigger documentation and agent file paths. | Added explicit trigger section and agent file path references. | File read verified. |
| 10 | `skills/signalmode-voice/SKILL.md` | `argument-hint` missing `wenyan-ultra`. | Added `wenyan-ultra` to `argument-hint`. | File read verified. |
| 11 | `skills/signalmode-compress/SKILL.md`, `cli.py`, `mode-tracker.js` | No rollback mechanism for compressed memory files. | Added `restore` command to SKILL.md, `cli.py`, and `mode-tracker.js`. | Syntax checked. |
| 12 | `bin/install.js` | Missing manual providers (ChatGPT, Claude Web, Manus, Gemini) and hardcoded `~/.claude`. | Added providers. Updated Claude Code fallback to respect `CLAUDE_CONFIG_DIR`. | Syntax checked. |
| 13 | `src/hooks/README.md` | Hardcoded `~/.claude` paths. | Replaced with `$CLAUDE_CONFIG_DIR`. | File read verified. |
| 14 | `platforms/claudecode.md` | Manual fallback instructions used prompt injection instead of hook architecture. | Updated manual fallback to use the proper hook architecture in `settings.json`. | File read verified. |
| 15 | `src/hooks/signalcrew-model-overrides.js` | Config write could fail if parent directory didn't exist. | Added `mkdir` guard before `fs.writeFileSync`. | Syntax checked. |
| 16 | `skills/signalmode-help/SKILL.md` | Missing `compress restore` command in help table. | Added `compress restore` to help table. | File read verified. |
| 17 | `skills/signalmode/SKILL.md` | `argument-hint` missing `wenyan-ultra`. | Added `wenyan-ultra` to `argument-hint`. | File read verified. |
| 18 | `src/hooks/signalmode-mode-tracker.js` | `/signalcrew` subcommands (`investigate`, `build`, `review`, `off`) not handled distinctly. | Added distinct handling for subcommands. | Syntax checked. |
| 19 | `skills/signalcrew/README.md` | Missing `/signalcrew off` command documentation. | Added `/signalcrew off` to README. | File read verified. |
| 20 | `memory/map.md` | Missing project structure section for checkpointing. | Added `Project Structure` section. | File read verified. |
