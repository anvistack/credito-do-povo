import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IMaskInput } from "react-imask";
import { ModalShell } from "./ModalShell";
import { CardGrid } from "./CardGrid";
import { supabase } from "@/lib/supabase";
import { calcAge, ageGroup, formatBRL, isValidCPF, ESTADOS } from "@/lib/utils-lead";

type Props = { open: boolean; onClose: () => void };

const PERFIS = [
  { value: "Aposentado(a)", label: "Aposentado(a)", emoji: "👴" },
  { value: "Pensionista INSS", label: "Pensionista INSS", emoji: "🧓" },
  { value: "Trabalhador CLT", label: "Trabalhador CLT", emoji: "👔" },
  { value: "Empresa", label: "Empresa", emoji: "🏢" },
];

const SERVICOS = [
  { value: "Consignado INSS", label: "Consignado INSS", emoji: "🏦" },
  { value: "Crédito CLT", label: "Crédito CLT", emoji: "👔" },
  { value: "Conta de Energia", label: "Conta de Energia", emoji: "⚡" },
  { value: "Boleto", label: "Boleto", emoji: "🧾" },
  { value: "Portabilidade", label: "Portabilidade", emoji: "🔄" },
  { value: "Cartão", label: "Cartão", emoji: "💳" },
];

const COMO_CONHECEU = [
  { value: "Instagram", label: "Instagram", emoji: "📸" },
  { value: "Facebook", label: "Facebook", emoji: "👍" },
  { value: "TikTok", label: "TikTok", emoji: "🎵" },
  { value: "YouTube", label: "YouTube", emoji: "▶️" },
  { value: "WhatsApp", label: "WhatsApp", emoji: "💬" },
  { value: "Indicação", label: "Indicação", emoji: "🤝" },
  { value: "Google", label: "Google", emoji: "🔍" },
];

const QUICK_VALUES = [1000, 5000, 10000, 30000, 50000];

const dadosSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo").max(120),
  cpf: z.string().refine((v) => isValidCPF(v), "CPF inválido"),
  whatsapp: z.string().refine((v) => v.replace(/\D/g, "").length >= 10, "WhatsApp inválido"),
  email: z.string().trim().email("E-mail inválido").max(255),
  data_nascimento: z
    .string()
    .min(1, "Informe sua data de nascimento")
    .refine((v) => calcAge(v) >= 18, "Você deve ter pelo menos 18 anos")
    .refine((v) => calcAge(v) <= 110, "Data inválida"),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(80),
  estado: z.string().refine((v) => ESTADOS.includes(v), "Selecione um estado"),
  lgpd: z.literal(true, { errorMap: () => ({ message: "Aceite os termos" }) }),
});

type DadosForm = z.infer<typeof dadosSchema>;

