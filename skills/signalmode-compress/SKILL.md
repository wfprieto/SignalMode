---
name: signalmode-compress
version: 2.0.0
description: >
  Compress natural language files (CLAUDE.md, AGENTS.md, todos, preferences,
  project notes) into SignalMode-speak to reduce input tokens on every future
  session. Compressed version overwrites the original. Human-readable backup
  saved automatically as FILE.original.md.
trigger: /signalmode-compress
argument-hint: "<filepath>"
---

# SignalMode Compress

## Purpose

Rewrite memory files into compressed form to reduce input tokens on every future session. The compression is permanent (original backed up). Save tokens forever, not just once.

## Trigger

`/signalmode-compress <filepath>` or when user asks to compress a memory file.

## Process

1. The compression scripts live in `scripts/` adjacent to this SKILL.md.
2. From the directory containing this SKILL.md, run:
   ```
   python3 -m scripts <absolute_filepath>
   ```
3. The CLI will:
   - Detect file type (no tokens consumed)
   - Call the LLM to compress
   - Validate output (no tokens consumed)
   - If errors: cherry-pick fix with targeted LLM call (no full recompression)
   - Retry up to 2 times
   - If still failing after 2 retries: report error to user, leave original file untouched
4. Return result to user.

## Compression Rules

### Remove
- Articles: a, an, the
- Filler: just, really, basically, actually, simply, essentially, generally
- Pleasantries: "sure", "certainly", "of course", "happy to", "I'd recommend"
- Hedging: "it might be worth", "you could consider", "it would be good to"
- Redundant phrasing: "in order to" → "to", "make sure to" → "ensure", "the reason is because" → "because"
- Connective fluff: "however", "furthermore", "additionally", "in addition"

### Preserve EXACTLY (never modify)
- Code blocks (fenced ``` and indented)
- Inline code (`backtick content`)
- URLs and links (full URLs, markdown links)
- File paths (`/src/components/...`, `./config.yaml`)
- Commands (`npm install`, `git commit`, `docker build`)
- Technical terms (library names, API names, protocols, algorithms)
- Proper nouns (project names, people, companies)
- Dates, version numbers, numeric values
- Environment variables (`$HOME`, `NODE_ENV`)

### Preserve Structure
- All markdown headings (keep exact heading text, compress body below)
- Bullet point hierarchy (keep nesting level)
- Numbered lists (keep numbering)
- Tables (compress cell text, keep structure)
- Frontmatter/YAML headers in markdown files

### Compress
- Use short synonyms: "big" not "extensive", "fix" not "implement a solution for", "use" not "utilize"
- Fragments OK: "Run tests before commit" not "You should always run tests before committing"
- Drop "you should", "make sure to", "remember to" — just state the action
- Merge redundant bullets that say the same thing differently
- Keep one example where multiple examples show the same pattern

**CRITICAL RULE:** Anything inside ``` ... ``` must be copied EXACTLY. Do not remove comments, remove spacing, reorder lines, shorten commands, or simplify anything. Inline code (`...`) must be preserved EXACTLY.

## Pattern

**Original:**
> You should always make sure to run the test suite before pushing any changes to the main branch. This is important because it helps catch bugs early and prevents broken builds from being deployed to production.

**Compressed:**
> Run tests before push to main. Catch bugs early, prevent broken prod deploys.

## Boundaries

- ONLY compress natural language files (.md, .txt, .typ, .typst, .tex, extensionless)
- NEVER modify: .py, .js, .ts, .json, .yaml, .yml, .toml, .env, .lock, .css, .html, .xml, .sql, .sh
- If file has mixed content (prose + code), compress ONLY the prose sections
- If unsure whether something is code or prose, leave it unchanged
- Original file is backed up as FILE.original.md before overwriting.
- To restore the original file, use `/signalmode-compress restore <filepath>`.
- Never compress FILE.original.md (skip it).
