import { useEffect, useRef, useState } from "react";
import { ArrowArcLeft, ArrowArcRight, ArrowsLeftRight, Check, PencilSimple, Plus, Prohibit, X } from "@phosphor-icons/react";
import { useT } from "../i18n";

// Иллюстрации к статье про архитектуру канваса. Всё условное: названия и примеры придуманы, это не код продукта

const SLOTS = [6, 38, 70]; // позиции элемента на мини-канвасе, в процентах ширины
const DELAY = 700; // сколько «сервер» думает над командой

type Entry = { id: number; from: number; to: number; kind: "do" | "undo" | "redo"; status: "pending" | "ok" | "fail" };

// Команды: двигаешь элемент, команда уходит на сервер, может откатиться; undo и redo это просто обратные команды
export function CommandsDemo() {
  const tr = useT();
  const [pos, setPos] = useState(0);
  const [log, setLog] = useState<Entry[]>([]);
  const [done, setDone] = useState<{ from: number; to: number }[]>([]);
  const [undone, setUndone] = useState<{ from: number; to: number }[]>([]);
  const [failNext, setFailNext] = useState(false);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = (from: number, to: number, kind: Entry["kind"]) => {
    const id = ++seq.current;
    const fail = failNext;
    setBusy(true);
    setPos(to); // применяем сразу, не дожидаясь сервера
    setLog((l) => [{ id, from, to, kind, status: "pending" as const }, ...l].slice(0, 4));
    timer.current = window.setTimeout(() => {
      setLog((l) => l.map((e) => (e.id === id ? { ...e, status: fail ? "fail" : "ok" } : e)));
      if (fail) {
        setPos(from); // сервер не принял: откатываем
        setFailNext(false);
      } else if (kind === "undo") {
        setDone((d) => d.slice(0, -1));
        setUndone((u) => [...u, { from: to, to: from }]);
      } else if (kind === "redo") {
        setUndone((u) => u.slice(0, -1));
        setDone((d) => [...d, { from, to }]);
      } else {
        setDone((d) => [...d, { from, to }]);
        setUndone([]);
      }
      setBusy(false);
    }, DELAY);
  };

  const move = () => send(pos, (pos + 1) % SLOTS.length, "do");
  const undo = () => {
    const last = done[done.length - 1];
    if (last) send(last.to, last.from, "undo");
  };
  const redo = () => {
    const last = undone[undone.length - 1];
    if (last) send(last.from, last.to, "redo");
  };

  const btn =
    "inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 text-[13px] text-ink transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40";
  const kindLabel = { do: "", undo: tr("отмена", "undo"), redo: tr("повтор", "redo") };

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
      <div className="min-w-0">
        {/* мини-канвас */}
        <div
          className="relative h-28 overflow-hidden rounded-lg border border-line bg-bg"
          style={{ backgroundImage: "radial-gradient(var(--color-line-strong) 1px, transparent 1px)", backgroundSize: "14px 14px" }}
        >
          {SLOTS.map((x, i) => (
            <span key={x} aria-hidden className="absolute bottom-1.5 -translate-x-1/2 font-mono text-[11px] text-ink-3" style={{ left: `${x + 12}%` }}>
              {i + 1}
            </span>
          ))}
          <div
            className="absolute top-[44%] flex h-11 w-[24%] -translate-y-1/2 items-center justify-center rounded-md border border-accent bg-accent-soft text-[13px] font-medium text-ink motion-safe:transition-[left] motion-safe:duration-300"
            style={{ left: `${SLOTS[pos]}%` }}
          >
            {tr("Заявка", "Request")}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={move} disabled={busy}>
            <ArrowsLeftRight size={14} /> {tr("Сдвинуть", "Move")}
          </button>
          <button type="button" className={btn} onClick={undo} disabled={busy || !done.length}>
            <ArrowArcLeft size={14} /> {tr("Отменить", "Undo")}
          </button>
          <button type="button" className={btn} onClick={redo} disabled={busy || !undone.length}>
            <ArrowArcRight size={14} /> {tr("Повторить", "Redo")}
          </button>
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-[13px] text-ink-2">
          <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
          {tr("Сервер отклонит следующую команду", "The server rejects the next command")}
        </label>
      </div>

      {/* журнал команд */}
      <div className="min-w-0 rounded-lg border border-line bg-bg p-3">
        <div className="text-[13px] font-medium text-ink">{tr("Команды", "Commands")}</div>
        <ul className="mt-2 space-y-1.5" aria-live="polite">
          {log.length === 0 && <li className="text-[13px] leading-snug text-ink-3">{tr("Нажми «Сдвинуть», и здесь появится команда", "Press «Move» and a command shows up here")}</li>}
          {log.map((e) => (
            <li key={e.id} className="flex items-center gap-2 text-[13px]">
              <code className="min-w-0 truncate font-mono text-[12px] text-ink-2">
                move {e.from + 1} → {e.to + 1}
              </code>
              {e.kind !== "do" && <span className="shrink-0 rounded-full bg-surface-2 px-2 py-px text-[11.5px] text-ink-2">{kindLabel[e.kind]}</span>}
              <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-[12.5px]">
                {e.status === "pending" && <span className="text-ink-3">{tr("на сервере…", "on the server…")}</span>}
                {e.status === "ok" && (
                  <span className="inline-flex items-center gap-1 text-ink-2">
                    <Check size={13} className="text-accent" /> {tr("применена", "applied")}
                  </span>
                )}
                {e.status === "fail" && (
                  <span className="inline-flex items-center gap-1 text-accent-ink">
                    <X size={13} /> {tr("откат", "rolled back")}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Слушатели: что происходит с изменением, прежде чем оно попадет в состояние карты
export function ListenersTable() {
  const tr = useT();
  const rows = [
    { Icon: Check, verdict: tr("Пропускает", "Lets it through"), event: tr("Элемент сдвинули", "An element was moved"), result: tr("позиция сохраняется как есть", "the position is saved as is") },
    { Icon: PencilSimple, verdict: tr("Корректирует", "Corrects"), event: tr("Элемент отпустили между клетками", "An element was dropped between grid cells"), result: tr("позиция прилипает к сетке", "the position snaps to the grid") },
    { Icon: Plus, verdict: tr("Дополняет", "Extends"), event: tr("Нарисовали новую стрелку", "A new edge was drawn"), result: tr("стрелка получает данные по умолчанию", "the edge gets its default data") },
    { Icon: Prohibit, verdict: tr("Блокирует", "Blocks"), event: tr("Стрелку замкнули на тот же элемент", "An edge was looped back onto the same element"), result: tr("изменение не проходит", "the change doesn't go through"), block: true },
  ];
  return (
    <div>
      <div className="mb-2 hidden grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] gap-4 text-[12.5px] text-ink-3 sm:grid">
        <span>{tr("Событие от xyflow", "Event from xyflow")}</span>
        <span>{tr("Слушатель", "Listener")}</span>
        <span>{tr("Что попадает в карту", "What reaches the map")}</span>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {rows.map(({ Icon, verdict, event, result, block }) => (
          <li key={verdict} className="grid gap-x-4 gap-y-1.5 py-3 sm:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] sm:items-center">
            <span className="text-[14px] leading-snug text-ink">{event}</span>
            <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${block ? "text-accent-ink" : "text-ink-2"}`}>
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${block ? "bg-accent text-white" : "bg-surface-2 text-ink-2"}`}>
                <Icon size={13} weight="bold" aria-hidden />
              </span>
              {verdict}
            </span>
            <span className={`text-[13.5px] leading-snug ${block ? "text-ink-3" : "text-ink-2"}`}>{result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// MapInstance: раньше каждый доставал одно и то же по-своему, теперь один вызов
export function FacadeCompare() {
  const tr = useT();
  const before = [
    { who: tr("Панель свойств", "Properties panel"), code: "useSelector(s => s.map.nodes)\n  .filter(n => n.selected)" },
    { who: tr("Панель инструментов", "Toolbar"), code: "useReactFlow().getNodes()\n  .filter(n => n.selected)" },
    { who: tr("Контекстное меню", "Context menu"), code: "store.getState().map.selectedIds" },
  ];
  const covers = [tr("выделение", "selection"), tr("позиции", "positions"), tr("навигация", "navigation"), tr("загрузка данных", "data loading")];
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:gap-5">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-ink">{tr("Было: три компонента, три способа", "Before: three components, three ways")}</div>
        <ul className="mt-2 space-y-2">
          {before.map((b) => (
            <li key={b.who}>
              <div className="text-[12.5px] text-ink-3">{b.who}</div>
              <pre className="mt-1 overflow-x-auto rounded-md bg-surface-2 px-3 py-2 font-mono text-[12px] leading-[1.55] [font-variant-ligatures:none] text-ink-2">{b.code}</pre>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 rounded-lg border border-accent/60 bg-accent-soft p-3.5">
        <div className="text-[13px] font-medium text-accent-ink">{tr("Стало: один способ для всех", "After: one way for everyone")}</div>
        <pre className="mt-3 overflow-x-auto rounded-md bg-surface px-3 py-2 font-mono text-[12px] leading-[1.55] [font-variant-ligatures:none] text-ink">map.selection.get()</pre>
        <div className="mt-4 text-[12.5px] text-ink-3">{tr("Через MapInstance идут", "MapInstance covers")}</div>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {covers.map((c) => (
            <li key={c} className="rounded-full border border-line-strong bg-surface px-2.5 py-0.5 text-[12.5px] text-ink-2">
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12.5px] leading-snug text-ink-2">{tr("Типизировано, без прямых обращений к Redux", "Typed, with no direct Redux access")}</p>
      </div>
    </div>
  );
}
