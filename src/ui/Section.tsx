import type { ReactNode } from "react";

// Заголовок секции в духе cali.so: номер в рамке, штриховка и подпись капителью
export function SectionLabel({ n, children, aside }: { n: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">
        <span className="flex h-5 items-stretch border border-line-strong">
          <span className="grid place-items-center px-1.5 text-[11px] tracking-normal">{n}</span>
          <span
            aria-hidden
            className="w-3.5 border-l border-line-strong"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, var(--line-strong) 0 1px, transparent 1px 4px)" }}
          />
        </span>
        {children}
      </h2>
      {aside}
    </div>
  );
}