export function MultiStepModal({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [perfil, setPerfil] = useState("");
  const [servico, setServico] = useState("");
  const [valor, setValor] = useState(5000);
  const [comoConheceu, setComoConheceu] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [savedName, setSavedName] = useState("");
  const [savedWA, setSavedWA] = useState("");

  const form = useForm<DadosForm>({
    resolver: zodResolver(dadosSchema),
    mode: "onTouched",
    defaultValues: {
      nome: "",
      cpf: "",
      whatsapp: "",
      email: "",
      data_nascimento: "",
      cidade: "",
      estado: "",
      lgpd: undefined as unknown as true,
    },
  });

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setPerfil("");
        setServico("");
        setValor(5000);
        setComoConheceu("");
        setSubmitting(false);
        setSubmitError(null);
        setSuccess(false);
        form.reset();
      }, 300);
    }
  }, [open, form]);

  const submitLead = async (final: { como_conheceu: string }) => {
    setSubmitting(true);
    setSubmitError(null);
    const dados = form.getValues();
    const idade = calcAge(dados.data_nascimento);
    const { error } = await supabase.from("leads").insert({
      nome: dados.nome.trim(),
      cpf: dados.cpf,
      data_nascimento: dados.data_nascimento,
      whatsapp: dados.whatsapp,
      cidade: dados.cidade.trim(),
      estado: dados.estado,
      email: dados.email.trim().toLowerCase(),
      como_conheceu: final.como_conheceu,
      valor_pretendido: valor,
      perfil,
      servico,
      idade,
      faixa_etaria: ageGroup(idade),
      status: "novo",
      updated_at: new Date().toISOString(),
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(
        "Não foi possível enviar agora. Verifique sua conexão e tente novamente."
      );
      return false;
    }
    setSavedName(dados.nome.split(" ")[0]);
    setSavedWA(dados.whatsapp.replace(/\D/g, ""));
    setSuccess(true);
    setStep(6);
    return true;
  };

  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <AnimatePresence>
      {open && (
        <ModalShell open={open} onClose={onClose} step={step} total={6}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div>
                  <h2 className="text-2xl text-foreground mb-1">Qual é o seu perfil?</h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    Selecione a opção que mais combina com você.
                  </p>
                  <CardGrid
                    options={PERFIS}
                    value={perfil}
                    onChange={(v) => {
                      setPerfil(v);
                      setTimeout(goNext, 250);
                    }}
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl text-foreground mb-1">
                    Que tipo de crédito você precisa?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    Escolha a modalidade ideal para você.
                  </p>
                  <CardGrid
                    options={SERVICOS}
                    value={servico}
                    onChange={(v) => {
                      setServico(v);
                      setTimeout(goNext, 250);
                    }}
                  />
                  <button
                    onClick={goPrev}
                    className="mt-5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Voltar
                  </button>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl text-foreground mb-1">
                    Quanto você precisa?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Arraste para escolher o valor desejado.
                  </p>
                  <div className="text-center mb-6">
                    <div className="text-4xl sm:text-5xl font-brand text-primary">
                      {formatBRL(valor)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setValor((v) => Math.max(500, v - 500))}
                      className="h-12 w-12 rounded-full bg-accent text-primary text-xl font-bold hover:bg-accent/70"
                    >−</button>
                    <input
                      type="range"
                      min={500}
                      max={150000}
                      step={500}
                      value={valor}
                      onChange={(e) => setValor(Number(e.target.value))}
                      className="flex-1 accent-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setValor((v) => Math.min(150000, v + 500))}
                      className="h-12 w-12 rounded-full bg-accent text-primary text-xl font-bold hover:bg-accent/70"
                    >+</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {QUICK_VALUES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setValor(v)}
                        className={[
                          "px-3 py-1.5 rounded-full text-sm font-medium border transition",
                          valor === v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:border-primary/50",
                        ].join(" ")}
                      >
                        {formatBRL(v)}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={goPrev}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Voltar
                    </button>
                    <button
                      onClick={goNext}
                      className="px-6 h-12 rounded-xl gradient-hero text-primary-foreground font-semibold shadow-brand hover:opacity-95"
                    >
                      Continuar →
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <form
                  onSubmit={form.handleSubmit(() => goNext())}
                  className="space-y-4"
                  noValidate
                >
                  <div>
                    <h2 className="text-2xl text-foreground mb-1">Seus dados</h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      Vamos precisar de algumas informações.
                    </p>
                  </div>

                  <Field label="Nome completo" error={form.formState.errors.nome?.message}>
                    <input
                      {...form.register("nome")}
                      className="input-base"
                      placeholder="Como aparece no documento"
                      autoComplete="name"
                    />
                  </Field>

                  <Field label="CPF" error={form.formState.errors.cpf?.message}>
                    <IMaskInput
                      mask="000.000.000-00"
                      value={form.watch("cpf")}
                      onAccept={(v) => form.setValue("cpf", String(v), { shouldValidate: true })}
                      placeholder="000.000.000-00"
                      className="input-base"
                      inputMode="numeric"
                    />
                  </Field>

                  <Field label="WhatsApp" error={form.formState.errors.whatsapp?.message}>
                    <IMaskInput
                      mask="(00) 00000-0000"
                      value={form.watch("whatsapp")}
                      onAccept={(v) => form.setValue("whatsapp", String(v), { shouldValidate: true })}
                      placeholder="(00) 00000-0000"
                      className="input-base"
                      inputMode="tel"
                    />
                  </Field>

                  <Field label="E-mail" error={form.formState.errors.email?.message}>
                    <input
                      type="email"
                      {...form.register("email")}
                      className="input-base"
                      placeholder="seu@email.com"
                      autoComplete="email"
                    />
                  </Field>

                  <Field
                    label="Data de nascimento"
                    error={form.formState.errors.data_nascimento?.message}
                  >
                    <input
                      type="date"
                      {...form.register("data_nascimento")}
                      className="input-base"
                      max={new Date().toISOString().slice(0, 10)}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Cidade" error={form.formState.errors.cidade?.message}>
                      <input
                        {...form.register("cidade")}
                        className="input-base"
                        placeholder="Sua cidade"
                      />
                    </Field>
                    <Field label="Estado" error={form.formState.errors.estado?.message}>
                      <select {...form.register("estado")} className="input-base">
                        <option value="">UF</option>
                        {ESTADOS.map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      {...form.register("lgpd")}
                      className="mt-0.5 h-4 w-4 accent-primary"
                    />
                    <span>
                      Autorizo o contato sobre o crédito solicitado e concordo com a Política
                      de Privacidade (LGPD).
                    </span>
                  </label>
                  {form.formState.errors.lgpd && (
                    <p className="text-xs text-warning-foreground bg-warning/30 px-3 py-1.5 rounded-lg">
                      {form.formState.errors.lgpd.message as string}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Voltar
                    </button>
                    <button
                      type="submit"
                      className="px-6 h-12 rounded-xl gradient-hero text-primary-foreground font-semibold shadow-brand hover:opacity-95"
                    >
                      Continuar →
                    </button>
                  </div>
                </form>
              )}

              {step === 5 && (
                <div>
                  <h2 className="text-2xl text-foreground mb-1">
                    Como você nos conheceu?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    Última pergunta — nos ajude a melhorar.
                  </p>
                  <CardGrid
                    options={COMO_CONHECEU}
                    value={comoConheceu}
                    onChange={async (v) => {
                      setComoConheceu(v);
                      await submitLead({ como_conheceu: v });
                    }}
                    cols={3}
                  />
                  {submitting && (
                    <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      Enviando seu pedido…
                    </div>
                  )}
                  {submitError && (
                    <div className="mt-4 px-4 py-3 rounded-xl bg-warning/30 text-warning-foreground text-sm">
                      ❌ {submitError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={goPrev}
                    className="mt-5 text-sm text-muted-foreground hover:text-foreground"
                    disabled={submitting}
                  >
                    ← Voltar
                  </button>
                </div>
              )}

              {step === 6 && success && (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="mx-auto h-20 w-20 rounded-full bg-success/15 flex items-center justify-center mb-4"
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 150)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </motion.div>
                  <div className="text-4xl mb-2">😊</div>
                  <h2 className="text-2xl text-foreground mb-2">
                    Pedido enviado, {savedName}!
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    Recebemos seus dados. Em instantes nossa equipe entrará em contato pelo
                    WhatsApp para finalizar seu crédito.
                  </p>
                  <a
                    href={`https://wa.me/55${savedWA}?text=${encodeURIComponent(
                      "Olá! Acabei de fazer minha simulação no site Crédito do Povo."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-[oklch(0.65_0.17_150)] text-white font-semibold shadow-soft hover:opacity-95"
                  >
                    💬 Falar no WhatsApp agora
                  </a>
                  <button
                    onClick={onClose}
                    className="block mx-auto mt-4 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-warning-foreground bg-warning/25 mt-1 px-2.5 py-1 rounded-md">
          {error}
        </p>
      )}
    </div>
  );
}
