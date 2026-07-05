# signalmode-refresh

Compiles the active session into a lean, verifiable continuation contract. Use when a session is getting long, outputs are drifting, or work needs to move to a new session or person.

## Usage

```
/signalmode-refresh           — Full handoff (default)
/signalmode-refresh lite      — Quick reset, minimum state
/signalmode-refresh full      — Verified operational handoff
/signalmode-refresh ultra     — Full audit with risks and dependencies
```

## What it produces

A structured handoff document containing:
- The active objective
- Confirmed current state (what actually exists)
- Intended state (what needs to happen)
- Key decisions and constraints
- Ordered action plan
- Recovery point (for medium/high-risk work)
- Resource manifest
- Open questions and blockers

## Where it saves

`memory/history/YYYY-MM-DD.md` — appends to today's log or creates it.
`memory/map.md` — updates the state registry.

## Token Refresh Protocol

After completing the handoff, SignalMode prompts:

> ⚠️ **TOKEN REFRESH PROTOCOL ACTIVATED**: Session memory compiled to `memory/history/` and maps updated. To drop your context token count to zero, please type `/clear` now.

## When to use it

- Session is getting long (>50 messages)
- Outputs are drifting or becoming inconsistent
- Work needs to move to a new session
- Handing off to a human or another agent
- Before a risky operation (creates a recovery point)
