import { motion } from "framer-motion";

type CardOption = {
  value: string;
  label: string;
  emoji: string;
  desc?: string;
};

type Props = {
  options: CardOption[];
  value: string;
  onChange: (v: string) => void;
  cols?: 1 | 2 | 3;
};

export function CardGrid({ options, value, onChange, cols = 2 }: Props) {
  const gridCls =
    cols === 3
      ? "grid grid-cols-2 sm:grid-cols-3 gap-3"
      : cols === 1
      ? "grid grid-cols-1 gap-3"
      : "grid grid-cols-1 sm:grid-cols-2 gap-3";

  return (
    <div className={gridCls}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(opt.value)}
            className={[
              "min-h-[100px] p-4 rounded-2xl border-2 text-left transition-all",
              "flex flex-col items-start gap-1.5",
              active
                ? "border-primary bg-accent shadow-soft ring-2 ring-primary/20"
                : "border-border hover:border-primary/40 hover:bg-accent/40",
            ].join(" ")}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span className="font-semibold text-sm leading-tight">{opt.label}</span>
            {opt.desc && (
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
