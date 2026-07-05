#!/usr/bin/env node
// SignalMode — Claude Code SessionStart activation hook
//
// Runs on every session start:
//   1. Writes flag file at $CLAUDE_CONFIG_DIR/.signalmode-active (statusline reads this)
//   2. Emits SignalMode ruleset as hidden SessionStart context
//   3. Detects missing statusline config and emits setup nudge

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { getDefaultMode, safeWriteFlag, recordModeChange } = require('./signalmode-config');

const claudeDir  = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath   = path.join(claudeDir, '.signalmode-active');

// Apply per-agent model overrides from env vars before emitting rules.
// Best-effort: any error is swallowed so SessionStart is never blocked.
try {
  const { applyOverrides, resolvePluginRoot } = require('./signalcrew-model-overrides');
  applyOverrides(resolvePluginRoot(__dirname));
} catch (e) {}

const mode = getDefaultMode();

// "off" mode — skip activation entirely, don't write flag or emit rules
if (mode === 'off') {
  recordModeChange(claudeDir, null);
  try { fs.unlinkSync(flagPath); } catch (e) {}
  process.stdout.write('OK');
  process.exit(0);
}

// 1. Write flag file (symlink-safe)
recordModeChange(claudeDir, mode);
safeWriteFlag(flagPath, mode);

// 2. Emit full SignalMode ruleset, filtered to the active intensity level.
//    Full rules with examples anchor behavior much more reliably than a
//    2-sentence summary — models drift back to verbose mid-conversation
//    without the full context.
//
//    Reads SKILL.md at runtime so edits propagate automatically.

const INDEPENDENT_MODES = new Set(['commit', 'review', 'compress', 'basic-english', 'refresh', 'voice', 'human', 'signalcrew']);
if (INDEPENDENT_MODES.has(mode)) {
  process.stdout.write('SIGNALMODE ACTIVE — level: ' + mode + '. Behavior defined by /signalmode-' + mode + ' skill.');
  process.exit(0);
}

// Resolve the canonical label for wenyan alias
const modeLabel = mode === 'wenyan' ? 'wenyan-full' : mode;

// Read SKILL.md — the single source of truth for SignalMode behavior.
const skillCandidates = [];
if (process.env.CLAUDE_PLUGIN_ROOT) {
  skillCandidates.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'skills', 'signalmode', 'SKILL.md'));
}
skillCandidates.push(
  path.join(__dirname, '..', '..', 'skills', 'signalmode', 'SKILL.md'),
  path.join(__dirname, '..', 'skills', 'signalmode', 'SKILL.md')
);

let skillContent = '';
for (const candidate of skillCandidates) {
  try {
    skillContent = fs.readFileSync(candidate, 'utf8');
    break;
  } catch (e) {}
}

if (!skillContent) {
  // Hardcoded fallback — minimal ruleset if SKILL.md is not found
  skillContent = `# SignalMode: ACTIVE (${modeLabel})
Drop filler, keep substance. No pleasantries, no hedging, no narration.
Pattern: [thing] [action] [reason]. [next step].
Never modify code blocks, inline code, URLs, file paths, commands, or error messages.`;
}

// Filter to the active intensity section
const sectionStart = skillContent.indexOf('## Intensity');
const filtered = sectionStart > -1
  ? skillContent.slice(0, sectionStart) + extractIntensitySection(skillContent, modeLabel)
  : skillContent;

process.stdout.write(filtered.trim());
process.exit(0);

function extractIntensitySection(content, level) {
  // Extract just the relevant intensity level from the Intensity table
  const lines = content.split('\n');
  const tableStart = lines.findIndex(l => l.includes('## Intensity'));
  if (tableStart === -1) return '';
  return '\n\n## Active Level: ' + level + '\n' + lines.slice(tableStart, tableStart + 20).join('\n');
}
