import { useState } from "react";
import { books } from "../books";
import { sound } from "../sound";

// Полка как на cali.so: каждая книга это 3D-блок. Закрытая повернута к нам корешком,
// выбранная разворачивается обложкой, а соседи сдвигаются за счет ширины ячейки.
const H = 210; // высота книги
const SPINE = 28; // толщина корешка
const base = import.meta.env.BASE_URL;

export function Shelf() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const b = books[active];
  if (!b) return null;
  return (
    <div className="room-shelf">
      <ul className="relative z-[2] -mb-[3px] flex items-end gap-px overflow-hidden px-1 pt-2" style={{ height: H + 8 }} aria-label="Книжная полка">
        {books.map((book, i) => {
          const open = i === active;
          const w = Math.round(H * book.ratio);
          return (
            <li key={book.title} className="book-frame" style={{ width: open ? w : SPINE, height: H }}>
              <span className="book-shadow" style={{ width: open ? w : SPINE }} aria-hidden />
              <button
                type="button"
                className="book"
                data-hover={hover === i && !open ? "" : undefined}
                aria-pressed={open}
                aria-label={`${book.title}, ${book.author}`}
                onClick={() => {
                  if (!open) sound.click();
                  setActive(i);
                }}
                onMouseEnter={() => {
                  setHover(i);
                  if (!open) sound.hover();
                }}
                onMouseLeave={() => setHover(null)}
              >
                <span className="book-inner" style={{ width: w, transform: `rotateY(${open ? 0 : 90}deg)` }}>
                  <span className="book-cover" style={{ transform: `translateZ(${SPINE}px)` }}>
                    <img src={`${base}books/${book.cover}`} alt="" width={w} height={H} loading="lazy" decoding="async" />
                  </span>
                  <span className="book-spine" style={{ width: SPINE, background: book.color, color: book.ink }}>
                    <span className="book-spine-title">{book.title}</span>
                    <span className="book-spine-author">{book.initials}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <span className="room-shelf-plank" aria-hidden />
      <p className="mt-3 text-center text-[13.5px] text-ink-2">
        <a href={b.url} target="_blank" rel="noreferrer" className="link">
          {b.title}
        </a>
        <span className="text-ink-3"> · {b.author}</span>
        {b.note && <span className="block text-ink-3">{b.note}</span>}
      </p>
    </div>
  );
}
