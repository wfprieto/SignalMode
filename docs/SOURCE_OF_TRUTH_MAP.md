# SignalMode Source-of-Truth Map

1. **Canonical Entry Point:** `README.md`
2. **Required Loading Order:** Installer (`bin/install.js`) -> Hooks (`src/hooks/`) -> Skills (`skills/`)
3. **Global Instructions:** `CLAUDE.md` (Maintainer guide)
4. **Domain-Specific Instructions:** `skills/<name>/SKILL.md` (LLM-facing behavior rules)
5. **Platform Adapters:** `platforms/*.md`
6. **Agent Definitions:** `agents/signalcrew-*.md`
7. **Configuration:** `package.json`, `src/hooks/signalmode-config.js`

## Precedence Hierarchy
1. User's explicit assignment in-session
2. `CLAUDE.md` (for repository maintenance)
3. `skills/<name>/SKILL.md` (for specific mode behavior)
4. `platforms/*.md` (for agent-specific integration)
