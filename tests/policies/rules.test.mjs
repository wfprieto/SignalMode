/**
 * SignalMode Policy Tests
 * Tests the canonical rule registry for structural integrity.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

function readRule(name) {
  return readFileSync(join(ROOT, 'rules', name), 'utf8');
}

describe('Rule Registry', () => {
  const RULE_FILES = ['precedence.yaml', 'integrity.yaml', 'communication.yaml', 'human-writing.yaml', 'execution.yaml'];

  for (const rf of RULE_FILES) {
    it(`rules/${rf} exists`, () => {
      assert.ok(existsSync(join(ROOT, 'rules', rf)), `rules/${rf} must exist`);
    });

    it(`rules/${rf} has version field`, () => {
      const content = readRule(rf);
      assert.ok(content.includes('version:'), `rules/${rf} must have a version field`);
    });

    it(`rules/${rf} has change_control field`, () => {
      const content = readRule(rf);
      assert.ok(content.includes('change_control:'), `rules/${rf} must have a change_control field`);
    });
  }
});

describe('Precedence Rules', () => {
  it('precedence.yaml has at least 7 precedence levels', () => {
    const content = readRule('precedence.yaml');
    const levels = content.match(/^\s+\d+_\w+:/gm) || [];
    assert.ok(levels.length >= 7, `Must have at least 7 precedence levels, found ${levels.length}`);
  });

  it('safety is the highest precedence level', () => {
    const content = readRule('precedence.yaml');
    assert.ok(content.includes('1_safety'), 'Safety must be the first (highest) precedence level');
  });
});

describe('Human Writing Rules', () => {
  it('human-writing.yaml has three classes', () => {
    const content = readRule('human-writing.yaml');
    assert.ok(content.includes('prohibited_patterns'), 'Must have prohibited_patterns class');
    assert.ok(content.includes('high_risk_language'), 'Must have high_risk_language class');
    assert.ok(content.includes('preserve_exactly'), 'Must have preserve_exactly class');
  });

  it('human-writing.yaml does not use the word "immutable"', () => {
    const content = readRule('human-writing.yaml');
    assert.ok(!content.includes('immutable'), 'human-writing.yaml must not use "immutable" — use "protected" instead');
  });
});

describe('Execution Rules', () => {
  it('execution.yaml defines decision levels', () => {
    const content = readRule('execution.yaml');
    assert.ok(content.includes('level_1'), 'Must define level_1');
    assert.ok(content.includes('level_4'), 'Must define level_4 (hard blocker)');
  });

  it('execution.yaml has a report_contract', () => {
    const content = readRule('execution.yaml');
    assert.ok(content.includes('report_contract'), 'Must have a report_contract section');
  });
});

describe('Platform Registry', () => {
  it('platforms/registry.yaml exists', () => {
    assert.ok(existsSync(join(ROOT, 'platforms/registry.yaml')), 'platforms/registry.yaml must exist');
  });

  it('platforms/registry.yaml has all 10 required platforms', () => {
    const content = readFileSync(join(ROOT, 'platforms/registry.yaml'), 'utf8');
    const platforms = ['claude', 'claudecode', 'chatgpt', 'codex', 'copilot', 'cursor', 'gemini', 'manus', 'replit', 'windsurf'];
    for (const p of platforms) {
      assert.ok(content.includes(`${p}:`), `platforms/registry.yaml must include platform: ${p}`);
    }
  });
});
