import { useId, type PointerEvent, type ReactNode } from "react";
import { Robot } from "@phosphor-icons/react";
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

// Как устроена дизайн-система: откуда берутся пакеты и куда они уходят
function DesignSystemDiagram() {
  const id = useId().replace(/:/g, "");
  const pk = [
    { y: 28, title: "Токены", sub: "цвета, типографика" },
    { y: 96, title: "Иконки", sub: "740+, SVGO и SVGR" },
    { y: 164, title: "UI-библиотека", sub: "обертки над AntD 5" },
  ];
  const px = 168;
  const pw = 152;
  return (
    <svg viewBox="0 0 600 216" className="h-auto w-full" role="img" aria-label="Иконки выгружаются из Figma автоматически, токены пока вносятся вручную. Три пакета публикуются в GitLab Registry и используются в двух из четырех продуктов компании">
      <defs>
        <marker id={`${id}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" className="fill-ink-3" />
        </marker>
        <marker id={`${id}-h`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" className="fill-accent" />
        </marker>
      </defs>

      {/* Figma */}
      <rect x="8" y="68" width="96" height="56" rx="10" className="fill-surface-2 stroke-line-strong" />
      <text x="56" y="92" textAnchor="middle" className="fill-ink text-[13px] font-semibold">Figma</text>
      <text x="56" y="110" textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">дизайнеры</text>
      <path d={`M104 96 H${px}`} className="stroke-accent" strokeWidth={1.5} markerEnd={`url(#${id}-h)`} />
      <text x="136" y="88" textAnchor="middle" className="fill-accent font-mono text-[10px]">авто</text>
      <path d={`M80 68 V50 H${px}`} className="fill-none stroke-ink-3" strokeDasharray="3 4" markerEnd={`url(#${id}-a)`} />
      <text x="124" y="42" textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">вручную</text>

      {/* три пакета */}
      {pk.map((p, i) => (
        <g key={p.title}>
          <rect x={px} y={p.y} width={pw} height="44" rx="10" className={i === 1 ? "fill-accent-soft stroke-accent" : "fill-surface-2 stroke-line-strong"} />
          <text x={px + 14} y={p.y + 19} className="fill-ink text-[12.5px] font-semibold">{p.title}</text>
          <text x={px + 14} y={p.y + 34} className="fill-ink-3 font-mono text-[10px]">{p.sub}</text>
          <path d={`M${px + pw} ${p.y + 22} H${px + pw + 20} V108 H392`} className="fill-none stroke-ink-3" markerEnd={i === 1 ? `url(#${id}-a)` : undefined} />
        </g>
      ))}

      {/* реестр и продукты */}
      <rect x="392" y="80" width="96" height="56" rx="10" className="fill-surface-2 stroke-line-strong" />
      <text x="440" y="104" textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">GitLab</text>
      <text x="440" y="121" textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">Registry</text>
      <path d="M488 108 H520" className="stroke-ink-3" markerEnd={`url(#${id}-a)`} />
      <rect x="520" y="80" width="72" height="56" rx="10" className="fill-surface-2 stroke-line-strong" />
      <text x="556" y="104" textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">2 из 4</text>
      <text x="556" y="121" textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">продуктов</text>
    </svg>
  );
}

export function Work() {
  const { designSystem, e2e, export: exp, journal, assistant } = pixWork;
  return (
    <section id="work" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <h2 className="max-w-[18ch] font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
        Инфраструктура и бэкенд
      </h2>

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4">
          <Card className="flex flex-col overflow-hidden">
            <div className="p-7 sm:p-8">
              <h3 className="text-2xl font-semibold tracking-tight">{designSystem.title}</h3>
              <p className="mt-3 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-2">{designSystem.text}</p>
            </div>
            <div className="mt-auto border-t border-line bg-bg/40 px-5 py-6 sm:px-8">
              <div className="overflow-x-auto">
                <div className="min-w-[480px]">
                  <DesignSystemDiagram />
                </div>
              </div>
              <p className="mt-4 font-mono text-[12px] leading-relaxed text-ink-3">
                патч-версии публикуются автоматически в CI, минорные и мажорные вручную
              </p>
            </div>
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
