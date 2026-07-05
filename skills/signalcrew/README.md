# signalcrew

Multi-agent crew for spec-driven development. Three agents — Investigator, Builder, Reviewer — work in sequence to audit, build, and verify.

## Usage

```
/signalcrew <task>             — Run full crew (Investigate → Build → Review)
/signalcrew investigate <task> — Run only the Investigator
/signalcrew build <task>       — Run only the Builder
/signalcrew review             — Run only the Reviewer on recent output
```

## Agents

| Agent | Role | Scope |
|---|---|---|
| **Investigator** | Audit, gather facts, identify gaps | Read-only |
| **Builder** | Implement against the spec | Write, bounded by spec |
| **Reviewer** | Adversarial review | Read-only, report only |

## Rules

- Each agent operates within its defined scope.
- If a blocker is found at any stage, the crew stops and reports it.
- No irreversible changes without explicit user approval.
- All agents use SignalMode compression in their outputs.

## Model overrides

Set per-agent models via environment variables:

```bash
SIGNALCREW_INVESTIGATOR_MODEL=claude-opus-4-5
SIGNALCREW_BUILDER_MODEL=claude-sonnet-4-5
SIGNALCREW_REVIEWER_MODEL=claude-opus-4-5
```
