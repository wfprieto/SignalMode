#!/usr/bin/env node
// SignalMode Installer
// Detects installed AI coding agents and installs SignalMode skills for each one.
// LLM-agnostic: works with Claude Code, Cursor, Windsurf, Copilot, Replit, and more.

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { execSync, spawnSync } = require('child_process');

const REPO    = 'wfprieto/SignalMode';
const VERSION = '1.0.0';

// ── Entry point ────────────────────────────────────────────────────────────
checkNodeVersion();
checkWslWindowsNode();
const opts = parseArgs(process.argv.slice(2));
if (opts.help)     { printHelp(); process.exit(0); }
if (opts.listOnly) { printProviders(); process.exit(0); }
main(opts).catch(err => { process.stderr.write(err.message + '\n'); process.exit(1); });

// ── Provider matrix ────────────────────────────────────────────────────────
// Single source of truth for all supported AI coding agents.
// Each entry: id, label, detect (clause spec), mech (install mechanism), optional soft flag.
const PROVIDERS = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    detect: 'command:claude',
    mech: 'claude-plugin',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    detect: 'command:cursor||dir:~/.cursor',
    mech: 'rules-file',
    rulesFile: '.cursorrules',
    platformFile: 'cursor.md',
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    detect: 'command:windsurf||dir:~/.codeium',
    mech: 'rules-file',
    rulesFile: '.windsurfrules',
    platformFile: 'windsurf.md',
  },
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    detect: 'command:gh||vscode-ext:github.copilot',
    mech: 'copilot-instructions',
    platformFile: 'copilot.md',
  },
  {
    id: 'replit',
    label: 'Replit',
    detect: 'dir:~/.replit||file:~/.replit/config',
    mech: 'replit-instructions',
    platformFile: 'replit.md',
    soft: true,
  },
  {
    id: 'opencode',
    label: 'opencode',
    detect: 'command:opencode',
    mech: 'opencode-plugin',
  },
  {
    id: 'aider',
    label: 'Aider',
    detect: 'command:aider',
    mech: 'aider-conventions',
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    detect: 'command:codex',
    mech: 'codex-instructions',
    platformFile: 'codex.md',
  },
  {
    id: 'continue',
    label: 'Continue',
    detect: 'vscode-ext:continue.continue||cursor-ext:continue.continue',
    mech: 'continue-instructions',
    soft: true,
  },
  {
    id: 'cline',
    label: 'Cline',
    detect: 'vscode-ext:saoudrizwan.claude-dev',
    mech: 'cline-instructions',
    soft: true,
  },
];

// ── Main ───────────────────────────────────────────────────────────────────
async function main(opts) {
  const chalk = makeChalk(opts.noColor);
  const say   = (s) => process.stdout.write(s + '\n');
  const note  = (s) => process.stdout.write(chalk.dim(s) + '\n');
  const warn  = (s) => process.stderr.write(chalk.yellow('  warning: ' + s) + '\n');

  say('');
  say(chalk.orange('SignalMode') + ' v' + VERSION + ' — Signal over noise.');
  say('');

  const repoRoot   = findRepoRoot();
  const detected   = detectProviders(opts);
  const toInstall  = opts.only.length ? PROVIDERS.filter(p => opts.only.includes(p.id)) : detected;

  if (toInstall.length === 0) {
    say('No supported AI coding agents detected.');
    say('');
    say('Supported agents: ' + PROVIDERS.map(p => p.id).join(', '));
    say('');
    say('To install for a specific agent: signalmode --only <agent-id>');
    say('To list all agents: signalmode --list');
    return;
  }

  say('Detected agents: ' + toInstall.map(p => p.label).join(', '));
  say('');

  const results = { installed: [], skipped: [], failed: [] };

  for (const provider of toInstall) {
    say('Installing SignalMode for ' + chalk.orange(provider.label) + '...');
    const r = await installProvider(provider, repoRoot, opts, chalk, say, note, warn);
    if (r.ok)      results.installed.push(provider.label);
    else if (r.skip) results.skipped.push([provider.label, r.reason]);
    else           results.failed.push([provider.label, r.reason]);
  }

  say('');
  say('─────────────────────────────────────────');

  if (results.installed.length) {
    say(chalk.green('Installed: ') + results.installed.join(', '));
  }
  if (results.skipped.length) {
    for (const [label, reason] of results.skipped) {
      note('Skipped: ' + label + ' — ' + reason);
    }
  }
  if (results.failed.length) {
    for (const [label, reason] of results.failed) {
      warn('Failed: ' + label + ' — ' + reason);
    }
  }

  say('');
  say('SignalMode installed. Start a new session and type /signalmode to activate.');
  say('Type /signalmode-help to see all available skills.');
  say('');
}

