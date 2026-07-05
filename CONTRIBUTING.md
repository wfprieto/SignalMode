# Contributing to SignalMode

## How to contribute

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes.
4. Run the tests: `npm test`
5. Submit a pull request.

## What to contribute

- New platform instruction files (`platforms/`)
- New or improved skills (`skills/`)
- New agent support in the installer (`bin/install.js`)
- Bug fixes
- Documentation improvements

## Key rules

- Edit `skills/<name>/SKILL.md` for behavior changes. Never edit synced copies.
- `bin/install.js` is the only installer source. Never add per-OS logic to shell shims.
- Benchmark and eval numbers must be real. Never fabricate.
- Hook files must silent-fail on all filesystem errors.
- Any new flag file write must go through `safeWriteFlag()` in `signalmode-config.js`.

## Adding a new platform

1. Create `platforms/<platform-name>.md` with the instruction file.
2. Add a row to the platform matrix in `README.md` and `INSTALL.md`.
3. If the platform supports auto-detection, add an entry to `PROVIDERS` in `bin/install.js`.

## Code style

- Node.js: CommonJS (`require`/`module.exports`). No TypeScript. No build step.
- Python: Standard library only in `detect.py` and `validate.py`. Optional LLM dependency in `compress.py`.
- Shell: POSIX-compatible bash. No bashisms.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
