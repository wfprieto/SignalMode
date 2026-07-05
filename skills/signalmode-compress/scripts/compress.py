"""
SignalMode Compress — LLM-based compression.
Uses the configured LLM to compress natural language while preserving code.
"""
import os
import re
from typing import Optional


SYSTEM_PROMPT = """You are a text compression assistant. Your task is to compress natural language text to reduce token count while preserving all technical information.

RULES:
1. Remove articles (a, an, the) when they add no meaning.
2. Remove filler words: just, really, basically, actually, simply, essentially, generally.
3. Remove pleasantries: "sure", "certainly", "of course", "happy to".
4. Remove hedging: "it might be worth", "you could consider".
5. Remove redundant phrasing: "in order to" → "to", "make sure to" → "ensure".
6. Remove connective fluff: "however", "furthermore", "additionally".
7. Use short synonyms: "big" not "extensive", "fix" not "implement a solution for".
8. Fragments are OK: "Run tests before commit" not "You should always run tests before committing".
9. Drop "you should", "make sure to", "remember to" — just state the action.
10. Merge redundant bullets that say the same thing differently.

CRITICAL — NEVER MODIFY:
- Anything inside ``` ... ``` code blocks. Copy EXACTLY.
- Anything inside `backticks`. Copy EXACTLY.
- URLs, file paths, commands, environment variables.
- Technical terms, library names, API names, protocols.
- Proper nouns (project names, company names).
- Dates, version numbers, numeric values.
- Markdown headings (keep exact heading text, compress body below).
- Bullet point hierarchy and numbered lists.

Return ONLY the compressed text. No explanation, no preamble."""


def compress_file(content: str, filepath: str) -> str:
    """
    Compress the content of a file using an LLM.
    Protects code blocks from compression.
    """
    # Extract and protect code blocks
    protected, blocks = protect_code_blocks(content)

    # Call LLM to compress the protected content
    compressed_protected = call_llm(protected, filepath)

    # Restore code blocks
    compressed = restore_code_blocks(compressed_protected, blocks)

    return compressed


def protect_code_blocks(content: str):
    """
    Replace code blocks with placeholders to prevent LLM from modifying them.
    Returns (protected_content, {placeholder: original_block}).
    """
    blocks = {}
    counter = [0]

    def replace_block(match):
        placeholder = f'__SIGNALMODE_CODE_BLOCK_{counter[0]}__'
        blocks[placeholder] = match.group(0)
        counter[0] += 1
        return placeholder

    # Protect fenced code blocks (``` ... ```)
    protected = re.sub(r'```[\s\S]*?```', replace_block, content)

    # Protect indented code blocks (4+ spaces)
    protected = re.sub(r'(?m)^(    .+\n?)+', replace_block, protected)

    return protected, blocks


def restore_code_blocks(content: str, blocks: dict) -> str:
    """Restore protected code blocks from placeholders."""
    for placeholder, original in blocks.items():
        content = content.replace(placeholder, original)
    return content


def call_llm(content: str, filepath: str) -> str:
    """
    Call the LLM to compress the content.
    Tries OpenAI API first, falls back to a simple rule-based compression.
    """
    try:
        return _call_openai(content)
    except Exception:
        pass

    # Rule-based fallback (no LLM available)
    return _rule_based_compress(content)


def _call_openai(content: str) -> str:
    """Call OpenAI API for compression."""
    import openai
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': content},
        ],
        temperature=0.1,
        max_tokens=len(content) * 2,  # generous upper bound
    )
    return response.choices[0].message.content or content


def _rule_based_compress(content: str) -> str:
    """
    Simple rule-based compression fallback when no LLM is available.
    Removes the most common filler patterns.
    """
    replacements = [
        (r'\bIn order to\b', 'To'),
        (r'\bin order to\b', 'to'),
        (r'\bMake sure to\b', 'Ensure'),
        (r'\bmake sure to\b', 'ensure'),
        (r'\bThe reason is because\b', 'Because'),
        (r'\bthe reason is because\b', 'because'),
        (r'\bYou should\b', ''),
        (r'\byou should\b', ''),
        (r'\bRemember to\b', ''),
        (r'\bremember to\b', ''),
        (r'\bPlease note that\b', ''),
        (r'\bplease note that\b', ''),
        (r'\bIt is worth noting that\b', ''),
        (r'\bit is worth noting that\b', ''),
        (r'\bBasically,?\s*', ''),
        (r'\bEssentially,?\s*', ''),
        (r'\bActually,?\s*', ''),
        (r'\bSimply\b', ''),
        (r'\bJust\b(?! in| as| like)', ''),
        (r'\bHowever,?\s*', ''),
        (r'\bFurthermore,?\s*', ''),
        (r'\bAdditionally,?\s*', ''),
        (r'\bMoreover,?\s*', ''),
        (r'\bIn addition,?\s*', ''),
    ]
    result = content
    for pattern, replacement in replacements:
        result = re.sub(pattern, replacement, result)
    # Clean up double spaces
    result = re.sub(r'  +', ' ', result)
    return result
