# signalmode

Core SignalMode skill. Forces high-signal, low-noise communication.

## Usage

```
/signalmode          — Activate (full mode, default)
/signalmode lite     — Lite mode: no filler, full sentences
/signalmode full     — Full mode: fragments OK, no narration
/signalmode ultra    — Ultra mode: maximum compression
/signalmode off      — Deactivate
```

## What it removes

- Filler openers ("Sure!", "Certainly!", "I'd be happy to")
- Hedging ("it might be worth", "you could consider")
- Status narration ("I'll now", "Let me")
- Closing pleasantries ("Let me know if you need anything else!")
- Connective fluff ("however", "furthermore", "additionally")
- Decorative emoji

## What it never touches

- Code blocks
- Inline code
- URLs, file paths, commands, environment variables
- Technical terms, API names, error messages

## Works with

Claude Code, Cursor, Windsurf, Copilot, opencode, Aider, Codex, ChatGPT, Gemini, Manus, Replit, and 30+ other agents.
