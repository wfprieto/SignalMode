#!/usr/bin/env node
// SignalMode — Claude Code PreToolUse / UserMessage mode tracker hook
//
// Intercepts /signalmode, /signalmode-stats, /signalmode-refresh, etc.
// and handles them without consuming LLM tokens.

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { getDefaultMode, setDefaultMode, safeWriteFlag, recordModeChange, VALID_MODES } = require('./signalmode-config');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath  = path.join(claudeDir, '.signalmode-active');

// Read the hook input from stdin
let inputRaw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { inputRaw += chunk; });
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(inputRaw); } catch (e) { respond(null); return; }

  const message = (input.message || input.tool_input?.prompt || '').trim();

  // /signalmode-stats
  if (/^\/signalmode-stats\b/.test(message)) {
    const stats = readStats(claudeDir);
    respond({ decision: 'block', reason: formatStats(stats) });
    return;
  }

  // /signalmode-help
  if (/^\/signalmode-help\b/.test(message)) {
    const helpText = readSkillContent('signalmode-help', 'SKILL.md');
    respond({ decision: 'block', reason: helpText || 'See skills/signalmode-help/SKILL.md' });
    return;
  }

  // /signalmode [mode]
  const modeMatch = message.match(/^\/signalmode(?:\s+(lite|full|ultra|wenyan|wenyan-lite|wenyan-full|wenyan-ultra|off))?\s*$/i);
  if (modeMatch) {
    const newMode = (modeMatch[1] || 'full').toLowerCase();
    setDefaultMode(newMode, claudeDir);
    recordModeChange(claudeDir, newMode);
    if (newMode === 'off') {
      try { fs.unlinkSync(flagPath); } catch (e) {}
      respond({ decision: 'block', reason: 'SignalMode deactivated. Normal response mode restored.' });
    } else {
      safeWriteFlag(flagPath, newMode);
      respond({ decision: 'block', reason: 'SignalMode activated: ' + newMode + '. Type /signalmode-help to see all skills.' });
    }
    return;
  }

  // /signalmode-voice [on|off]
  const voiceMatch = message.match(/^\/signalmode-voice(?:\s+(on|off))?\s*$/i);
  if (voiceMatch) {
    const newMode = (voiceMatch[1] || 'on').toLowerCase() === 'off' ? 'off' : 'voice';
    setDefaultMode(newMode, claudeDir);
    recordModeChange(claudeDir, newMode);
    if (newMode === 'off') {
      respond({ decision: 'block', reason: 'SignalMode Voice deactivated.' });
    } else {
      safeWriteFlag(flagPath, newMode);
      respond({ decision: 'block', reason: 'SignalMode Voice activated. Verdict-first structure, calm authority, no corporate theater. Pair with /signalmode-human for full signal hygiene.' });
    }
    return;
  }

  // /signalmode-human [on|off]
  const humanMatch = message.match(/^\/signalmode-human(?:\s+(on|off))?\s*$/i);
  if (humanMatch) {
    const newMode = (humanMatch[1] || 'on').toLowerCase() === 'off' ? 'off' : 'human';
    setDefaultMode(newMode, claudeDir);
    recordModeChange(claudeDir, newMode);
    if (newMode === 'off') {
      respond({ decision: 'block', reason: 'SignalMode Human deactivated.' });
    } else {
      safeWriteFlag(flagPath, newMode);
      respond({ decision: 'block', reason: 'SignalMode Human activated. All AI writing tells removed. Pair with /signalmode-voice for full signal hygiene.' });
    }
    return;
  }

  // /signalmode-basic-english [on|off]
  const beMatch = message.match(/^\/signalmode-basic-english(?:\s+(on|off))?\s*$/i);
  if (beMatch) {
    const newMode = (beMatch[1] || 'on').toLowerCase() === 'off' ? 'off' : 'basic-english';
    setDefaultMode(newMode, claudeDir);
    recordModeChange(claudeDir, newMode);
    if (newMode === 'off') {
      respond({ decision: 'block', reason: 'SignalMode Basic English deactivated.' });
    } else {
      safeWriteFlag(flagPath, newMode);
      respond({ decision: 'block', reason: 'SignalMode Basic English activated. All responses will use plain, layman-friendly language with the 5-section report structure.' });
    }
    return;
  }

  // Pass through — not a SignalMode command
  respond(null);
});

function respond(result) {
  if (result === null) {
    process.stdout.write(JSON.stringify({ decision: 'allow' }));
  } else {
    process.stdout.write(JSON.stringify(result));
  }
  process.exit(0);
}

function readStats(claudeDir) {
  // Read the Claude Code session log and compute token stats
  const logPath = path.join(claudeDir, 'usage.json');
  try {
    const raw = fs.readFileSync(logPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function formatStats(stats) {
  if (!stats) {
    return 'SignalMode Stats — No session data available yet.\nStart a session with /signalmode to begin tracking.';
  }
  const saved = Math.max(0, (stats.baseline_tokens || 0) - (stats.input_tokens || 0));
  const pct   = stats.baseline_tokens > 0
    ? Math.round(saved / stats.baseline_tokens * 100)
    : 0;
  return [
    'SignalMode Stats — Current Session',
    '─────────────────────────────────────',
    'Input tokens used:      ' + (stats.input_tokens  || 0).toLocaleString(),
    'Output tokens used:     ' + (stats.output_tokens || 0).toLocaleString(),
    'Estimated baseline:     ' + (stats.baseline_tokens || 0).toLocaleString(),
    'Tokens saved:           ' + saved.toLocaleString() + '  (' + pct + '%)',
    '',
    'Mode: ' + (stats.mode || 'full'),
  ].join('\n');
}

function readSkillContent(skillName, filename) {
  const candidates = [
    path.join(__dirname, '..', '..', 'skills', skillName, filename),
    path.join(__dirname, '..', 'skills', skillName, filename),
  ];
  for (const c of candidates) {
    try { return fs.readFileSync(c, 'utf8'); } catch (e) {}
  }
  return null;
}
