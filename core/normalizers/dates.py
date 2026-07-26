"""Date normalization for Spanish bank exports.

Spanish banks export dates in a mess of formats: DD/MM/YYYY, DD-MM-YYYY,
DD.MM.YYYY, DD/MM/YY, or already-parsed Excel datetimes. This module tries
each known format and returns a plain `datetime.date`, or None if nothing
matched (caller decides whether that's fatal).
"""
from __future__ import annotations

import datetime as dt
from typing import Optional, Union

_KNOWN_FORMATS = [
    "%d/%m/%Y",
    "%d-%m-%Y",
    "%d.%m.%Y",
    "%d/%m/%y",
    "%d-%m-%y",
    "%Y-%m-%d",
    "%Y/%m/%d",
    "%d/%m/%Y %H:%M:%S",
    "%d-%m-%Y %H:%M:%S",
]


def normalize_date(value: Union[str, dt.date, dt.datetime, int, float, None]) -> Optional[dt.date]:
    """Best-effort conversion of a raw cell value into a `date`.

    Returns None (never raises) so callers can decide how to surface the
    problem to the user instead of catching exceptions everywhere.
    """
    if value is None:
        return None

    if isinstance(value, dt.datetime):
        return value.date()
    if isinstance(value, dt.date):
        return value

    # Excel serial date number (e.g. 45123) leaking through from openpyxl/pandas.
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        try:
            base = dt.date(1899, 12, 30)  # Excel's epoch, accounting for the 1900 leap-year bug
            return base + dt.timedelta(days=int(value))
        except (OverflowError, ValueError):
            return None

    text = str(value).strip()
    if not text:
        return None

    for fmt in _KNOWN_FORMATS:
        try:
            return dt.datetime.strptime(text, fmt).date()
        except ValueError:
            continue

    # Last resort: pandas' flexible parser (handles "3 enero 2024" etc. only
    # partially, but catches ISO-ish variants the strict formats miss).
    try:
        import pandas as pd

        parsed = pd.to_datetime(text, dayfirst=True, errors="raise")
        return parsed.date()
    except Exception:
        return None
