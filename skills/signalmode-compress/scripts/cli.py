"""
SignalMode Compress — CLI module.
Compresses natural language files to reduce input tokens.
"""
import sys
import os
from .detect import is_compressible
from .compress import compress_file
from .validate import validate_output


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python3 -m scripts <filepath>", file=sys.stderr)
        return 2

    filepath = os.path.abspath(sys.argv[1])

    if not os.path.exists(filepath):
        print(f"signalmode-compress: file not found: {filepath}", file=sys.stderr)
        return 1

    if not is_compressible(filepath):
        print(f"signalmode-compress: skipping non-compressible file: {filepath}", file=sys.stderr)
        return 0

    # Do not compress backup files
    if filepath.endswith('.original.md'):
        print(f"signalmode-compress: skipping backup file: {filepath}", file=sys.stderr)
        return 0

    print(f"Compressing: {filepath}")

    # Read original content
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    # Backup original
    backup_path = filepath + '.original.md' if not filepath.endswith('.md') else filepath.replace('.md', '.original.md')
    if not os.path.exists(backup_path):
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original)
        print(f"  Backup saved: {backup_path}")

    # Compress with retries
    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            compressed = compress_file(original, filepath)
            errors = validate_output(original, compressed)
            if not errors:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(compressed)
                original_tokens = estimate_tokens(original)
                compressed_tokens = estimate_tokens(compressed)
                saved = original_tokens - compressed_tokens
                pct = round(saved / original_tokens * 100) if original_tokens > 0 else 0
                print(f"  Done. {original_tokens} -> {compressed_tokens} tokens ({pct}% reduction)")
                return 0
            else:
                if attempt < max_retries:
                    print(f"  Validation failed (attempt {attempt + 1}): {errors[0]}. Retrying...")
                else:
                    print(f"  Compression failed after {max_retries} retries: {errors[0]}", file=sys.stderr)
                    print(f"  Original file unchanged. Backup at: {backup_path}", file=sys.stderr)
                    return 1
        except Exception as e:
            if attempt < max_retries:
                print(f"  Error (attempt {attempt + 1}): {e}. Retrying...")
            else:
                print(f"  Compression error: {e}", file=sys.stderr)
                print(f"  Original file unchanged. Backup at: {backup_path}", file=sys.stderr)
                return 1

    return 1


def estimate_tokens(text: str) -> int:
    """Rough token estimate: ~4 chars per token (OpenAI BPE approximation)."""
    return max(1, len(text) // 4)
