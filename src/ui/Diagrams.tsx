import { Fragment, useEffect, useId, useRef, useState } from "react";
import { useT } from "../i18n";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUp, CheckCircle, Desktop, FileZip, HardDrives, PlugsConnected, Printer, Storefront, TerminalWindow, XCircle } from "@phosphor-icons/react";

// Как устроена дизайн-система: откуда берутся пакеты и куда они уходят
export function DesignSystemDiagram() {
  const tr = useT();
  const id = useId().replace(/:/g, "");
  const pk = [
    { y: 28, title: tr("Токены", "Tokens"), sub: tr("цвета, типографика", "colors, typography") },
    { y: 96, title: tr("Иконки", "Icons"), sub: tr("740+, SVGO и SVGR", "740+, SVGO and SVGR") },
    { y: 164, title: tr("UI-библиотека", "UI library"), sub: tr("обертки над AntD 5", "wrappers over AntD 5") },
  ];
  const px = 168;
  const pw = 152;
  return (
    <svg viewBox="0 0 600 216" className="h-auto w-full" role="img" aria-label={tr("Иконки выгружаются из Figma автоматически, токены пока вносятся вручную. Три пакета публикуются в GitLab Registry и используются в трех из четырех продуктов компании", "Icons are exported from Figma automatically, tokens are still entered by hand. Three packages are published to GitLab Registry and used in three of the four company products")}>
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
      <text x="56" y="110" textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">{tr("дизайнеры", "designers")}</text>
      <path d={`M104 96 H${px}`} className="stroke-accent" strokeWidth={1.5} markerEnd={`url(#${id}-h)`} />
      <text x="136" y="88" textAnchor="middle" className="fill-accent font-mono text-[10px]">{tr("авто", "auto")}</text>
      <path d={`M80 68 V50 H${px}`} className="fill-none stroke-ink-3" strokeDasharray="3 4" markerEnd={`url(#${id}-a)`} />
      <text x="124" y="42" textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">{tr("вручную", "manual")}</text>

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
      <text x="556" y="104" textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">{tr("3 из 4", "3 of 4")}</text>
      <text x="556" y="121" textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">{tr("продуктов", "products")}</text>
    </svg>
  );
}

// Как касса печатает чек: фронт не знает протокола ККМ, все идет через обертку и локальный демон
function Receipt() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto h-[66px] w-[60px] overflow-hidden" aria-hidden>
      <div className="absolute inset-x-0 top-0 z-10 h-[5px] rounded-full bg-ink-3" />
      <motion.svg
        viewBox="0 0 48 60"
        className="absolute left-[6px] top-[2px] w-[48px]"
        initial={false}
        animate={reduce ? { y: 0 } : { y: [-60, 0, 0] }}
        transition={reduce ? undefined : { duration: 3.2, times: [0, 0.45, 1], repeat: Infinity, ease: "easeOut" }}
      >
        <path d="M0 0 H48 V54 l-4 4 -4 -4 -4 4 -4 -4 -4 4 -4 -4 -4 4 -4 -4 -4 4 -4 -4 -4 4 Z" className="fill-surface-2 stroke-line-strong" strokeWidth="1" />
        <g className="fill-ink-3">
          <rect x="7" y="8" width="34" height="3" rx="1.5" />
          <rect x="7" y="17" width="22" height="2.5" rx="1.25" />
          <rect x="7" y="24" width="28" height="2.5" rx="1.25" />
          <rect x="7" y="31" width="18" height="2.5" rx="1.25" />
          <rect x="7" y="42" width="34" height="3" rx="1.5" />
        </g>
      </motion.svg>
    </div>
  );
}

