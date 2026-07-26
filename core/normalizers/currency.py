"""Amount parsing and European (es-ES) currency formatting.

Spanish/European exports use '.' as thousands separator and ',' as decimal
separator (1.234,56), the opposite of en-US. Bank exports also throw in
currency symbols, whitespace, and parentheses-for-negative conventions.
"""
from __future__ import annotations

import re
from typing import Optional, Union

_CLEAN_RE = re.compile(r"[^\d,.\-()]")


def parse_amount(value: Union[str, int, float, None]) -> Optional[float]:
    """Best-effort parse of a raw amount cell into a float. Never raises."""
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip()
    if not text:
        return None

    negative = False
    if text.startswith("(") and text.endswith(")"):
        negative = True
        text = text[1:-1]

    text = _CLEAN_RE.sub("", text).strip()
    if not text:
        return None

    if text.startswith("-"):
        negative = True
        text = text[1:]
    elif text.endswith("-"):
        negative = True
        text = text[:-1]

    has_comma = "," in text
    has_dot = "." in text

    if has_comma and has_dot:
        # Whichever separator appears last is the decimal separator.
        if text.rfind(",") > text.rfind("."):
            text = text.replace(".", "").replace(",", ".")
        else:
            text = text.replace(",", "")
    elif has_comma:
        # Only a comma: treat as decimal separator unless it looks like a
        # thousands grouping (more than 2 digits after it, e.g. "1,234").
        integer_part, _, frac = text.partition(",")
        if len(frac) == 3 and len(integer_part) <= 3:
            text = text.replace(",", "")
        else:
            text = text.replace(",", ".")
    # dot-only: already valid Python float syntax (or thousands-only, which
    # float() will mis-parse, but that's rare enough in bank exports to accept).

    try:
        result = float(text)
    except ValueError:
        return None

    return -result if negative else result


def format_currency_es(value: Union[int, float]) -> str:
    """Formats a number the Spanish way: 1.234,56 €"""
    negative = value < 0
    value = abs(value)
    formatted = f"{value:,.2f}"
    # f-string gives us en-US grouping (1,234.56); swap separators for es-ES.
    formatted = formatted.replace(",", "_").replace(".", ",").replace("_", ".")
    sign = "-" if negative else ""
    return f"{sign}{formatted} €"
