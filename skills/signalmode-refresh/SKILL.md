---
name: signalmode-refresh
version: 2.0.0
description: >
  Compiles the active session into a lean, verifiable continuation contract.
  Use when a session is becoming long, outputs are drifting, work must move
  to a new session, or a project requires a portable handoff to a human or
  another agent. Preserves the active objective, confirmed state, decisions,
  constraints, risks, recovery path, and next executable actions while
  excluding transcript noise and inaccessible context.
trigger: /signalmode-refresh
argument-hint: "[lite | full | ultra] [local | portable | auto] [human | agent | auto]"
---

# SignalMode Refresh

## Purpose

Produce the minimum sufficient, trustworthy context a recipient needs to continue work without relying on the current conversation, hidden memory, or inaccessible resources.

The output is a **continuation contract**, not a transcript summary. It must help the recipient orient, act, verify, recover, and finish.

## Fast Path

Use this path unless a later rule requires deeper inspection:

1. Resolve the objective, level, destination, and recipient.
2. Extract the active state and decisions from the current conversation.
3. Detect material contradictions.
4. Inspect only the resources needed to resolve gaps or verify the first actions.
5. Build one ordered action plan with accessible resources and explicit stopping conditions.
6. Run the readiness gate and deliver either a ready handoff or a blocked notice.

Do not scan an entire workspace merely because access exists. Expand inspection only when the current evidence is insufficient.

## Core Principles

1. **Continuation over compression.** Preserve what enables the next action, not everything that happened.
2. **Access over location.** A resource is useful only when the recipient can resolve and open it.
3. **Observed state and intended state are different.** Never present a requested change as already implemented.
4. **Verify before asserting.** Never invent a file, path, URL, identifier, decision, completion state, date, recovery point, or project detail.
5. **One fact, one home.** State information once, then reference it by a stable action, decision, conflict, or resource ID.
6. **Context is a budget.** Preserve enough to continue while leaving most of the recipient's context available for execution.
7. **Fail safely.** Do not label a handoff executable when a material blocker remains.
8. **Plan for recovery.** Medium-risk work must identify a safe checkpoint. High-risk work requires a verified recovery path before execution.
9. **Separate certainty levels.** Distinguish confirmed facts, observed state, intended state, assumptions, unresolved conflicts, and open questions.
10. **Minimize exposure.** Never include live credentials or unnecessary sensitive information.
11. **Make resumption cheap.** Preserve stable IDs and a checkpoint so the next recipient can continue without rereading the entire handoff.
12. **Avoid duplicate mutation.** Before rerunning a completed or uncertain action, verify whether it is idempotent or whether repetition could create duplicate, conflicting, or destructive effects.

## Inputs

### Level
- `lite` — rapid reset with only the minimum continuation state. ~500–1,200 tokens.
- `full` — verified operational handoff. Default. ~1,200–3,500 tokens.
- `ultra` — broader continuation audit with risks, rejected approaches, dependencies. ~2,500–6,000 tokens.

### Destination
- `local` — recipient works in the same accessible project or workspace.
- `portable` — recipient may use another machine, account, workspace, or organization.
- `auto` — infer from request. Default to `local` only when continued access to the same resources is reasonably supported.

### Recipient
- `human` — optimize for readable context, rationale, and judgment notes.
- `agent` — optimize for deterministic structure, verb-first actions, stable IDs, inputs, outputs, validation, and stop conditions.
- `auto` — infer from request. Use `agent` only when autonomous execution is explicit.

### Risk
- `low` — analysis, drafting, reading, or readily reversible edits.
- `medium` — configuration changes, batch edits, deployments with a known rollback.
- `high` — destructive writes, migrations, production changes, irreversible external actions.

## Interaction Rule

Ask at most one clarification question.

- If the goal is clear, do not ask.
- If the goal is missing, ask: **"What should the next session or recipient accomplish? Mention whether it is for a person, an autonomous agent, or another workspace if that matters."**
- End the turn after asking and wait.
- Do not ask a second question. Resolve remaining ambiguity conservatively.

## Lite Mode Workflow