// ── Provider detection ─────────────────────────────────────────────────────
function detectProviders(opts) {
  return PROVIDERS.filter(p => {
    if (opts.all) return true;
    return evaluateDetect(p.detect);
  });
}

function evaluateDetect(spec) {
  if (!spec) return false;
  const clauses = spec.split('||');
  return clauses.some(clause => {
    const [type, value] = clause.split(':');
    const expanded = value ? value.replace('~', os.homedir()) : '';
    switch (type) {
      case 'command':
        return commandExists(expanded);
      case 'dir':
        return fs.existsSync(expanded) && fs.statSync(expanded).isDirectory();
      case 'file':
        return fs.existsSync(expanded);
      case 'vscode-ext':
        return vscodeExtExists(expanded, 'vscode');
      case 'cursor-ext':
        return vscodeExtExists(expanded, 'cursor');
      default:
        return false;
    }
  });
}

function commandExists(cmd) {
  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    execSync(which + ' ' + cmd, { stdio: 'ignore' });
    return true;
  } catch { return false; }
}

function vscodeExtExists(needle, kind) {
  const base = kind === 'cursor'
    ? path.join(os.homedir(), '.cursor', 'extensions')
    : path.join(os.homedir(), '.vscode', 'extensions');
  if (!fs.existsSync(base)) return false;
  try {
    return fs.readdirSync(base).some(d => d.toLowerCase().includes(needle.toLowerCase()));
  } catch { return false; }
}

// ── Provider installation ──────────────────────────────────────────────────
async function installProvider(provider, repoRoot, opts, chalk, say, note, warn) {
  switch (provider.mech) {
    case 'claude-plugin':
      return installClaudeCode(provider, repoRoot, opts, say, note, warn);
    case 'rules-file':
      return installRulesFile(provider, repoRoot, opts, say, note, warn);
    case 'copilot-instructions':
      return installCopilotInstructions(provider, repoRoot, opts, say, note, warn);
    case 'opencode-plugin':
      return installOpencode(provider, repoRoot, opts, say, note, warn);
    case 'aider-conventions':
      return installAider(provider, repoRoot, opts, say, note, warn);
    default:
      return installGenericInstructions(provider, repoRoot, opts, say, note, warn);
  }
}

function installClaudeCode(provider, repoRoot, opts, say, note, warn) {
  try {
    const r = spawnSync('claude', ['plugin', 'install', 'signalmode@signalmode'], {
      stdio: opts.dryRun ? 'ignore' : 'pipe',
      env: process.env,
    });
    if (opts.dryRun) { note('  [dry-run] would install claude plugin'); return { ok: true }; }
    if (r.status === 0) { note('  Claude Code plugin installed'); return { ok: true }; }
    // Fallback: write skills directly to ~/.claude/skills/
    return installSkillsToDir(
      path.join(os.homedir(), '.claude', 'skills'),
      repoRoot, opts, say, note, warn
    );
  } catch (e) {
    return installSkillsToDir(
      path.join(os.homedir(), '.claude', 'skills'),
      repoRoot, opts, say, note, warn
    );
  }
}

