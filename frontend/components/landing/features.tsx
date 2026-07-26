import { Banknote, FileSpreadsheet, ShieldCheck, Landmark, Layers, Lock } from "lucide-react";

const FEATURES = [
  {
    eyebrow: "Bancos",
    icon: Landmark,
    title: "Auto-detección",
    description:
      "Reconoce automáticamente el formato de BBVA, CaixaBank, Santander y extractos genéricos, sin configuración manual.",
  },
  {
    eyebrow: "Fiscalidad",
    icon: ShieldCheck,
    title: "Validación NIF/CIF",
    description:
      "Verifica el dígito de control de cada NIF, NIE y CIF siguiendo el algoritmo oficial de la Agencia Tributaria.",
  },
  {
    eyebrow: "Exportación",
    icon: FileSpreadsheet,
    title: "Excel con fórmulas vivas",
    description:
      "Exporta un informe con SUMIFS, VLOOKUP y tabla dinámica por trimestre — no valores estáticos, fórmulas reales.",
  },
  {
    eyebrow: "Archivos",
    icon: Layers,
    title: "Multi-formato",
    description: "Sube PDF, XLSX o CSV indistintamente. GestoriaSync normaliza la estructura de cada archivo.",
  },
  {
    eyebrow: "Categorías",
    icon: Banknote,
    title: "Clasificación automática",
    description:
      "Categoriza cada movimiento — Alquiler, Suministros, Impuestos, Nómina — de forma transparente y auditable.",
  },
  {
    eyebrow: "Privacidad",
    icon: Lock,
    title: "Cumplimiento RGPD",
    description: "Los archivos se procesan en memoria y no se almacenan tras generar el informe.",
  },
];

export function Features() {
  return (
    <section id="producto" className="scroll-mt-24 bg-[#0a0714] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Todo lo que necesita <span className="font-accent text-[#a89bfb]">tu Gestoría</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            Una sola herramienta para consolidar, validar y exportar — sin plugins ni macros que mantener.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-[#7c6ff0]/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-[#a89bfb] uppercase">
                  {f.eyebrow}
                </span>
                <div className="flex size-9 items-center justify-center rounded-full bg-white/[0.06]">
                  <f.icon className="size-4 text-[#a89bfb]" />
                </div>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
