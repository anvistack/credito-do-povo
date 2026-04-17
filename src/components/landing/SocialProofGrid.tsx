const SCENES = [
  { emoji: "📱", caption: "Sandra quitou suas dívidas", color: "oklch(0.85 0.10 30)" },
  { emoji: "🏠", caption: "Seu Pedro reformou sua casa", color: "oklch(0.85 0.13 80)" },
  { emoji: "🚌", caption: "Casal Silva visitou os filhos", color: "oklch(0.85 0.10 200)" },
  { emoji: "📚", caption: "Dona Rosa ajudou os netos", color: "oklch(0.85 0.10 320)" },
  { emoji: "🏍️", caption: "Paulo comprou sua moto", color: "oklch(0.85 0.13 50)" },
  { emoji: "💼", caption: "Carlos abriu seu negócio", color: "oklch(0.85 0.10 150)" },
];

export function SocialProofGrid() {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Sonhos realizados
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-brand text-foreground">
            O que nossos clientes conquistaram
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCENES.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden shadow-card group hover:shadow-brand transition"
            >
              <div
                className="aspect-[4/3] flex items-center justify-center text-7xl sm:text-8xl"
                style={{ backgroundColor: s.color }}
              >
                <span className="group-hover:scale-110 transition">{s.emoji}</span>
              </div>
              <div className="p-4 bg-card border-t border-border">
                <div className="font-semibold text-foreground text-sm">{s.caption} ✅</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
