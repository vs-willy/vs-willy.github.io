import { Fragment, type ReactNode } from "react";
import type { Side, Step } from "../articles";

// Строка с **жирным** и `кодом`, больше разметки в статьях не нужно
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((s, i) =>
        s.startsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">
            {s.slice(2, -2)}
          </strong>
        ) : s.startsWith("`") ? (
          <code key={i} className="rounded-[4px] bg-surface-2 px-1 py-px font-mono text-[0.86em] text-ink">
            {s.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={i}>{s}</Fragment>
        ),
      )}
    </>
  );
}

export function Figure({ caption, children, bare }: { caption?: string; children: ReactNode; bare?: boolean }) {
  return (
    <figure className="my-8">
      <div className={bare ? "" : "rounded-[10px] border border-line bg-surface p-3 sm:p-4"}>{children}</div>
      {caption && <figcaption className="mt-2.5 text-center text-[13px] text-ink-3">{caption}</figcaption>}
    </figure>
  );
}

// Цепочка шагов: на телефоне в столбик, на компьютере в строку
export function Flow({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center sm:gap-0">
      {steps.map((s, i) => (
        <Fragment key={s.title}>
          {i > 0 && (
            <li aria-hidden className="flex justify-center text-ink-3 sm:px-1.5">
              <span className="font-mono text-[13px] sm:hidden">↓</span>
              <span className="hidden font-mono text-[13px] sm:inline">→</span>
            </li>
          )}
          <li
            className={`min-w-0 flex-1 rounded-[8px] border px-2 py-2 text-center ${s.accent ? "border-accent bg-accent-soft" : "border-line-strong bg-surface-2"}`}
          >
            <div className="text-[13px] font-semibold leading-tight text-ink">{s.title}</div>
            {s.note && <div className="mt-0.5 font-mono text-[10.5px] leading-tight text-ink-3">{s.note}</div>}
          </li>
        </Fragment>
      ))}
    </ol>
  );
}

export function Compare({ sides }: { sides: [Side, Side] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {sides.map((s, k) => (
        <div key={s.title} className={`rounded-[8px] border p-4 ${k === 1 ? "border-accent/60 bg-accent-soft" : "border-line-strong bg-surface-2"}`}>
          <div className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-3">{s.title}</div>
          <ul className="mt-2.5 space-y-2">
            {s.items.map((it) => (
              <li key={it} className="flex gap-2 text-[14px] leading-snug text-ink-2">
                <span aria-hidden className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${k === 1 ? "bg-accent" : "bg-ink-3"}`} />
                <span>
                  <Rich text={it} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items: { when: string; what: string }[] }) {
  return (
    <ol className="relative ml-1.5 border-l border-line-strong">
      {items.map((it, i) => (
        <li key={it.when} className="relative pb-4 pl-5 last:pb-0">
          <span aria-hidden className={`absolute -left-[4.5px] top-[7px] h-2 w-2 rounded-full ${i === items.length - 1 ? "bg-accent" : "bg-ink-3"}`} />
          <div className="font-mono text-[12px] text-ink-3">{it.when}</div>
          <div className="text-[14.5px] text-ink-2">{it.what}</div>
        </li>
      ))}
    </ol>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className={`my-8 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line ${items.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
      {items.map((s) => (
        <div key={s.label} className="bg-surface px-4 py-4">
          <div className="text-[22px] font-semibold tracking-tight text-ink">{s.value}</div>
          <div className="mt-1 text-[13px] leading-snug text-ink-3">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Quote({ text }: { text: string }) {
  return (
    <blockquote className="my-9 border-l-2 border-accent py-1 pl-5 text-[20px] font-medium leading-snug tracking-tight text-ink">
      {text}
    </blockquote>
  );
}

export function Note({ text }: { text: string }) {
  return (
    <aside className="my-6 rounded-[8px] border border-dashed border-line-strong px-4 py-3 text-[14px] leading-relaxed text-ink-2">
      <Rich text={text} />
    </aside>
  );
}

export function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-[10px] border border-line bg-surface-2 p-4 font-mono text-[12.5px] leading-[1.6] text-ink-2">
      <code>{code}</code>
    </pre>
  );
}
