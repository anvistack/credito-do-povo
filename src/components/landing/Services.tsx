type Props = { onCTAClick: () => void };

const SERVICES = [
  { emoji: "🏦", title: "Consignado INSS", desc: "Para aposentados e pensionistas. Desconto direto em folha." },
  { emoji: "👔", title: "Crédito CLT", desc: "Trabalha com carteira assinada? Crédito com taxas justas." },
  { emoji: "⚡", title: "Conta de Energia", desc: "Use sua conta de luz como garantia. Aprovação em minutos." },
  { emoji: "🧾", title: "Boleto", desc: "Quitação de boletos atrasados sem complicação." },
  { emoji: "🔄", title: "Portabilidade", desc: "Migre seu empréstimo e pague menos juros." },
  { emoji: "💳", title: "Cartão Consignado", desc: "Cartão exclusivo com desconto em folha." },
];

export function Services({ onCTAClick }: Props) {
  return (
    <section id="servicos" className="py-16 sm:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Nossos serviços
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-brand text-foreground">
            O crédito certo para o seu momento
          </h2>
          <p className="mt-3 text-muted-foreground">
            Escolha a modalidade que mais combina com você. Atendimento personalizado em todas elas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <button
              key={s.title}
              onClick={onCTAClick}
              className="text-left p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-brand transition group"
            >
              <div className="h-12 w-12 rounded-xl gradient-soft flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                {s.emoji}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-primary">
                Simular agora →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
