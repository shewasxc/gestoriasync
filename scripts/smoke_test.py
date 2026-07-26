"""Ad-hoc smoke test: runs every demo file through the real pipeline and
builds the final workbook, without going through the API. Not a pytest
suite — just a fast way to catch parser/builder regressions manually.

Run: venv/Scripts/python.exe scripts/smoke_test.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from core.categorizer import categorize
from core.excel_builder import build_report
from core.parsers.base import ParserError
from core.parsers.detector import parse_any_file

DEMO_DIR = os.path.join(ROOT, "demo_files")

FILES = [
    "extracto_BBVA_demo.pdf",
    "movimientos_Santander_demo.xlsx",
    "movimientos_CaixaBank_demo.csv",
    "facturas_genericas_demo.xlsx",
]


def main() -> None:
    all_movements = []
    all_issues = []

    for filename in FILES:
        path = os.path.join(DEMO_DIR, filename)
        with open(path, "rb") as f:
            data = f.read()
        try:
            stmt = parse_any_file(data, filename)
        except ParserError as e:
            print(f"[ERROR] {filename}: {e}")
            continue

        for m in stmt.movements:
            m.categoria = categorize(m.concepto, m.importe)

        print(f"{filename}: banco={stmt.banco.value} movimientos={len(stmt.movements)} issues={len(stmt.issues)}")
        for issue in stmt.issues:
            print(f"    [{issue.nivel}] fila {issue.fila}: {issue.mensaje}")

        all_movements.extend(stmt.movements)
        all_issues.extend(stmt.issues)

    print(f"\nTOTAL movimientos={len(all_movements)} issues={len(all_issues)}")
    invalid = [m for m in all_movements if m.nif_cif and m.nif_cif_valido is False]
    print(f"NIF/CIF invalidos detectados: {len(invalid)}")
    for m in invalid:
        print(f"    {m.archivo_origen} fila {m.fila_origen}: {m.nif_cif} -> {m.errores}")

    report_bytes = build_report(all_movements, all_issues)
    out_path = os.path.join(ROOT, "scripts", "_smoke_test_output.xlsx")
    with open(out_path, "wb") as f:
        f.write(report_bytes)
    print(f"\nInforme generado: {out_path} ({len(report_bytes)} bytes)")


if __name__ == "__main__":
    main()
