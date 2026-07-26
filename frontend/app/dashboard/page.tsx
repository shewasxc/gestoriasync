"use client";

import { useState } from "react";
import { AlertCircle, Download, Loader2, RotateCcw } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { MovementsTable } from "@/components/dashboard/movements-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exportReport, parseFiles } from "@/lib/api";
import type { ParseResponse } from "@/lib/types";

export default function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<ParseResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleProcess() {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await parseFiles(files);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar los archivos.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleExport() {
    if (!result) return;
    setIsExporting(true);
    setError(null);
    try {
      const blob = await exportReport(result.movements, result.issues);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Informe_Trimestral_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar el informe.");
    } finally {
      setIsExporting(false);
    }
  }

  function handleReset() {
    setFiles([]);
    setResult(null);
    setError(null);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border px-6 lg:px-8">
          <div>
            <h1 className="text-[15px] font-semibold text-foreground">Procesar extractos</h1>
            <p className="text-xs text-muted-foreground">Consolida, valida y exporta en un solo flujo</p>
          </div>
          {result && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="rounded-full text-muted-foreground">
              <RotateCcw className="size-3.5" />
              Nuevo análisis
            </Button>
          )}
        </header>

        <main className="mx-auto max-w-6xl space-y-6 px-6 py-8 lg:px-8">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          <UploadZone files={files} onFilesChange={setFiles} onProcess={handleProcess} isProcessing={isProcessing} />

          {!result && !isProcessing && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Sube uno o varios extractos y pulsa <span className="text-foreground">Procesar archivos</span> para
                ver el análisis.
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-primary" />
              Analizando extractos y validando NIF/CIF…
            </div>
          )}

          {result && !isProcessing && (
            <>
              <KpiCards summary={result.summary} />
              <MovementsTable movements={result.movements} />

              {result.issues.length > 0 && (
                <details className="rounded-3xl border border-border bg-card p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">
                    Incidencias de validación ({result.issues.length})
                  </summary>
                  <div className="mt-4 space-y-2">
                    {result.issues.map((issue, i) => (
                      <div
                        key={`${issue.archivo}-${issue.fila}-${i}`}
                        className="flex flex-wrap items-center gap-2.5 border-b border-border/60 pb-2 text-sm last:border-0"
                      >
                        <Badge variant={issue.nivel === "error" ? "destructive" : "warning"}>
                          {issue.nivel === "error" ? "ERROR" : "AVISO"}
                        </Badge>
                        <span className="text-muted-foreground">{issue.archivo}</span>
                        {issue.fila != null && <span className="text-muted-foreground/60">fila {issue.fila}</span>}
                        <span className="text-foreground/90">{issue.mensaje}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              <div className="rounded-[1.75rem] border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-success/5 p-10 text-center">
                <h3 className="text-xl font-bold text-foreground">
                  Tu informe <span className="font-accent text-2xl text-primary">trimestral</span> está listo
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                  Incluye fórmulas SUMIFS / VLOOKUP en vivo, tabla dinámica por trimestre y categoría, y formato
                  corporativo — listo para tu Gestoría.
                </p>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  size="lg"
                  className="mt-6 h-12 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_rgba(79,70,229,0.65)] transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                  Descargar Informe Consolidado (.XLSX con Fórmulas)
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
