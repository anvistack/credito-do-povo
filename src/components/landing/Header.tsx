import { Link } from "@tanstack/react-router";

type Props = { onCTAClick: () => void };

export function Header({ onCTAClick }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Crédito do Povo" className="h-8 sm:h-9 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground">
          <a href="#servicos" className="hover:text-primary transition">Serviços</a>
          <a href="#como-funciona" className="hover:text-primary transition">Como funciona</a>
          <a href="#depoimentos" className="hover:text-primary transition">Depoimentos</a>
          <a href="#faq" className="hover:text-primary transition">FAQ</a>
        </nav>
        <button
          onClick={onCTAClick}
          className="px-4 sm:px-5 h-10 sm:h-11 rounded-full gradient-hero text-primary-foreground font-semibold text-sm shadow-brand hover:opacity-95 transition"
        >
          Simular agora
        </button>
      </div>
    </header>
  );
}
