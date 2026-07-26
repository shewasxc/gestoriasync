"""GestoriaSync REST API — thin FastAPI wrapper around core/.

Two endpoints carry the whole product:

- POST /api/parse   multipart file upload (PDF/XLSX/CSV) -> normalized
  movements + validation issues + a summary, ready for the dashboard.
- POST /api/export   JSON body (the movements/issues echoed back from
  /api/parse) -> the final .xlsx, built fresh from core.excel_builder so
  it keeps its live SUMIFS/VLOOKUP formulas.

All parsing, normalization, categorization and Excel-generation logic
lives in core/ untouched — this file only adapts it to HTTP.
"""
from __future__ import annotations

import datetime as dt
from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from core.categorizer import categorize
from core.excel_builder import build_report
from core.models import Movement, ParseIssue
from core.parsers.base import ParserError
from core.parsers.detector import parse_any_file

app = FastAPI(title="GestoriaSync API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    # allow_origin_regex covers any localhost dev port (Next.js falls back to
    # 3001, 3002... when 3000 is already taken by another project).
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- /api/parse --------------------------------------------------------------
class Summary(BaseModel):
    total_movimientos: int
    balance_total: float
    alertas_fiscales: int
    archivos_procesados: int
    errores_parseo: int


class ParseResponse(BaseModel):
    summary: Summary
    movements: list[Movement]
    issues: list[ParseIssue]


@app.post("/api/parse", response_model=ParseResponse)
async def parse_files(files: list[UploadFile] = File(...)) -> ParseResponse:
    if not files:
        raise HTTPException(status_code=400, detail="No se ha subido ningun archivo.")

    movements: list[Movement] = []
    issues: list[ParseIssue] = []
    processed = 0

    for f in files:
        data = await f.read()
        filename = f.filename or "archivo"
        try:
            statement = parse_any_file(data, filename)
            for m in statement.movements:
                m.categoria = categorize(m.concepto, m.importe)
            movements.extend(statement.movements)
            issues.extend(statement.issues)
            processed += 1
        except ParserError as e:
            issues.append(ParseIssue(archivo=filename, mensaje=str(e), nivel="error"))

    invalid_nif = sum(1 for m in movements if m.nif_cif and m.nif_cif_valido is False)
    n_errors = sum(1 for i in issues if i.nivel == "error")

    summary = Summary(
        total_movimientos=len(movements),
        balance_total=sum(m.importe for m in movements),
        alertas_fiscales=invalid_nif,
        archivos_procesados=processed,
        errores_parseo=n_errors,
    )
    return ParseResponse(summary=summary, movements=movements, issues=issues)


# --- /api/export ---------------------------------------------------------------
class MovementIn(BaseModel):
    fecha: dt.date
    concepto: str
    importe: float
    nif_cif: Optional[str] = None
    categoria: Optional[str] = None
    banco: Optional[str] = None
    archivo_origen: Optional[str] = ""
    fila_origen: Optional[int] = None
    trimestre: Optional[int] = None


class IssueIn(BaseModel):
    archivo: str
    fila: Optional[int] = None
    mensaje: str
    nivel: str = "error"


class ExportRequest(BaseModel):
    movements: list[MovementIn]
    issues: list[IssueIn] = []


@app.post("/api/export")
async def export_report(payload: ExportRequest) -> Response:
    if not payload.movements:
        raise HTTPException(status_code=400, detail="No hay movimientos para exportar.")

    # Rebuilding Movement from scratch (instead of trusting the client's
    # derived fields) lets model_post_init recompute nif_cif_valido/trimestre
    # fresh, so a tampered or stale payload can't smuggle bad validation state
    # into the report.
    movements = [
        Movement(
            fecha=m.fecha,
            concepto=m.concepto,
            importe=m.importe,
            nif_cif=m.nif_cif,
            categoria=m.categoria or "Otros",
            banco=m.banco or "Desconocido",
            archivo_origen=m.archivo_origen or "",
            fila_origen=m.fila_origen,
            trimestre=m.trimestre,
        )
        for m in payload.movements
    ]
    issues = [ParseIssue(archivo=i.archivo, fila=i.fila, mensaje=i.mensaje, nivel=i.nivel) for i in payload.issues]

    report_bytes = build_report(movements, issues)
    filename = f"Informe_Trimestral_{dt.date.today().isoformat()}.xlsx"
    return Response(
        content=report_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
