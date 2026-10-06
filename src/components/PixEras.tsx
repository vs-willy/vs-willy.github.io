import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { pix } from "../content";
import { Reveal } from "./Reveal";

// Работа по трем периодам. Вкладки вместо длинного списка
export function PixEras() {
  const [active, setActive] = useState(pix.eras.length - 1);
  const reduce = useReducedMotion();
  const era = pix.eras[active];

  return (
    <section aria-labelledby="eras-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <Reveal>
        <h2 id="eras-title" className="max-w-[20ch] font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
          Три года задач по периодам
        </h2>
      </Reveal>

      <div role="tablist" aria-label="Период" className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {pix.eras.map((e, i) => (
          <button
            key={e.id}
            role="tab"
            id={`era-tab-${e.id}`}
            aria-selected={i === active}
            aria-controls={`era-panel-${e.id}`}
            onClick={() => setActive(i)}
            className={`relative isolate shrink-0 rounded-full px-5 py-2.5 text-left transition ${i === active ? "text-[oklch(0.18_0.02_40)]" : "border border-line-strong text-ink-2 hover:text-ink"}`}
          >
            {i === active && (
              <motion.span layoutId="era-pill" className="absolute inset-0 -z-10 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
            )}
            <span className="block text-[15px] font-semibold">{e.tab}</span>
            <span className={`block font-mono text-[11px] ${i === active ? "opacity-75" : "text-ink-3"}`}>{e.period}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          id={`era-panel-${era.id}`}
          role="tabpanel"
          aria-labelledby={`era-tab-${era.id}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <p className="max-w-[60ch] text-[17px] leading-relaxed text-ink">{era.lead}</p>
          <div className={`mt-8 grid gap-4 ${era.groups.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
            {era.groups.map((g) => (
              <div key={g.title} className="rounded-[20px] border border-line bg-surface p-6 sm:p-7">
                <h3 className="font-mono text-[13px] text-accent-ink">{g.title}</h3>
                <ul className="mt-4 space-y-3">
                  {g.items.map((it) => (
                    <li key={it} className="relative pl-4 text-[15px] leading-relaxed text-ink-2 before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-2 before:bg-accent/70">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
