import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Шапка главы компании: крупное название, период и роль. Одинаковая для всех мест работы
export function ChapterHeader({ name, period, role, children }: { name: string; period: string; role: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:pt-32">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-line-strong pt-8">
          <h2 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">{name}</h2>
          <div className="text-right max-sm:text-left">
            <div className="font-mono text-[13px] text-accent-ink">{period}</div>
            <div className="mt-1 text-[15px] text-ink-2">{role}</div>
          </div>
        </div>
      </Reveal>
      {children}
    </div>
  );
}
