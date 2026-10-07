import { useEffect, useId } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

// Четыре схемы к кейсу канваса. Сетка 8px, связи ортогональные, у каждой стрелки подпись.
// Анимация крутится только при включенном движении; при reduce-motion показан понятный статичный кадр.

const W = 480;
const H = 360;

const boxCls = "fill-surface stroke-line-strong";
const subCls = "fill-surface-2 stroke-line-strong";
const titleCls = "fill-ink text-[13px] font-semibold";
const monoCls = "fill-ink-3 font-mono text-[10.5px]";
const edgeCls = "fill-none stroke-ink-3";

function Svg({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

// Стрелки: обычная и акцентная. id уникальный, чтобы схемы не конфликтовали на странице
function Markers({ id }: { id: string }) {
  return (
    <defs>
      <marker id={`${id}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L8 4 L0 8 z" className="fill-ink-3" />
      </marker>
      <marker id={`${id}-h`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L8 4 L0 8 z" className="fill-accent" />
      </marker>
    </defs>
  );
}

function useMarkerId() {
  return useId().replace(/:/g, "");
}

/* 1. Command / Executor */
export function CommandsVisual() {
  const reduce = useReducedMotion();
  const id = useMarkerId();
  const T = { duration: 8, repeat: Infinity, ease: "easeInOut" as const };
  // Дорожки: команды идут по верхней, подтверждения возвращаются по нижней
  const topY = 144;
  const botY = 224;
  const from = 136;
  const to = 344;

  return (
    <Svg label="Команда уходит на бэкенд, подтверждение возвращается через SignalR в Executor, неуспешная команда откатывается">
      <Markers id={id} />

      {/* Канвас */}
      <rect x="24" y="72" width="112" height="208" rx="12" className={boxCls} />
      <text x="40" y="100" className={titleCls}>Канвас</text>
      <rect x="40" y={topY - 18} width="80" height="36" rx="8" className={subCls} />
      <text x="80" y={topY + 4} textAnchor="middle" className="fill-ink-2 font-mono text-[11px]">Command</text>
      <motion.rect
        x="40"
        y={botY - 18}
        width="80"
        height="36"
        rx="8"
        className="fill-surface-2"
        strokeWidth={1}
        animate={reduce ? { stroke: "var(--accent)" } : { stroke: ["var(--line-strong)", "var(--line-strong)", "var(--accent)", "var(--line-strong)", "var(--line-strong)"] }}
        transition={reduce ? { duration: 0 } : { ...T, times: [0, 0.42, 0.46, 0.52, 1] }}
      />
      <text x="80" y={botY + 4} textAnchor="middle" className="fill-ink-2 font-mono text-[11px]">Executor</text>

      {/* Бэкенд */}
      <rect x="344" y="72" width="112" height="208" rx="12" className={boxCls} />
      <text x="360" y="100" className={titleCls}>Бэкенд</text>
      <rect x="360" y={topY - 18} width="80" height="36" rx="8" className={subCls} />
      <text x="400" y={topY + 4} textAnchor="middle" className="fill-ink-2 font-mono text-[11px]">применение</text>
      <rect x="360" y={botY - 18} width="80" height="36" rx="8" className={subCls} />
      <text x="400" y={botY + 4} textAnchor="middle" className="fill-ink-2 font-mono text-[11px]">event store</text>
      <line x1="400" y1={topY + 18} x2="400" y2={botY - 18} className={edgeCls} markerEnd={`url(#${id}-a)`} />

      {/* Связи */}
      <line x1={from} y1={topY} x2={to} y2={topY} className={edgeCls} markerEnd={`url(#${id}-a)`} />
      <text x="240" y={topY - 20} textAnchor="middle" className={monoCls}>команды, пачкой</text>
      <line x1={to} y1={botY} x2={from} y2={botY} className={edgeCls} markerEnd={`url(#${id}-a)`} />
      <text x="240" y={botY - 14} textAnchor="middle" className={monoCls}>SignalR</text>
      <text x="240" y={botY + 22} textAnchor="middle" className={monoCls}>подтверждения и правки коллег</text>

      {/* Успешная команда */}
      <motion.g
        animate={reduce ? { x: 88, opacity: 1 } : { x: [0, 0, 152, 152, 152], opacity: [0, 1, 1, 0, 0] }}
        transition={reduce ? { duration: 0 } : { ...T, times: [0, 0.04, 0.2, 0.24, 1] }}
      >
        <rect x={from + 4} y={topY - 11} width="40" height="22" rx="11" className="fill-bg stroke-ink-2" />
        <text x={from + 24} y={topY + 4} textAnchor="middle" className="fill-ink font-mono text-[10.5px]">move</text>
      </motion.g>
      {/* Подтверждение */}
      <motion.circle
        cy={botY}
        r={4.5}
        className="fill-accent"
        animate={reduce ? { cx: 240, opacity: 1 } : { cx: [to - 8, to - 8, from + 12, from + 12], opacity: [0, 1, 1, 0] }}
        transition={reduce ? { duration: 0 } : { ...T, times: [0, 0.26, 0.42, 0.46] }}
      />

      {/* Неуспешная команда: доходит и возвращается откатом */}
      <motion.g
        animate={reduce ? { x: 0, opacity: 0 } : { x: [0, 0, 0, 140, 140, 0, 0], opacity: [0, 0, 1, 1, 1, 1, 0] }}
        transition={reduce ? { duration: 0 } : { ...T, times: [0, 0.54, 0.56, 0.7, 0.74, 0.9, 0.94] }}
      >
        <rect x={from + 4} y={topY - 11} width="52" height="22" rx="11" className="fill-bg stroke-accent" />
        <text x={from + 30} y={topY + 4} textAnchor="middle" className="fill-accent font-mono text-[10.5px]">rename</text>
      </motion.g>
      <motion.text
        x="240"
        y={topY + 34}
        textAnchor="middle"
        className="fill-accent font-mono text-[10.5px]"
        animate={reduce ? { opacity: 0 } : { opacity: [0, 0, 1, 1, 0] }}
        transition={reduce ? { duration: 0 } : { ...T, times: [0, 0.72, 0.75, 0.92, 0.96] }}
      >
        не применилась: откат
      </motion.text>

      {/* undo / redo */}
      <g>
        <rect x="24" y="304" width="64" height="28" rx="14" className={subCls} />
        <text x="56" y="322" textAnchor="middle" className="fill-ink-2 font-mono text-[11px]">undo</text>
        <rect x="96" y="304" width="64" height="28" rx="14" className={subCls} />
        <text x="128" y="322" textAnchor="middle" className="fill-ink-2 font-mono text-[11px]">redo</text>
        <text x="176" y="322" className={monoCls}>бесплатно: это просто обратные команды</text>
      </g>
    </Svg>
  );
}

/* 2. Слушатели: три исхода для события */
export function ListenersVisual() {
  const reduce = useReducedMotion();
  const id = useMarkerId();
  const lanes = [
    { y: 128, outcome: "пропущено", kind: "pass" as const },
    { y: 184, outcome: "скорректировано", kind: "fix" as const },
    { y: 240, outcome: "заблокировано", kind: "block" as const },
  ];
  const srcR = 112; // правый край источника
  const gateL = 168;
  const gateR = 232;
  const dstL = 368;
  const T = { duration: 6, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <Svg label="Слушатель проверяет каждое событие по правилам нотации: пропускает, корректирует или блокирует">
      <Markers id={id} />

      <rect x="24" y="88" width="88" height="184" rx="12" className={boxCls} />
      <text x="40" y="114" className={titleCls}>xyflow</text>
      <text x="40" y="262" className={monoCls}>события</text>

      <rect x={gateL} y="72" width={gateR - gateL} height="216" rx="12" className="fill-accent-soft stroke-accent" />
      <text x="200" y="60" textAnchor="middle" className="fill-ink text-[13px] font-semibold">Слушатель</text>
      <text x="200" y="306" textAnchor="middle" className="fill-accent font-mono text-[10.5px]">правила нотации</text>

      <rect x={dstL} y="88" width="88" height="184" rx="12" className={boxCls} />
      <text x={dstL + 16} y="114" className={titleCls}>Состояние</text>
      <text x={dstL + 16} y="262" className={monoCls}>карта</text>

      {lanes.map((l, i) => {
        const start = i / lanes.length;
        const span = 1 / lanes.length;
        const t = (k: number) => Math.min(1, start + span * k);
        const blocked = l.kind === "block";
        // Исправленное событие тоже останавливается на слушателе: дальше уходит уже новое, оранжевое
        const stops = blocked || l.kind === "fix";
        return (
          <g key={l.y}>
            <line x1={srcR} y1={l.y} x2={gateL} y2={l.y} className={edgeCls} markerEnd={`url(#${id}-a)`} />
            {blocked ? (
              <g className="stroke-accent" strokeWidth={1.6}>
                <line x1={gateR - 22} y1={l.y - 6} x2={gateR - 10} y2={l.y + 6} />
                <line x1={gateR - 22} y1={l.y + 6} x2={gateR - 10} y2={l.y - 6} />
              </g>
            ) : (
              <line x1={gateR} y1={l.y} x2={dstL} y2={l.y} className={edgeCls} markerEnd={`url(#${id}-a)`} />
            )}
            <text x={blocked ? gateR + 12 : 300} y={blocked ? l.y + 4 : l.y - 8} textAnchor={blocked ? "start" : "middle"} className={blocked ? "fill-accent font-mono text-[10.5px]" : monoCls}>
              {l.outcome}
            </text>

            {/* событие на дорожке */}
            <motion.rect
              y={l.y - 5}
              width={10}
              height={10}
              className="fill-ink-2"
             
              animate={
                reduce
                  ? { x: blocked ? gateL + 22 : dstL - 30, rx: 5, opacity: l.kind === "fix" ? 0 : 1 }
                  : {
                      x: stops
                        ? [srcR, srcR, gateL + 22, gateL + 22, gateL + 22]
                        : [srcR, srcR, gateL + 22, dstL - 22, dstL - 22],
                      rx: 5,
                      opacity: [0, 1, 1, stops ? 0 : 1, 0],
                    }
              }
              transition={reduce ? { duration: 0 } : { ...T, times: [t(0), t(0.08), t(0.45), t(0.85), t(1)] }}
            />
            {l.kind === "fix" && (
              <motion.rect
                y={l.y - 5}
                width={10}
                height={10}
                rx={2}
                className="fill-accent"
                animate={reduce ? { x: dstL - 30, opacity: 1 } : { x: [gateL + 22, gateL + 22, dstL - 22, dstL - 22], opacity: [0, 1, 1, 0] }}
                transition={reduce ? { duration: 0 } : { ...T, times: [t(0.45), t(0.5), t(0.85), t(1)] }}
              />
            )}
          </g>
        );
      })}
    </Svg>
  );
}

/* 3. MapInstance: было и стало рядом */
export function FacadeVisual() {
  const reduce = useReducedMotion();
  const id = useMarkerId();
  const rows = [112, 176, 240];
  const targets = [
    { y: 128, name: "Redux" },
    { y: 224, name: "xyflow" },
  ];

  const panel = (x0: number, after: boolean) => {
    const compX = x0 + 12;
    const compW = 52;
    const tgtX = x0 + 136;
    const tgtW = 64;
    const facX = x0 + 76;
    const facW = 52;
    return (
      <g>
        <rect x={x0} y="48" width="208" height="264" rx="12" className={after ? "fill-surface stroke-accent/50" : boxCls} />
        <text x={x0 + 16} y="76" className={after ? "fill-accent font-mono text-[11px]" : monoCls}>{after ? "стало" : "было"}</text>

        {rows.map((y, i) => (
          <g key={y}>
            <rect x={compX} y={y - 14} width={compW} height="28" rx="8" className={subCls} />
            <text x={compX + compW / 2} y={y + 4} textAnchor="middle" className="fill-ink-2 font-mono text-[10.5px]">{`UI ${i + 1}`}</text>
          </g>
        ))}

        {after && (
          <>
            <rect x={facX} y="96" width={facW} height="160" rx="10" className="fill-accent-soft stroke-accent" />
            <text x={facX + facW / 2} y="172" textAnchor="middle" className="fill-ink font-mono text-[10px] font-semibold">Map</text>
            <text x={facX + facW / 2} y="186" textAnchor="middle" className="fill-ink font-mono text-[10px] font-semibold">Instance</text>
          </>
        )}

        {targets.map((t) => (
          <g key={t.name}>
            <rect x={tgtX} y={t.y - 20} width={tgtW} height="40" rx="8" className={subCls} />
            <text x={tgtX + tgtW / 2} y={t.y + 4} textAnchor="middle" className="fill-ink-2 font-mono text-[10px]">
              {after && t.name === "Redux" ? "store" : t.name}
            </text>
          </g>
        ))}

        {/* связи */}
        {after ? (
          <>
            {rows.map((y) => (
              <line key={y} x1={compX + compW} y1={y} x2={facX} y2={y} className="stroke-accent/70" markerEnd={`url(#${id}-h)`} />
            ))}
            {targets.map((t) => (
              <line key={t.name} x1={facX + facW} y1={t.y} x2={tgtX} y2={t.y} className="stroke-accent/70" markerEnd={`url(#${id}-h)`} />
            ))}
            {!reduce &&
              rows.map((y, i) => (
                <motion.circle
                  key={y}
                  r={3}
                  className="fill-accent"
                  animate={{ cx: [compX + compW, facX - 4], cy: y, opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, delay: i * 0.4, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
                />
              ))}
          </>
        ) : (
          rows.flatMap((y) =>
            targets.map((t) => {
              const midX = compX + compW + 20 + (t.y > 150 ? 12 : 0);
              return (
                <path
                  key={`${y}-${t.name}`}
                  d={`M${compX + compW} ${y} H${midX} V${t.y} H${tgtX}`}
                  className="fill-none stroke-ink-3/70"
                  markerEnd={`url(#${id}-a)`}
                />
              );
            }),
          )
        )}

        <text x={x0 + 104} y="292" textAnchor="middle" className={after ? "fill-ink-2 font-mono text-[10.5px]" : monoCls}>
          {after ? "одна точка входа" : "каждый ходит сам"}
        </text>
      </g>
    );
  };

  return (
    <Svg label="Было: каждый компонент сам обращается к Redux и API xyflow. Стало: все обращения идут через фасад MapInstance">
      <Markers id={id} />
      {panel(24, false)}
      {panel(248, true)}
    </Svg>
  );
}

/* 4. Крепление стрелок: 30 фиксированных хендлов против одной точки в долях рамки */
export function HandlesVisual() {
  const reduce = useReducedMotion();
  const id = useMarkerId();

  // Левая панель: элемент со всеми старыми хендлами
  const L = { x: 56, y: 136, w: 144, h: 88 };
  const old: [number, number][] = [];
  for (const f of [0.25, 0.5, 0.75]) {
    for (const o of [-4, 4]) {
      old.push([L.x + L.w * f + o, L.y], [L.x + L.w * f + o, L.y + L.h], [L.x, L.y + L.h * f + o], [L.x + L.w, L.y + L.h * f + o]);
    }
  }
  old.push([L.x, L.y], [L.x + L.w, L.y], [L.x, L.y + L.h], [L.x + L.w, L.y + L.h]);
  const extra: [number, number][] = [
    [L.x + L.w / 2, L.y + L.h / 2],
    [L.x + L.w - 14, L.y + 14],
  ];

  // Правая панель: элемент и точка, которая едет по периметру
  const R = { x: 296, y: 136, w: 144, h: 88 };
  const src = { x: 264, y: 268 };
  const p = useMotionValue(0.62);
  useEffect(() => {
    if (reduce) return;
    const c = animate(p, [0.62, 1.62], { duration: 9, repeat: Infinity, ease: "linear" });
    return () => c.stop();
  }, [reduce, p]);

  // Перевод доли периметра в точку на рамке и в доли bbox
  const perim = 2 * (R.w + R.h);
  const at = (v: number) => {
    let d = (((v % 1) + 1) % 1) * perim;
    if (d < R.w) return { fx: d / R.w, fy: 0 };
    d -= R.w;
    if (d < R.h) return { fx: 1, fy: d / R.h };
    d -= R.h;
    if (d < R.w) return { fx: 1 - d / R.w, fy: 1 };
    d -= R.w;
    return { fx: 0, fy: 1 - d / R.h };
  };
  const cx = useTransform(p, (v) => R.x + at(v).fx * R.w);
  const cy = useTransform(p, (v) => R.y + at(v).fy * R.h);
  const coords = useTransform(p, (v) => {
    const { fx, fy } = at(v);
    return `x ${Math.round(fx * 100)}%  y ${Math.round(fy * 100)}%`;
  });
  // Ортогональная стрелка от источника: вверх, потом к точке
  const d = useTransform(p, (v) => {
    const { fx, fy } = at(v);
    const ex = R.x + fx * R.w;
    const ey = R.y + fy * R.h;
    const midY = 244;
    const s0 = `M${src.x + 24} ${src.y - 14} V${midY}`;
    if (fy === 1) return `${s0} H${ex} V${ey + 6}`;
    const side = fx === 0 ? R.x - 20 : fx === 1 ? R.x + R.w + 12 : ex;
    if (fy === 0) return `${s0} H${R.x - 20} V${R.y - 18} H${ex} V${ey - 6}`;
    return `${s0} H${side} V${ey} H${fx === 0 ? ex - 6 : ex + 6}`;
  });

  return (
    <Svg label="Было около 30 фиксированных точек крепления на элемент, стала одна: стрелка хранит позицию в долях рамки и крепится в любую точку границы">
      <Markers id={id} />

      {/* было */}
      <rect x="24" y="48" width="208" height="288" rx="12" className={boxCls} />
      <text x="40" y="76" className={monoCls}>было</text>
      <text x="128" y="104" textAnchor="middle" className="fill-ink font-display text-[20px] font-semibold">30</text>
      <rect x={L.x} y={L.y} width={L.w} height={L.h} rx="10" className={subCls} />
      {[...old, ...extra].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} className="fill-ink-2 stroke-surface" strokeWidth={1.5} />
      ))}
      <text x="128" y="304" textAnchor="middle" className={monoCls}>node-id + handle-id</text>
      <text x="128" y="322" textAnchor="middle" className="fill-ink-3 text-[11px]">на 1000 элементов падала вкладка</text>

      {/* стало */}
      <rect x="248" y="48" width="208" height="288" rx="12" className="fill-surface stroke-accent/50" />
      <text x="264" y="76" className="fill-accent font-mono text-[11px]">стало</text>
      <text x="352" y="104" textAnchor="middle" className="fill-accent font-display text-[20px] font-semibold">1</text>
      <rect x={R.x} y={R.y} width={R.w} height={R.h} rx="10" className={subCls} />
      <motion.text x={R.x + R.w / 2} y={R.y + R.h / 2 + 4} textAnchor="middle" className="fill-ink-2 font-mono text-[10.5px]">
        {coords}
      </motion.text>

      <rect x={src.x} y={src.y - 14} width="48" height="28" rx="8" className={subCls} />
      <motion.path d={d} className="fill-none stroke-accent" strokeWidth={1.6} markerEnd={`url(#${id}-h)`} />
      <motion.circle cx={cx} cy={cy} r={4} className="fill-accent stroke-surface" strokeWidth={2} />
      <text x="352" y="304" textAnchor="middle" className={monoCls}>node-id + доли рамки</text>
      <text x="352" y="322" textAnchor="middle" className="fill-ink-3 text-[11px]">крепится в любую точку границы</text>
    </Svg>
  );
}

export const visuals = [CommandsVisual, ListenersVisual, FacadeVisual, HandlesVisual];
