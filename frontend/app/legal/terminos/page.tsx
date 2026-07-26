import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Términos y condiciones — GestoriaSync",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Términos y condiciones" updated="26 de julio de 2026">
      <p>
        GestoriaSync es un <strong>proyecto de demostración</strong> que muestra, de extremo a extremo, cómo sería un
        producto SaaS real para consolidar extractos bancarios de gestorías españolas. No es una empresa registrada
        ni presta un servicio comercial: el entorno público (<code>gestoriasync.vercel.app</code>) existe con fines
        de portfolio técnico.
      </p>

      <h2>1. Uso del servicio</h2>
      <p>
        Puedes usar libremente la demo en vivo con los archivos de ejemplo incluidos en el repositorio o con tus
        propios extractos ficticios. No proceses documentos con datos personales o financieros reales: al ser un
        entorno de demostración con planes de alojamiento gratuitos, no se ofrecen garantías de disponibilidad,
        cifrado a nivel de infraestructura ni de retención de datos propias de un producto en producción.
      </p>

      <h2>2. Procesamiento de archivos</h2>
      <p>
        Los archivos subidos se procesan en memoria únicamente para generar la respuesta (movimientos, validaciones
        e informe Excel) y no se almacenan de forma persistente en ningún servidor ni base de datos.
      </p>

      <h2>3. Sin garantías</h2>
      <p>
        El servicio se ofrece &ldquo;tal cual&rdquo;, sin garantía de ningún tipo. La validación de NIF/NIE/CIF sigue
        el algoritmo oficial de dígito de control de la Agencia Tributaria, pero no sustituye una verificación fiscal
        profesional.
      </p>

      <h2>4. Código fuente</h2>
      <p>
        El proyecto completo (backend FastAPI y frontend Next.js) es de código abierto y puede revisarse en{" "}
        <a href="https://github.com/shewasxc/gestoriasync" target="_blank" rel="noopener noreferrer">
          github.com/shewasxc/gestoriasync
        </a>
        .
      </p>
    </LegalLayout>
  );
}
