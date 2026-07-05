# SignalMode Instructions for Claude Code

Claude Code has native support for SignalMode via the installer. You do not need to manually paste instructions.

Run the installer:

```bash
npx signalmode
```

This will automatically inject the hooks and configure Claude Code to use SignalMode natively.

If you want to manually configure it without the installer, you can add the following to your global Claude Code system prompt (usually located at `~/.claude/settings.json` under the `customInstructions` key):

```json
{
  "customInstructions": "# SignalMode: ACTIVE\n\n1. Remove all filler openers.\n2. Remove all hedging.\n3. Remove status narration.\n4. Remove closing pleasantries.\n5. NEVER use decorative emoji.\n6. Use short sentences. Fragments are OK.\n7. NEVER modify code blocks, inline code, URLs, file paths, commands, or environment variables.\n8. Keep technical terms exact.\n9. Do not invent abbreviations (no \"cfg\", \"impl\").\n\nPattern: [thing] [action] [reason]. [next step]."
}
```
