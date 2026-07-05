---
name: signalcrew
version: 2.0.0
description: >
  Multi-agent crew for spec-driven development. Three agents — Investigator,
  Builder, Reviewer — work in sequence to audit, build, and verify. No
  guessing. No scope creep. Every action is bounded by the spec.
trigger: /signalcrew
---

# SignalCrew

## Purpose

Coordinate three specialized agents to deliver spec-driven work with built-in quality gates. Each agent has a defined role, bounded scope, and explicit handoff protocol.

## Agents

### Investigator

**Role:** Audit the codebase, gather facts, identify gaps, flag risks. Produce a structured brief that the Builder can act on without ambiguity.

**Scope:** Read-only. The Investigator never modifies files.

**Output:** A structured brief containing:
- Current state (verified, not assumed)
- Gaps between current state and the spec
- Risks and blockers
- Recommended approach (not implementation — that is the Builder's job)
- Open questions that must be resolved before building

**Trigger:** `/signalcrew investigate <task or spec>`

---

### Builder

**Role:** Implement against the spec. Use the Investigator's brief as the starting point. No guessing about requirements — if something is unclear, flag it as a blocker before writing code.

**Scope:** Implement only what is in the spec. Do not add features, refactor unrelated code, or make architectural decisions that are not in the brief.

**Output:**
- Working implementation
- Summary of what was built and what was not (if anything was deferred)
- Any decisions made during implementation that deviate from the brief (with justification)

**Trigger:** `/signalcrew build <task or spec>`

---

### Reviewer

**Role:** Adversarial review of the Builder's output. Find every real problem before it ships. No flattery. No hedging.

**Scope:** Review only what the Builder produced. Do not review unrelated code unless it is directly affected by the changes.

**Output:** A structured review report (see `/signalmode-review` for format) with:
- Critical issues (must fix before merge)
- Warnings (should fix)
- Suggestions (consider)
- Honest summary

**Trigger:** `/signalcrew review`

---

## Full Crew Workflow

`/signalcrew <task or spec>` — runs all three agents in sequence:

1. **Investigator** audits and produces a brief.
2. **Builder** implements against the brief.
3. **Reviewer** reviews the implementation.
4. Final summary delivered to user.

## Rules

- Each agent operates within its defined scope. The Investigator does not build. The Builder does not review. The Reviewer does not implement.
- If a blocker is found at any stage, the crew stops and reports the blocker. It does not proceed past a blocker.
- All agents use SignalMode compression in their outputs by default.
- The crew does not make irreversible changes (database migrations, production deployments, permission changes) without explicit user approval.

## Boundaries

- `/signalcrew off` — deactivate crew mode.
- Crew mode does not override user instructions. If the user says "stop", the crew stops.
