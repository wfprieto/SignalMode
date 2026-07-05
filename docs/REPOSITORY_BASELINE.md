# SignalMode Repository Baseline

**Status:** Preflight Complete
**Commit:** a587242 (HEAD -> manus/signalmode-20-pass-20250705, main)
**Date:** July 5, 2026

## Objective and Product Clarity (Score: 8/10)
SignalMode is an LLM-agnostic communication optimizer for AI coding agents. It forces agents to respond with precision, clarity, and zero filler.
**Strengths:** The core value proposition is very clear in the README and SKILL files.
**Weaknesses:** The `signalcrew` skill is listed in the help menu and has its own SKILL.md, but it is not registered in the `VALID_MODES` of the configuration hook, meaning it cannot be reliably tracked or managed by the mode-tracker hook.

## Source-of-Truth Discipline (Score: 7/10)
**Strengths:** `CLAUDE.md` explicitly defines the architecture and rules for agents working on the codebase.
**Weaknesses:** `AGENTS.md` and `GEMINI.md` are identical, which violates the "one rule, one home" principle and creates redundant maintenance overhead. `INSTALL.md` is missing the `claudecode` platform file from its matrix, even though the file exists.

## Repository and File-Loading Precision (Score: 7.5/10)
**Strengths:** Clear separation between `skills/`, `platforms/`, and `src/hooks/`.
**Weaknesses:** The `signalmode-stats` skill references a hook file (`src/hooks/signalmode-stats.js`) that does not exist. The mode-tracker hook handles stats internally, creating a contradiction.

## Cross-File Consistency (Score: 6.5/10)
**Strengths:** Most skills have matching READMEs and SKILL.md files.
**Weaknesses:** 
1. `package.json` version is `1.0.0`, but skills are marked as `2.0.0` or `1.0.0` inconsistently.
2. `skills/signalmode-voice/SKILL.md` has its "How to Customize" section placed after the "Final Rule", breaking the logical flow.
3. The README claims "65-75% token savings" but the `evals/README.md` provides no benchmark data to support this specific claim.

## Agent and Workflow Reliability (Score: 7/10)
**Strengths:** `signalcrew` defines clear roles and handoffs.
**Weaknesses:** `src/hooks/signalmode-mode-tracker.js` does not intercept `/signalmode-refresh` or `/signalmode-compress`, meaning these commands pass through to the LLM without triggering the necessary hook state changes.

## LLM Portability and Adapter Discipline (Score: 8/10)
**Strengths:** Strong platform matrix supporting 14 agents.
**Weaknesses:** `CHATGPT.md` and `CODEX.md` root-level files are missing, though their `platforms/` equivalents exist. The `INSTALL.md` matrix needs updating to reflect the exact manual install steps for Windsurf and Copilot.

## Security, Privacy, and Data Integrity (Score: 9/10)
**Strengths:** Strong privacy stance ("SignalMode does not phone home"). No exposed secrets detected in the scan.
**Weaknesses:** No explicit rollback mechanism documented for the `signalmode-compress` file rewriting.

## Verification and Evidence Quality (Score: 6/10)
**Strengths:** `evals/` harness exists.
**Weaknesses:** The `tests/` directory is empty. The `package.json` references `tests/installer/*.test.mjs` which do not exist.

## Maintainability and Change Control (Score: 8/10)
**Strengths:** `CONTRIBUTING.md` provides clear rules for adding skills and platforms.
**Weaknesses:** No explicit deprecation policy or changelog.

## Failure Handling and Reporting (Score: 8/10)
**Strengths:** Hooks are designed to fail silently so they don't block session start.
**Weaknesses:** The mode-tracker hook silently swallows JSON parse errors on the input without logging, making debugging difficult.

## Initial Repository Score: 7.4 / 10
