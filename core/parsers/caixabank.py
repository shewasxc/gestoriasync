"""CaixaBank statement export parser.

CaixaBank's export typically uses 'Fecha', 'Concepto', 'Importe',
'Saldo disponible', and sometimes an 'Categoria' column CaixaBankNow adds.
"""
from __future__ import annotations

import pandas as pd

from core.models import SourceBank
from core.parsers.base import ParsedStatement, build_movements, detection_confidence, map_columns

BANK = SourceBank.CAIXABANK

EXTRA_ALIASES = {
    "fecha": {"fecha"},
    "concepto": {"concepto", "descripcion movimiento"},
    "importe": {"importe"},
    "nif_cif": {"nif/cif", "nif titular"},
}

SIGNATURE_HINTS = {"saldo disponible", "caixabank", "la caixa", "caixabanknow"}


def detect(columns: list[str], filename: str) -> float:
    score = detection_confidence(columns, EXTRA_ALIASES)
    haystack = " ".join(str(c).lower() for c in columns) + " " + filename.lower()
    if any(hint in haystack for hint in SIGNATURE_HINTS):
        score += 0.15
    return score


def parse(df: pd.DataFrame, filename: str) -> ParsedStatement:
    column_map = map_columns(list(df.columns), EXTRA_ALIASES)
    return build_movements(df, column_map, BANK, filename)
