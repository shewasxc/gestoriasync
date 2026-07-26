"""Shared parsing engine used by every bank-specific parser.

Design: bank exports differ wildly in column naming ("Concepto" vs
"Descripcion" vs "Detalle del movimiento") but the underlying shape is
always the same four fields (fecha, concepto, importe, nif/cif). Rather
than duplicating row-building logic per bank, each bank module only
supplies *hints* (extra header aliases, a signature to detect the bank)
and delegates the actual DataFrame -> Movement conversion to this module.
"""
from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field

import pandas as pd
from pydantic import ValidationError
from rapidfuzz import fuzz

from core.models import Movement, ParseIssue, SourceBank

MAX_HEADER_SCAN_ROWS = 15
FUZZY_MATCH_THRESHOLD = 72


class ParserError(Exception):
    """Raised when a file cannot be parsed into a tabular shape at all."""


@dataclass
class ParsedStatement:
    archivo: str
    banco: SourceBank
    movements: list[Movement] = field(default_factory=list)
    issues: list[ParseIssue] = field(default_factory=list)
    filas_totales: int = 0

    @property
    def filas_validas(self) -> int:
        return len(self.movements)


# Canonical field -> set of header aliases (normalized: lowercase, no accents).
FIELD_ALIASES: dict[str, set[str]] = {
    "fecha": {
        "fecha", "f valor", "fecha valor", "fecha operacion", "fecha oper",
        "fecha contable", "f operacion", "date", "fecha movimiento",
    },
    "concepto": {
        "concepto", "descripcion", "detalle", "concepto movimiento",
        "texto", "detalle del movimiento", "descripcion operacion",
        "concepto/descripcion", "movimiento", "referencia",
    },
    "importe": {
        "importe", "importe eur", "cantidad", "cargo/abono", "debe/haber",
        "importe eur.", "importe (eur)", "cargo", "abono", "valor",
        "total", "total factura", "importe factura", "total a pagar",
        "base imponible", "monto",
    },
    "nif_cif": {
        "nif", "cif", "nif/cif", "dni", "identificador fiscal", "nif cif",
        "cif/nif", "id fiscal", "nie",
    },
    "saldo": {"saldo", "saldo posterior", "saldo disponible", "balance"},
}


def normalize_header(text: object) -> str:
    """Lowercase, strip accents/punctuation so headers compare cleanly."""
    text = "" if text is None else str(text)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower().strip()
    text = re.sub(r"[.\-_/]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _best_alias_score(header_norm: str, aliases: set[str]) -> int:
    if not header_norm:
        return 0
    best = 0
    for alias in aliases:
        score = fuzz.token_sort_ratio(header_norm, alias)
        # exact substring match is a very strong signal (e.g. "nif" in "nif/cif emisor")
        if alias in header_norm or header_norm in alias:
            score = max(score, 90)
        best = max(best, score)
    return best


def locate_header_row(raw: pd.DataFrame) -> int:
    """Scans the first rows for the one that best matches known field names.

    Bank exports frequently prepend account-summary rows before the real
    header row; picking row 0 blindly would misparse everything below it.
    """
    best_row, best_score = 0, -1
    scan_limit = min(MAX_HEADER_SCAN_ROWS, len(raw))
    for i in range(scan_limit):
        row_values = [normalize_header(v) for v in raw.iloc[i].tolist()]
        matched_fields = 0
        for field_name, aliases in FIELD_ALIASES.items():
            if field_name == "saldo":
                continue
            if any(_best_alias_score(v, aliases) >= FUZZY_MATCH_THRESHOLD for v in row_values):
                matched_fields += 1
        if matched_fields > best_score:
            best_score = matched_fields
            best_row = i
    return best_row if best_score >= 2 else 0


def map_columns(columns: list[str], extra_aliases: dict[str, set[str]] | None = None) -> dict[str, str]:
    """Best-effort mapping of canonical field name -> actual column label."""
    aliases_by_field = {k: set(v) for k, v in FIELD_ALIASES.items()}
    if extra_aliases:
        for field_name, extras in extra_aliases.items():
            aliases_by_field.setdefault(field_name, set()).update(extras)

    normalized_cols = {col: normalize_header(col) for col in columns}
    mapping: dict[str, str] = {}
    used_columns: set[str] = set()

    for field_name, aliases in aliases_by_field.items():
        best_col, best_score = None, 0
        for col, col_norm in normalized_cols.items():
            if col in used_columns:
                continue
            score = _best_alias_score(col_norm, aliases)
            if score > best_score:
                best_score, best_col = score, col
        if best_col is not None and best_score >= FUZZY_MATCH_THRESHOLD:
            mapping[field_name] = best_col
            used_columns.add(best_col)

    return mapping


def detection_confidence(columns: list[str], extra_aliases: dict[str, set[str]] | None = None) -> float:
    """0..1 score: how confident we are this table has the shape we need."""
    mapping = map_columns(columns, extra_aliases)
    required = {"fecha", "concepto", "importe"}
    found = required & mapping.keys()
    return len(found) / len(required)


def build_movements(
    df: pd.DataFrame,
    column_map: dict[str, str],
    banco: SourceBank,
    archivo: str,
) -> ParsedStatement:
    result = ParsedStatement(archivo=archivo, banco=banco)

    missing_required = {"fecha", "concepto", "importe"} - column_map.keys()
    if missing_required:
        result.issues.append(
            ParseIssue(
                archivo=archivo,
                mensaje=f"No se pudieron detectar las columnas: {', '.join(sorted(missing_required))}",
                nivel="error",
            )
        )
        return result

    result.filas_totales = len(df)

    def _clean(v: object) -> object:
        """NaN cells (pandas) must reach Movement as None, not the string 'nan'."""
        if v is None:
            return None
        if isinstance(v, float) and pd.isna(v):
            return None
        return v

    for idx, row in df.iterrows():
        excel_row_num = int(idx) + 2  # +1 for header, +1 for 1-based indexing
        raw = {
            "fecha": _clean(row.get(column_map["fecha"])),
            "concepto": _clean(row.get(column_map["concepto"])),
            "importe": _clean(row.get(column_map["importe"])),
        }
        if "nif_cif" in column_map:
            raw["nif_cif"] = _clean(row.get(column_map["nif_cif"]))

        # Skip fully-blank rows (common trailing rows in bank exports).
        if all(v is None or (isinstance(v, float) and pd.isna(v)) or str(v).strip() == "" for v in raw.values()):
            continue

        try:
            movement = Movement(
                banco=banco,
                archivo_origen=archivo,
                fila_origen=excel_row_num,
                **raw,
            )
            result.movements.append(movement)
            if movement.errores:
                for err in movement.errores:
                    result.issues.append(
                        ParseIssue(archivo=archivo, fila=excel_row_num, mensaje=err, nivel="warning")
                    )
        except ValidationError as e:
            messages = "; ".join(err["msg"] for err in e.errors())
            result.issues.append(
                ParseIssue(archivo=archivo, fila=excel_row_num, mensaje=messages, nivel="error")
            )

    return result
