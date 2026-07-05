# Test Fixtures

This directory contains sample input and expected output files for SignalMode tests.

## Structure

| File | Purpose |
|---|---|
| `sample-verbose-response.txt` | A verbose AI response before SignalMode compression |
| `sample-compressed-response.txt` | The expected output after SignalMode core is applied |
| `sample-basic-english-input.txt` | A technical status update before Basic English skill |
| `sample-basic-english-output.txt` | The expected 5-section Basic English report |
| `sample-ai-writing.txt` | Text with common AI writing tells for human skill testing |
| `sample-clean-writing.txt` | The expected output after signalmode-human is applied |

## Usage

These fixtures are used by the test suite to validate that SignalMode skills produce the expected output format. They are not used in automated output comparison (which would require LLM execution), but serve as reference examples for manual validation and documentation.
