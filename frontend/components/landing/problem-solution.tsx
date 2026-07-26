import { Check, X } from "lucide-react";

const BEFORE = [
  "15 horas al mes copiando movimientos entre extractos y Excel",
  "Errores de NIF/CIF que Hacienda rechaza en la presentación",
  "Fórmulas rotas cada vez que cambia el formato del banco",
  "Cada banco exporta las columnas con un nombre distinto",
];

const AFTER = [
  "1 clic: sube los extractos y GestoriaSync hace el resto",
  "Validación automática del dígito de control (NIF/NIE/CIF)",
  "Excel con fórmulas SUMIFS / VLOOKUP en vivo, listas para el cliente",
  "Detección automática de BBVA, Santander, CaixaBank y más",
];

export function ProblemSolution() {
  return (
    <section id="como-funciona" className="relative scroll-mt-24 overflow-hidden bg-aurora-dark py-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            De 15 horas de Excel a{" "}
            <span className="font-accent text-[#a89bfb]">un clic</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            Así es el cierre trimestral antes y después de GestoriaSync.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wide text-white/45 uppercase">
                Antes
              </h3>
              <span className="rounded-full bg-[#ef4444]/15 px-3 py-1 text-xs font-bold text-[#f87171]">
                ~15h / mes
              </span>
            </div>
            <ul className="space-y-4">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <X className="mt-0.5 size-4 shrink-0 text-[#f87171]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-3xl border border-[#7c6ff0]/40 bg-white/[0.04] p-8 shadow-[0_0_0_1px_rgba(124,111,240,0.15),0_30px_70px_-25px_rgba(124,111,240,0.45)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wide text-white uppercase">
                Ahora, con GestoriaSync
              </h3>
              <span className="rounded-full bg-[#10b981]/15 px-3 py-1 text-xs font-bold text-[#34d399]">
                1 clic
              </span>
            </div>
            <ul className="space-y-4">
              {AFTER.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#34d399]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
