"""
SignalMode Compress — output validation.
Checks that the compressed output is safe and correct.
"""
import re
from typing import List


def validate_output(original: str, compressed: str) -> List[str]:
    """
    Validate the compressed output against the original.
    Returns a list of error strings (empty if valid).
    """
    errors = []

    # Must not be empty
    if not compressed or not compressed.strip():
        errors.append("Compressed output is empty")
        return errors

    # Must not be longer than original (compression should reduce size)
    if len(compressed) > len(original) * 1.1:
        errors.append(
            f"Compressed output is longer than original "
            f"({len(compressed)} > {len(original)})"
        )

    # All code blocks from original must appear in compressed
    original_blocks = extract_code_blocks(original)
    compressed_blocks = extract_code_blocks(compressed)

    for block in original_blocks:
        if block not in compressed_blocks:
            errors.append(f"Code block was modified or removed: {block[:60]}...")

    # All URLs from original must appear in compressed
    original_urls = extract_urls(original)
    compressed_urls = extract_urls(compressed)
    for url in original_urls:
        if url not in compressed_urls:
            errors.append(f"URL was removed: {url}")

    return errors


def extract_code_blocks(content: str) -> List[str]:
    """Extract all fenced code blocks from content."""
    return re.findall(r'```[\s\S]*?```', content)


def extract_urls(content: str) -> List[str]:
    """Extract all URLs from content."""
    return re.findall(r'https?://[^\s\)\"\']+', content)
