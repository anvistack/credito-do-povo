import type { Lead } from "@/lib/supabase";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const COLUMNS: { key: keyof Lead; label: string }[] = [
  { key: "created_at", label: "Data" },
  { key: "nome", label: "Nome" },
  { key: "cpf", label: "CPF" },
  { key: "data_nascimento", label: "Nascimento" },
  { key: "idade", label: "Idade" },
  { key: "faixa_etaria", label: "Faixa etária" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "E-mail" },
  { key: "cidade", label: "Cidade" },
  { key: "estado", label: "UF" },
  { key: "como_conheceu", label: "Como conheceu" },
  { key: "servico", label: "Serviço" },
  { key: "perfil", label: "Perfil" },
  { key: "valor_pretendido", label: "Valor pretendido" },
  { key: "status", label: "Status" },
  { key: "agente", label: "Agente" },
];

export function leadsToCsv(leads: Lead[]): string {
  const header = COLUMNS.map((c) => escapeCsv(c.label)).join(";");
  const rows = leads.map((l) =>
    COLUMNS.map((c) => {
      const v = l[c.key];
      if (c.key === "created_at" && v) {
        return escapeCsv(new Date(String(v)).toLocaleString("pt-BR"));
      }
      return escapeCsv(v);
    }).join(";")
  );
  return [header, ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  // BOM for Excel UTF-8 compatibility
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
