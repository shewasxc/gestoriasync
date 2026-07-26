export type ExpenseCategory =
  | "Suministros"
  | "Alquiler"
  | "Impuestos"
  | "Nomina y Seguros Sociales"
  | "Proveedores"
  | "Gastos Bancarios"
  | "Seguros"
  | "Transporte"
  | "Ingresos"
  | "Otros";

export type SourceBank = "BBVA" | "Santander" | "CaixaBank" | "Generic" | "Desconocido";

export interface Movement {
  fecha: string;
  concepto: string;
  importe: number;
  nif_cif: string | null;
  nif_cif_valido: boolean | null;
  nif_cif_tipo: string | null;
  categoria: ExpenseCategory;
  banco: SourceBank;
  archivo_origen: string;
  fila_origen: number | null;
  trimestre: number | null;
  errores: string[];
}

export interface ParseIssue {
  archivo: string;
  fila: number | null;
  mensaje: string;
  nivel: "error" | "warning";
}

export interface Summary {
  total_movimientos: number;
  balance_total: number;
  alertas_fiscales: number;
  archivos_procesados: number;
  errores_parseo: number;
}

export interface ParseResponse {
  summary: Summary;
  movements: Movement[];
  issues: ParseIssue[];
}
