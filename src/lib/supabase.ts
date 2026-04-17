import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pqdtvfbuonfamhesfkms.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zUETtWrO2yggANIXPDNwXg_Gb-b63h0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "cdp-admin-auth",
  },
});

export type LeadInsert = {
  nome: string;
  cpf: string;
  data_nascimento: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  email: string;
  como_conheceu: string;
  valor_pretendido: number;
  perfil: string;
  servico: string;
  idade: number;
  faixa_etaria: string;
  status?: string;
  agente?: string | null;
  updated_at?: string;
};

export type Lead = LeadInsert & {
  id: string;
  created_at: string;
  agente?: string | null;
};

export type Agente = {
  id: string;
  nome: string;
  email: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};
