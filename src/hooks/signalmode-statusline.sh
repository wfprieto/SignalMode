#!/usr/bin/env bash
# SignalMode — statusline badge for shell prompts (bash/zsh)
# Outputs the current SignalMode mode if active, empty string if not.
#
# Usage in .bashrc / .zshrc:
#   source /path/to/signalmode-statusline.sh
#   PS1='$(signalmode_badge)'"$PS1"

CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
FLAG_FILE="$CLAUDE_DIR/.signalmode-active"

signalmode_badge() {
  if [ -f "$FLAG_FILE" ]; then
    local mode
    mode=$(cat "$FLAG_FILE" 2>/dev/null)
    if [ -n "$mode" ] && [ "$mode" != "off" ]; then
      printf "[SM:%s] " "$mode"
    fi
  fi
}
