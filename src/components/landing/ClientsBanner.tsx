import { ALL_AVATARS } from "@/components/avatars";

export function ClientsBanner() {
  const loop = [...ALL_AVATARS, ...ALL_AVATARS];
  return (
    <section className="py-12 sm:py-16 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-6">
        <p className="text-sm font-semibold text-muted-foreground">
          Quem já confiou no Crédito do Povo
        </p>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-card to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-card to-transparent z-10" />
        <div className="flex gap-5 sm:gap-7 animate-marquee w-max">
          {loop.map((a, i) => {
            const C = a.C;
            return (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-soft">
                  <C />
                </div>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                  {a.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center mt-6 text-sm font-semibold text-foreground">
        + de 15.000 clientes em todo o Brasil 🇧🇷
      </div>
    </section>
  );
}
