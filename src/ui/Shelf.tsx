import { useState } from "react";
import { books } from "../books";
import { sound } from "../sound";

// светлый корешок получает темный текст, остальные белый (светлота берется из oklch)
const isLight = (color: string) => parseFloat(color.match(/oklch\(([\d.]+)/)?.[1] ?? "0") > 0.7;
// разная высота и толщина, чтобы ряд не выглядел как частокол
const H = ["h-44", "h-40", "h-[11.5rem]", "h-[10.5rem]", "h-[11rem]", "h-[11.75rem]"];
const W = ["w-9", "w-8", "w-10", "w-8", "w-9", "w-11"];

// Полка как на cali.so: корешки в ряд, наведенная книга выдвигается и показывает подпись
export function Shelf() {
  const [active, setActive] = useState(0);
  const b = books[active];
  if (!b) return null;
  return (
    <div>
      <div className="flex items-end gap-1 overflow-x-auto pb-0">
        {books.map((book, i) => (
          <button
            key={book.title}
            type="button"
            onMouseEnter={() => {
              setActive(i);
              sound.hover();
            }}
            onFocus={() => setActive(i)}
            aria-label={`${book.title}, ${book.author}`}
            className={`flex ${H[i % H.length]} ${W[i % W.length]} shrink-0 items-center justify-center rounded-[3px] transition-transform duration-300 ${i === active ? "-translate-y-2" : ""}`}
            style={{ background: book.color }}
          >
            <span className={`whitespace-nowrap text-[11px] font-semibold [writing-mode:vertical-rl] ${isLight(book.color) ? "text-[#222]" : "text-white/90"}`}>{book.title}</span>
          </button>
        ))}
      </div>
      <div className="h-2.5 rounded-[2px] bg-gradient-to-b from-[oklch(0.78_0.04_70)] to-[oklch(0.62_0.05_60)]" />
      <p className="mt-3 text-center text-[13.5px] text-ink-2">
        <a href={b.url} target="_blank" rel="noreferrer" className="link">
          {b.title}
        </a>
        , {b.author}
        {b.note && <span className="block text-ink-3">{b.note}</span>}
      </p>
    </div>
  );
}
