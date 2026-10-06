import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, TelegramLogo } from "@phosphor-icons/react";
import { contacts } from "../content";
import { HeroMap } from "./HeroMap";

const ease = [0.16, 1, 0.3, 1] as const;

// Слово выезжает снизу из-под маски: заголовок собирается по словам
function Word({ children, delay, className }: { children: string; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className={`inline-block ${className ?? ""}`}
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } };

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 -z-10 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:min-h-[100dvh] lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-16 lg:pt-24">
        <div>
          <motion.p {...fade(0.1)} className="font-mono text-[13px] text-ink-3">
            <span className="text-ink">Виталий Иванов</span>
            <span className="mx-2 text-ink-3">/</span>
            fullstack-разработчик
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.2rem,3.7vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            <Word delay={0.15}>Делаю</Word> <Word delay={0.22}>тяжелые</Word> <Word delay={0.29}>интерфейсы</Word>{" "}
            <Word delay={0.4} className="text-accent">
              быстрыми
            </Word>
          </h1>

          <motion.p {...fade(0.6)} className="mt-7 max-w-[44ch] text-[17px] leading-relaxed text-ink-2">
            Пишу на React и TypeScript, а когда нужно, сам делаю бэкенд на C#/.NET. Отвечаю за canvas-редактор в PIX Robotics.
          </motion.p>

          <motion.div {...fade(0.7)} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={contacts.telegram.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-[oklch(0.18_0.02_40)] transition hover:brightness-110 active:scale-[0.98]"
            >
              <TelegramLogo size={18} weight="fill" />
              Написать
            </a>
            <a
              href="#canvas"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-[15px] font-medium text-ink transition hover:bg-surface active:scale-[0.98]"
            >
              Главный кейс
              <ArrowDown size={16} />
            </a>
          </motion.div>
        </div>

        <motion.div {...fade(0.35)}>
          <HeroMap />
          <p className="mt-3 text-[13px] leading-snug text-ink-3">
            Маленький редактор на @xyflow/react, той же библиотеке, на которой построен мой рабочий канвас.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
