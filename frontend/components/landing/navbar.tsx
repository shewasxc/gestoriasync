import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const NAV_LINKS = [
  { href: "#producto", label: "Producto" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-black/[0.06] bg-white/85 px-5 shadow-[0_8px_30px_-12px_rgba(11,10,18,0.15)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8 bg-[#0b0a12]" iconClassName="text-white" />
          <span className="text-[15px] font-semibold tracking-tight text-[#0b0a12]">
            GestoriaSync
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#4a4560] transition-colors hover:text-[#0b0a12]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="rounded-full text-[#4a4560] hover:bg-black/[0.04] hover:text-[#0b0a12]">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="sm"
              className="rounded-full bg-[#0b0a12] px-4 text-white hover:bg-[#0b0a12]/85"
            >
              Probar Demo en Vivo
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
