import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { parseCsv, mapRowsToLeads, type ParsedRow } from "@/lib/csv-import";
import { supabase, type LeadInsert } from "@/lib/supabase";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onImported: () => void;
};

type Preview = {
  fileName: string;
  parsed: ParsedRow[];
  matchedHeaders: string[];
  unknownHeaders: string[];
};

export function ImportLeadsDialog({ open, onOpenChange, onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setPreview(null);
    setImporting(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Selecione um arquivo .csv");
      return;
    }
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length < 2) {
        toast.error("Arquivo vazio ou sem dados além do cabeçalho");
        return;
      }
      const { parsed, matchedHeaders, unknownHeaders } = mapRowsToLeads(rows);
      if (matchedHeaders.length === 0) {
        toast.error("Nenhum cabeçalho do CSV corresponde aos campos da tabela");
        return;
      }
      setPreview({ fileName: file.name, parsed, matchedHeaders, unknownHeaders });
    } catch (e) {
      toast.error("Falha ao ler o arquivo", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const doImport = async () => {
    if (!preview) return;
    const valid = preview.parsed.filter((r) => r.data).map((r) => r.data!) as LeadInsert[];
    if (valid.length === 0) {
      toast.error("Nenhum lead válido para importar");
      return;
    }
    setImporting(true);
    // Insert in batches of 200
    const BATCH = 200;
    let inserted = 0;
    let failed = 0;
    const errors: string[] = [];
    for (let i = 0; i < valid.length; i += BATCH) {
      const slice = valid.slice(i, i + BATCH);
      const { error, count } = await supabase
        .from("leads")
        .insert(slice, { count: "exact" });
      if (error) {
        failed += slice.length;
        errors.push(error.message);
      } else {
        inserted += count ?? slice.length;
      }
    }
    setImporting(false);
    if (failed === 0) {
      toast.success(`${inserted} lead(s) importado(s) com sucesso`);
      onImported();
      reset();
      onOpenChange(false);
    } else {
      toast.error(`Importação parcial: ${inserted} ok, ${failed} falharam`, {
        description: errors[0],
      });
      if (inserted > 0) onImported();
    }
  };

  const validCount = preview?.parsed.filter((r) => r.data).length ?? 0;
  const errorRows = preview?.parsed.filter((r) => r.errors.length > 0) ?? [];

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar leads via CSV</DialogTitle>
          <DialogDescription>
            Envie um arquivo .csv. As colunas são reconhecidas automaticamente pelo nome
            (sem diferenciar maiúsculas, acentos ou espaços). Separadores aceitos:{" "}
            <code>;</code> ou <code>,</code>.
          </DialogDescription>
        </DialogHeader>

        {!preview ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Arraste o arquivo aqui ou clique para selecionar
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              <FileText className="h-4 w-4" />
              Selecionar arquivo
            </Button>
            <div className="mt-2 text-xs text-muted-foreground">
              Campos reconhecidos: nome, cpf, data_nascimento, whatsapp, email, cidade,
              estado/uf, como_conheceu, valor_pretendido, perfil, servico, idade,
              faixa_etaria, status, agente.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border p-3 text-sm">
              <div className="font-medium">{preview.fileName}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {preview.parsed.length} linha(s) lida(s) ·{" "}
                <span className="text-primary">{validCount} válida(s)</span>
                {errorRows.length > 0 && (
                  <>
                    {" · "}
                    <span className="text-destructive">{errorRows.length} com erro</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-md border p-3 text-xs">
              <div className="mb-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Colunas reconhecidas ({preview.matchedHeaders.length})
              </div>
              <div className="text-muted-foreground">
                {preview.matchedHeaders.join(", ") || "—"}
              </div>
              {preview.unknownHeaders.length > 0 && (
                <>
                  <div className="mt-2 mb-1 flex items-center gap-1 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                    Colunas ignoradas ({preview.unknownHeaders.length})
                  </div>
                  <div className="text-muted-foreground">
                    {preview.unknownHeaders.join(", ")}
                  </div>
                </>
              )}
            </div>

            {errorRows.length > 0 && (
              <div className="max-h-40 overflow-auto rounded-md border p-3 text-xs">
                <div className="mb-1 font-medium text-destructive">
                  Linhas com erro (não serão importadas):
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  {errorRows.slice(0, 20).map((r) => (
                    <li key={r.rowNumber}>
                      Linha {r.rowNumber}: {r.errors.join("; ")}
                    </li>
                  ))}
                  {errorRows.length > 20 && (
                    <li>… e mais {errorRows.length - 20} linha(s).</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {preview && (
            <Button variant="outline" onClick={reset} disabled={importing}>
              Trocar arquivo
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
            disabled={importing}
          >
            Cancelar
          </Button>
          {preview && (
            <Button onClick={doImport} disabled={importing || validCount === 0}>
              {importing && <Loader2 className="h-4 w-4 animate-spin" />}
              Importar {validCount} lead(s)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
