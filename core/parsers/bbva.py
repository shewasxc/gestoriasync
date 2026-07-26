"""BBVA statement export parser.

BBVA's "Movimientos" CSV/Excel export typically uses headers like
'F.Valor', 'Concepto', 'Importe', 'Divisa', 'Disponible' and prepends a
few account-summary rows before the real table starts.
"""
from __future__ import annotations

import pandas as pd

from core.models import SourceBank
from core.parsers.base import ParsedStatement, build_movements, detection_confidence, map_columns

BANK = SourceBank.BBVA

EXTRA_ALIASES = {
    "fecha": {"f valor", "fecha valor"},
    "concepto": {"concepto", "movimiento"},
    "importe": {"importe", "importe eur"},
    "nif_cif": {"nif/cif ordenante", "nif ordenante"},
}

# Strings that show up verbatim in BBVA exports and rarely elsewhere.
SIGNATURE_HINTS = {"f.valor", "f valor", "bbva"}


def detect(columns: list[str], filename: str) -> float:
    score = detection_confidence(columns, EXTRA_ALIASES)
    haystack = " ".join(str(c).lower() for c in columns) + " " + filename.lower()
    if any(hint in haystack for hint in SIGNATURE_HINTS):
        score += 0.15
    return score


def parse(df: pd.DataFrame, filename: str) -> ParsedStatement:
    column_map = map_columns(list(df.columns), EXTRA_ALIASES)
    return build_movements(df, column_map, BANK, filename)
