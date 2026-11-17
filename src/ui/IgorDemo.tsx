import { ArrowDown, Sparkle } from "@phosphor-icons/react";
import { useT } from "../i18n";

// Ситуационная модель ИИгоря на условном примере: пользователь пишет короткий вопрос,
// а ассистент получает его вместе с контекстом и поэтому отвечает по делу

export function IgorDemo() {
  const tr = useT();
  const context = [
    { k: tr("раздел", "section"), v: tr("канвас", "canvas") },
    { k: tr("карта", "map"), v: tr("«Закупки»", "«Procurement»") },
    { k: tr("выделено", "selected"), v: tr("шаг «Согласование»", "step «Approval»") },
  ];
  const question = tr("Что тут можно улучшить?", "What can be improved here?");
  const head = "text-[12.5px] text-ink-3";
  const Arrow = () => (
    <div aria-hidden className="grid place-items-center text-ink-3">
      <ArrowDown size={16} />
    </div>
  );

  return (
    <div className="mx-auto grid max-w-[440px] gap-3 py-1">
      {/* что пишет пользователь */}
      <div className="min-w-0">
        <div className={head}>{tr("Пользователь пишет", "The user types")}</div>
        <div className="mt-2 ml-auto w-fit rounded-2xl rounded-br-md bg-ink px-3 py-1.5 text-[13px] text-bg">{question}</div>
      </div>

      <Arrow />

      {/* что получает ассистент */}
      <div className="min-w-0">
        <div className={head}>{tr("ИИгорь получает", "IIgor receives")}</div>
        <div className="mt-2 rounded-lg border border-line-strong bg-bg p-3">
          <div className="text-[13px] text-ink">{question}</div>
          <ul className="mt-2.5 space-y-1 border-t border-line pt-2.5">
            {context.map((c) => (
              <li key={c.k} className="flex gap-2 text-[12.5px]">
                <span className="w-[62px] shrink-0 text-ink-3">{c.k}</span>
                <span className="min-w-0 text-accent-ink">{c.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Arrow />

      {/* ответ */}
      <div className="min-w-0">
        <div className={`${head} flex items-center gap-1`}>
          <Sparkle size={12} weight="fill" className="text-accent" aria-hidden /> {tr("Отвечает по делу", "Answers to the point")}
        </div>
        <div className="mt-2 w-fit rounded-2xl rounded-bl-md bg-surface-2 px-3 py-2 text-[13px] leading-snug text-ink">
          {tr(
            "Перед «Согласованием» два согласования подряд, их можно проводить параллельно. И у шага нет ответственного.",
            "Two approvals run back to back before «Approval», they could run in parallel. And the step has no owner.",
          )}
        </div>
      </div>
    </div>
  );
}
