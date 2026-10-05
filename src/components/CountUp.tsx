import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

// Счетчик пишет в DOM напрямую, без setState на каждый кадр
export function CountUp({ to, decimals = 0, duration = 1.6 }: { to: number; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const format = (v: number) => v.toFixed(decimals).replace(".", ",");

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = format(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return <span ref={ref}>{format(reduce ? to : 0)}</span>;
}
