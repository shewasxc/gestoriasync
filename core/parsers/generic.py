"""Fallback parser for CSV/Excel files that don't match a known bank shape.

Used for generic invoice ledgers ("facturas") or any spreadsheet whose
columns happen to fuzzy-match our canonical fields regardless of bank.
"""
from __future__ import annotations

import pandas as pd

from core.models import SourceBank
from core.parsers.base import ParsedStatement, build_movements, detection_confidence, map_columns

BANK = SourceBank.GENERIC


def detect(columns: list[str], filename: str) -> float:
    return detection_confidence(columns)


def parse(df: pd.DataFrame, filename: str) -> ParsedStatement:
    column_map = map_columns(list(df.columns))
    return build_movements(df, column_map, BANK, filename)
