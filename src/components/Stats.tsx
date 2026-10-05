import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

const small = [
  { value: <>2,5-3×</>, text: "меньше памяти уходит на больших картах после миграции стрелок" },
  { value: <>~<CountUp to={200} /></>, text: "e2e-сценариев на Playwright. Тестирование запускал с нуля" },
  { value: <><CountUp to={10} /> млн</>, text: "строк журнала событий загружаются примерно за минуту" },
  { value: <CountUp to={3} duration={0.8} />, text: "npm-пакета дизайн-системы, уже в 2 из 4 продуктов компании" },
];

export function Stats() {
  return (
    <section aria-label="Результаты в цифрах" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="dot-grid relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-[20px] border border-line bg-surface p-7 sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-[100px]" />
            <div className="relative font-mono text-[13px] text-ink-3">карта на 1000 элементов открывается за</div>
            <div className="relative">
              <div className="font-display text-[clamp(5rem,13vw,10.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-ink">
                <CountUp to={1.7} decimals={1} duration={2.2} />
                <span className="ml-3 text-accent">с</span>
              </div>
              <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-ink-2">
                Раньше на таком размере падала вкладка, а 750 элементов открывались полторы минуты.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
          {small.map((s, i) => (
            <Reveal key={i} delay={0.06 * (i + 1)}>
              <div className="flex h-full flex-col justify-between gap-6 rounded-[20px] border border-line p-6">
                <div className="font-display text-[2.6rem] font-semibold leading-none tracking-[-0.04em]">{s.value}</div>
                <p className="text-[14px] leading-snug text-ink-2">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
