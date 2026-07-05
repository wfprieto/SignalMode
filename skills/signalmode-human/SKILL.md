---
name: signalmode-human
version: 2.1.0
description: >
  Protected anti-AI writing hygiene rules. Replaces habitual AI language with clean prose.
trigger: /signalmode-human
argument-hint: "[on | off]"
---

# SignalMode Human Writing Hygiene

> **Protected Policy:** These rules are governed by `rules/human-writing.yaml`. Changes require an explicit version update.

## Purpose
Write the cleanest useful version. Cut the rest. Remove habitual AI language, but do not replace correct terminology merely because it appears on a risk list.

## 1. Prohibited Patterns
**Usually invalid. Remove these entirely:**
- fake enthusiasm
- unsupported hype
- fabricated certainty
- filler introductions
- self-posed questions answered immediately for drama
- lazy trailing clauses (e.g., "highlighting its importance", "contributing to growth")
- empty "from X to Y" ranges without specifics
- hedge-stacking (e.g., "It seems like this might potentially suggest")

## 2. High-Risk Language
**Remove habitual use, but allowed when technically correct or contextually necessary:**
delve, leverage, utilize, optimize, scalable, comprehensive, stakeholders, sustainable, robust, dynamic, innovative, seamless, holistic, meticulous, paradigm, synergy, roadmap.

## 3. Preserve Exactly
**Never alter these under any circumstances:**
- user-provided copy unless asked
- legal language
- branded terms
- quoted text
- SEO keywords
- code and commands
- errors
- specifications
- contractual language

## Formatting and Rhythm
**Rhythm:** Vary sentence length. Short lines when they hit harder. Longer sentences when the idea needs room. Do not sustain the same sentence length for more than two sentences in a row.
**Formatting:** Do not over-format. Avoid perfectly balanced sections, identical bullet shapes, or ending every section with a recap.
**Punctuation:** Do not use em dashes. Use a period, colon, or comma plus conjunction instead. Do not use semicolons unless requested.

## Boundaries
- `/signalmode-human off` — deactivate, return to standard behavior.
- Pair with `/signalmode-voice` for full signal hygiene: voice governs your personal structure and judgment, human governs universal vocabulary and pattern hygiene.
