"use client";

import Link from "next/link";
import { Home, UploadCloud, History, Settings } from "lucide-react";
import { Logo } from "@/components/logo";

const NAV = [
  { label: "Inicio", icon: Home, href: "/", active: false, soon: false },
  { label: "Procesar", icon: UploadCloud, href: "/dashboard", active: true, soon: false },
  { label: "Historial", icon: History, href: "#", active: false, soon: true },
  { label: "Ajustes", icon: Settings, href: "#", active: false, soon: true },
];

function NavLinks() {
  return (
    <>
      {NAV.map((item) => (
        <Link
          key={item.label}
          href={item.soon ? "#" : item.href}
          aria-disabled={item.soon}
          className={`group flex items-center justify-between rounded-full px-3.5 py-2.5 text-sm transition-colors ${
            item.active
              ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
              : item.soon
                ? "cursor-default text-sidebar-foreground/40"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          }`}
          onClick={(e) => item.soon && e.preventDefault()}
        >
          <span className="flex items-center gap-3">
            <item.icon className="size-4" />
            {item.label}
          </span>
          {item.soon && (
            <span className="rounded-full border border-sidebar-border px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
              Pronto
            </span>
          )}
        </Link>
      ))}
    </>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
        <Logo className="h-7 w-7 bg-primary" iconClassName="size-3.5 text-primary-foreground" />
        <span className="text-sm font-semibold text-foreground">GestoriaSync</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        <NavLinks />
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-3.5">
          <p className="text-xs font-semibold text-foreground">Plan Profesional</p>
          <p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/60">
            Archivos ilimitados y soporte prioritario.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function DashboardMobileTopBar() {
  return (
    <div className="flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="h-6 w-6 bg-primary" iconClassName="size-3 text-primary-foreground" />
        <span className="text-sm font-semibold text-foreground">GestoriaSync</span>
      </Link>
      <nav className="flex items-center gap-1">
        {NAV.filter((item) => !item.soon).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className={`flex size-8 items-center justify-center rounded-full transition-colors ${
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="size-4" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
