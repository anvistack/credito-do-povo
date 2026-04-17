type Props = { onCTAClick: () => void };

export function CTABanner({ onCTAClick }: Props) {
  return (
    <section className="py-16 sm:py-24 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-primary-foreground">
        <h2 className="text-3xl sm:text-5xl font-brand text-balance">
          Pronto para resolver sua vida financeira?
        </h2>
        <p className="mt-4 text-lg text-white/90 max-w-xl mx-auto">
          Faça sua simulação grátis em menos de 2 minutos e descubra quanto você pode pegar.
        </p>
        <button
          onClick={onCTAClick}
          className="mt-7 inline-flex items-center gap-2 px-7 h-14 rounded-2xl bg-white text-primary font-bold text-lg shadow-brand hover:scale-[1.03] transition"
        >
          Simular meu crédito agora 🚀
        </button>
      </div>
    </section>
  );
}
