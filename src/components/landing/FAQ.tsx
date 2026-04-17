import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Preciso pagar alguma taxa para fazer a simulação?",
    a: "Não. A simulação é 100% gratuita e sem compromisso. Você só decide se quer seguir depois de saber as condições.",
  },
  {
    q: "Quem está negativado no SPC ou Serasa pode contratar?",
    a: "Sim. Nossos produtos consignados não consultam SPC/Serasa. Para outras modalidades, fazemos uma análise individual sem complicação.",
  },
  {
    q: "Em quanto tempo o dinheiro cai na conta?",
    a: "Depois da aprovação, o crédito é liberado em até 24 horas úteis. Em muitos casos, no mesmo dia.",
  },
  {
    q: "Como funciona o desconto em folha do consignado?",
    a: "O valor da parcela é descontado automaticamente do seu benefício do INSS ou salário, sem boleto e sem atraso.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. Seguimos a Lei Geral de Proteção de Dados (LGPD) e usamos criptografia em todas as etapas.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24 gradient-soft">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Perguntas frequentes
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-brand text-foreground">
            Tire suas dúvidas
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-foreground">{f.q}</span>
                  <span
                    className={`shrink-0 h-8 w-8 rounded-full bg-accent text-primary flex items-center justify-center transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
