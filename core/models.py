"""Pydantic v2 schemas that every parsed row must satisfy before it reaches
the Excel builder. Keeping the schema strict here means downstream code
(categorizer, excel_builder) never has to defend against malformed rows.
"""
from __future__ import annotations

import datetime as dt
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from core.normalizers.currency import parse_amount
from core.normalizers.dates import normalize_date
from core.normalizers.identifiers import validate_spanish_id


class SourceBank(str, Enum):
    BBVA = "BBVA"
    SANTANDER = "Santander"
    CAIXABANK = "CaixaBank"
    GENERIC = "Generic"
    UNKNOWN = "Desconocido"


class ExpenseCategory(str, Enum):
    SUMINISTROS = "Suministros"
    ALQUILER = "Alquiler"
    IMPUESTOS = "Impuestos"
    NOMINA = "Nomina y Seguros Sociales"
    PROVEEDORES = "Proveedores"
    BANCARIO = "Gastos Bancarios"
    SEGUROS = "Seguros"
    TRANSPORTE = "Transporte"
    INGRESOS = "Ingresos"
    OTROS = "Otros"


class Movement(BaseModel):
    """A single normalized bank movement / invoice line, ready for Excel export."""

    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    fecha: dt.date
    concepto: str = Field(min_length=1, max_length=500)
    importe: float
    nif_cif: Optional[str] = None
    nif_cif_valido: Optional[bool] = None
    nif_cif_tipo: Optional[str] = None
    categoria: ExpenseCategory = ExpenseCategory.OTROS
    banco: SourceBank = SourceBank.UNKNOWN
    archivo_origen: str = ""
    fila_origen: Optional[int] = None
    trimestre: Optional[int] = None
    errores: list[str] = Field(default_factory=list)

    @field_validator("fecha", mode="before")
    @classmethod
    def _v_fecha(cls, v):
        if isinstance(v, dt.date):
            return v
        parsed = normalize_date(v)
        if parsed is None:
            raise ValueError(f"Fecha invalida: {v!r}")
        return parsed

    @field_validator("importe", mode="before")
    @classmethod
    def _v_importe(cls, v):
        if isinstance(v, (int, float)):
            return float(v)
        parsed = parse_amount(v)
        if parsed is None:
            raise ValueError(f"Importe invalido: {v!r}")
        return parsed

    @field_validator("nif_cif", mode="before")
    @classmethod
    def _v_nif(cls, v):
        if v is None:
            return None
        v = str(v).strip().upper().replace(" ", "").replace("-", "")
        return v or None

    def model_post_init(self, __context) -> None:
        # Derived fields that depend on other already-validated fields.
        if self.trimestre is None:
            self.trimestre = (self.fecha.month - 1) // 3 + 1
        if self.nif_cif:
            result = validate_spanish_id(self.nif_cif)
            self.nif_cif_valido = result.is_valid
            self.nif_cif_tipo = result.id_type
            if not result.is_valid:
                self.errores.append(f"NIF/CIF invalido: {self.nif_cif}")
        else:
            self.nif_cif_valido = None


class ParseIssue(BaseModel):
    """A row-level problem surfaced to the UI (does not necessarily block export)."""

    archivo: str
    fila: Optional[int] = None
    mensaje: str
    nivel: str = "error"  # "error" | "warning"
