---
name: signalmode-stats
version: 2.0.0
description: >
  Show real token usage and estimated savings for the current session.
  Reads directly from the agent session log — no AI estimation.
  Triggers on /signalmode-stats. Output is injected by the mode-tracker hook;
  the model itself does not compute the numbers.
trigger: /signalmode-stats
---

# SignalMode Stats

## Purpose

Report real token counts and estimated savings for the current session. Numbers come from the session log, not from AI estimation.

## Trigger

`/signalmode-stats`

## How it works

This skill is delivered by `src/hooks/signalmode-mode-tracker.js` on `/signalmode-stats`. The model does not compute the numbers — the hook returns `decision: "block"` with the formatted stats as the reason. The user sees the numbers immediately.

## Output Format

```
SignalMode Stats — Current Session
───────────────────────────────────
Input tokens used:      12,450
Output tokens used:      3,210
Estimated baseline:     18,900
Tokens saved:            6,450  (34%)
Estimated cost saved:   $0.019

Mode: full
Sessions with SignalMode: 7
Total tokens saved (all sessions): 41,200
```

## Boundaries

- Stats are estimates based on session log data.
- Absolute token counts are approximate (OpenAI BPE tokenizer used as approximation).
- Ratios and relative savings are meaningful; absolute numbers are indicative.
- Stats reset when `/clear` is used or a new session starts.
