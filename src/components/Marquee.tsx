import { stack } from "../content";

// Единственная бегущая строка на странице: ширина стека одним взглядом
export function Marquee() {
  const items = stack.flatMap((g) => g.items);
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-medium tracking-[-0.03em] text-ink-3">
          <span className="px-6 sm:px-8">{item}</span>
          <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] border border-accent/70" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Технологии" className="relative overflow-hidden border-y border-line py-7 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
