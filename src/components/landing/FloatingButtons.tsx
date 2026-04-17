type Props = { onFormClick: () => void };

export function FloatingButtons({ onFormClick }: Props) {
  return (
    <>
      <a
        href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20saber%20sobre%20cr%C3%A9dito."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 z-30 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[oklch(0.65_0.17_150)] text-white flex items-center justify-center shadow-brand animate-pulse-ring hover:scale-110 transition"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l.601.952-1.001 3.648 3.737-.967.642.408z"/>
        </svg>
      </a>
      <button
        onClick={onFormClick}
        aria-label="Simular crédito"
        className="fixed bottom-5 left-5 z-30 h-14 px-5 rounded-full gradient-hero text-primary-foreground font-bold text-sm shadow-brand animate-bounce-soft hover:scale-105 transition flex items-center gap-2"
      >
        💰 Simular agora
      </button>
    </>
  );
}
