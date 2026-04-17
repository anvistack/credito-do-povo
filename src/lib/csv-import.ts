import type { LeadInsert } from "@/lib/supabase";
import { calcAge, ageGroup } from "@/lib/utils-lead";

/** Normalize header/key: lowercase, no accents, no non-alphanumerics. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Map of normalized header -> canonical lead field. */
const FIELD_ALIASES: Record<string, keyof LeadInsert> = {
  nome: "nome",
  nomecompleto: "nome",
  cpf: "cpf",
  datanascimento: "data_nascimento",
  nascimento: "data_nascimento",
  datadenascimento: "data_nascimento",
  whatsapp: "whatsapp",
  telefone: "whatsapp",
  celular: "whatsapp",
  cidade: "cidade",
  estado: "estado",
  uf: "estado",
  email: "email",
  comoconheceu: "como_conheceu",
  origem: "como_conheceu",
  valorpretendido: "valor_pretendido",
  valor: "valor_pretendido",
  perfil: "perfil",
  servico: "servico",
  idade: "idade",
  faixaetaria: "faixa_etaria",
  status: "status",
  agente: "agente",
  proprietarioveiculo: "proprietario_veiculo",
  proprietariodoveiculo: "proprietario_veiculo",
  cpfproprietario: "cpf_proprietario_veiculo",
  cpfproprietarioveiculo: "cpf_proprietario_veiculo",
  cpfdoproprietario: "cpf_proprietario_veiculo",
  placa: "placa_veiculo",
  placaveiculo: "placa_veiculo",
  placadoveiculo: "placa_veiculo",
  tipoconsorcio: "tipo_consorcio",
  tipodeconsorcio: "tipo_consorcio",
  temporegistroclt: "tempo_registro_clt",
  temporegistro: "tempo_registro_clt",
  tempodeclt: "tempo_registro_clt",
};

export type ParsedRow = {
  rowNumber: number;
  data?: LeadInsert;
  errors: string[];
};

/** Parse a CSV string into rows of cells. Supports `,` and `;`, quoted fields with "" escapes. */
export function parseCsv(text: string): string[][] {
  // Strip BOM
  const src = text.replace(/^\uFEFF/, "");
  // Detect delimiter from first non-empty line
  const firstLine = src.split(/\r?\n/).find((l) => l.trim().length > 0) ?? "";
  const semiCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const delim = semiCount > commaCount ? ";" : ",";

  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === delim) {
        cur.push(field);
        field = "";
      } else if (c === "\n") {
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else if (c === "\r") {
        // ignore, \n handles line end
      } else {
        field += c;
      }
    }
  }
  // last field/row
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  // remove empty trailing rows
  return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

/** Try to convert a date string to ISO yyyy-mm-dd. Accepts dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy. */
function parseDate(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  // yyyy-mm-dd
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const [, y, mo, d] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // dd/mm/yyyy or dd-mm-yyyy
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // try Date parse fallback
  const dt = new Date(s);
  if (!isNaN(dt.getTime())) {
    return dt.toISOString().slice(0, 10);
  }
  return null;
}

function parseNumber(v: string): number | null {
  if (!v) return null;
  // remove currency symbols, spaces
  let s = v.replace(/[R$\s]/g, "");
  // if it has both . and , assume pt-BR (1.234,56)
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = Number(s);
  return isNaN(n) ? null : n;
}

/** Map CSV rows to LeadInsert objects with validation. */
export function mapRowsToLeads(rows: string[][]): {
  parsed: ParsedRow[];
  unknownHeaders: string[];
  matchedHeaders: string[];
} {
  if (rows.length === 0) {
    return { parsed: [], unknownHeaders: [], matchedHeaders: [] };
  }
  const headers = rows[0].map((h) => h.trim());
  const headerMap: (keyof LeadInsert | null)[] = headers.map((h) => {
    const key = FIELD_ALIASES[norm(h)];
    return key ?? null;
  });

  const matchedHeaders: string[] = [];
  const unknownHeaders: string[] = [];
  headers.forEach((h, i) => {
    if (headerMap[i]) matchedHeaders.push(h);
    else if (h) unknownHeaders.push(h);
  });

  const parsed: ParsedRow[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rec: Partial<LeadInsert> = {};
    const errors: string[] = [];

    for (let c = 0; c < headers.length; c++) {
      const field = headerMap[c];
      if (!field) continue;
      const raw = (row[c] ?? "").trim();
      if (!raw) continue;

      switch (field) {
        case "data_nascimento": {
          const iso = parseDate(raw);
          if (!iso) errors.push(`data_nascimento inválida: "${raw}"`);
          else rec.data_nascimento = iso;
          break;
        }
        case "valor_pretendido": {
          const n = parseNumber(raw);
          if (n === null) errors.push(`valor_pretendido inválido: "${raw}"`);
          else rec.valor_pretendido = n;
          break;
        }
        case "idade": {
          const n = parseNumber(raw);
          if (n !== null) rec.idade = Math.floor(n);
          break;
        }
        case "estado": {
          rec.estado = raw.toUpperCase().slice(0, 2);
          break;
        }
        default:
          (rec as Record<string, unknown>)[field] = raw;
      }
    }

    // Derive idade / faixa_etaria from data_nascimento if missing
    if (rec.data_nascimento && rec.idade === undefined) {
      const age = calcAge(rec.data_nascimento);
      rec.idade = age;
      rec.faixa_etaria = ageGroup(age);
    } else if (rec.idade !== undefined && !rec.faixa_etaria) {
      rec.faixa_etaria = ageGroup(rec.idade);
    }

    // Required fields
    const required: (keyof LeadInsert)[] = [
      "nome",
      "cpf",
      "data_nascimento",
      "whatsapp",
      "cidade",
      "estado",
      "email",
    ];
    for (const f of required) {
      if (!rec[f]) errors.push(`campo obrigatório ausente: ${f}`);
    }

    // Defaults
    if (!rec.como_conheceu) rec.como_conheceu = "importacao";
    if (!rec.servico) rec.servico = "nao-informado";
    if (!rec.perfil) rec.perfil = "nao-informado";
    if (rec.valor_pretendido === undefined) rec.valor_pretendido = 0;
    if (!rec.status) rec.status = "novo";

    parsed.push({
      rowNumber: r + 1,
      data: errors.length === 0 ? (rec as LeadInsert) : undefined,
      errors,
    });
  }

  return { parsed, unknownHeaders, matchedHeaders };
}
