import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Política de Privacidad — GestoriaSync",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Política de Privacidad" updated="26 de julio de 2026">
      <p>
        Esta política describe cómo se tratan los datos en la demo pública de GestoriaSync, un proyecto de
        demostración técnica y no un servicio comercial.
      </p>

      <h2>1. Qué datos se procesan</h2>
      <p>
        Cuando subes un extracto bancario o una factura a <code>/dashboard</code>, el archivo viaja al backend
        (alojado en Render) únicamente para extraer movimientos, validar NIF/NIE/CIF y generar el informe Excel. No
        se crea ninguna cuenta de usuario ni se solicita información de identificación personal para usar la demo.
      </p>

      <h2>2. Almacenamiento</h2>
      <p>
        Los archivos y los datos extraídos se procesan en memoria durante la petición y no se guardan en disco ni en
        una base de datos. Al cerrar la pestaña o iniciar un nuevo análisis, la información desaparece del cliente y
        del servidor.
      </p>

      <h2>3. Terceros</h2>
      <p>
        El frontend se sirve desde Vercel y el backend desde Render; ambos pueden registrar metadatos técnicos
        estándar de sus infraestructuras (IP, hora de la petición) con fines de operación del hosting, ajenos a este
        proyecto.
      </p>

      <h2>4. Recomendación</h2>
      <p>
        Al ser un entorno de demostración, no subas documentos con datos personales, fiscales o financieros reales.
        Usa los archivos de ejemplo de <code>demo_files/</code> o datos ficticios equivalentes.
      </p>
    </LegalLayout>
  );
}
