import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-aurora-light pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/70 px-3.5 py-1.5 text-xs font-medium text-[#4a4560] shadow-sm">
          <Logo className="h-4 w-4 bg-[#4f46e5]" iconClassName="size-2.5 text-white" />
          GestoriaSync App
        </div>

        <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight text-[#0b0a12] sm:text-6xl">
          Consolida extractos
          <br />
          bancarios para <span className="font-accent text-[#4f46e5]">todos</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[#4a4560]">
          Pon tu contabilidad a trabajar en segundos, no en horas. BBVA, Santander y
          CaixaBank, validados y listos para tu Gestoría.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-12 w-full rounded-full bg-[#4f46e5] px-7 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(79,70,229,0.55)] hover:bg-[#4338ca] sm:w-auto"
            >
              Probar Demo en Vivo
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href="#como-funciona">
            <Button
              size="lg"
              className="h-12 w-full rounded-full bg-[#efe9ff] px-7 text-base font-semibold text-[#4f46e5] shadow-none hover:bg-[#e4dbff] sm:w-auto"
            >
              Ver cómo funciona
            </Button>
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#4a4560]">
          {["Sin tarjeta de crédito", "Datos procesados de forma segura", "Compatible RGPD"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[#10b981]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl px-6">
        <HeroMockPanel />
      </div>
    </section>
  );
}

function HeroMockPanel() {
  const rows = [
    { concepto: "ALQUILER LOCAL COMERCIAL", importe: "-1.250,50 €", estado: "ok" },
    { concepto: "AGENCIA TRIBUTARIA MODELO 303", importe: "-940,15 €", estado: "ok" },
    { concepto: "TRANSFERENCIA RECIBIDA CLIENTE", importe: "+3.200,00 €", estado: "ok" },
    { concepto: "ALQUILER LOCAL COMERCIAL FEB", importe: "-1.250,50 €", estado: "error" },
  ];

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-10 -z-10 rounded-[3rem] bg-[#4f46e5]/10 blur-3xl" />
      <div className="overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-[0_40px_80px_-30px_rgba(11,10,18,0.35)]">
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-[#fbfaff] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#ef4444]/70" />
            <span className="size-2.5 rounded-full bg-[#f59e0b]/70" />
            <span className="size-2.5 rounded-full bg-[#10b981]/70" />
          </div>
          <span className="text-xs font-medium text-[#4a4560]">app.gestoriasync.es/dashboard</span>
          <span className="w-14" />
        </div>

        <div className="grid grid-cols-3 gap-3 p-5 sm:p-6">
          {[
            { label: "Movimientos", value: "30" },
            { label: "Balance", value: "-6.811 €" },
            { label: "Alertas NIF", value: "3" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-black/[0.06] bg-[#fbfaff] p-4">
              <div className="text-[10px] font-semibold tracking-wide text-[#4a4560] uppercase">
                {kpi.label}
              </div>
              <div className="mt-1.5 text-xl font-bold tabular-nums text-[#0b0a12]">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2 px-5 pb-6 sm:px-6">
          {rows.map((row) => (
            <div
              key={row.concepto}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                row.estado === "error" ? "border-[#ef4444]/25 bg-[#ef4444]/5" : "border-black/[0.05] bg-[#fbfaff]"
              }`}
            >
              <span className="truncate pr-3 text-[#0b0a12]/90">{row.concepto}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="tabular-nums font-semibold text-[#0b0a12]">{row.importe}</span>
                {row.estado === "ok" ? (
                  <span className="rounded-full bg-[#10b981]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#0a8a63]">
                    VÁLIDO
                  </span>
                ) : (
                  <span className="rounded-full bg-[#ef4444]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#ef4444]">
                    ERROR NIF
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
