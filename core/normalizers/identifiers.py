"""Validation of Spanish tax identifiers: DNI, NIE and CIF.

Each type has its own check-digit algorithm. We detect the type from the
shape of the string, then verify the control character so the UI can flag
rows with a fabricated or mistyped identifier.
"""
from __future__ import annotations

import re
from typing import NamedTuple, Optional

_DNI_RE = re.compile(r"^(\d{8})([A-Z])$")
_NIE_RE = re.compile(r"^([XYZ])(\d{7})([A-Z])$")
_CIF_RE = re.compile(r"^([A-HJNPQRSUVW])(\d{7})([0-9A-J])$")

_DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE"
_NIE_PREFIX = {"X": "0", "Y": "1", "Z": "2"}

# CIF organisation types whose control digit must be a letter (not a number).
_CIF_LETTER_ONLY = set("KPQS")
_CIF_NUMBER_ONLY = set("ABEH")
_CIF_CONTROL_LETTERS = "JABCDEFGHI"


class IdentifierValidation(NamedTuple):
    is_valid: bool
    id_type: Optional[str]  # "DNI" | "NIE" | "CIF" | None
    reason: Optional[str] = None


def _validate_dni(value: str) -> IdentifierValidation:
    m = _DNI_RE.match(value)
    if not m:
        return IdentifierValidation(False, "DNI", "Formato DNI incorrecto")
    number, letter = m.groups()
    expected = _DNI_LETTERS[int(number) % 23]
    if letter != expected:
        return IdentifierValidation(False, "DNI", f"Letra de control incorrecta (esperada {expected})")
    return IdentifierValidation(True, "DNI")


def _validate_nie(value: str) -> IdentifierValidation:
    m = _NIE_RE.match(value)
    if not m:
        return IdentifierValidation(False, "NIE", "Formato NIE incorrecto")
    prefix, number, letter = m.groups()
    numeric = _NIE_PREFIX[prefix] + number
    expected = _DNI_LETTERS[int(numeric) % 23]
    if letter != expected:
        return IdentifierValidation(False, "NIE", f"Letra de control incorrecta (esperada {expected})")
    return IdentifierValidation(True, "NIE")


def _cif_control_digit(letter: str, number: str) -> tuple[str, str]:
    """Returns (numeric_control, letter_control) — caller decides which applies."""
    even_sum = sum(int(number[i]) for i in range(1, 7, 2))
    odd_sum = 0
    for i in range(0, 7, 2):
        doubled = int(number[i]) * 2
        odd_sum += doubled // 10 + doubled % 10
    total = even_sum + odd_sum
    unit = total % 10
    numeric_control = str((10 - unit) % 10)
    letter_control = _CIF_CONTROL_LETTERS[(10 - unit) % 10]
    return numeric_control, letter_control


def _validate_cif(value: str) -> IdentifierValidation:
    m = _CIF_RE.match(value)
    if not m:
        return IdentifierValidation(False, "CIF", "Formato CIF incorrecto")
    letter, number, control = m.groups()
    numeric_control, letter_control = _cif_control_digit(letter, number)

    if letter in _CIF_LETTER_ONLY:
        ok = control == letter_control
    elif letter in _CIF_NUMBER_ONLY:
        ok = control == numeric_control
    else:
        ok = control in (numeric_control, letter_control)

    if not ok:
        return IdentifierValidation(
            False, "CIF", f"Digito de control incorrecto (esperado {numeric_control} o {letter_control})"
        )
    return IdentifierValidation(True, "CIF")


def validate_spanish_id(raw: str) -> IdentifierValidation:
    """Detects DNI / NIE / CIF from shape and validates its control character."""
    if not raw:
        return IdentifierValidation(False, None, "Vacio")

    value = raw.strip().upper().replace(" ", "").replace("-", "")

    if _DNI_RE.match(value):
        return _validate_dni(value)
    if _NIE_RE.match(value):
        return _validate_nie(value)
    if _CIF_RE.match(value):
        return _validate_cif(value)

    return IdentifierValidation(False, None, "Formato no reconocido (ni DNI, ni NIE, ni CIF)")
