"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrencyEs, formatDateEs } from "@/lib/api";
import type { Movement } from "@/lib/types";

const PAGE_SIZE = 8;

export function MovementsTable({ movements }: { movements: Movement[] }) {
  const banks = useMemo(() => Array.from(new Set(movements.map((m) => m.banco))).sort(), [movements]);
  const quarters = useMemo(
    () => Array.from(new Set(movements.map((m) => m.trimestre).filter((q): q is number => q != null))).sort(),
    [movements],
  );

  const [bankFilter, setBankFilter] = useState<Set<string>>(new Set(banks));
  const [quarterFilter, setQuarterFilter] = useState<Set<number>>(new Set(quarters));
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setBankFilter(new Set(banks)), [banks]);
  useEffect(() => setQuarterFilter(new Set(quarters)), [quarters]);
  useEffect(() => setPage(1), [bankFilter, quarterFilter, search, movements]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movements
      .filter((m) => bankFilter.has(m.banco))
      .filter((m) => (m.trimestre != null ? quarterFilter.has(m.trimestre) : true))
      .filter(
        (m) =>
          !q ||
          m.concepto.toLowerCase().includes(q) ||
          (m.nif_cif ?? "").toLowerCase().includes(q),
      )
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [movements, bankFilter, quarterFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggle<T>(set: Set<T>, value: T, setter: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  return (
    <div className="rounded-3xl border border-border bg-card">
      <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Movimientos Detallados</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {filtered.length} de {movements.length} movimientos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {banks.map((bank) => (
              <button
                key={bank}
                onClick={() => toggle(bankFilter, bank, setBankFilter)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  bankFilter.has(bank)
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {bank}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quarters.map((quarter) => (
              <button
                key={quarter}
                onClick={() => toggle(quarterFilter, quarter, setQuarterFilter)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  quarterFilter.has(quarter)
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                T{quarter}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Concepto o NIF…"
              className="h-8 w-44 border-border bg-surface pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Fecha</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead className="text-right">Importe</TableHead>
              <TableHead>NIF/CIF</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Trim.</TableHead>
              <TableHead>Banco</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  Ningún movimiento coincide con los filtros seleccionados.
                </TableCell>
              </TableRow>
            )}
            {pageRows.map((m, i) => {
              const invalid = Boolean(m.nif_cif) && m.nif_cif_valido === false;
              return (
                <TableRow key={`${m.archivo_origen}-${m.fila_origen}-${i}`} className={invalid ? "bg-destructive/[0.04]" : ""}>
                  <TableCell className="text-muted-foreground">{formatDateEs(m.fecha)}</TableCell>
                  <TableCell className="max-w-[220px] truncate font-medium text-foreground" title={m.concepto}>
                    {m.concepto}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold tabular-nums ${
                      m.importe >= 0 ? "text-success" : "text-foreground"
                    }`}
                  >
                    {formatCurrencyEs(m.importe)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.nif_cif ?? "—"}</TableCell>
                  <TableCell>
                    {!m.nif_cif ? (
                      <Badge variant="outline" className="text-muted-foreground">
                        Sin NIF
                      </Badge>
                    ) : m.nif_cif_valido ? (
                      <Badge variant="success">✓ VÁLIDO</Badge>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="destructive" className="cursor-help">
                            ⚠ ERROR NIF
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {m.errores[0] ?? "Dígito de control incorrecto"}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-muted-foreground">
                      {m.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">T{m.trimestre}</TableCell>
                  <TableCell className="text-muted-foreground">{m.banco}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
        <span className="text-xs text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
