import type { ReactNode } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="bg-aurora-light pt-40 pb-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-[2rem] border border-black/[0.06] bg-white px-8 py-12 shadow-[0_30px_80px_-30px_rgba(11,10,18,0.15)] sm:px-12">
            <p className="text-xs font-semibold tracking-wide text-[#4f46e5] uppercase">Última actualización: {updated}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b0a12] sm:text-4xl">{title}</h1>
            <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[#4a4560] [&_a]:text-[#4f46e5] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:pt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#0b0a12] [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-[#0b0a12]">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
