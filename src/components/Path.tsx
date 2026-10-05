import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { education, path } from "../content";
import { CareerFlow } from "./CareerFlow";
import { Reveal } from "./Reveal";

export function Path() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  // Линия таймлайна прорисовывается вслед за чтением
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <section id="path" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">Опыт</h2>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
        <ol ref={ref} className="relative pl-8">
          <span aria-hidden className="absolute left-[5px] top-2 bottom-2 w-px bg-line" />
          <motion.span
            aria-hidden
            style={reduce ? undefined : { scaleY: line }}
            className="absolute left-[5px] top-2 bottom-2 w-px origin-top bg-accent"
          />
          {path.map((p, i) => (
            <li key={p.period} className="relative pb-12 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-8 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${i === 0 ? "border-accent bg-accent shadow-[0_0_14px_oklch(0.72_0.19_42/0.7)]" : "border-ink-3 bg-bg"}`}
              />
              <Reveal>
                <div className="font-mono text-[13px] text-ink-3">{p.period}</div>
                <h3 className={`mt-2 text-xl font-semibold tracking-tight ${p.points.length ? "" : "text-ink-2"}`}>{p.company}</h3>
                {p.role && <div className="mt-0.5 text-[15px] text-accent-ink">{p.role}</div>}
                {p.points.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="relative pl-4 text-[15px] leading-relaxed text-ink-2 before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-2 before:bg-ink-3">
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
          <div className="mt-16">
            <h3 className="font-mono text-[13px] text-ink-3">учеба</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {education.map((e) => (
                <li key={e.title} className="py-4">
                  <div className="text-[16px] font-medium leading-snug">{e.title}</div>
                  <div className="mt-1 text-[14.5px] leading-snug text-ink-2">{e.detail}</div>
                </li>
              ))}
              <li className="py-4 text-[14.5px] text-ink-2">Языки: русский родной, английский B1</li>
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <CareerFlow />
        </div>
      </div>
    </section>
  );
}
