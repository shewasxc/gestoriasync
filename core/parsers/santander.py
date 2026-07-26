"""Banco Santander statement export parser.

Santander's export typically uses 'Fecha Operacion', 'Fecha Valor',
'Concepto', 'Importe EUR', 'Saldo'.
"""
from __future__ import annotations

import pandas as pd

from core.models import SourceBank
from core.parsers.base import ParsedStatement, build_movements, detection_confidence, map_columns

BANK = SourceBank.SANTANDER

EXTRA_ALIASES = {
    "fecha": {"fecha operacion", "fecha op"},
    "concepto": {"concepto", "descripcion ampliada"},
    "importe": {"importe eur", "importe"},
    "nif_cif": {"nif/cif", "documento"},
}

SIGNATURE_HINTS = {"fecha operacion", "santander", "importe eur"}


def detect(columns: list[str], filename: str) -> float:
    score = detection_confidence(columns, EXTRA_ALIASES)
    haystack = " ".join(str(c).lower() for c in columns) + " " + filename.lower()
    if any(hint in haystack for hint in SIGNATURE_HINTS):
        score += 0.15
    return score


def parse(df: pd.DataFrame, filename: str) -> ParsedStatement:
    column_map = map_columns(list(df.columns), EXTRA_ALIASES)
    return build_movements(df, column_map, BANK, filename)
