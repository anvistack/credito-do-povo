import { motion } from "framer-motion";

type Props = { onCTAClick: () => void };

export function Hero({ onCTAClick }: Props) {
  return (
    <section className="relative gradient-hero overflow-hidden">
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary-foreground"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur mb-5">
            ✅ 100% online · Sem sair de casa
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-brand text-balance leading-[1.05]">
            Dinheiro na sua conta, sem complicação!
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/90 max-w-lg">
            Contrate seu crédito 100% online. Aprovação rápida e atendimento humano,
            de pessoas que entendem a sua realidade.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCTAClick}
              className="px-6 h-14 rounded-2xl bg-white text-primary font-bold text-base shadow-brand hover:scale-[1.02] transition"
            >
              Quero meu crédito agora →
            </button>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 h-14 rounded-2xl border-2 border-white/80 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition"
            >
              💬 Fale pelo WhatsApp
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/95">
            <Badge>✅ Sem SPC/Serasa</Badge>
            <Badge>✅ Online</Badge>
            <Badge>✅ Aprovação rápida</Badge>
            <Badge>✅ Sem taxas</Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="hidden md:block"
        >
          <div className="relative max-w-md ml-auto">
            <div className="absolute inset-0 bg-white/30 rounded-[2.5rem] blur-2xl" />
            <div className="relative bg-card rounded-[2rem] shadow-brand p-6 sm:p-8 border border-white/40">
              <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                Simulação rápida
              </div>
              <div className="mt-3 text-sm text-muted-foreground">Você quer pegar até</div>
              <div className="mt-1 text-5xl font-brand text-primary">R$ 50.000</div>
              <div className="mt-2 text-sm text-muted-foreground">a partir de</div>
              <div className="text-2xl font-brand text-foreground">12x R$ 415</div>
              <button
                onClick={onCTAClick}
                className="mt-6 w-full h-12 rounded-xl gradient-hero text-primary-foreground font-semibold shadow-soft hover:opacity-95 transition"
              >
                Simular meu crédito
              </button>
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                Valores ilustrativos. Condições sujeitas a análise.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="font-medium">{children}</span>;
}
