// SignalCrew — per-agent model overrides
// Reads SIGNALCREW_<AGENT>_MODEL env vars and applies them to the agent config.
// Best-effort: any error is swallowed so SessionStart is never blocked.

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const AGENT_ENV_MAP = {
  investigator: 'SIGNALCREW_INVESTIGATOR_MODEL',
  builder:      'SIGNALCREW_BUILDER_MODEL',
  reviewer:     'SIGNALCREW_REVIEWER_MODEL',
};

function resolvePluginRoot(hooksDir) {
  // hooksDir is typically <plugin_root>/src/hooks/
  return path.resolve(hooksDir, '..', '..');
}

function applyOverrides(pluginRoot) {
  const configPath = path.join(pluginRoot, 'signalcrew-config.json');
  let config = {};
  try { config = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (e) {}

  let changed = false;
  for (const [agent, envVar] of Object.entries(AGENT_ENV_MAP)) {
    const model = process.env[envVar];
    if (model) {
      config[agent] = config[agent] || {};
      config[agent].model = model;
      changed = true;
    }
  }

  if (changed) {
    try { 
      const dir = path.dirname(configPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2)); 
    } catch (e) {}
  }
}

module.exports = { applyOverrides, resolvePluginRoot };
