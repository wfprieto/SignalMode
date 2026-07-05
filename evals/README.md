# SignalMode Evals

Three-arm harness to measure the real compression delta of SignalMode skills.

## Arms

| Arm | System prompt |
|---|---|
| `__baseline__` | None |
| `__terse__` | "Answer concisely." |
| `<skill>` | "Answer concisely.\n\n{SKILL.md}" |

The honest delta is **skill vs terse**, not skill vs baseline. Baseline comparison conflates SignalMode with generic terseness.

## Running

```bash
# Requires OPENAI_API_KEY or ANTHROPIC_API_KEY in .env.local
python3 evals/llm_run.py
python3 evals/measure.py
```

## Adding prompts

Append lines to `evals/prompts/en.txt`. Each line is one prompt.

## Adding skills

Drop `skills/<name>/SKILL.md`. The harness auto-discovers skills.

## Results

Snapshots are committed to `evals/snapshots/results.json`. CI reads without API calls. Only regenerate when SKILL.md or prompts change.
