import type { Movement, ParseIssue, ParseResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function readError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.detail ?? fallback);
}

export async function parseFiles(files: File[]): Promise<ParseResponse> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${API_URL}/api/parse`, { method: "POST", body: formData });
  if (!res.ok) return readError(res, `No se pudieron procesar los archivos (HTTP ${res.status}).`);
  return res.json();
}

export async function exportReport(movements: Movement[], issues: ParseIssue[]): Promise<Blob> {
  const res = await fetch(`${API_URL}/api/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movements, issues }),
  });
  if (!res.ok) return readError(res, `No se pudo generar el informe (HTTP ${res.status}).`);
  return res.blob();
}

export function formatCurrencyEs(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    useGrouping: "always",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateEs(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
