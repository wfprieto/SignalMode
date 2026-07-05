"""
SignalMode Compress — CLI entry point.
Usage: python3 -m scripts <filepath>
"""
import sys
from .cli import main

if __name__ == '__main__':
    sys.exit(main())
