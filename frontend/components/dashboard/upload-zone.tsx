"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet, FileText, FileType, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCEPTED = [".pdf", ".xlsx", ".xls", ".csv"];

function fileIcon(name: string) {
  const ext = name.toLowerCase().split(".").pop();
  if (ext === "pdf") return <FileText className="size-4 text-destructive" />;
  if (ext === "csv") return <FileType className="size-4 text-primary" />;
  return <FileSpreadsheet className="size-4 text-success" />;
}

interface UploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function UploadZone({ files, onFilesChange, onProcess, isProcessing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const existingKeys = new Set(files.map((f) => `${f.name}-${f.size}`));
    const merged = [...files, ...incoming.filter((f) => !existingKeys.has(`${f.name}-${f.size}`))];
    onFilesChange(merged);
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Carga de archivos</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Arrastra los extractos de BBVA, Santander, CaixaBank aquí
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          {[
            { label: ".PDF", cls: "text-destructive" },
            { label: ".XLSX", cls: "text-success" },
            { label: ".CSV", cls: "text-primary" },
          ].map((chip) => (
            <span
              key={chip.label}
              className={`rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-bold ${chip.cls}`}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border bg-surface/50 hover:border-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <UploadCloud className="size-6 text-primary" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          Suelta tus archivos aquí o <span className="text-primary">haz clic para seleccionar</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">PDF, XLSX, XLS o CSV — varios archivos a la vez</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${file.size}-${i}`}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-3.5 py-2.5 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {fileIcon(file.name)}
                <span className="truncate text-sm text-foreground">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Quitar ${file.name}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <Button
          onClick={onProcess}
          disabled={files.length === 0 || isProcessing}
          className="rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {isProcessing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Procesando…
            </>
          ) : (
            <>
              <UploadCloud className="size-4" />
              Procesar archivos
            </>
          )}
        </Button>
        {files.length > 0 && !isProcessing && (
          <span className="text-sm text-muted-foreground">{files.length} archivo(s) listo(s)</span>
        )}
      </div>
    </div>
  );
}
