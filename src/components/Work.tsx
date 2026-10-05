import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  ChartLine,
  Cube,
  Database,
  FlowArrow,
  Folder,
  GearSix,
  Lightning,
  MagnifyingGlass,
  PencilSimple,
  Robot,
  ShareNetwork,
  Stack as StackIcon,
  Trash,
  TreeStructure,
  UsersThree,
} from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { pixWork } from "../content";
import { Reveal } from "./Reveal";

// Подсветка рамки идет за курсором: координаты пишутся в CSS-переменные напрямую
function onSpot(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <article onPointerMove={onSpot} className={`spotlight h-full rounded-[20px] border border-line bg-surface ${className}`}>
      {children}
    </article>
  );
}

// Иллюстрация к иконочному пакету: настоящие иконки из библиотеки
const sampleIcons = [FlowArrow, TreeStructure, ChartLine, UsersThree, Folder, GearSix, MagnifyingGlass, Bell, PencilSimple, Trash, ShareNetwork, Cube, Lightning, StackIcon, Robot, Database];

// Нажатие на иконку прогоняет ее по пайплайну пакета: шаги подсвечиваются по очереди
function IconPipeline({ steps }: { steps: string[] }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(steps.length - 1);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (run === 0) return;
    if (reduce) {
      setStep(steps.length - 1);
      return;
    }
    setStep(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= steps.length - 1) clearInterval(t);
    }, 320);
    return () => clearInterval(t);
  }, [run, reduce, steps.length]);

  const pick = (i: number) => {
    setSelected(i);
    setRun((r) => r + 1);
  };
  const Selected = sampleIcons[selected];

  return (
    <>
      <div className="px-7 pb-7 sm:px-8 sm:pb-8">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[12px]" aria-label="Пайплайн пакета иконок">
          {steps.map((p, i) => {
            const done = i <= step;
            const current = i === step && step < steps.length - 1;
            return (
              <li key={p} className="flex items-center gap-1.5">
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors duration-200 ${
                    current ? "border-accent bg-accent text-[oklch(0.18_0.02_40)]" : done ? "border-accent/60 text-ink" : "border-line-strong text-ink-3"
                  }`}
                >
                  {i === steps.length - 1 && done && <Selected size={13} weight="bold" />}
                  {p}
                </span>
                {i < steps.length - 1 && <ArrowRight size={12} className={`transition-colors duration-200 ${i < step ? "text-accent" : "text-ink-3"}`} />}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-auto border-t border-line bg-bg/40 p-5 sm:p-6">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {sampleIcons.map((Icon, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={i === selected}
              aria-label={`Прогнать иконку ${i + 1} через пайплайн`}
              className={`grid h-14 place-items-center rounded-[12px] border transition duration-200 hover:-translate-y-0.5 active:scale-95 ${
                i === selected ? "border-accent/60 bg-accent-soft text-accent" : "border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink"
              }`}
            >
              <Icon size={24} />
            </button>
          ))}
        </div>
        <p className="mt-4 font-mono text-[12px] text-ink-3">нажми на иконку: она пройдет путь от Figma до пакета</p>
      </div>
    </>
  );
}

export function Work() {
  const { designSystem, e2e, export: exp, journal, assistant } = pixWork;
  return (
    <section id="work" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <h2 className="max-w-[18ch] font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
        Инфраструктура и бэкенд
      </h2>

      <div className="mt-14 grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4">
          <Card className="flex flex-col overflow-hidden">
            <div className="px-7 pb-5 pt-7 sm:px-8 sm:pt-8">
              <h3 className="text-2xl font-semibold tracking-tight">{designSystem.title}</h3>
              <p className="mt-3 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-2">{designSystem.text}</p>
            </div>
            <IconPipeline steps={designSystem.pipeline} />
          </Card>
        </Reveal>

        <Reveal delay={0.06} className="md:col-span-2">
          <Card className="relative flex flex-col overflow-hidden p-7 sm:p-8">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-[70px]" />
            <div className="relative font-display text-6xl font-semibold tracking-[-0.05em] text-accent">~200</div>
            <div className="relative mt-2 font-mono text-[12px] text-ink-3">сценариев на Playwright</div>
            <h3 className="relative mt-10 text-2xl font-semibold tracking-tight">{e2e.title}</h3>
            <p className="relative mt-3 text-[15.5px] leading-relaxed text-ink-2">{e2e.text}</p>
          </Card>
        </Reveal>

        <Reveal className="md:col-span-3">
          <Card className="p-7 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight">{exp.title}</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{exp.text}</p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[12px] text-ink-2">
              {["PuppeteerSharp", "headless Chromium", "ASP.NET Core"].map((t) => (
                <span key={t} className="rounded-full bg-surface-2 px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.06} className="md:col-span-3">
          <Card className="flex flex-col p-7 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight">{journal.title}</h3>
            <p className="mb-6 mt-3 text-[15.5px] leading-relaxed text-ink-2">{journal.text}</p>
            <code className="mt-auto block overflow-x-auto whitespace-nowrap rounded-[12px] border border-line bg-bg px-4 py-3.5 font-mono text-[12.5px] text-ink-2">
              <span className="text-accent">COPY</span> ... <span className="text-accent">FROM</span> STDIN (FORMAT BINARY)
            </code>
          </Card>
        </Reveal>

        <Reveal className="md:col-span-6">
          <Card className="grid gap-5 p-7 sm:p-8 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
            <div className="grid h-16 w-16 place-items-center rounded-[16px] border border-accent/40 bg-accent-soft text-accent">
              <Robot size={30} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">{assistant.title}</h3>
              <p className="mt-2 max-w-[80ch] text-[15.5px] leading-relaxed text-ink-2">{assistant.text}</p>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
