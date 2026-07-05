#!/usr/bin/env node
/**
 * SignalMode Prompt Linter
 * Checks SKILL.md and platform files for instruction conflicts and quality issues.
 *
 * Usage: node scripts/lint-prompts.js
 * Exit code 0 = pass, 1 = fail
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let passed = 0;
let failed = 0;
let warned = 0;

function pass(msg) { console.log(`  ✓ ${msg}`); passed++; }
function fail(msg) { console.error(`  ✗ FAIL: ${msg}`); failed++; }
function warn(msg) { console.warn(`  ⚠ WARN: ${msg}`); warned++; }
function section(name) { console.log(`\n── ${name} ──`); }

// ── Conflict test cases ────────────────────────────────────────────────────

section('Conflict Resolution Tests');

const CONFLICT_TESTS = [
  {
    id: 'CONF-001',
    description: 'User asks for a "comprehensive roadmap" — preservation and user intent must win over word bans',
    check: () => {
      const humanSkill = readFileSync(join(ROOT, 'skills/signalmode-human/SKILL.md'), 'utf8');
      // The skill should have a preserve_exactly or contextual exception section
      const hasException = humanSkill.includes('preserve_exactly') ||
                           humanSkill.includes('Preserve Exactly') ||
                           humanSkill.includes('user-provided copy') ||
                           humanSkill.includes('contextually necessary');
      return { pass: hasException, detail: hasException ? 'Exception clause present' : 'Missing exception clause for user-provided terms' };
    }
  },
  {
    id: 'CONF-002',
    description: 'Safety warning must not be compressed — safety > compression',
    check: () => {
      const coreSkill = readFileSync(join(ROOT, 'skills/signalmode/SKILL.md'), 'utf8');
      const hasSafetyException = coreSkill.toLowerCase().includes('security') &&
                                 (coreSkill.includes('exception') || coreSkill.includes('Exception'));
      return { pass: hasSafetyException, detail: hasSafetyException ? 'Safety exception present' : 'Missing safety exception in core skill' };
    }
  },
  {
    id: 'CONF-003',
    description: '"Immutable" language must not appear in signalmode-human — use protected versioned policy instead',
    check: () => {
      const humanSkill = readFileSync(join(ROOT, 'skills/signalmode-human/SKILL.md'), 'utf8');
      const hasImmutable = humanSkill.includes('immutable') && !humanSkill.includes('protected');
      return { pass: !hasImmutable, detail: !hasImmutable ? 'No unguarded "immutable" language' : 'Still contains "immutable" without "protected" qualifier' };
    }
  },
  {
    id: 'CONF-004',
    description: 'Uncertainty hedging must be allowed when evidence is incomplete',
    check: () => {
      const manus = readFileSync(join(ROOT, 'platforms/manus.md'), 'utf8');
      const hasUncertaintyException = manus.includes('incomplete') || manus.includes('uncertainty') || manus.includes('cannot confirm');
      return { pass: hasUncertaintyException, detail: hasUncertaintyException ? 'Uncertainty exception present in manus.md' : 'Missing uncertainty exception in manus.md' };
    }
  },
  {
    id: 'CONF-005',
    description: 'Code blocks must never be altered by any skill',
    check: () => {
      const skills = ['signalmode', 'signalmode-human', 'signalmode-voice', 'signalmode-basic-english'];
      for (const s of skills) {
        const path = join(ROOT, 'skills', s, 'SKILL.md');
        if (!existsSync(path)) continue;
        const content = readFileSync(path, 'utf8');
        if (!content.includes('code') && !content.includes('Code')) {
          return { pass: false, detail: `${s}/SKILL.md has no code preservation clause` };
        }
      }
      return { pass: true, detail: 'Code preservation mentioned in all checked skills' };
    }
  },
];

for (const test of CONFLICT_TESTS) {
  try {
    const result = test.check();
    if (result.pass) {
      pass(`[${test.id}] ${test.description} — ${result.detail}`);
    } else {
      fail(`[${test.id}] ${test.description} — ${result.detail}`);
    }
  } catch (e) {
    fail(`[${test.id}] ${test.description} — Error: ${e.message}`);
  }
}

// ── Marketing claim checks ─────────────────────────────────────────────────

section('Marketing Claim Audit');

const UNVERIFIABLE_CLAIMS = [
  'removes every detectable AI writing tell',
  '65-75%',
  '65–75%',
  'removes all AI',
  'eliminates every',
];

function scanForClaims(dir) {
  const items = readdirSync(dir);
  for (const item of items) {
    const full = join(dir, item);
    if (item === '.git' || item === 'node_modules') continue;
    if (statSync(full).isDirectory()) { scanForClaims(full); continue; }
    if (!item.endsWith('.md') && !item.endsWith('.json')) continue;
    const content = readFileSync(full, 'utf8').toLowerCase();
    for (const claim of UNVERIFIABLE_CLAIMS) {
      if (content.includes(claim.toLowerCase())) {
        warn(`Unverifiable claim "${claim}" in ${full.replace(ROOT + '/', '')}`);
      }
    }
  }
}
scanForClaims(ROOT);
if (warned === 0) pass('No unverifiable marketing claims detected');

// ── Precedence hierarchy present in key files ──────────────────────────────

section('Precedence Hierarchy References');
const KEY_FILES = ['AGENTS.md', 'GEMINI.md', 'skills/signalmode/SKILL.md'];
for (const kf of KEY_FILES) {
  const content = readFileSync(join(ROOT, kf), 'utf8');
  if (content.includes('precedence') || content.includes('Precedence') || content.includes('PREC')) {
    pass(`Precedence reference in ${kf}`);
  } else {
    warn(`No precedence reference in ${kf}`);
  }
}

// ── Summary ────────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(50));
console.log(`Passed: ${passed}  Failed: ${failed}  Warnings: ${warned}`);
if (failed > 0) {
  console.error(`\nLint FAILED with ${failed} error(s).`);
  process.exit(1);
} else {
  console.log('\nLint PASSED.');
  process.exit(0);
}
