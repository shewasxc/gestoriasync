import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Básico",
    price: "0€",
    period: "/mes",
    description: "Para probar GestoriaSync en un caso real.",
    features: ["Hasta 3 archivos al mes", "Validación NIF/CIF", "Exportación a Excel", "1 usuario"],
    cta: "Empezar gratis",
    highlighted: false,
    href: undefined as string | undefined,
  },
  {
    name: "Profesional",
    price: "49€",
    period: "/mes",
    description: "Para gestores que cierran trimestres cada mes.",
    features: [
      "Archivos ilimitados",
      "Validación NIF/CIF",
      "Fórmulas Excel en vivo",
      "Historial de informes",
      "Soporte prioritario",
    ],
    cta: "Probar Demo en Vivo",
    highlighted: true,
    href: undefined as string | undefined,
  },
  {
    name: "Asesoría",
    price: "149€",
    period: "/mes",
    description: "Para despachos con múltiples clientes.",
    features: [
      "Todo lo de Profesional",
      "Multi-cliente y multi-usuario",
      "Acceso a la API",
      "Exportación masiva",
      "Gestor de cuenta dedicado",
    ],
    cta: "Hablar con ventas",
    highlighted: false,
    href: "https://github.com/shewasxc/gestoriasync",
  },
];

export function Pricing() {
  return (
    <section id="precios" className="scroll-mt-24 bg-aurora-light py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0b0a12] sm:text-4xl">
            Precios <span className="font-accent text-[#4f46e5]">simples</span>, sin sorpresas
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#4a4560]">
            Cancela cuando quieras. Sin permanencia.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[1.75rem] border p-8 ${
                plan.highlighted
                  ? "border-[#4f46e5]/30 bg-white shadow-[0_30px_70px_-25px_rgba(79,70,229,0.35)]"
                  : "border-black/[0.06] bg-white"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-[#4f46e5] px-3.5 py-1 text-[11px] font-bold text-white">
                  MÁS POPULAR
                </span>
              )}

              <h3 className="text-xs font-semibold tracking-wide text-[#4a4560] uppercase">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-[#0b0a12]">{plan.price}</span>
                <span className="text-sm text-[#4a4560]">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-[#4a4560]">{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#0b0a12]/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#10b981]" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href ?? "/dashboard"}
                target={plan.href ? "_blank" : undefined}
                rel={plan.href ? "noopener noreferrer" : undefined}
                className="mt-8 block"
              >
                <Button
                  className={`h-11 w-full rounded-full font-semibold ${
                    plan.highlighted
                      ? "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                      : "bg-[#efe9ff] text-[#4f46e5] hover:bg-[#e4dbff]"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
