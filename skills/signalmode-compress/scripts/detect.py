"""
SignalMode Compress — file type detection.
Only compresses natural language files.
"""
import os

COMPRESSIBLE_EXTENSIONS = {'.md', '.txt', '.typ', '.typst', '.tex'}
NON_COMPRESSIBLE_EXTENSIONS = {
    '.py', '.js', '.ts', '.jsx', '.tsx', '.json', '.yaml', '.yml',
    '.toml', '.env', '.lock', '.css', '.html', '.xml', '.sql', '.sh',
    '.bash', '.zsh', '.fish', '.ps1', '.rb', '.go', '.rs', '.java',
    '.c', '.cpp', '.h', '.hpp', '.cs', '.php', '.swift', '.kt',
}


def is_compressible(filepath: str) -> bool:
    """Return True if the file is safe to compress."""
    _, ext = os.path.splitext(filepath.lower())
    if ext in NON_COMPRESSIBLE_EXTENSIONS:
        return False
    if ext in COMPRESSIBLE_EXTENSIONS:
        return True
    # Extensionless files: check if they look like text
    if not ext:
        return _looks_like_text(filepath)
    return False


def _looks_like_text(filepath: str) -> bool:
    """Heuristic: read first 512 bytes and check for null bytes."""
    try:
        with open(filepath, 'rb') as f:
            chunk = f.read(512)
        return b'\x00' not in chunk
    except Exception:
        return False
