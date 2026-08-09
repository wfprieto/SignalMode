# SignalMode

**Signal over noise. Every token counts.**

SignalMode is an LLM-agnostic communication optimizer. It installs into your AI coding agents and forces them to respond with precision, clarity, and zero filler — cutting token waste, reducing cost, and making every response actually useful.

Works with Claude Code, ChatGPT, Codex, Gemini, Copilot, Cursor, Windsurf, Replit, Manus, and 30+ other agents.

---

## What it does

| Skill | What it gives you |
|---|---|
| **signalmode** | Core signal: drop filler, keep substance. Terse but never cryptic. |
| **signalmode-voice** | Your personal writing voice template (customizable). Ships with The Strategist voice: verdict-first, calm authority, no corporate theater. |
| **signalmode-human** | Protected versioned policy. Reduces common patterns associated with generic AI writing while preserving correct terminology. |
| **signalmode-basic-english** | Forces plain, layman-friendly reports. 5-section structure. Assumes the reader knows nothing about code or platforms. |
| **signalmode-compress** | Rewrites memory files (CLAUDE.md, AGENTS.md, etc.) into compressed form — save tokens every future session. |
| **signalmode-stats** | Uses session-log data to estimate token and cost savings. Results are directional, not billing-grade measurements. |
| **signalmode-refresh** | Compiles the active session into a lean continuation contract. Clean handoff to a new session, a human, or another agent. |
| **signalcrew** | Multi-agent crew: Builder, Investigator, Reviewer. Spec-driven, no guessing. |

---

## Install

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/wfprieto/SignalMode/main/install.sh | bash
```

**Windows:**

```powershell
irm https://raw.githubusercontent.com/wfprieto/SignalMode/main/install.ps1 | iex
```

**npm** (available once v2.1.1 is published to the npm registry):

```bash
npx signalmode
```

See [INSTALL.md](./INSTALL.md) for the full platform matrix.

---

## Platform instruction files

SignalMode ships ready-made instruction files for the top 10 AI platforms. Drop them in and your agent is configured immediately.

| Platform | File | How to use |
|---|---|---|
| ChatGPT | [`platforms/chatgpt.md`](./platforms/chatgpt.md) | Paste into Custom Instructions |
| Claude | [`platforms/claude.md`](./platforms/claude.md) | Paste into System Prompt |
| Claude Code | [`platforms/claudecode.md`](./platforms/claudecode.md) | Auto-installed via hooks |
| Codex (OpenAI) | [`platforms/codex.md`](./platforms/codex.md) | Paste into system prompt |
| Manus | [`platforms/manus.md`](./platforms/manus.md) | Add to project instructions |
| Replit | [`platforms/replit.md`](./platforms/replit.md) | Add to `.replit` AI instructions |
| Gemini | [`platforms/gemini.md`](./platforms/gemini.md) | Paste into system instructions |
| GitHub Copilot | [`platforms/copilot.md`](./platforms/copilot.md) | Add to `.github/copilot-instructions.md` |
| Cursor | [`platforms/cursor.md`](./platforms/cursor.md) | Add to `.cursorrules` |
| Windsurf | [`platforms/windsurf.md`](./platforms/windsurf.md) | Add to `.windsurfrules` |
| **All platforms** | [`platforms/full-signal.md`](./platforms/full-signal.md) | Combined 3-layer system prompt for maximum effect |

---

## Skills

### `/signalmode` — Core signal

Activates compressed, high-signal communication. Drops filler, keeps substance. Three intensity levels:

- **lite** — No filler or hedging. Full sentences. Professional and tight.
- **full** — Fragments OK. Classic signal mode. No narration, no decorative tables.
- **ultra** — Maximum compression. One word when one word is enough.

### `/signalmode-basic-english` — Plain language reports

Forces the AI to explain everything as if the reader has never heard of code, databases, or cloud platforms. Every response follows a strict 5-section structure:

1. **What happened?** — What was reviewed, changed, built, tested, or discovered.
2. **What is the result?** — Working / Partly working / Not working / Not tested yet.
3. **Why does it matter?** — The real-world effect if this is not addressed.
4. **What is needed?** — Exactly what must be added, fixed, decided, or provided — with plain-English explanations of every technical service or platform.
5. **What happens next?** — Steps in exact order.

### `/signalmode-compress` — Compress memory files

Rewrites `.md` memory files (CLAUDE.md, AGENTS.md, project notes) into compressed form. Saves tokens on every future session. Original backed up automatically.

```bash
/signalmode-compress CLAUDE.md
```

### `/signalmode-stats` — Token savings report

Reads your session log and reports real token counts and savings. No AI estimation.

```bash
/signalmode-stats
```

### `/signalmode-refresh` — Session handoff

Compiles the active session into a lean, verifiable continuation contract. Use when a session is getting long, outputs are drifting, or work needs to move to a new session or person.

```bash
/signalmode-refresh
/signalmode-refresh lite
/signalmode-refresh full
/signalmode-refresh ultra
```

### `/signalmode-voice` — Your personal voice template

A customizable writing voice template. Ships with The Strategist voice as the default: verdict-first structure, calm authority, clean judgment, no corporate theater. **Edit `skills/signalmode-voice/SKILL.md` to make it your own.** Change the output order, tone, phrase list, and context modes to match how you actually write.

```bash
/signalmode-voice
/signalmode-voice off
```

### `/signalmode-human` — Anti-AI hygiene

**Protected versioned policy.** These rules reduce common patterns associated with generic AI writing while preserving correct terminology and source material.

```bash
/signalmode-human
/signalmode-human off
```

Replaces habitual AI language with clean prose. Implements a three-class system: prohibited patterns (always wrong), high-risk language (context-dependent), and preserve-exactly exceptions (protecting user copy, legal language, and code).

**Use both together for full signal hygiene.** Voice is yours to customize. Human is a protected versioned policy.

### `/signalcrew` — Multi-agent crew

Three-agent crew for spec-driven development:

- **Investigator** — Audits the codebase, identifies gaps, flags risks.
- **Builder** — Implements against the spec. No guessing.
- **Reviewer** — Adversarial review pass. Junior output in, senior output out.

---

## How it works

1. Install drops skill files into your agent.
2. Skills tell the agent: drop filler, keep substance, use fragments — but never touch code, commands, or errors.
3. On Claude Code, a hook writes a flag file each session so the agent uses SignalMode from message one.
4. `/signalmode-voice` applies a verdict-first, judgment-driven voice standard to all output.
5. `/signalmode-human` reduces common patterns associated with generic AI writing using a three-class filtering system.
6. `/signalmode-stats` reads your session log, counts tokens saved.
7. `/signalmode-compress` rewrites memory files so every future session starts with a smaller context.
8. `/signalmode-refresh` compiles a clean handoff contract when sessions get long.

---

## Privacy

SignalMode does not phone home. No telemetry, no analytics, no accounts, no backend. After install, zero network calls. The skill is a prompt, the hooks are local scripts, and `/signalmode-stats` reads a log already on your disk.

---

## License

MIT — free to use, modify, and distribute.

---

<sub>
<strong>Docs:</strong>
<a href="./INSTALL.md">Install matrix</a> ·
<a href="./CONTRIBUTING.md">Contributing</a> ·
<a href="./SECURITY.md">Security</a> ·
<a href="https://github.com/wfprieto/SignalMode/issues">Issues</a>
</sub>
