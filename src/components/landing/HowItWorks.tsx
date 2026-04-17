const STEPS = [
  { emoji: "📋", title: "Preencha", desc: "Conte rapidinho seu perfil e quanto precisa. Leva menos de 2 minutos." },
  { emoji: "🔍", title: "Analisamos", desc: "Nossa equipe verifica as melhores condições para o seu caso." },
  { emoji: "💸", title: "Receba", desc: "Aprovado? O dinheiro cai direto na sua conta no mesmo dia." },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 sm:py-24 gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Como funciona
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-brand text-foreground">
            Em 3 passos simples
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-primary/30" />
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative bg-card p-6 rounded-2xl shadow-card text-center">
              <div className="relative mx-auto h-20 w-20 rounded-full gradient-hero flex items-center justify-center text-3xl shadow-brand mb-4">
                {s.emoji}
                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-card border-2 border-primary text-primary text-sm font-brand flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
