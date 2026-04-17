import { CountUp } from "./CountUp";

const STATS = [
  { value: 15000, suffix: "+", label: "Clientes atendidos", emoji: "🤝" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Avaliação dos clientes", emoji: "⭐" },
  { value: 24, suffix: "h", label: "Aprovação em até", emoji: "⚡" },
  { value: 50, prefix: "R$ ", suffix: "M+", label: "Liberados em crédito", emoji: "💰" },
];

export function Stats() {
  return (
    <section className="py-14 sm:py-20 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center p-5 sm:p-6 rounded-2xl gradient-soft">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="text-3xl sm:text-4xl">
                <CountUp
                  to={s.value}
                  decimals={s.decimals ?? 0}
                  prefix={s.prefix ?? ""}
                  suffix={s.suffix ?? ""}
                />
              </div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
