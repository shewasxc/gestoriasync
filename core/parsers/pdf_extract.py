"""Raw table extraction from bank-statement PDFs via pdfplumber.

Banks ship PDFs with ruled tables (BBVA/Santander/CaixaBank statements all
export this way), so pdfplumber's default line-based table strategy works
without per-bank tuning. We return the same "raw, no header assumed" shape
that the CSV/Excel readers produce, so the rest of the pipeline (header-row
detection, column mapping) is identical regardless of source format.
"""
from __future__ import annotations

import io

import pandas as pd
import pdfplumber

from core.parsers.base import ParserError


def extract_raw_table(file_bytes: bytes, filename: str) -> pd.DataFrame:
    rows: list[list[object]] = []
    max_cols = 0

    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        cleaned = [(cell or "").strip() if isinstance(cell, str) else cell for cell in row]
                        rows.append(cleaned)
                        max_cols = max(max_cols, len(cleaned))
    except Exception as e:
        raise ParserError(f"No se pudo leer el PDF '{filename}': {e}") from e

    if not rows:
        raise ParserError(f"No se detectaron tablas en el PDF '{filename}'")

    # Pad ragged rows so pandas doesn't choke on inconsistent column counts.
    padded = [row + [None] * (max_cols - len(row)) for row in rows]
    return pd.DataFrame(padded)