1. Analyze active git diff, file changes, and recent session history.
2. Separate observed state (actual file changes) from intended state (next steps).
3. Look for an existing file at `memory/history/YYYY-MM-DD.md` (using today's date). If it exists, append to it; if not, create it.
4. Format output using the lite schema below.
5. Update `memory/map.md` to reflect newly completed changes.
6. Conclude by prompting the user with the Token Refresh Protocol message.

## Output Schema — Lite

```markdown
---
schema: signalmode-refresh-handoff
schema_version: 2.0
status: ready
created_at: <ISO 8601 timestamp>
level: lite
destination: <local | portable>
recipient: <human | agent>
risk: <low | medium | high>
---

# Session Refresh: [Short Objective Slug]

Handoff reason: <why this was created>

- **Session Objective**: What were we trying to accomplish?
- **Observed State**: Active file paths modified and verified working state.
- **Key Decisions (D1)**: Architecture boundaries established.
- **Immediate Actions (A1–A3)**: 1–3 verb-first, linear next steps.
- **Open Questions / Blockers**: Remaining gaps or ambiguities.
```

## Output Schema — Full (Human Mode)

```markdown
---
schema: signalmode-refresh-handoff
schema_version: 2.0
status: <ready | ready_with_warnings>
created_at: <ISO 8601 timestamp>
level: full
destination: <local | portable>
recipient: human
risk: <low | medium | high>
---

# Session refresh: <goal>

Handoff reason: <why this was created>

You are continuing work on <project or workstream>.
Objective: <single concrete objective>

## Current state
<confirmed observed state and completed work>

## Intended state
<target state, only when different from current state>

## Confirmed decisions and constraints
- D1: <decision or constraint> — <why it matters>

## Conflicts
- C1: <resolved or unresolved conflict, evidence, and effect>

## Action plan

### Immediate
1. A1: <verb-first action>
2. A2: <verb-first action>

### Queued
1. A3: <later action>

### Pending or blocked
- A4: <action> — Blocked by: <dependency, decision, or access>

## Success criteria
- <observable completion condition>

## Recovery point
Risk: <medium or high>
- Last known-good state: <verified locator or "not verified">
- Rollback: <concise procedure or required first step>

## Resources
- R1: `<normalized locator>` — <purpose>; access: <status>; freshness: <class>; verified: <date or unverified>

## Assumptions and open questions
- Assumption: <labeled assumption>
- Open question: <unresolved item and effect>

## Integrity note
- Verified: <checks completed>
- Warnings: <noncritical issues>
- Unverified: <checks that could not be completed>
```

## Output Schema — Full (Agent Mode)

```markdown
---
schema: signalmode-refresh-handoff
schema_version: 2.0
status: <ready | ready_with_warnings>
created_at: <ISO 8601 timestamp>
level: full
destination: <local | portable>
recipient: agent
risk: <low | medium | high>
checkpoint: <not_started | A# completed | custom checkpoint>
---

# Continuation contract: <goal>

Handoff reason: <why this was created>
Objective: <single measurable objective>

## Execution contract
- Scope: <what may be changed or investigated>
- Allowed: <authorized operations>
- Do not change: <protected areas or non-goals>
- Approval gates: <actions requiring confirmation>
- Completion report: <required final evidence>

## Observed state
- <verified current state>

## Intended state
- <desired result not yet proven complete>

## Decisions
- D1: <active decision> | rationale: <brief reason> | evidence: <source or status>

## Action plan

### Immediate

#### A1 — <VERB> <objective>
- Inputs: <R# or explicit input>
- Depends on: <A# or none>
- Expected output: <artifact or state>
- Validate: <observable check>
- Stop if: <condition>
- Approval required: <yes/no and when>
- Repeat safety: <safe to rerun | verify first | do not rerun>

### Queued
- A2: <VERB> <objective> | depends on: <A#> | output: <result>

## Success criteria
- S1: <observable measurable condition>

## Recovery point
- Risk: <medium or high>
- Last known-good state: <R# or not verified>
- Rollback validation: <check>

## Resource manifest
- R1 | locator: `<normalized locator>` | purpose: <purpose> | access: <status> | freshness: <class> | verified_at: <timestamp or unverified>

## Integrity
- Verified: <checks completed>
- Warnings: <noncritical issues>
- Unverified: <checks unavailable>
```

## Token Refresh Protocol

After completing the handoff, always conclude with:

> ⚠️ **TOKEN REFRESH PROTOCOL ACTIVATED**: Session memory compiled to `memory/history/` and maps updated. To drop your context token count to zero, please type `/clear` now. You can resume immediately by typing: *Resume from today's history log.*

## Readiness Gate

**Hard blockers — set status to `blocked` when:**
- The objective is missing or materially ambiguous.
- A material contradiction makes the first action unsafe.
- A critical dependency is inaccessible and cannot be carried.
- A live secret remains exposed.
- A high-risk operation lacks a verified usable recovery path.
- The recipient cannot safely determine where to begin.

**Warnings — set status to `ready_with_warnings` when:**
- An optional resource is unverified.
- A noncritical external dependency may be stale.
- A secondary open question remains.

## Boundaries

- Never include passwords, API keys, access tokens, or live authentication material in the handoff.
- Replace secret values with environment-variable names or credential labels.
- Portable mode must not expose sender-local absolute paths.
- Never invent a file, path, completion claim, or recovery point.
