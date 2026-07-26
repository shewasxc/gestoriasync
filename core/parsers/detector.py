"""Entry point: takes raw file bytes + filename, returns a ParsedStatement.

Pipeline: read the file into a headerless raw table (format-specific) ->
locate the real header row (banks prepend summary rows) -> ask every known
bank parser how confident it is that this is "its" shape -> hand the table
to the most confident one (generic CSV/Excel is the fallback when no bank
signature is found).
"""
from __future__ import annotations

import io
from typing import Callable

import pandas as pd

from core.parsers import bbva, caixabank, generic, santander
from core.parsers.base import ParsedStatement, ParserError, locate_header_row
from core.parsers.pdf_extract import extract_raw_table

DETECT_THRESHOLD = 0.6

_PARSERS: list[tuple[str, Callable[[list[str], str], float], Callable[[pd.DataFrame, str], ParsedStatement]]] = [
    ("BBVA", bbva.detect, bbva.parse),
    ("Santander", santander.detect, santander.parse),
    ("CaixaBank", caixabank.detect, caixabank.parse),
]


def _read_raw_csv(file_bytes: bytes) -> pd.DataFrame:
    last_error: Exception | None = None
    for encoding in ("utf-8-sig", "latin-1", "cp1252"):
        for sep in (None, ";", ",", "\t"):
            try:
                return pd.read_csv(
                    io.BytesIO(file_bytes),
                    header=None,
                    sep=sep,
                    engine="python",
                    encoding=encoding,
                    dtype=object,
                )
            except Exception as e:  # noqa: BLE001 - trying multiple combos on purpose
                last_error = e
                continue
    raise ParserError(f"No se pudo leer el CSV: {last_error}")


def _read_raw_excel(file_bytes: bytes) -> pd.DataFrame:
    try:
        return pd.read_excel(io.BytesIO(file_bytes), header=None, dtype=object)
    except Exception as e:
        raise ParserError(f"No se pudo leer el Excel: {e}") from e


def _read_raw_table(file_bytes: bytes, filename: str) -> pd.DataFrame:
    ext = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""
    if ext == "csv":
        return _read_raw_csv(file_bytes)
    if ext in ("xlsx", "xls", "xlsm"):
        return _read_raw_excel(file_bytes)
    if ext == "pdf":
        return extract_raw_table(file_bytes, filename)
    raise ParserError(f"Formato de archivo no soportado: '.{ext}'")


def _to_headered_dataframe(raw: pd.DataFrame) -> pd.DataFrame:
    header_idx = locate_header_row(raw)
    header = [str(v).strip() if v is not None else "" for v in raw.iloc[header_idx].tolist()]

    # De-duplicate blank/repeated header labels so pandas doesn't collapse columns.
    seen: dict[str, int] = {}
    clean_header = []
    for i, h in enumerate(header):
        label = h or f"col_{i}"
        if label in seen:
            seen[label] += 1
            label = f"{label}_{seen[label]}"
        else:
            seen[label] = 0
        clean_header.append(label)

    data = raw.iloc[header_idx + 1 :].copy()
    data.columns = clean_header
    data = data.dropna(axis=0, how="all").reset_index(drop=True)
    return data


def parse_any_file(file_bytes: bytes, filename: str) -> ParsedStatement:
    raw = _read_raw_table(file_bytes, filename)
    df = _to_headered_dataframe(raw)

    if df.empty or len(df.columns) == 0:
        raise ParserError(f"'{filename}' no contiene datos tabulares reconocibles")

    columns = list(df.columns)

    best_name, best_score, best_parse = "Generic", generic.detect(columns, filename), generic.parse
    for name, detect_fn, parse_fn in _PARSERS:
        score = detect_fn(columns, filename)
        if score > best_score:
            best_name, best_score, best_parse = name, score, parse_fn

    if best_score < DETECT_THRESHOLD:
        # Still attempt with the generic parser; build_movements will surface
        # a clear "columns not found" issue instead of silently dropping the file.
        best_parse = generic.parse

    return best_parse(df, filename)