function installRulesFile(provider, repoRoot, opts, say, note, warn) {
  const platformFile = path.join(repoRoot, 'platforms', provider.platformFile);
  if (!fs.existsSync(platformFile)) {
    return { ok: false, reason: 'platform file not found: ' + platformFile };
  }
  const dest = path.join(process.cwd(), provider.rulesFile);
  if (fs.existsSync(dest) && !opts.force) {
    note('  ' + provider.rulesFile + ' already exists (use --force to overwrite)');
    return { skip: true, reason: 'already exists' };
  }
  if (!opts.dryRun) {
    const content = fs.readFileSync(platformFile, 'utf8');
    // Extract the code block content (between first ``` and last ```)
    const match = content.match(/```(?:markdown)?\n([\s\S]*?)```/);
    fs.writeFileSync(dest, match ? match[1] : content, 'utf8');
    note('  wrote ' + provider.rulesFile);
  } else {
    note('  [dry-run] would write ' + provider.rulesFile);
  }
  return { ok: true };
}

function installCopilotInstructions(provider, repoRoot, opts, say, note, warn) {
  const githubDir = path.join(process.cwd(), '.github');
  const dest = path.join(githubDir, 'copilot-instructions.md');
  const platformFile = path.join(repoRoot, 'platforms', provider.platformFile);
  if (!fs.existsSync(platformFile)) {
    return { ok: false, reason: 'platform file not found' };
  }
  if (fs.existsSync(dest) && !opts.force) {
    note('  .github/copilot-instructions.md already exists (use --force to overwrite)');
    return { skip: true, reason: 'already exists' };
  }
  if (!opts.dryRun) {
    if (!fs.existsSync(githubDir)) fs.mkdirSync(githubDir, { recursive: true });
    const content = fs.readFileSync(platformFile, 'utf8');
    const match = content.match(/```(?:markdown)?\n([\s\S]*?)```/);
    fs.writeFileSync(dest, match ? match[1] : content, 'utf8');
    note('  wrote .github/copilot-instructions.md');
  } else {
    note('  [dry-run] would write .github/copilot-instructions.md');
  }
  return { ok: true };
}

function installOpencode(provider, repoRoot, opts, say, note, warn) {
  const opencodeDir = path.join(os.homedir(), '.config', 'opencode');
  const skillsDir   = path.join(opencodeDir, 'skills');
  return installSkillsToDir(skillsDir, repoRoot, opts, say, note, warn);
}

function installAider(provider, repoRoot, opts, say, note, warn) {
  const dest = path.join(process.cwd(), 'CONVENTIONS.md');
  const skillFile = path.join(repoRoot, 'skills', 'signalmode', 'SKILL.md');
  if (!fs.existsSync(skillFile)) return { ok: false, reason: 'SKILL.md not found' };
  if (fs.existsSync(dest) && !opts.force) {
    note('  CONVENTIONS.md already exists (use --force to overwrite)');
    return { skip: true, reason: 'already exists' };
  }
  if (!opts.dryRun) {
    fs.copyFileSync(skillFile, dest);
    note('  wrote CONVENTIONS.md');
  } else {
    note('  [dry-run] would write CONVENTIONS.md');
  }
  return { ok: true };
}

function installGenericInstructions(provider, repoRoot, opts, say, note, warn) {
  if (!provider.platformFile) {
    note('  No platform file defined for ' + provider.label);
    return { skip: true, reason: 'no platform file' };
  }
  const platformFile = path.join(repoRoot, 'platforms', provider.platformFile);
  if (!fs.existsSync(platformFile)) {
    return { ok: false, reason: 'platform file not found: ' + platformFile };
  }
  say('  Platform instructions for ' + provider.label + ':');
  say('  ' + platformFile);
  say('  Copy the content into your agent\'s system prompt or custom instructions.');
  return { ok: true };
}

function installSkillsToDir(skillsDir, repoRoot, opts, say, note, warn) {
  const srcSkillsDir = path.join(repoRoot, 'skills');
  if (!fs.existsSync(srcSkillsDir)) {
    return { ok: false, reason: 'skills directory not found. Re-run from a clone: git clone https://github.com/' + REPO };
  }
  if (!opts.dryRun) {
    if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });
    const skills = fs.readdirSync(srcSkillsDir);
    for (const skill of skills) {
      const src  = path.join(srcSkillsDir, skill);
      const dest = path.join(skillsDir, skill);
      copyDirRecursive(src, dest);
      note('  installed skill: ' + skill);
    }
  } else {
    note('  [dry-run] would install skills to ' + skillsDir);
  }
  return { ok: true };
}

