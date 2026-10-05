import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { virtuum } from "../content";
import { ChapterHeader } from "./Chapter";
import { Reveal } from "./Reveal";

// Как касса печатает чек: фронт не знает протокола ККМ, все идет через обертку и локальный демон
function KkmDiagram() {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const y = 72;
  const boxes = [
    { x: 8, title: "Касса", sub: "React" },
    { x: 164, title: "Обертка", sub: "cashRegister" },
    { x: 320, title: "Демон C#", sub: "localhost:8888" },
    { x: 476, title: "ККМ", sub: "драйвер Atol" },
  ];
  const w = 108;
  const arrows = [
    { x1: 8 + w, x2: 164, label: "чек" },
    { x1: 164 + w, x2: 320, label: "fetch" },
    { x1: 320 + w, x2: 476, label: "драйвер" },
  ];
  return (
    <svg viewBox="0 0 592 148" className="h-auto w-full" role="img" aria-label="Касса на React отправляет чек через обертку в локальный демон на C#, который печатает его на ККМ через драйвер Atol">
      <defs>
        <marker id={`${id}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" className="fill-ink-3" />
        </marker>
      </defs>
      {boxes.map((b, i) => (
        <g key={b.title}>
          <rect x={b.x} y={y - 28} width={w} height="56" rx="10" className={i === 3 ? "fill-accent-soft stroke-accent" : "fill-surface-2 stroke-line-strong"} />
          <text x={b.x + w / 2} y={y - 4} textAnchor="middle" className="fill-ink text-[13px] font-semibold">{b.title}</text>
          <text x={b.x + w / 2} y={y + 14} textAnchor="middle" className="fill-ink-3 font-mono text-[10.5px]">{b.sub}</text>
        </g>
      ))}
      {arrows.map((a) => (
        <g key={a.label}>
          <line x1={a.x1} y1={y} x2={a.x2} y2={y} className="stroke-ink-3" markerEnd={`url(#${id}-a)`} />
          <text x={(a.x1 + a.x2) / 2} y={y - 10} textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">{a.label}</text>
        </g>
      ))}
      {/* граница: что знает фронт, а что скрыто за оберткой */}
      <path d="M154 24 V128" className="stroke-accent/60" strokeDasharray="3 4" />
      <text x="146" y="140" textAnchor="end" className="fill-ink-3 font-mono text-[10px]">код кассы</text>
      <text x="162" y="140" className="fill-accent font-mono text-[10px]">детали оборудования спрятаны за оберткой</text>
      {!reduce && (
        <motion.circle
          cy={y}
          r={4.5}
          className="fill-accent"
          animate={{ cx: [8 + w - 4, 164, 164 + w, 320, 320 + w, 476 + 4], opacity: [0, 1, 1, 1, 1, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

export function Virtuum() {
  const { fudkit, crm } = virtuum;
  return (
    <section id="virtuum" aria-label="ВиртуумЛаб">
      <ChapterHeader name="ВиртуумЛаб" period={virtuum.period} role={virtuum.role}>
        <Reveal>
          <p className="mt-10 max-w-[60ch] text-[17px] leading-relaxed text-ink-2">{virtuum.intro}</p>
        </Reveal>
      </ChapterHeader>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-4 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Reveal>
          <article className="h-full rounded-[20px] border border-line bg-surface p-7 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight">{fudkit.title}</h3>
            <p className="mt-3 max-w-[64ch] text-[15.5px] leading-relaxed text-ink-2">{fudkit.text}</p>
            <div className="dot-grid mt-6 overflow-x-auto rounded-[14px] border border-line bg-bg/50 p-4">
              <div className="min-w-[500px]">
                <KkmDiagram />
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {fudkit.points.map((pt) => (
                <li key={pt} className="relative pl-4 text-[15px] leading-relaxed text-ink-2 before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-2 before:bg-accent/70">
                  {pt}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
        <Reveal delay={0.06}>
          <article className="flex h-full flex-col rounded-[20px] border border-line bg-surface p-7 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight">{crm.title}</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{crm.text}</p>
            <div className="mt-auto pt-8">
              <div className="font-mono text-[12px] text-ink-3">стек</div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {virtuum.stack.map((s) => (
                  <li key={s} className="rounded-full border border-line-strong px-3 py-1.5 text-[13.5px] text-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
