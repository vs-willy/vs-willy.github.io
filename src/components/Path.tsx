import { education, path } from "../content";
import { CareerFlow } from "./CareerFlow";
import { Reveal } from "./Reveal";

// Короткий путь и учеба. Подробности по каждому месту работы - в главах выше
export function Path() {
  return (
    <section id="path" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">Путь и учеба</h2>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <ol className="divide-y divide-line border-y border-line">
            {path.map((p) => (
              <li key={p.period} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                <div className="font-mono text-[13px] text-ink-3 sm:pt-0.5">{p.period}</div>
                <div>
                  <div className={`text-[16px] font-semibold ${p.role ? "text-ink" : "text-ink-2"}`}>{p.company}</div>
                  {p.role && <div className="text-[14.5px] text-ink-2">{p.role}</div>}
                </div>
              </li>
            ))}
          </ol>

          <Reveal className="mt-14">
            <h3 className="font-mono text-[13px] text-ink-3">учеба</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {education.map((e) => (
                <li key={e.title} className="py-4">
                  <div className="text-[16px] font-medium leading-snug">{e.title}</div>
                  <div className="mt-1 text-[14.5px] leading-snug text-ink-2">{e.detail}</div>
                </li>
              ))}
              <li className="py-4 text-[14.5px] text-ink-2">Языки: русский родной, английский B1</li>
            </ul>
          </Reveal>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <CareerFlow />
        </div>
      </div>
    </section>
  );
}
