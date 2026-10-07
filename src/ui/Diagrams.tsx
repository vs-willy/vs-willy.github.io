import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

// Как устроена дизайн-система: откуда берутся пакеты и куда они уходят
export function DesignSystemDiagram() {
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

// Как касса печатает чек: фронт не знает протокола ККМ, все идет через обертку и локальный демон
export function KkmDiagram() {
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