export function KkmDiagram() {
  const tr = useT();
  const nodes = [
    { icon: Storefront, title: tr("Касса", "POS"), sub: "React", note: tr("кассир жмет «Пробить чек»", "the cashier clicks «Print receipt»") },
    { icon: PlugsConnected, title: tr("Обертка", "Wrapper"), sub: "cashRegister", note: tr("единственное место, которое знает про ККМ", "the only place that knows about the printer"), accent: true },
    { icon: TerminalWindow, title: tr("Демон на C#", "C# daemon"), sub: "localhost:8888", note: tr("локальный сервис рядом с браузером", "a local service next to the browser") },
    { icon: Printer, title: "ККМ", sub: "Atol", note: tr("печатает чек", "prints the receipt"), receipt: true },
  ];
  const links = ["чек", "fetch", tr("драйвер", "driver")];
  const zones = [
    { label: tr("компьютер кассира", "the cashier's computer"), span: "sm:col-span-5" },
    { label: tr("оборудование", "hardware"), span: "sm:col-start-7" },
  ];
  return (
    <div className="grid gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-2">
      {zones.map((z) => (
        <div key={z.label} className={`hidden border-b border-line pb-1.5 text-center text-[12px] text-ink-3 sm:block ${z.span}`}>
          {z.label}
        </div>
      ))}
      {nodes.map((n, i) => {
        const Icon = n.icon;
        return (
          <Fragment key={n.sub}>
            {i > 0 && (
              <div className="flex items-center justify-center gap-1.5 py-1 text-[12px] text-ink-3 sm:flex-col sm:gap-0.5 sm:pt-6 sm:pb-0 sm:justify-start" aria-hidden>
                <span className="font-mono [font-variant-ligatures:none]">{links[i - 1]}</span>
                <ArrowDown size={13} className="sm:-rotate-90" />
              </div>
            )}
            <div className={`flex gap-3 rounded-lg px-3 py-3 sm:flex-col sm:items-center sm:gap-2 sm:px-1 sm:text-center ${n.accent ? "bg-accent-soft" : ""}`}>
              <Icon size={24} weight="duotone" className={`shrink-0 ${n.accent ? "text-accent-ink" : "text-ink-2"}`} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium text-ink">{n.title}</div>
                <div className="font-mono text-[12px] text-ink-3">{n.sub}</div>
                <div className="mt-1.5 text-[12.5px] leading-snug text-ink-2">{n.note}</div>
              </div>
              {n.receipt && <Receipt />}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

const RESX_LANGS = ["ru", "en", "de", "it"] as const;
const RESX_ROWS = [
  { key: "Cart.Pay", v: ["Оплатить", "Pay", "Bezahlen", "Paga"] },
  { key: "Order.Paid", v: ["Заказ оплачен", "Order paid", "Bestellung bezahlt", "Ordine pagato"] },
];

export function ResxDiagram() {
  const tr = useT();
  const reduce = useReducedMotion();
  const [lang, setLang] = useState(1);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (reduce || !auto) return;
    const id = setInterval(() => setLang((l) => (l + 1) % 4), 1800);
    return () => clearInterval(id);
  }, [reduce, auto]);
  const pick = (i: number) => {
    setAuto(false);
    setLang(i);
  };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-ink-3">{tr("Локаль:", "Locale:")}</span>
        {RESX_LANGS.map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => pick(i)}
            aria-pressed={i === lang}
            className={`rounded-md px-2 py-0.5 font-mono text-[12px] transition-colors ${i === lang ? "bg-accent text-white" : "bg-surface-2 text-ink-2 hover:text-ink"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <table className="w-full border-collapse text-left text-[12px] sm:text-[12.5px]">
          <caption className="pb-1.5 text-left text-[12.5px] text-ink-3">{tr("Словари .resx на бэкенде", ".resx dictionaries on the backend")}</caption>
          <thead>
            <tr className="border-b border-line text-ink-3">
              <th className="py-1.5 pr-2 font-normal">{tr("ключ", "key")}</th>
              {RESX_LANGS.map((l, i) => (
                <th key={l} className={`px-1.5 py-1.5 font-mono font-normal transition-colors sm:px-2 ${i === lang ? "text-accent-ink" : ""}`}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESX_ROWS.map((r) => (
              <tr key={r.key} className="border-b border-line">
                <td className="py-1.5 pr-2 font-mono text-ink-2">{r.key}</td>
                {r.v.map((v, i) => (
                  <td key={v} className={`px-1.5 py-1.5 leading-snug transition-colors sm:px-2 ${i === lang ? "bg-accent-soft text-ink" : "text-ink-3"}`}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <div className="text-[13px] font-medium text-ink">{tr("Фронт", "Frontend")}</div>
          <div className="mt-0.5 text-[12.5px] text-ink-3">{tr("кнопка оплаты", "the pay button")}</div>
          <span className="mt-2 inline-block rounded-md bg-accent px-3 py-1.5 text-[13px] font-medium text-white">{RESX_ROWS[0].v[lang]}</span>
        </div>
        <div>
          <div className="text-[13px] font-medium text-ink">{tr("Бэкенд", "Backend")}</div>
          <div className="mt-0.5 text-[12.5px] text-ink-3">{tr("уведомление о заказе", "the order notification")}</div>
          <span className="mt-2 inline-block rounded-md border border-line px-3 py-1.5 text-[13px] text-ink-2">{RESX_ROWS[1].v[lang]}</span>
        </div>
      </div>
    </div>
  );
}

// ЛЦТ: одна и та же улица и три новых здания. Слева трасса кратчайшим путем, справа так, как ее ведет инженер
const LCT_HOUSES = [
  { x: 40, y: 22, w: 64, h: 50 },
  { x: 160, y: 26, w: 76, h: 46 },
  { x: 96, y: 156, w: 72, h: 46 },
];

function LctPanel({ kind }: { kind: "short" | "engineer" }) {
  const tr = useT();
  const src = { x: 14, y: 114 };
  const eng = kind === "engineer";
  // кратчайший путь: напрямую к ближайшему углу здания, через двор и под углом к стене
  const shortRoutes = ["M14 114 L40 72", "M14 114 L160 72", "M14 114 L96 156"];
  // инженер: магистраль по оси улицы, ответвления в камерах, вводы перпендикулярно стене
  const chambers = [72, 132, 198];
  return (
    <svg
      viewBox="0 0 260 216"
      className="h-auto w-full"
      role="img"
      aria-label={
        eng
          ? tr("Трасса как у инженера: магистраль идет по улице, ответвления в камерах, каждый ввод перпендикулярен стене здания", "An engineer's route: the main line follows the street, branches leave at chambers, every inlet is perpendicular to the building wall")
          : tr("Кратчайший путь: трассы идут напрямую через дворы и подходят к зданиям под углом", "Shortest path: routes cut straight across yards and reach the buildings at an angle")
      }
    >
      {/* улица */}
      <rect x="0" y="100" width="260" height="28" className="fill-surface-2" />
      <path d="M0 114 H260" className="stroke-line-strong" strokeDasharray="6 6" />
      <text x="252" y="96" textAnchor="end" className="fill-ink-3 text-[10px]">{tr("улица", "street")}</text>

      {/* новые здания */}
      {LCT_HOUSES.map((h, i) => (
        <rect key={i} x={h.x} y={h.y} width={h.w} height={h.h} rx="3" className="fill-surface stroke-ink-3" />
      ))}

      {eng ? (
        <>
          <path d="M14 114 H198" className="fill-none stroke-accent" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M72 114 V72 M198 114 V72 M132 114 V156" className="fill-none stroke-accent" strokeWidth={1.75} />
          {chambers.map((x) => (
            <rect key={x} x={x - 4.5} y={109.5} width="9" height="9" className="fill-bg stroke-accent" strokeWidth={1.5} />
          ))}
        </>
      ) : (
        shortRoutes.map((d) => <path key={d} d={d} className="fill-none stroke-ink-2" strokeWidth={1.75} />)
      )}

      {/* врезка в действующую сеть */}
      <circle cx={src.x} cy={src.y} r="5" className="fill-surface-2 stroke-line-strong" strokeWidth="1" />
    </svg>
  );
}

export function LctRoutesDiagram() {
  const tr = useT();
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-6">
      <div className="min-w-0">
        <div className="mb-2 text-[13px] font-medium text-ink-2">{tr("Кратчайший путь", "Shortest path")}</div>
        <LctPanel kind="short" />
      </div>
      <div aria-hidden className="h-px bg-line sm:h-auto sm:w-px" />
      <div className="min-w-0">
        <div className="mb-2 text-[13px] font-medium text-ink">{tr("Как ведет инженер", "How an engineer lays it out")}</div>
        <LctPanel kind="engineer" />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-2 sm:col-span-3">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ink" />
          {tr("врезка в действующую сеть", "tie-in to the existing network")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5 border-[1.5px] border-accent" />
          {tr("камера", "chamber")}
        </span>
      </div>
    </div>
  );
}

// КосмоХакатон: почему сдавали план вместе с правилом реакции. Три плана против двух обязательных сценариев
export function KosmoPlansDiagram() {
  const tr = useT();
  const plans = [
    {
      name: tr("Лунный план без резерва", "The lunar plan without a reserve"),
      base: { ok: true, why: tr("проходит, и дешевле всех", "passes, and is the cheapest") },
      stress: { ok: false, why: tr("три года подряд на аварийном канале, а это запрещено", "three years in a row on the emergency channel, which is forbidden") },
    },
    {
      name: tr("План с запасом под стресс", "A plan sized for the stress"),
      base: { ok: false, why: tr("бак переполняется", "the tank overflows") },
      stress: { ok: true, why: tr("проходит", "passes") },
    },
    {
      name: tr("Базовый план и правило реакции", "Base plan plus a reaction rule"),
      base: { ok: true, why: tr("проходит", "passes") },
      stress: { ok: true, why: tr("вызывается заранее оплаченный резерв", "the prepaid reserve is called in") },
      accent: true,
    },
  ];
  const Cell = ({ label, c }: { label: string; c: { ok: boolean; why: string } }) => (
    <div className="flex min-w-0 items-start gap-2">
      {c.ok ? (
        <CheckCircle size={18} weight="fill" className="mt-px shrink-0 text-accent" aria-hidden />
      ) : (
        <XCircle size={18} className="mt-px shrink-0 text-ink-3" aria-hidden />
      )}
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-ink">{label}</div>
        <div className={`text-[12.5px] leading-snug ${c.ok ? "text-ink-2" : "text-ink-3"}`}>
          <span className="sr-only">{c.ok ? tr("да: ", "yes: ") : tr("нет: ", "no: ")}</span>
          {c.why}
        </div>
      </div>
    </div>
  );
  return (
    <ul className="divide-y divide-line">
      {plans.map((p) => (
        <li key={p.name} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
          <div className={`text-[14px] font-semibold leading-snug ${p.accent ? "text-accent-ink" : "text-ink"}`}>{p.name}</div>
          <Cell label={tr("Базовый сценарий", "Base scenario")} c={p.base} />
          <Cell label={tr("Стресс 2038", "2038 stress")} c={p.stress} />
        </li>
      ))}
    </ul>
  );
}

// РОБОЗОН: упрощенная линия сортировочного центра, по которой едут посылки.
// Рисуем в координатах «вдоль потока» (m) и «поперек» (c): на широком экране поток идет слева направо, на телефоне сверху вниз
const RZ_LANES = [40, 100, 160];
const RZ_BOXES = 10;
const RZ_DUR = 6;

function RobozonLineSvg({ vertical }: { vertical: boolean }) {
  const tr = useT();
  const reduce = useReducedMotion();
  const boxRefs = useRef<(SVGRectElement | null)[]>([]);
  const P = (m: number, c: number) => (vertical ? [c, m] : [m, c]);
  const pt = (m: number, c: number) => P(m, c).join(" ");
  const rectAt = (m: number, c: number, lm: number, lc: number) => {
    const [x, y] = P(m - lm / 2, c - lc / 2);
    const [w, h] = vertical ? [lc, lm] : [lm, lc];
    return { x, y, width: w, height: h };
  };
  // подпись узла: на широком экране под ним, на телефоне справа
  const label = (m: number, c: number, off: number, text: string, sub?: string) => {
    const [x, y] = vertical ? [c + off, m - (sub ? 3 : -4)] : [m, c + off + 10];
    const anchor = vertical ? "start" : "middle";
    return (
      <g>
        <text x={x} y={y} textAnchor={anchor} className="fill-ink text-[12.5px] font-semibold">{text}</text>
        {sub && <text x={x} y={y + 15} textAnchor={anchor} className="fill-ink-3 text-[11px]">{sub}</text>}
      </g>
    );
  };
  // маршрут посылки: по конвейеру до сортера и дальше по своему желобу в лоток
  const route = (lane: number) => [[36, 100], [338, 100], [436, lane], [468, lane]].map(([m, c]) => P(m, c));
  const boxes = Array.from({ length: RZ_BOXES }, (_, i) => ({ lane: RZ_LANES[[1, 0, 2, 1, 2, 0, 1, 2, 0, 1][i]], i }));
  const [vw, vh] = vertical ? [250, 540] : [540, 236];

  useEffect(() => {
    const place = (t: number) => {
      boxes.forEach(({ lane, i }) => {
        const el = boxRefs.current[i];
        if (!el) return;
        const pts = route(lane);
        const seg = pts.slice(1).map((q, k) => Math.hypot(q[0] - pts[k][0], q[1] - pts[k][1]));
        const total = seg.reduce((a, b) => a + b, 0);
        const ph = (t + i / RZ_BOXES) % 1;
        // 90% цикла посылка едет, остаток лежит в лотке и гаснет
        let d = Math.min(ph / 0.9, 1) * total;
        let k = 0;
        while (k < seg.length - 1 && d > seg[k]) d -= seg[k++];
        const f = seg[k] ? d / seg[k] : 0;
        const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f;
        const y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f;
        el.setAttribute("transform", `translate(${x} ${y})`);
        el.setAttribute("opacity", String(ph < 0.04 ? ph / 0.04 : ph > 0.9 ? Math.max(0, 1 - (ph - 0.9) / 0.1) : 1));
      });
    };
    if (reduce) {
      place(0.25);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      place(((now - t0) / 1000 / RZ_DUR) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // маршруты зависят только от ориентации
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertical, reduce]);

  return (
    <svg
      viewBox={vertical ? `0 0 ${vw} ${vh}` : `-30 0 ${vw + 30} ${vh}`}
      className="h-auto w-full"
      role="img"
      aria-label={tr(
        "Упрощенная линия: посылки приходят из источника, едут по конвейеру, индукция подает их на сортер с нужным зазором, сортер раскладывает их по лоткам направлений",
        "A simplified line: parcels arrive from the source, ride the conveyor, the induction feeds them onto the sorter with the right gap, and the sorter drops them into chutes by destination",
      )}
    >
      {/* конвейер с бегущей лентой */}
      <path d={`M${pt(52, 100)} L${pt(298, 100)}`} className="stroke-surface-2" strokeWidth={18} strokeLinecap="round" />
      <path d={`M${pt(52, 100)} L${pt(298, 100)}`} className="stroke-line-strong" strokeWidth={1.5} strokeDasharray="3 9">
        {!reduce && <animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.5s" repeatCount="indefinite" />}
      </path>

      {/* желоба от сортера к лоткам */}
      {RZ_LANES.map((c) => (
        <path key={c} d={`M${pt(342, 100)} L${pt(436, c)} L${pt(452, c)}`} className="fill-none stroke-line-strong" strokeWidth={1.5} />
      ))}

      {/* источник */}
      <rect {...rectAt(30, 100, 44, 44)} rx="8" className="fill-surface-2 stroke-line-strong" />
      {label(30, 100, 34, tr("Источник", "Source"), tr("приходят партиями", "arrive in batches"))}

      {/* подпись конвейера */}
      {label(130, 100, 22, tr("Конвейер", "Conveyor"))}

      {/* индукция: ворота на ленте */}
      <rect {...rectAt(222, 100, 6, 34)} rx="2" className="fill-ink-3" />
      {label(222, 100, 26, tr("Индукция", "Induction"), tr("выдает с зазором", "spaces them out"))}

      {/* сортер */}
      <rect {...rectAt(326, 100, 40, 58)} rx="8" className="fill-accent-soft stroke-accent" strokeWidth={1.5} />
      {label(326, 100, 38, tr("Сортер", "Sorter"), tr("решает, куда", "decides where"))}

      {/* лотки направлений */}
      {RZ_LANES.map((c) => (
        <rect key={c} {...rectAt(474, c, 40, 30)} rx="5" className="fill-surface-2 stroke-line-strong" />
      ))}
      {vertical ? (
        <g>
          <text x={100} y={518} textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">{tr("Лотки направлений", "Destination chutes")}</text>
          <text x={100} y={533} textAnchor="middle" className="fill-ink-3 text-[11px]">{tr("дальше затаривание", "then bagging")}</text>
        </g>
      ) : (
        <g>
          <text x={474} y={200} textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">{tr("Лотки", "Chutes")}</text>
          <text x={474} y={215} textAnchor="middle" className="fill-ink-3 text-[11px]">{tr("по направлениям", "by destination")}</text>
        </g>
      )}

      {/* посылки: позиции двигает цикл анимации ниже */}
      {boxes.map(({ lane, i }) => (
        <rect
          key={i}
          ref={(el) => {
            boxRefs.current[i] = el;
          }}
          x="-5"
          y="-5"
          width="10"
          height="10"
          rx="2"
          className={lane === 40 ? "fill-accent" : "fill-ink-2"}
        />
      ))}
    </svg>
  );
}

export function RobozonLineDiagram() {
  return (
    <>
      <div className="hidden sm:block">
        <RobozonLineSvg vertical={false} />
      </div>
      <div className="mx-auto max-w-[300px] sm:hidden">
        <RobozonLineSvg vertical />
      </div>
    </>
  );
}

// E2E: тестировщик пишет тест-кейс обычными словами, разработчик переводит каждый шаг в автотест
export function E2eCaseDiagram() {
  const tr = useT();
  const steps = [
    {
      n: "1",
      text: tr("Создать задачи «Подготовка товара» и «Продажа товара», соединить стрелкой", "Create tasks «Prepare goods» and «Sell goods», connect them with an edge"),
      code: tr(
        "MapEnvironment.create(page)\n  .withTask('Подготовка товара')\n  .withTask('Продажа товара')\n  .withEdge(...).open()",
        "MapEnvironment.create(page)\n  .withTask('Prepare goods')\n  .withTask('Sell goods')\n  .withEdge(...).open()",
      ),
    },
    {
      n: "2",
      text: tr("Удалить «Продажа товара»", "Delete «Sell goods»"),
      code: tr("map.element('Продажа товара')\n  .delete()", "map.element('Sell goods')\n  .delete()"),
    },
    { n: "3", text: tr("Нажать «Отменить»", "Click «Undo»"), code: "map.toolbar.undo()" },
    {
      n: "✓",
      text: tr("На карте снова два элемента, стрелка на месте", "Both elements are back, and so is the edge"),
      code: "map.expectElementsCount(2)\nmap.expectEdge(...)",
      result: true,
    },
  ];
  return (
    <div>
      <p className="mb-3 text-[12.5px] leading-snug text-ink-3 sm:hidden">
        {tr("Шаг пишет тестировщик, код под ним - разработчик", "A tester writes the step, a developer writes the code under it")}
      </p>
      <div className="mb-3 hidden grid-cols-[24px_minmax(0,1fr)_minmax(0,1.15fr)] gap-x-4 sm:grid">
        <span />
        <div>
          <div className="text-[13px] font-medium text-ink">{tr("Тест-кейс", "Test case")}</div>
          <div className="text-[12.5px] text-ink-3">{tr("пишет тестировщик", "written by a tester")}</div>
        </div>
        <div>
          <div className="text-[13px] font-medium text-accent-ink">{tr("Автотест", "Automated test")}</div>
          <div className="text-[12.5px] text-ink-3">{tr("пишет разработчик", "written by a developer")}</div>
        </div>
      </div>
      <ol className="divide-y divide-line border-y border-line">
        {steps.map((s) => (
          <li key={s.n} className="grid grid-cols-[24px_minmax(0,1fr)] gap-x-4 gap-y-2 py-3 sm:grid-cols-[24px_minmax(0,1fr)_minmax(0,1.15fr)]">
            <span
              aria-hidden
              className={`mt-px grid h-6 w-6 place-items-center rounded-full text-[12px] font-semibold ${s.result ? "bg-accent text-white" : "bg-surface-2 text-ink-2"}`}
            >
              {s.n}
            </span>
            <div className={`text-[14px] leading-snug ${s.result ? "font-medium text-ink" : "text-ink-2"}`}>
              {s.result && <span className="sr-only">{tr("Ожидаемый результат: ", "Expected result: ")}</span>}
              {s.text}
            </div>
            <pre className="col-start-2 overflow-x-auto rounded-md bg-surface-2 px-3 py-2 font-mono text-[12px] leading-[1.55] text-ink-2 sm:col-start-3">{s.code}</pre>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ExportMap() {
  const reduce = useReducedMotion();
  const [tile, setTile] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTile((t) => (t + 1) % 4), 1100);
    return () => clearInterval(id);
  }, [reduce]);
  const tiles = [
    [0, 0],
    [60, 0],
    [0, 40],
    [60, 40],
  ];
  return (
    <svg viewBox="0 0 120 80" className="block h-auto w-full" aria-hidden>
      <rect x="0.5" y="0.5" width="119" height="79" rx="3" className="fill-bg stroke-line" />
      <g className="stroke-line-strong" strokeWidth="1" fill="none">
        <path d="M30 20 H52 M68 20 H88 M98 26 V50 M88 58 H68 M52 58 H34 M24 52 V28" />
      </g>
      <g className="fill-surface-2 stroke-line-strong" strokeWidth="1">
        <rect x="10" y="14" width="20" height="12" rx="2" />
        <rect x="52" y="14" width="16" height="12" rx="2" />
        <rect x="88" y="14" width="20" height="12" rx="2" />
        <rect x="88" y="50" width="20" height="12" rx="2" />
        <rect x="52" y="52" width="16" height="12" rx="2" />
        <rect x="14" y="46" width="20" height="12" rx="2" />
      </g>
      <path d="M60 0 V80 M0 40 H120" className="stroke-ink-3" strokeDasharray="2 2" strokeWidth="0.75" />
      <rect
        x={tiles[tile][0] + 1}
        y={tiles[tile][1] + 1}
        width="58"
        height="38"
        rx="2"
        className="fill-accent/15 stroke-accent transition-all duration-300"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function ExportPathDiagram() {
  const tr = useT();
  const step = "py-3 sm:px-4 sm:py-0 sm:first:pl-0 sm:last:pr-0";
  const label = "text-[13px] font-medium text-ink";
  const note = "mt-1 text-[12.5px] leading-snug text-ink-3";
  return (
    <div className="rounded-xl border border-dashed border-line-strong p-3 sm:p-4">
      <div className="mb-3 text-[12.5px] text-ink-3">
        {tr("Контур компании-клиента: система стоит у нее, а не на общем сервере", "The client company's own setup: the system runs there, not on a shared server")}
      </div>
      <div className="grid gap-2">
        <div className="rounded-lg border border-line bg-surface p-3 sm:flex sm:items-center sm:gap-5">
          <div className="flex shrink-0 items-center gap-2 text-ink">
            <Desktop size={18} weight="duotone" />
            <span className={label}>{tr("Компьютер пользователя", "User's computer")}</span>
          </div>
          <ul className="mt-3 space-y-2 text-[13px] leading-snug text-ink-2 sm:mt-0 sm:flex sm:gap-5 sm:space-y-0">
            <li className="flex gap-2 sm:whitespace-nowrap">
              <ArrowDown size={14} className="mt-0.5 shrink-0 text-accent-ink" />
              {tr("отправляет настройки", "sends settings")}
            </li>
            <li className="flex gap-2 sm:whitespace-nowrap">
              <ArrowUp size={14} className="mt-0.5 shrink-0 text-accent-ink" />
              {tr("получает файл", "gets the file")}
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-line bg-surface p-3">
          <div className="flex items-center gap-2 text-ink">
            <HardDrives size={18} weight="duotone" />
            <span className={label}>{tr("Сервер системы", "The system's server")}</span>
          </div>
          <div className="mt-3 grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className={step}>
              <div className={label}>{tr("Очередь", "Queue")}</div>
              <div className="mt-2.5 flex gap-1" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-5 flex-1 rounded-sm ${i < 3 ? "bg-accent" : "border border-line-strong"}`} />
                ))}
              </div>
              <div className={note}>{tr("до пяти карт сразу, остальные ждут", "up to five maps at once, the rest wait")}</div>
            </div>
            <div className={step}>
              <div className={label}>Headless Chromium</div>
              <div className="mt-2.5 max-w-[220px]">
                <ExportMap />
              </div>
              <div className={note}>{tr("открывает карту от имени пользователя и снимает частями", "opens the map as the user and shoots it in parts")}</div>
            </div>
            <div className={step}>
              <div className={label}>{tr("Склейка", "Stitching")}</div>
              <div className="mt-2.5 flex items-center gap-2 text-ink-2" aria-hidden>
                <FileZip size={30} weight="duotone" className="text-accent-ink" />
                <span className="font-mono text-[12px] whitespace-nowrap">png jpg pdf</span>
              </div>
              <div className={note}>{tr("один файл или zip, если карт несколько", "one file, or a zip for several maps")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
