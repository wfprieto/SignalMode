// SignalMode — configuration utilities for hooks
// Shared by signalmode-activate.js, signalmode-mode-tracker.js, signalmode-stats.js

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const VALID_MODES = new Set([
  'lite', 'full', 'ultra',
  'wenyan', 'wenyan-lite', 'wenyan-full', 'wenyan-ultra',
  'commit', 'review', 'compress', 'basic-english', 'refresh',
  'voice', 'human',
  'off',
]);

const DEFAULT_MODE = 'full';

/**
 * Read the current SignalMode default from the config file.
 * Config file: $CLAUDE_CONFIG_DIR/.signalmode-config (or ~/.claude/.signalmode-config)
 * Falls back to DEFAULT_MODE if missing or invalid.
 */
function getDefaultMode() {
  const claudeDir  = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  const configPath = path.join(claudeDir, '.signalmode-config');
  try {
    const raw = fs.readFileSync(configPath, 'utf8').trim().toLowerCase();
    if (VALID_MODES.has(raw)) return raw;
  } catch (e) {}
  return DEFAULT_MODE;
}

/**
 * Write the mode to the config file.
 */
function setDefaultMode(mode, claudeDir) {
  if (!VALID_MODES.has(mode)) throw new Error('Invalid mode: ' + mode);
  const configPath = path.join(claudeDir, '.signalmode-config');
  safeWriteFlag(configPath, mode);
}

/**
 * Write a flag file safely (no symlink clobber attack surface).
 * Creates parent directories if needed.
 */
function safeWriteFlag(flagPath, content) {
  try {
    const dir = path.dirname(flagPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    // Unlink first to avoid following symlinks
    try { fs.unlinkSync(flagPath); } catch (e) {}
    fs.writeFileSync(flagPath, content || '', { flag: 'wx' });
  } catch (e) {
    // Silent fail — hooks must never block session start
  }
}

/**
 * Record a mode change to the transition log.
 * Log file: $CLAUDE_CONFIG_DIR/.signalmode-transitions.log
 */
function recordModeChange(claudeDir, mode) {
  try {
    const logPath = path.join(claudeDir, '.signalmode-transitions.log');
    const entry   = new Date().toISOString() + ' ' + (mode || 'off') + '\n';
    fs.appendFileSync(logPath, entry);
  } catch (e) {}
}

module.exports = { getDefaultMode, setDefaultMode, safeWriteFlag, recordModeChange, VALID_MODES };
