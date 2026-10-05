import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { canvasSteps } from "../content";
import { useMediaQuery } from "../hooks";
import { visuals } from "./CanvasVisuals";
import { Reveal } from "./Reveal";

function Intro({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <p className="font-mono text-[13px] text-accent-ink">Главный кейс</p>
      <h2 className={`mt-4 font-display font-semibold leading-[1.05] tracking-[-0.04em] ${compact ? "text-[clamp(1.8rem,2.6vw,2.5rem)]" : "text-[clamp(2rem,4vw,3.4rem)]"}`}>
        Canvas-редактор бизнес-процессов
      </h2>
      <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-ink-2">
        PIX Процессы - enterprise-платформа для процессного управления. С середины 2025 я отвечаю за модуль канваса целиком. Карты у клиентов обычно на 500-1000 элементов.
      </p>
    </>
  );
}

// Десктоп: экран прилипает, шаги переключаются прокруткой, схема справа меняется
function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(canvasSteps.length - 1, Math.floor(p * canvasSteps.length));
    if (i !== active) setActive(i);
  });
  const Visual = visuals[active];

  return (
    <section ref={ref} id="canvas" data-anchor-offset="0" style={{ height: `${canvasSteps.length * 90 + 30}vh` }} className="relative">
      <div className="sticky top-0 flex h-[100dvh] items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_1.05fr] items-center gap-16 px-6">
          <div>
            <Intro compact />
            <ol className="mt-8 space-y-1">
              {canvasSteps.map((s, i) => (
                <li key={s.title} className="relative pl-6">
                  <span className="absolute left-0 top-0 h-full w-px bg-line" />
                  <motion.span
                    className="absolute left-0 top-0 w-px origin-top bg-accent"
                    animate={{ height: i === active ? "100%" : i < active ? "100%" : "0%", opacity: i === active ? 1 : 0.35 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <h3 className={`py-2 text-[17px] font-semibold tracking-tight transition-colors duration-300 ${i === active ? "text-ink" : "text-ink-3"}`}>
                    {s.title}
                  </h3>
                  <AnimatePresence initial={false}>
                    {i === active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ol>
          </div>

          <div className="dot-grid relative overflow-hidden rounded-[20px] border border-line bg-surface/60 p-6">
            <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/15 blur-[90px]" />
            <div className="relative flex items-center justify-between font-mono text-[12px] text-ink-3">
              <span>{canvasSteps[active].tags.join(" / ")}</span>
              <span>
                {active + 1} из {canvasSteps.length}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                transition={{ duration: 0.4 }}
                className="relative mt-4"
              >
                <Visual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// Мобильный: обычный поток, у каждого шага своя схема
function Stacked() {
  return (
    <section id="canvas" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Intro />
      <div className="mt-12 space-y-14">
        {canvasSteps.map((s, i) => {
          const Visual = visuals[i];
          return (
            <Reveal key={s.title}>
              <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
              <div className="dot-grid mt-5 rounded-[20px] border border-line bg-surface/60 p-3">
                <Visual />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function CanvasCase() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  return desktop ? <Pinned /> : <Stacked />;
}
