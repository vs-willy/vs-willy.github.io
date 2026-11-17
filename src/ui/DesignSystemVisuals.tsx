import { useT } from "../i18n";

// Дизайн-система PIX UI одной картинкой: три пакета, что в каждом, когда появился и где используется
export function PackagesOverview() {
  const tr = useT();
  const packages = [
    {
      name: "@pix-ui/icons",
      since: tr("с марта 2025", "since March 2025"),
      what: tr("Иконки выгружаются из Figma одной командой и становятся React-компонентами", "Icons are pulled from Figma with one command and become React components"),
      fact: tr("775 иконок, в трех продуктах", "775 icons, in three products"),
    },
    {
      name: "@pix-ui/tokens",
      since: tr("с лета 2026", "since summer 2026"),
      what: tr("Цвета, типографика и тени для светлой и темной темы", "Colors, typography and shadows for the light and dark themes"),
      fact: tr("в двух продуктах", "in two products"),
    },
    {
      name: "@pix-ui/components",
      since: tr("ноябрь 2026", "November 2026"),
      what: tr("Ant Design 5 под наш дизайн", "Ant Design 5 in our design"),
      fact: tr("66 компонентов, идет проверка", "66 components, under review"),
      wip: true,
    },
  ];
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {packages.map((p) => (
          <div key={p.name} className={`flex min-w-0 flex-col rounded-lg border p-3.5 ${p.wip ? "border-dashed border-line-strong bg-bg" : "border-line bg-bg"}`}>
            <div className="truncate font-mono text-[12.5px] font-medium text-ink">{p.name}</div>
            <div className="mt-0.5 text-[12px] text-ink-3">{p.since}</div>
            <p className="mt-3 flex-1 text-[13px] leading-snug text-ink-2">{p.what}</p>
            <div className={`mt-3 text-[12.5px] font-medium ${p.wip ? "text-ink-2" : "text-accent-ink"}`}>{p.fact}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[12.5px] text-ink-2">
        {tr("Источник для всех пакетов - макеты в Figma. Собирает и публикует их CI", "All packages come from the Figma mockups. CI builds and publishes them")}
      </p>
    </div>
  );
}
