import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GestoriaSync — Consolidador Financiero",
  description:
    "Automatización de extractos bancarios y validación fiscal (NIF/CIF) para asesorías. Consolida BBVA, Santander y CaixaBank en segundos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
