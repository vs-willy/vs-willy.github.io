import { stack } from "../content";
import { Reveal } from "./Reveal";

export function Stack() {
  return (
    <section aria-labelledby="stack-title" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:pb-32">
      <div className="grid gap-10 rounded-[20px] border border-line bg-surface p-7 sm:p-10 lg:grid-cols-[0.6fr_1fr_1fr_1fr] lg:gap-8">
        <h2 id="stack-title" className="font-display text-3xl font-semibold tracking-[-0.04em]">
          Стек
        </h2>
        {stack.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.05}>
            <h3 className="font-mono text-[13px] text-ink-3">{g.group}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li key={item} className="rounded-full border border-line-strong px-3 py-1.5 text-[14px] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
