import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { PaperPlaneRight, Sparkle } from "@phosphor-icons/react";
import { useT } from "../i18n";

// Условная демка ситуационной модели ИИгоря: ответы заготовлены, это не настоящий ассистент.
// Смысл в том, что вместе с вопросом уходит контекст: раздел, выделение и открытая карта

type Section = "canvas" | "pm";
type Ask = "improve" | "doc";

export function IgorDemo() {
  const tr = useT();
  const reduce = useReducedMotion();
  const steps = [tr("Прием заявки", "Intake"), tr("Проверка", "Review"), tr("Согласование", "Approval")];
  const map = tr("Закупки", "Procurement");
  const [section, setSection] = useState<Section>("canvas");
  const [sel, setSel] = useState<number | null>(2);
  const [noCtx, setNoCtx] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [shown, setShown] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const words = answer.split(" ");
  const streaming = shown < words.length;

  useEffect(() => {
    if (!answer) return;
    if (reduce) {
      setShown(words.length);
      return;
    }
    setShown(0);
    let n = 0;
    timer.current = window.setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= words.length) window.clearInterval(timer.current);
    }, 45);
    return () => window.clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, reduce]);

  const reply = (ask: Ask) => {
    const s = sel === null ? null : steps[sel];
    if (noCtx) return tr("Уточните, пожалуйста, о какой карте и каком шаге речь: я не вижу, где вы сейчас.", "Could you tell me which map and which step you mean? I can't see where you are.");
    if (section === "canvas") {
      if (ask === "improve")
        return s
          ? tr(`Смотрю на шаг «${s}» на карте «${map}». Перед ним два согласования подряд, их можно проводить параллельно. И у шага нет ответственного, его стоит назначить.`, `Looking at the «${s}» step on the «${map}» map. Two approvals run one after another before it, they could run in parallel. The step also has no owner, worth assigning one.`)
          : tr(`На карте «${map}» есть шаг без ответственного и ветка, которая никуда не ведет. С них я бы и начал.`, `The «${map}» map has a step without an owner and a branch that leads nowhere. I'd start there.`);
      return tr(`Готовлю регламент по карте «${map}»${s ? `, начну с шага «${s}»` : ""}: назначение, участники, порядок действий и ответственные по каждому шагу.`, `Drafting a procedure for the «${map}» map${s ? `, starting with the «${s}» step` : ""}: purpose, participants, the order of actions and an owner for every step.`);
    }
    if (ask === "improve")
      return s
        ? tr(`По журналу событий карты «${map}» на этапе «${s}» заявки ждут дольше всего. Посмотрите, как часто их возвращают на доработку.`, `In the event log of the «${map}» map, requests wait longest at the «${s}» stage. Check how often they get sent back for rework.`)
        : tr(`По журналу событий карты «${map}» больше всего времени уходит на ожидание между этапами, а не на сами этапы.`, `In the event log of the «${map}» map, most of the time goes into waiting between stages, not the stages themselves.`);
    return tr("Регламент лучше собирать по карте процесса, а вы сейчас в Process Mining. Открыть карту на канвасе?", "A procedure is best built from the process map, and you're in Process Mining right now. Open the map on the canvas?");
  };

  const ask = (a: Ask, q: string) => {
    setQuestion(q);
    setAnswer(reply(a));
  };
  // смена контекста сбрасывает разговор, чтобы было видно, что ответ зависит от него
  const reset = () => {
    setQuestion(null);
    setAnswer("");
  };

  const tab = (on: boolean) =>
    `rounded-full px-3 py-1 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${on ? "bg-ink text-bg" : "text-ink-2 hover:bg-surface-2"}`;
  const chip = "rounded-full border border-line-strong bg-surface px-2 py-0.5 text-[11.5px] text-ink-2";
  const qBtn =
    "rounded-full border border-line-strong bg-surface px-3 py-1.5 text-left text-[12.5px] text-ink transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40";
  const widths = [38, 62, 92];

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] sm:gap-5">
      {/* окно продукта */}
      <div className="min-w-0 rounded-lg border border-line bg-bg p-3">
        <div className="flex items-center gap-1" role="tablist" aria-label={tr("Раздел продукта", "Product section")}>
          <button type="button" role="tab" aria-selected={section === "canvas"} className={tab(section === "canvas")} onClick={() => (setSection("canvas"), reset())}>
            {tr("Канвас", "Canvas")}
          </button>
          <button type="button" role="tab" aria-selected={section === "pm"} className={tab(section === "pm")} onClick={() => (setSection("pm"), reset())}>
            Process Mining
          </button>
        </div>
        <div className="mt-3 text-[12.5px] font-medium text-ink">
          {tr("Карта", "Map")} «{map}»
        </div>
        <div className="text-[12px] text-ink-3">{tr("нажми на шаг, чтобы выделить", "click a step to select it")}</div>
        {section === "canvas" ? (
          <div className="mt-2 flex flex-col items-start gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-start">
                {i > 0 && <span aria-hidden className="ml-5 h-3 w-px bg-line-strong" />}
                <button
                  type="button"
                  aria-pressed={sel === i}
                  onClick={() => (setSel(sel === i ? null : i), reset())}
                  className={`rounded-md border px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${sel === i ? "border-accent bg-accent-soft text-ink" : "border-line-strong bg-surface text-ink-2 hover:bg-surface-2"}`}
                >
                  {s}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {steps.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  aria-pressed={sel === i}
                  onClick={() => (setSel(sel === i ? null : i), reset())}
                  className="group block w-full rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className={`text-[12.5px] ${sel === i ? "text-ink" : "text-ink-2"}`}>{s}</span>
                  <span className="mt-0.5 block h-2.5 rounded-sm bg-surface-2">
                    <span className={`block h-full rounded-sm ${sel === i ? "bg-accent" : "bg-ink-3/60 group-hover:bg-ink-3"}`} style={{ width: `${widths[i]}%` }} />
                  </span>
                </button>
              </li>
            ))}
            <li className="pt-1 text-[11.5px] text-ink-3">{tr("время на этапе", "time per stage")}</li>
          </ul>
        )}
      </div>

      {/* чат ассистента */}
      <div className="flex min-w-0 flex-col rounded-lg border border-line bg-bg p-3">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
          <Sparkle size={14} weight="fill" className="text-accent" aria-hidden /> {tr("ИИгорь", "IIgor")}
        </div>
        <div className={`mt-2 flex flex-wrap gap-1 ${noCtx ? "opacity-40" : ""}`} aria-label={tr("Контекст запроса", "Request context")}>
          <span className={chip}>{section === "canvas" ? tr("канвас", "canvas") : "Process Mining"}</span>
          <span className={chip}>
            {tr("карта", "map")} «{map}»
          </span>
          {sel !== null && <span className={chip}>{tr("выделено", "selected")}: {steps[sel]}</span>}
        </div>

        <div className="mt-3 min-h-[118px] flex-1 space-y-2" aria-live="polite">
          {question && (
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3 py-1.5 text-[13px] text-bg">{question}</div>
          )}
          {answer && (
            <div className="w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-surface-2 px-3 py-2 text-[13px] leading-snug text-ink">
              {words.slice(0, shown).join(" ")}
              {streaming && <span aria-hidden className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-ink-3 align-middle" />}
            </div>
          )}
          {!question && <div className="text-[12.5px] leading-snug text-ink-3">{tr("Выбери раздел и шаг слева, потом задай вопрос", "Pick a section and a step on the left, then ask")}</div>}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <button type="button" className={qBtn} disabled={streaming && !!answer} onClick={() => ask("improve", tr("Что тут можно улучшить?", "What can be improved here?"))}>
            {tr("Что тут можно улучшить?", "What can be improved here?")}
          </button>
          <button type="button" className={qBtn} disabled={streaming && !!answer} onClick={() => ask("doc", tr("Составь регламент", "Draft a procedure"))}>
            {tr("Составь регламент", "Draft a procedure")}
          </button>
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-2">
          <input type="checkbox" checked={noCtx} onChange={(e) => (setNoCtx(e.target.checked), reset())} className="h-4 w-4 accent-[var(--color-accent)]" />
          {tr("Отправить без контекста", "Send without context")}
          <PaperPlaneRight size={12} className="text-ink-3" aria-hidden />
        </label>
      </div>
    </div>
  );
}
