import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Cumplimiento RGPD — GestoriaSync",
};

export default function RgpdPage() {
  return (
    <LegalLayout title="Cumplimiento RGPD" updated="26 de julio de 2026">
      <p>
        GestoriaSync se diseñó siguiendo los principios del RGPD (Reglamento (UE) 2016/679) como ejercicio de
        arquitectura: minimización de datos, ausencia de persistencia innecesaria y transparencia sobre el
        procesamiento. Esta página resume cómo se aplican esos principios en la demo pública.
      </p>

      <h2>1. Minimización de datos</h2>
      <p>
        El backend solo extrae los campos necesarios para el informe (fecha, concepto, importe, NIF/CIF, banco de
        origen) y no requiere registro, cookies de seguimiento ni analítica de terceros.
      </p>

      <h2>2. Sin persistencia</h2>
      <p>
        No existe base de datos: cada petición a <code>/api/parse</code> y <code>/api/export</code> es independiente
        (stateless). Los archivos y movimientos procesados no sobreviven a la respuesta HTTP.
      </p>

      <h2>3. Validación de identificadores fiscales</h2>
      <p>
        La validación de NIF/NIE/CIF se realiza localmente mediante el algoritmo público de dígito de control de la
        Agencia Tributaria — no se consulta ningún servicio externo ni se comparte el identificador con terceros.
      </p>

      <h2>4. Alcance real</h2>
      <p>
        Este proyecto es una demostración de portfolio, no una entidad que trate datos de clientes reales. Para un
        despliegue en producción de una gestoría real, este mismo diseño (sin persistencia, procesamiento en
        memoria) sería el punto de partida de un análisis RGPD completo, incluyendo un registro de actividades de
        tratamiento formal.
      </p>
    </LegalLayout>
  );
}
