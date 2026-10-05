import { pix } from "../content";
import { ChapterHeader } from "./Chapter";
import { Reveal } from "./Reveal";

export function PixIntro() {
  const total = pix.modules.reduce((a, m) => a + m.count, 0);
  return (
    <section id="pix" aria-label="PIX Robotics">
      <ChapterHeader name="PIX Robotics" period={pix.period} role={pix.role}>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <p className="max-w-[56ch] text-[17px] leading-relaxed text-ink-2">{pix.product}</p>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-ink-3">{pix.people}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="grid grid-cols-3 gap-4">
              {pix.jira.map((j) => (
                <div key={j.label}>
                  <div className="font-display text-[clamp(2rem,3.4vw,2.8rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">{j.value}</div>
                  <div className="mt-2 text-[13px] leading-snug text-ink-2">{j.label}</div>
                </div>
              ))}
            </div>
            {/* Доля задач по модулям продукта, одной полосой */}
            <div className="mt-8">
              <div className="flex h-2.5 gap-1 overflow-hidden rounded-full" role="img" aria-label={pix.modules.map((m) => `${m.name}: ${m.count}`).join(", ")}>
                {pix.modules.map((m, i) => (
                  <div
                    key={m.name}
                    style={{ flexGrow: m.count, flexBasis: 0 }}
                    className={i === 0 ? "rounded-full bg-accent" : i === 1 ? "rounded-full bg-accent/50" : "rounded-full bg-ink-3/60"}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] text-ink-3">
                {pix.modules.map((m, i) => (
                  <li key={m.name} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-accent" : i === 1 ? "bg-accent/50" : "bg-ink-3/60"}`} />
                    {m.name} <span className="text-ink-2 tabular-nums">{Math.round((m.count / total) * 100)}%</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] text-ink-3">По выгрузке Jira: все задачи, где я исполнитель</p>
            </div>
          </Reveal>
        </div>
      </ChapterHeader>
    </section>
  );
}
