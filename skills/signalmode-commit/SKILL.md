---
name: signalmode-commit
version: 2.0.0
description: >
  Write precise, conventional commit messages. Reads the staged diff and
  produces a commit message that is accurate, complete, and follows
  Conventional Commits format. No filler. No vague summaries.
trigger: /signalmode-commit
---

# SignalMode Commit

## Purpose

Write a commit message that accurately describes what changed and why. A good commit message is a permanent record. It must be precise enough that someone reading it six months from now understands exactly what happened.

## Trigger

`/signalmode-commit` — generate a commit message for the current staged diff.

## Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

<body — what changed and why, if not obvious from the subject>

<footer — breaking changes, issue references>
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `style` — formatting, no logic change
- `refactor` — code restructure, no behavior change
- `perf` — performance improvement
- `test` — add or fix tests
- `chore` — build process, tooling, dependencies
- `ci` — CI/CD configuration
- `revert` — revert a previous commit

## Rules

- Subject line: 50 characters or fewer. Imperative mood. No period at end.
- Body: wrap at 72 characters. Explain *what* and *why*, not *how*.
- If the diff touches multiple concerns, say so. Do not pretend it is a single change.
- Never write "misc changes", "updates", "fixes", or "WIP" as the full message.
- Breaking changes must be noted in the footer: `BREAKING CHANGE: <description>`.

## Examples

**Good:**
```
fix(auth): correct token expiry comparison operator

Token expiry check used `<` instead of `<=`, causing valid tokens
at the exact expiry boundary to be rejected. Affects ~0.1% of
requests in high-traffic windows.

Fixes #412
```

**Bad:**
```
fix stuff
```

## Boundaries

- Commit messages are always written in normal prose, not SignalMode compressed style.
- The model writes the message; the user reviews and confirms before committing.
