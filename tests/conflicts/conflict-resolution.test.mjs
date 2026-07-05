/**
 * SignalMode Conflict Resolution Tests
 * Tests that rule conflicts are resolved correctly per the precedence hierarchy.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

describe('Conflict: Preservation > Word Bans', () => {
  it('signalmode-human SKILL.md has a preserve_exactly or contextual exception clause', () => {
    const content = readFileSync(join(ROOT, 'skills/signalmode-human/SKILL.md'), 'utf8');
    const hasException = content.includes('Preserve Exactly') ||
                         content.includes('preserve_exactly') ||
                         content.includes('user-provided copy') ||
                         content.includes('contextually necessary');
    assert.ok(hasException, 'signalmode-human must have an exception clause for user-provided terms');
  });

  it('human-writing.yaml has a preserve_exactly class', () => {
    const content = readFileSync(join(ROOT, 'rules/human-writing.yaml'), 'utf8');
    assert.ok(content.includes('preserve_exactly'), 'human-writing.yaml must have preserve_exactly class');
  });
});

describe('Conflict: Safety > Compression', () => {
  it('signalmode core SKILL.md has a safety exception', () => {
    const content = readFileSync(join(ROOT, 'skills/signalmode/SKILL.md'), 'utf8');
    const hasSafetyException = content.toLowerCase().includes('security') &&
                               (content.includes('exception') || content.includes('Exception'));
    assert.ok(hasSafetyException, 'Core skill must have a safety exception that overrides compression');
  });
});

describe('Conflict: "Immutable" Language Removed', () => {
  it('signalmode-human SKILL.md does not use "immutable" without "protected" qualifier', () => {
    const content = readFileSync(join(ROOT, 'skills/signalmode-human/SKILL.md'), 'utf8');
    const hasImmutableOnly = content.includes('immutable') && !content.includes('protected');
    assert.ok(!hasImmutableOnly, 'signalmode-human must use "protected" policy language, not "immutable"');
  });
});

describe('Conflict: Uncertainty Hedging Allowed When Evidence Incomplete', () => {
  it('communication.yaml allows hedging when evidence is incomplete', () => {
    const content = readFileSync(join(ROOT, 'rules/communication.yaml'), 'utf8');
    assert.ok(
      content.includes('incomplete') || content.includes('uncertainty') || content.includes('unless evidence'),
      'communication.yaml must allow hedging when evidence is genuinely incomplete'
    );
  });
});

describe('Conflict: Code Preservation Across All Skills', () => {
  const SKILLS = ['signalmode', 'signalmode-human', 'signalmode-voice', 'signalmode-basic-english'];
  for (const skill of SKILLS) {
    it(`${skill}/SKILL.md has a code preservation clause`, () => {
      const path = join(ROOT, 'skills', skill, 'SKILL.md');
      if (!existsSync(path)) return; // Skip if skill doesn't exist
      const content = readFileSync(path, 'utf8');
      const hasCodeClause = content.toLowerCase().includes('code') ||
                            content.includes('code block') ||
                            content.includes('inline code');
      assert.ok(hasCodeClause, `${skill}/SKILL.md must have a code preservation clause`);
    });
  }
});

describe('SignalCrew Repair Loop', () => {
  it('signalcrew SKILL.md has a repair loop', () => {
    const content = readFileSync(join(ROOT, 'skills/signalcrew/SKILL.md'), 'utf8');
    assert.ok(content.includes('Repair Loop') || content.includes('repair loop'), 'SignalCrew must have a repair loop');
  });

  it('signalcrew SKILL.md has decision levels', () => {
    const content = readFileSync(join(ROOT, 'skills/signalcrew/SKILL.md'), 'utf8');
    assert.ok(content.includes('Level 4') || content.includes('level_4'), 'SignalCrew must define Level 4 (hard blocker)');
  });

  it('signalcrew-reviewer.md has a report contract', () => {
    const content = readFileSync(join(ROOT, 'agents/signalcrew-reviewer.md'), 'utf8');
    assert.ok(content.includes('Result:'), 'Reviewer must have a report contract with Result field');
    assert.ok(content.includes('Next action:'), 'Reviewer must have a Next action field in report contract');
  });

  it('signalcrew-builder.md has a report contract', () => {
    const content = readFileSync(join(ROOT, 'agents/signalcrew-builder.md'), 'utf8');
    assert.ok(content.includes('Result:'), 'Builder must have a report contract with Result field');
  });
});
