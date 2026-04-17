import { motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  step: number;
  total: number;
  children: React.ReactNode;
};

export function ModalShell({ open, onClose, step, total, children }: Props) {
  if (!open) return null;
  const pct = Math.round((step / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-3xl shadow-brand max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3 border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo-stack.png" alt="Crédito do Povo" className="h-9 w-auto" />
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Processo 100% online e gratuito
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-hero"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs font-semibold text-primary whitespace-nowrap">
              Passo {step} de {total}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}
