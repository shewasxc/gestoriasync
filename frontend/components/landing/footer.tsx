import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const COLUMNS = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Precios", href: "#precios" },
      { label: "Probar Demo en Vivo", href: "/dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos y condiciones", href: "#" },
      { label: "Política de Privacidad", href: "#" },
      { label: "Cumplimiento RGPD", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Contacto", href: "#" },
      { label: "Soporte", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-aurora-light pb-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] border border-black/[0.06] bg-white px-8 py-14 text-center shadow-[0_30px_80px_-30px_rgba(11,10,18,0.2)] sm:px-16">
          <h3 className="text-3xl font-extrabold tracking-tight text-[#0b0a12] sm:text-4xl">
            ¿Listo para ahorrar <span className="font-accent text-[#4f46e5]">15 horas</span> al mes?
          </h3>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-[#4a4560]">
            Sube tu primer extracto y comprueba el informe en menos de un minuto.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button
              size="lg"
              className="h-12 rounded-full bg-[#4f46e5] px-8 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(79,70,229,0.55)] hover:bg-[#4338ca]"
            >
              Probar Demo en Vivo
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-7 w-7 bg-[#0b0a12]" iconClassName="size-3.5 text-white" />
              <span className="text-sm font-semibold text-[#0b0a12]">GestoriaSync</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#4a4560]">
              Consolidación de extractos bancarios y validación fiscal para asesorías españolas.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-wide text-[#4f46e5] uppercase">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#4a4560] transition-colors hover:text-[#0b0a12]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-black/[0.06] pt-6 text-xs text-[#4a4560] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} GestoriaSync. Todos los derechos reservados.</span>
          <span>Hecho para asesorías y gestorías en España.</span>
        </div>
      </div>
    </footer>
  );
}
