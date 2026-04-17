import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

type Props = {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function CountUp({ to, duration = 1.4, prefix = "", suffix = "", decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const display =
    decimals > 0
      ? val.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.round(val).toLocaleString("pt-BR");

  return (
    <motion.span ref={ref} className="font-brand text-primary">
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}
