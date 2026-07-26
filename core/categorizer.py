"""Keyword-based classification of bank movements into expense categories.

Simple and auditable on purpose: a Gestoría needs to be able to explain
*why* a movement landed in "Suministros" rather than "Otros", which a
black-box classifier would make harder to defend to a client or to
Hacienda. Keywords are matched against the normalized 'concepto' text.
"""
from __future__ import annotations

import unicodedata

from core.models import ExpenseCategory

# Ordered: first matching category wins, so put more specific keywords first.
_CATEGORY_KEYWORDS: list[tuple[ExpenseCategory, tuple[str, ...]]] = [
    (ExpenseCategory.NOMINA, (
        "nomina", "seguridad social", "tgss", "seg social", "salario",
        "sueldo", "retribucion",
    )),
    (ExpenseCategory.IMPUESTOS, (
        "agencia tributaria", "hacienda", "aeat", "iva", "irpf", "modelo 1",
        "modelo 3", "modelo 2", "impuesto",
    )),
    (ExpenseCategory.ALQUILER, (
        "alquiler", "arrendamiento", "renta local", "arrendador",
    )),
    (ExpenseCategory.SUMINISTROS, (
        "endesa", "iberdrola", "naturgy", "electricidad", "luz", "agua",
        "gas natural", "telefonica", "movistar", "vodafone", "orange",
        "internet", "suministro", "electrica",
    )),
    (ExpenseCategory.SEGUROS, (
        "seguro", "mapfre", "mutua", "axa", "allianz", "generali",
    )),
    (ExpenseCategory.TRANSPORTE, (
        "gasolina", "repsol", "cepsa", "peaje", "parking", "taxi", "uber",
        "renfe", "combustible", "autopista",
    )),
    (ExpenseCategory.BANCARIO, (
        "comision", "gastos bancarios", "mantenimiento cuenta", "intereses",
        "comisiones",
    )),
    (ExpenseCategory.INGRESOS, (
        "transferencia recibida", "abono", "ingreso", "cobro factura",
        "venta",
    )),
    (ExpenseCategory.PROVEEDORES, (
        "factura proveedor", "proveedor", "compra mercaderia", "suministro material",
    )),
]


def _normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    return text.lower()


def categorize(concepto: str, importe: float | None = None) -> ExpenseCategory:
    """Classifies a movement by matching keywords in its concept text.

    Falls back to INGRESOS/OTROS based on sign when no keyword matches,
    since a positive, unrecognized movement is far more likely income than
    an unclassified expense.
    """
    text = _normalize(concepto or "")

    for category, keywords in _CATEGORY_KEYWORDS:
        if any(kw in text for kw in keywords):
            return category

    if importe is not None and importe > 0:
        return ExpenseCategory.INGRESOS

    return ExpenseCategory.OTROS
