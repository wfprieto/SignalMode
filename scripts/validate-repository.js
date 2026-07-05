#!/usr/bin/env node
/**
 * SignalMode Repository Validator
 * Validates structural integrity, version consistency, and rule compliance.
 *
 * Usage: node scripts/validate-repository.js
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

function readFile(relPath) {
  const full = join(ROOT, relPath);
  if (!existsSync(full)) return null;
  return readFileSync(full, 'utf8');
}

// ── 1. Required files exist ────────────────────────────────────────────────

section('Required Files');
const REQUIRED_FILES = [
  'package.json',
  'README.md',
  'INSTALL.md',
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  'CODEX.md',
  'CHATGPT.md',
  'rules/precedence.yaml',
  'rules/integrity.yaml',
  'rules/communication.yaml',
  'rules/human-writing.yaml',
  'rules/execution.yaml',
  'platforms/registry.yaml',
  'scripts/generate-platforms.js',
  'scripts/validate-repository.js',
  'scripts/lint-prompts.js',
];

for (const f of REQUIRED_FILES) {
  if (existsSync(join(ROOT, f))) {
    pass(f);
  } else {
    fail(`Missing: ${f}`);
  }
}

// ── 2. Platform files exist ────────────────────────────────────────────────

section('Platform Files');
const PLATFORMS = ['chatgpt', 'claude', 'claudecode', 'codex', 'copilot', 'cursor', 'gemini', 'manus', 'replit', 'windsurf', 'full-signal'];
for (const p of PLATFORMS) {
  const f = `platforms/${p}.md`;
  if (existsSync(join(ROOT, f))) {
    pass(f);
  } else {
    fail(`Missing platform file: ${f}`);
  }
}

// ── 3. SKILL.md files have required frontmatter ────────────────────────────

section('SKILL.md Frontmatter');
const skillDirs = readdirSync(join(ROOT, 'skills'));
for (const dir of skillDirs) {
  const skillPath = `skills/${dir}/SKILL.md`;
  const content = readFile(skillPath);
  if (!content) {
    fail(`Missing: ${skillPath}`);
    continue;
  }
  if (!content.includes('trigger:')) {
    fail(`Missing trigger: in ${skillPath}`);
  } else {
    pass(`trigger: present in ${skillPath}`);
  }
}

// ── 4. Version consistency ─────────────────────────────────────────────────

section('Version Consistency');
const pkg = JSON.parse(readFile('package.json') || '{}');
const pkgVersion = pkg.version;

if (!pkgVersion) {
  fail('package.json missing version field');
} else {
  pass(`package.json version: ${pkgVersion}`);
}

// Check all SKILL.md files for version field consistency
const skillFiles = [];
function collectSkills(dir) {
  const items = readdirSync(dir);
  for (const item of items) {
    const full = join(dir, item);
    if (statSync(full).isDirectory()) collectSkills(full);
    else if (item === 'SKILL.md') skillFiles.push(full);
  }
}
collectSkills(join(ROOT, 'skills'));

for (const sf of skillFiles) {
  const content = readFileSync(sf, 'utf8');
  const versionMatch = content.match(/version:\s*(\S+)/);
  if (!versionMatch) {
    warn(`No version field in ${sf.replace(ROOT, '')}`);
  }
}

// ── 5. Brand contamination check ──────────────────────────────────────────

section('Brand Hygiene');
const BANNED_TERMS = ['caveman', 'julius', 'brussee', 'cavecrew', 'dancing-rock', 'atlas-cloud'];
const SCAN_EXTS = ['.md', '.js', '.py', '.json', '.sh', '.ps1', '.yaml'];

function scanDir(dir) {
  const items = readdirSync(dir);
  for (const item of items) {
    const full = join(dir, item);
    if (item === '.git' || item === 'node_modules') continue;
    if (statSync(full).isDirectory()) {
      scanDir(full);
      continue;
    }
    if (!SCAN_EXTS.some(ext => item.endsWith(ext))) continue;
    // Skip this validator script itself — it legitimately contains banned terms as string literals
    if (full.includes('validate-repository.js') || full.includes('lint-prompts.js')) continue;
    const content = readFileSync(full, 'utf8').toLowerCase();
    for (const term of BANNED_TERMS) {
      if (content.includes(term)) {
        fail(`Brand contamination: "${term}" in ${full.replace(ROOT, '')}`);
      }
    }
  }
}
scanDir(ROOT);
if (failed === 0) pass('Zero brand contamination detected');

// ── 6. Rule file version fields present ───────────────────────────────────

section('Rule File Versions');
const RULE_FILES = ['rules/precedence.yaml', 'rules/integrity.yaml', 'rules/communication.yaml', 'rules/human-writing.yaml', 'rules/execution.yaml'];
for (const rf of RULE_FILES) {
  const content = readFile(rf);
  if (!content) { fail(`Missing: ${rf}`); continue; }
  if (content.includes('version:')) {
    pass(`version: present in ${rf}`);
  } else {
    fail(`Missing version: in ${rf}`);
  }
  if (content.includes('change_control:')) {
    pass(`change_control: present in ${rf}`);
  } else {
    warn(`Missing change_control: in ${rf}`);
  }
}

// ── 7. Generated files have provenance headers ────────────────────────────

section('Generated File Provenance');
const genDir = join(ROOT, 'platforms', 'generated');
if (existsSync(genDir)) {
  const genFiles = readdirSync(genDir).filter(f => f.endsWith('.md'));
  if (genFiles.length === 0) {
    warn('No generated platform files found. Run `npm run generate`.');
  }
  for (const gf of genFiles) {
    const content = readFileSync(join(genDir, gf), 'utf8');
    if (content.includes('GENERATED FILE')) {
      pass(`Provenance header in platforms/generated/${gf}`);
    } else {
      fail(`Missing provenance header in platforms/generated/${gf}`);
    }
  }
} else {
  warn('platforms/generated/ does not exist. Run `npm run generate`.');
}

// ── 8. No duplicate rule IDs ──────────────────────────────────────────────

section('Duplicate Rule IDs');
const allIds = [];
for (const rf of RULE_FILES) {
  const content = readFile(rf);
  if (!content) continue;
  const matches = content.matchAll(/- id: (\S+)/g);
  for (const m of matches) allIds.push(m[1]);
}
const idSet = new Set();
let dups = 0;
for (const id of allIds) {
  if (idSet.has(id)) { fail(`Duplicate rule ID: ${id}`); dups++; }
  else idSet.add(id);
}
if (dups === 0) pass(`No duplicate rule IDs (${allIds.length} rules checked)`);

// ── Summary ────────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(50));
console.log(`Passed: ${passed}  Failed: ${failed}  Warnings: ${warned}`);
if (failed > 0) {
  console.error(`\nValidation FAILED with ${failed} error(s).`);
  process.exit(1);
} else {
  console.log('\nValidation PASSED.');
  process.exit(0);
}
