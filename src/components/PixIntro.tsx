import { pix } from "../content";
import { ChapterHeader } from "./Chapter";
import { Reveal } from "./Reveal";

export function PixIntro() {
  return (
    <section id="pix" aria-label="PIX Robotics">
      <ChapterHeader name="PIX Robotics" period={pix.period} role={pix.role}>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <p className="max-w-[56ch] text-[17px] leading-relaxed text-ink-2">{pix.product}</p>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-ink-3">{pix.people}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
              {pix.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display text-[clamp(1.7rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.04em]">{f.value}</dd>
                  <dd className="mt-2 text-[13px] leading-snug text-ink-2">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </ChapterHeader>
    </section>
  );
}
