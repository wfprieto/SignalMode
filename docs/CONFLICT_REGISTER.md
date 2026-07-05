# SignalMode Conflict Register

| Conflict | Location A | Location B | Resolution Status |
|---|---|---|---|
| Missing hook reference | `skills/signalmode-stats/SKILL.md` refers to `src/hooks/signalmode-stats.js` | Hook does not exist; logic is in `signalmode-mode-tracker.js` | Unresolved |
| Missing command triggers | `signalmode-refresh` and `signalmode-compress` SKILL.md files define triggers | `src/hooks/signalmode-mode-tracker.js` does not intercept them | Unresolved |
| Version mismatch | `package.json` is `1.0.0` | `skills/*/SKILL.md` are mostly `2.0.0` | Unresolved |
| Unregistered mode | `signalcrew` is listed in help and has a SKILL.md | `VALID_MODES` in `signalmode-config.js` does not include it | Unresolved |
| Missing test files | `package.json` test script references `tests/installer/*.test.mjs` | `tests/` directory is empty | Unresolved |
| Missing matrix row | `platforms/claudecode.md` exists | `INSTALL.md` matrix is missing the row | Unresolved |
| Duplicated files | `AGENTS.md` | `GEMINI.md` is identical | Unresolved |
| Unsupported claim | `README.md` claims "up to 70% (estimated, unverified) token savings" | `evals/README.md` provides no benchmark data | Unresolved |
