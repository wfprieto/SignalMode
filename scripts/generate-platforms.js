#!/usr/bin/env node
/**
 * SignalMode Platform Generator
 * Generates platform adapter files in platforms/generated/ from canonical rules.
 *
 * Usage: node scripts/generate-platforms.js [--dry-run]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

// ── helpers ────────────────────────────────────────────────────────────────

function readYaml(relPath) {
  const raw = readFileSync(join(ROOT, relPath), 'utf8');
  // Minimal YAML parser for simple key: value and block structures.
  // Full YAML parsing would require a dependency; we keep this zero-dep.
  return raw;
}

function readRegistry() {
  const raw = readYaml('platforms/registry.yaml');
  const platforms = {};
  let current = null;
  for (const line of raw.split('\n')) {
    const platformMatch = line.match(/^  (\w[\w-]+):$/);
    if (platformMatch) {
      current = platformMatch[1];
      platforms[current] = {};
      continue;
    }
    if (current) {
      const fieldMatch = line.match(/^    (\w+): (.+)$/);
      if (fieldMatch) {
        platforms[current][fieldMatch[1]] = fieldMatch[2].replace(/^"(.*)"$/, '$1');
      }
    }
  }
  return platforms;
}

function readCommunicationRules() {
  const raw = readYaml('rules/communication.yaml');
  const rules = [];
  let inRules = false;
  let currentRule = null;
  for (const line of raw.split('\n')) {
    if (line.trim() === 'rules:') { inRules = true; continue; }
    if (!inRules) continue;
    const idMatch = line.match(/^  - id: (.+)$/);
    if (idMatch) { currentRule = { id: idMatch[1] }; rules.push(currentRule); continue; }
    if (currentRule) {
      const nameMatch = line.match(/^    name: "(.+)"$/);
      const textMatch = line.match(/^    text: "(.+)"$/);
      if (nameMatch) currentRule.name = nameMatch[1];
      if (textMatch) currentRule.text = textMatch[1];
    }
  }
  return rules;
}

function readPrecedenceRules() {
  const raw = readYaml('rules/precedence.yaml');
  const order = [];
  let inPrec = false;
  for (const line of raw.split('\n')) {
    if (line.trim() === 'precedence:') { inPrec = true; continue; }
    if (inPrec && line.match(/^  \d/)) {
      const m = line.match(/^  \d+_\w+: "(.+)"$/);
      if (m) order.push(m[1]);
    } else if (inPrec && !line.startsWith('  ')) {
      inPrec = false;
    }
  }
  return order;
}

function readHumanWritingRules() {
  const raw = readYaml('rules/human-writing.yaml');
  return raw;
}

function provenance(platform) {
  return `<!--
GENERATED FILE — DO NOT EDIT DIRECTLY.
Source: rules/communication.yaml + rules/precedence.yaml + rules/human-writing.yaml
Platform: ${platform}
Generator: scripts/generate-platforms.js
To update: edit the source rule files, then run \`npm run generate\`.
-->
`;
}

// ── platform-specific install instructions ─────────────────────────────────

const INSTALL_INSTRUCTIONS = {
  claudecode: `## Installation (Claude Code)

**Automatic:**
\`\`\`bash
npx signalmode
\`\`\`

**Manual:**
Add to \`.claude/settings.json\`:
\`\`\`json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node src/hooks/signalmode-activate.js" }] }]
  }
}
\`\`\`

**Trigger:** \`/signalmode\``,

  cursor: `## Installation (Cursor)

**Automatic:**
\`\`\`bash
npx signalmode
\`\`\`

**Manual:**
Add to \`.cursorrules\` in your project root.

**Trigger:** \`/signalmode\``,

  chatgpt: `## Installation (ChatGPT)

Paste the system prompt below into **Settings → Personalization → Custom Instructions**.

**Trigger:** Type \`/signalmode\` at the start of any message.`,

  claude: `## Installation (Claude Web)

Paste the system prompt below into your **Project Instructions** or at the start of a conversation.

**Trigger:** \`/signalmode\``,

  codex: `## Installation (Codex)

Add to your \`AGENTS.md\` or paste into the system prompt field.

**Trigger:** \`/signalmode\``,

  copilot: `## Installation (GitHub Copilot)

Add to \`.github/copilot-instructions.md\` in your repository.

**Trigger:** \`/signalmode\``,

  gemini: `## Installation (Gemini)

Add to your \`GEMINI.md\` file or paste into the system instructions.

**Trigger:** \`/signalmode\``,

  manus: `## Installation (Manus)

Add to your Manus project's skill directory as a \`.md\` skill file.

**Trigger:** \`/signalmode\``,

  replit: `## Installation (Replit Agent)

Paste the system prompt below into your Replit Agent's custom instructions.

**Trigger:** \`/signalmode\``,

  windsurf: `## Installation (Windsurf)

**Automatic:**
\`\`\`bash
npx signalmode
\`\`\`

**Manual:**
Add to \`.windsurfrules\` in your project root.

**Trigger:** \`/signalmode\``,
};

// ── generator ──────────────────────────────────────────────────────────────

function generatePlatformFile(platformId, meta, commRules, precOrder) {
  const name = meta.name || platformId;
  const support = meta.support || 'instructions-only';
  const install = meta.install || 'manual';
  const persistence = meta.persistence || 'project-file';
  const tested = meta.tested === 'true' ? 'Yes' : 'Partial';

  const commRulesText = commRules
    .map((r, i) => `${i + 1}. **${r.name}:** ${r.text}`)
    .join('\n');

  const precText = precOrder
    .map((p, i) => `${i + 1}. ${p}`)
    .join('\n');

  const installInstructions = INSTALL_INSTRUCTIONS[platformId] ||
    `## Installation\n\nPaste the system prompt below into your agent's instruction field.\n\n**Trigger:** \`/signalmode\``;

  return `${provenance(platformId)}# SignalMode — ${name}

**Support level:** ${support} | **Install:** ${install} | **Persistence:** ${persistence} | **Tested:** ${tested}

${installInstructions}

---

## System Prompt

Paste this into your agent's system prompt or custom instructions:

\`\`\`markdown
# SignalMode: ACTIVE

You are operating in SignalMode. Maximize signal-to-noise ratio in all communications.

## Precedence (highest to lowest)
${precText}

## Communication Rules
${commRulesText}

## Exact Preservation
Never compress or alter: code blocks, inline code, file paths, commands, URLs, error messages, user-provided copy, legal language, quoted text, specifications.

## Uncertainty
State uncertainty explicitly when evidence is incomplete. "may", "likely", and "cannot confirm" are required when facts are not established.

## Trigger
\`/signalmode [lite|full|ultra|wenyan]\` — activate a mode.
\`/signalmode off\` — deactivate.
\`/signalmode-basic-english\` — plain language reports.
\`/signalmode-human\` — anti-AI writing hygiene.
\`/signalmode-voice\` — personal voice template.
\`/signalcrew\` — multi-agent crew.
\`/signalmode-help\` — list all commands.
\`\`\`

---

## Platform Notes

| Property | Value |
|---|---|
| Support Level | ${support} |
| Installation | ${install} |
| Persistence | ${persistence} |
| Tested | ${tested} |

*Generated from canonical rules. Do not edit this file directly.*
*Source: \`rules/communication.yaml\`, \`rules/precedence.yaml\`*
*Run \`npm run generate\` to regenerate.*
`;
}

// ── main ───────────────────────────────────────────────────────────────────

function main() {
  console.log(`SignalMode Platform Generator${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log('─'.repeat(50));

  const registry = readRegistry();
  const commRules = readCommunicationRules();
  const precOrder = readPrecedenceRules();

  const outDir = join(ROOT, 'platforms', 'generated');
  if (!DRY_RUN) {
    mkdirSync(outDir, { recursive: true });
  }

  let generated = 0;
  let skipped = 0;

  for (const [platformId, meta] of Object.entries(registry)) {
    const content = generatePlatformFile(platformId, meta, commRules, precOrder);
    const outPath = join(outDir, `${platformId}.md`);

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would write: platforms/generated/${platformId}.md`);
      skipped++;
    } else {
      writeFileSync(outPath, content, 'utf8');
      console.log(`✓ platforms/generated/${platformId}.md`);
      generated++;
    }
  }

  console.log('─'.repeat(50));
  console.log(`${DRY_RUN ? 'Would generate' : 'Generated'}: ${generated + skipped} files`);
  console.log('Done.');
}

main();
