#!/usr/bin/env node
/**
 * SignalMode Platform Generator
 * Generates active platform adapter files directly from canonical rules.
 * Output path is determined by generator_target in platforms/registry.yaml.
 *
 * Usage: node scripts/generate-platforms.mjs [--dry-run]
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
      // Support keys with underscores (e.g. generator_target) and quoted/unquoted values
      const fieldMatch = line.match(/^    ([\w_]+): (.+)$/);
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
  // Extract the three-class word system for inclusion in platform files
  // Actual YAML structure uses: prohibited_patterns.items, high_risk_language.words
  const prohibited = [];
  const highRisk = [];
  let section = null;
  for (const line of raw.split('\n')) {
    if (line.match(/^  prohibited_patterns:/)) { section = 'prohibited'; continue; }
    if (line.match(/^  high_risk_language:/)) { section = 'high_risk'; continue; }
    if (line.match(/^  preserve_exactly:/)) { section = null; continue; }
    if (line.match(/^  \w/) && section) { section = null; continue; } // new top-level key
    if (section === 'prohibited' && line.match(/^      - /)) {
      const m = line.match(/^      - "?([^"\n]+?)"?$/);
      if (m) prohibited.push(m[1].replace(/^"(.*)"$/, '$1'));
    }
    if (section === 'high_risk' && line.match(/^      - /)) {
      const m = line.match(/^      - "?([^"\n]+?)"?$/);
      if (m) highRisk.push(m[1].replace(/^"(.*)"$/, '$1'));
    }
  }
  return { prohibited, highRisk };
}

function provenance(platform) {
  return `<!--
GENERATED FILE — DO NOT EDIT DIRECTLY.
Source: rules/communication.yaml + rules/precedence.yaml + rules/human-writing.yaml
Platform: ${platform}
Generator: scripts/generate-platforms.mjs
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

function generatePlatformFile(platformId, meta, commRules, precOrder, humanRules) {
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

  // Build human-writing section from canonical rules/human-writing.yaml
  const prohibitedText = humanRules.prohibited.length
    ? `**Prohibited patterns (always wrong):** ${humanRules.prohibited.slice(0, 12).join(', ')}${humanRules.prohibited.length > 12 ? ', and more' : ''}.`
    : '';
  const highRiskText = humanRules.highRisk.length
    ? `**High-risk language (context-dependent):** ${humanRules.highRisk.slice(0, 8).join(', ')}${humanRules.highRisk.length > 8 ? ', and more' : ''}.`
    : '';

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

## Writing Hygiene
${prohibitedText}
${highRiskText}

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
  const humanRules = readHumanWritingRules();

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const [platformId, meta] of Object.entries(registry)) {
    // Write directly to the active platform file via generator_target.
    // This ensures the installer, README, and INSTALL.md always reference up-to-date content.
    const target = meta.generator_target || `${platformId}.md`;
    const outPath = join(ROOT, 'platforms', target);
    const content = generatePlatformFile(platformId, meta, commRules, precOrder, humanRules);

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would write: platforms/${target}`);
      skipped++;
    } else {
      try {
        writeFileSync(outPath, content, 'utf8');
        console.log(`✓ platforms/${target}`);
        generated++;
      } catch (e) {
        console.error(`✗ platforms/${target}: ${e.message}`);
        errors++;
      }
    }
  }

  console.log('─'.repeat(50));
  console.log(`${DRY_RUN ? 'Would generate' : 'Generated'}: ${generated + skipped} files${errors ? `, ${errors} errors` : ''}`);
  if (errors > 0) process.exit(1);
  console.log('Done.');
}

main();
