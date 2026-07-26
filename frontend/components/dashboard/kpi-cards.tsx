import { AlertTriangle, FileStack, ListChecks, Wallet } from "lucide-react";
import { formatCurrencyEs } from "@/lib/api";
import type { Summary } from "@/lib/types";

export function KpiCards({ summary }: { summary: Summary }) {
  const balancePositive = summary.balance_total >= 0;
  const hasAlerts = summary.alertas_fiscales > 0;

  const cards = [
    {
      label: "Balance Total",
      value: formatCurrencyEs(summary.balance_total),
      icon: Wallet,
      tone: balancePositive ? "success" : "destructive",
    },
    {
      label: "Filas Procesadas",
      value: summary.total_movimientos.toLocaleString("es-ES"),
      icon: ListChecks,
      tone: "neutral",
    },
    {
      label: "Errores NIF/CIF",
      value: summary.alertas_fiscales.toLocaleString("es-ES"),
      icon: AlertTriangle,
      tone: hasAlerts ? "destructive" : "success",
    },
    {
      label: "Archivos Procesados",
      value: summary.archivos_procesados.toLocaleString("es-ES"),
      icon: FileStack,
      tone: "primary",
    },
  ] as const;

  const toneClasses: Record<string, string> = {
    success: "text-success bg-success/10",
    destructive: "text-destructive bg-destructive/10",
    primary: "text-primary bg-primary/10",
    neutral: "text-foreground bg-muted",
  };
  const valueClasses: Record<string, string> = {
    success: "text-success",
    destructive: "text-destructive",
    primary: "text-foreground",
    neutral: "text-foreground",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {card.label}
            </span>
            <span className={`flex size-9 items-center justify-center rounded-full ${toneClasses[card.tone]}`}>
              <card.icon className="size-4" />
            </span>
          </div>
          <div className={`mt-3 text-2xl font-bold tabular-nums ${valueClasses[card.tone]}`}>
            {card.value}
          </div>
          {card.label === "Errores NIF/CIF" && hasAlerts && (
            <span className="mt-2 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
              Requiere revisión
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
