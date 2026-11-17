import { Check, X } from "@phosphor-icons/react";
import { useT } from "../i18n";

// Иллюстрации к статье про дизайн-систему PIX UI. Примеры кода упрощены

const pre = "overflow-x-auto rounded-md bg-surface-2 px-3 py-2 font-mono text-[12px] leading-[1.55] text-ink-2 [font-variant-ligatures:none]";

// Иконки: как было и как стало, от макета до иконки на экране
export function IconsBeforeAfter() {
  const tr = useT();
  const sides = [
    {
      title: tr("Было", "Before"),
      steps: [
        tr("Найти иконку в Figma и экспортировать SVG", "Find the icon in Figma and export an SVG"),
        tr("Придумать имя и положить в папку проекта", "Make up a name and drop it into the project folder"),
        tr("Вычистить заливку и выставить размер", "Clean up the fill and set the size"),
        tr("Импортировать по пути, размер и цвет задать классом", "Import it by path, set size and color with a class"),
      ],
      code: "import CloseIcon\n  from 'icons/Close.svg?react';\n\n<CloseIcon\n  className=\"icon-default\" />",
    },
    {
      title: tr("Стало", "After"),
      accent: true,
      steps: [
        tr("Увидеть имя иконки в макете", "See the icon's name in the mockup"),
        tr("Набрать его, IDE сама подскажет импорт", "Type it, the IDE suggests the import"),
        tr("Задать размер и цвет пропсами", "Set size and color with props"),
      ],
      code: "import { CloseIcon }\n  from '@pix-ui/icons';\n\n<CloseIcon size=\"small\" />",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
      {sides.map((s) => (
        <div key={s.title} className={`flex min-w-0 flex-col rounded-lg border p-3.5 ${s.accent ? "border-accent/60 bg-accent-soft" : "border-line bg-bg"}`}>
          <div className={`text-[13px] font-medium ${s.accent ? "text-accent-ink" : "text-ink"}`}>{s.title}</div>
          <ol className="mt-2.5 flex-1 space-y-1.5">
            {s.steps.map((t, i) => (
              <li key={t} className="flex gap-2.5 text-[13px] leading-snug text-ink-2">
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${s.accent ? "bg-accent text-white" : "bg-surface-2 text-ink-2"}`}>{i + 1}</span>
                <span className="pt-px">{t}</span>
              </li>
            ))}
          </ol>
          <pre className={`mt-3 ${pre} ${s.accent ? "bg-surface text-ink" : ""}`}>{s.code}</pre>
        </div>
      ))}
    </div>
  );
}

// Токены: почему наружу отдается только семантика. Примитив не знает про тему, семантический токен переключается
export function TokensTheme() {
  const tr = useT();
  const rows = [
    {
      ok: false,
      title: tr("Так нельзя", "Don't"),
      code: "color: PRIMITIVES.cobalt.light['6']",
      light: "#2E85FF",
      dark: "#2E85FF",
      note: tr("в темной теме тот же цвет", "same color in the dark theme"),
    },
    {
      ok: true,
      title: tr("Так правильно", "Do"),
      code: "color: var(--brand-primary)",
      light: "#2E85FF",
      dark: "#2C77E0",
      note: tr("цвет переключился вместе с темой", "the color switches with the theme"),
    },
  ];
  const Swatch = ({ bg, color, label }: { bg: string; color: string; label: string }) => (
    <div className="min-w-0 flex-1 rounded-md border border-line px-2.5 py-2" style={{ background: bg }}>
      <div className="text-[11px]" style={{ color: bg === "#ffffff" ? "#6b6b6b" : "#a3a3a3" }}>
        {label}
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="h-4 w-4 shrink-0 rounded" style={{ background: color }} />
        <span className="truncate font-mono text-[11.5px]" style={{ color: bg === "#ffffff" ? "#333333" : "#e5e5e5" }}>
          {color}
        </span>
      </div>
    </div>
  );
  return (
    <ul className="divide-y divide-line">
      {rows.map((r) => (
        <li key={r.title} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-5">
          <div className="min-w-0">
            <div className={`flex items-center gap-1.5 text-[13px] font-medium ${r.ok ? "text-accent-ink" : "text-ink-2"}`}>
              {r.ok ? <Check size={14} weight="bold" aria-hidden /> : <X size={14} weight="bold" aria-hidden />}
              {r.title}
            </div>
            <pre className={`mt-2 ${pre}`}>{r.code}</pre>
          </div>
          <div className="min-w-0">
            <div className="flex gap-2">
              <Swatch bg="#ffffff" color={r.light} label={tr("светлая", "light")} />
              <Swatch bg="#161616" color={r.dark} label={tr("темная", "dark")} />
            </div>
            <div className={`mt-1.5 text-[12.5px] ${r.ok ? "text-ink-2" : "text-ink-3"}`}>{r.note}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Компоненты: три категории, продукт никогда не импортирует antd напрямую
export function ComponentKinds() {
  const tr = useT();
  const kinds = [
    { n: "1", title: tr("Реэкспорт", "Re-export"), why: tr("хватает темы", "the theme is enough"), items: ["Flex", "Row", "Col", "Space", "Grid"] },
    { n: "2", title: tr("Обертка", "Wrapper"), why: tr("пропсы, иконки, фиксы", "props, icons, fixes"), items: ["Tag", "Badge", "Drawer", "Alert", "Tabs", "Table"] },
    { n: "3", title: tr("Свои", "Our own"), why: tr("чего нет в antd", "what antd doesn't have"), items: ["Sidebar", "ErrorBoundary", "Onboarding"] },
  ];
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {kinds.map((k) => (
          <div key={k.n} className="min-w-0 rounded-lg border border-line bg-bg p-3">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[12px] text-ink-3">{k.n}</span>
              <span className="text-[14px] font-semibold text-ink">{k.title}</span>
            </div>
            <div className="mt-0.5 text-[12.5px] text-ink-3">{k.why}</div>
            <ul className="mt-2.5 flex flex-wrap gap-1">
              {k.items.map((i) => (
                <li key={i} className="rounded border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-[11.5px] text-ink-2">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[12.5px] text-ink-2">
        {tr("Напрямую импортировать antd в продукте запрещает линтер", "A linter forbids importing antd directly in a product")}
      </p>
    </div>
  );
}