// ── Utilities ──────────────────────────────────────────────────────────────
function findRepoRoot() {
  // Walk up from __dirname to find the repo root (where package.json lives)
  let dir = __dirname;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    dir = path.dirname(dir);
  }
  return __dirname;
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcPath  = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function printProviders() {
  process.stdout.write('\nSupported AI coding agents:\n\n');
  const maxId    = Math.max(...PROVIDERS.map(p => p.id.length));
  const maxLabel = Math.max(...PROVIDERS.map(p => p.label.length));
  for (const p of PROVIDERS) {
    const detected = evaluateDetect(p.detect) ? ' [detected]' : '';
    const soft     = p.soft ? ' (soft)' : '';
    process.stdout.write(
      '  ' + p.id.padEnd(maxId + 2) +
      p.label.padEnd(maxLabel + 2) +
      (p.mech || '').padEnd(24) +
      soft + detected + '\n'
    );
  }
  process.stdout.write('\n');
}

function printHelp() {
  process.stdout.write(`
SignalMode v${VERSION} — Signal over noise. Every token counts.

USAGE
  npx signalmode [options]

OPTIONS
  --only <id>         Install for a specific agent (can repeat)
  --all               Install for all detected agents
  --force             Overwrite existing files
  --dry-run           Show what would be installed without doing it
  --list              List all supported agents and exit
  --no-color          Disable color output
  --non-interactive   Never prompt for input
  -h, --help          Show this help

EXAMPLES
  npx signalmode                    Auto-detect and install
  npx signalmode --only cursor      Install only for Cursor
  npx signalmode --only claude-code --only copilot
  npx signalmode --dry-run          Preview without installing
  npx signalmode --list             List all supported agents

SUPPORTED AGENTS
  ${PROVIDERS.map(p => p.id).join(', ')}

PLATFORM INSTRUCTIONS
  See platforms/ directory for ready-made instruction files for:
  ChatGPT, Claude, Codex, Manus, Replit, Gemini, Copilot, Cursor, Windsurf

MORE
  https://github.com/${REPO}
`);
}

// ── Argument parsing ───────────────────────────────────────────────────────
function parseArgs(argv) {
  const opts = {
    only: [], all: false, force: false, dryRun: false,
    listOnly: false, noColor: false, nonInteractive: false, help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--only=')) { opts.only.push(a.slice(7)); continue; }
    switch (a) {
      case '--dry-run':         opts.dryRun = true; break;
      case '--force':           opts.force = true; break;
      case '--all':             opts.all = true; break;
      case '--list':            opts.listOnly = true; break;
      case '--no-color':        opts.noColor = true; break;
      case '--non-interactive': opts.nonInteractive = true; break;
      case '-h': case '--help': opts.help = true; break;
      case '--only': {
        const v = argv[++i];
        if (!v) die('error: --only requires an argument');
        opts.only.push(v);
        break;
      }
      case '--': break;
      default:
        die(`error: unknown flag: ${a}\nrun 'signalmode --help' for usage`);
    }
  }
  return opts;
}

// ── Guards ─────────────────────────────────────────────────────────────────
function checkNodeVersion() {
  const major = parseInt(process.versions.node.split('.')[0], 10);
  if (major < 18) die(`signalmode: Node ${process.versions.node} too old. Need Node >=18. https://nodejs.org`);
}

function checkWslWindowsNode() {
  if (process.platform !== 'win32') return;
  if (process.env.WSL_DISTRO_NAME) {
    die('signalmode: detected Windows Node.js running inside WSL.\n' +
        '         Install Linux-native Node inside your WSL distro and re-run there.');
  }
}

function die(msg) { process.stderr.write(msg + '\n'); process.exit(2); }

// ── Color helpers ──────────────────────────────────────────────────────────
function makeChalk(noColor) {
  const useColor = !noColor && process.stdout.isTTY && !process.env.NO_COLOR;
  const wrap = (codes) => (s) => useColor ? `\x1b[${codes}m${s}\x1b[0m` : s;
  return {
    orange: wrap('38;5;172'), dim: wrap('2'), red: wrap('31'),
    green: wrap('32'), yellow: wrap('33'),
  };
}
