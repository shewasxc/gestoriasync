"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-aurora-light px-6 text-center">
      <Logo className="h-10 w-10 bg-[#0b0a12]" iconClassName="size-5 text-white" />
      <p className="mt-6 text-sm font-semibold tracking-wide text-[#4f46e5] uppercase">Algo salió mal</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b0a12] sm:text-4xl">
        Se ha producido un <span className="font-accent text-[#4f46e5]">error</span>
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-[15px] text-[#4a4560]">
        Puede que una extensión del navegador (como un traductor automático) haya interferido con la página.
        Recárgala e inténtalo de nuevo.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link href="/">
          <Button
            variant="outline"
            size="lg"
            className="h-11 rounded-full border-black/10 px-6 text-[#0b0a12] hover:bg-black/[0.04]"
          >
            Volver al inicio
          </Button>
        </Link>
        <Button
          onClick={() => reset()}
          size="lg"
          className="h-11 rounded-full bg-[#4f46e5] px-6 text-white shadow-[0_10px_30px_-8px_rgba(79,70,229,0.55)] hover:bg-[#4338ca]"
        >
          <RotateCcw className="size-4" />
          Reintentar
        </Button>
      </div>
    </div>
  );
}
