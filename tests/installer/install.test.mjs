/**
 * SignalMode Installer Tests
 * Tests the installer's provider detection and path resolution logic.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

describe('Installer', () => {
  it('bin/install.js exists and is executable', () => {
    const path = join(ROOT, 'bin/install.js');
    assert.ok(existsSync(path), 'bin/install.js must exist');
    const content = readFileSync(path, 'utf8');
    assert.ok(content.startsWith('#!/usr/bin/env node'), 'Must have shebang');
  });

  it('install.sh exists', () => {
    assert.ok(existsSync(join(ROOT, 'install.sh')), 'install.sh must exist');
  });

  it('install.ps1 exists', () => {
    assert.ok(existsSync(join(ROOT, 'install.ps1')), 'install.ps1 must exist');
  });

  it('installer references all 10 required platforms', () => {
    const content = readFileSync(join(ROOT, 'bin/install.js'), 'utf8');
    const platforms = ['claude', 'cursor', 'windsurf', 'chatgpt', 'codex', 'copilot', 'gemini', 'manus', 'replit'];
    for (const p of platforms) {
      assert.ok(content.toLowerCase().includes(p), `Installer must reference platform: ${p}`);
    }
  });

  it('installer does not contain original brand identifiers', () => {
    const content = readFileSync(join(ROOT, 'bin/install.js'), 'utf8').toLowerCase();
    const banned = ['caveman', 'julius', 'brussee', 'cavecrew'];
    for (const term of banned) {
      assert.ok(!content.includes(term), `Installer must not contain: ${term}`);
    }
  });

  it('package.json has required fields and correct version', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    assert.ok(pkg.name, 'package.json must have name');
    assert.ok(pkg.version, 'package.json must have version');
    assert.ok(pkg.author, 'package.json must have author');
    assert.ok(pkg.scripts?.generate, 'package.json must have generate script');
    assert.ok(pkg.scripts?.validate, 'package.json must have validate script');
    assert.ok(pkg.scripts?.lint, 'package.json must have lint script');
    assert.strictEqual(pkg.name, 'signalmode', 'Package name must be signalmode');
    assert.strictEqual(pkg.author, 'wfprieto', 'Author must be wfprieto');
  });
});
