import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Trophy } from "@phosphor-icons/react";
import { hackathons } from "../content";
import { ChapterHeader } from "./Chapter";
import { Reveal } from "./Reveal";

function Prize({ h, index }: { h: (typeof hackathons)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Цифра места едет медленнее карточки: глубина без лишних эффектов
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const first = index === 0;

  return (
    <div ref={ref} className="relative">
      <article className={`relative isolate overflow-hidden rounded-[20px] border p-7 sm:p-10 ${first ? "border-accent/40 bg-surface" : "border-line bg-surface"}`}>
        <motion.div
          aria-hidden
          style={reduce ? undefined : { y }}
          className={`pointer-events-none absolute -bottom-20 right-2 -z-10 select-none font-display text-[clamp(13rem,24vw,19rem)] font-bold leading-none tracking-[-0.08em] ${first ? "text-outline-accent" : "text-outline"}`}
        >
          {h.place}
        </motion.div>
        {first && <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-[90px]" />}

        <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium ${first ? "bg-accent text-[oklch(0.18_0.02_40)]" : "border border-line-strong text-ink"}`}>
          <Trophy size={15} weight="fill" />
          {h.place} место
        </div>
        <h3 className="mt-8 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{h.name}</h3>
        <div className="mt-2 text-[15px] text-ink-3">
          {h.org}, {h.year}
        </div>
        <p className="mt-8 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">{h.task}</p>
        <div className="mt-6 max-w-[52ch] border-t border-line pt-5">
          <div className="font-mono text-[12px] text-ink-3">моя часть</div>
          <p className="mt-2 text-[16px] leading-relaxed text-ink">{h.role}</p>
        </div>
      </article>
    </div>
  );
}

export function Hackathons() {
  return (
    <section id="hackathons" aria-label="Хакатоны">
      <ChapterHeader name="Хакатоны" period="2026" role="с коллегами, команда «Резонанс»">
        <Reveal>
          <p className="mt-10 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">
            Оба решения построены на нашей платформе дискретно-событийной симуляции Praxis на C#/.NET. Мы добавляем в нее новые домены, а не пишем всё заново под каждый кейс.
          </p>
        </Reveal>
      </ChapterHeader>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:pb-32">
      <div className="mt-14 grid gap-4 lg:grid-cols-2 lg:items-start">
        {hackathons.map((h, i) => (
          <div key={h.name} className={i === 1 ? "lg:mt-24" : ""}>
            <Reveal delay={i * 0.08}>
              <Prize h={h} index={i} />
            </Reveal>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
