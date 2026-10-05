import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, TelegramLogo } from "@phosphor-icons/react";
import { contacts } from "../content";
import { HeroField } from "./HeroField";

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
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // При прокрутке поле уходит вглубь, текст поднимается и гаснет
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fade = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } };

  return (
    <section ref={ref} id="top" className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <motion.div style={reduce ? undefined : { scale: fieldScale, opacity: fieldOpacity }} className="absolute inset-0 -z-10">
        <HeroField className="h-full w-full" />
        {/* Виньетка: текст читается поверх поля */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_30%_60%,var(--bg)_10%,transparent_75%)] opacity-80" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-14 pt-28 sm:px-6 lg:pb-20"
      >
        <motion.p {...fade(0.1)} className="font-mono text-[13px] text-ink-3">
          <span className="text-ink">Виталий Иванов</span>
          <span className="mx-2 text-ink-3">/</span>
          fullstack-разработчик
        </motion.p>

        <h1 className="mt-6 font-display text-[clamp(2.2rem,5.6vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
          <Word delay={0.15}>Делаю</Word> <Word delay={0.22}>тяжелые</Word> <Word delay={0.29}>интерфейсы</Word>{" "}
          <Word delay={0.4} className="text-accent">
            быстрыми
          </Word>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p {...fade(0.6)} className="max-w-[44ch] text-[17px] leading-relaxed text-ink-2">
            Пишу на React и TypeScript, а когда нужно, сам делаю бэкенд на C#/.NET. Отвечаю за canvas-редактор в PIX Robotics.
          </motion.p>
          <motion.div {...fade(0.7)} className="flex flex-wrap items-center gap-3">
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
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg/40 px-6 py-3.5 text-[15px] font-medium text-ink backdrop-blur transition hover:bg-surface active:scale-[0.98]"
            >
              Главный кейс
              <ArrowDown size={16} />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
