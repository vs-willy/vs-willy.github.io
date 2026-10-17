import { books } from "../books";
import { Shelf } from "../ui/Shelf";
import { t, useLang } from "../i18n";

export function Books() {
  const lang = useLang();
  return (
    <div className="fade-up">
      <h1 className="text-[22px] font-semibold tracking-tight">{t(lang, "Книги", "Books")}</h1>
      <p className="mt-2 text-ink-2">{t(lang, "Книги, которые мне понравились и которые я советую.", "Books I enjoyed and recommend.")}</p>
      <div className="mt-10">
        {books.length ? (
          <Shelf />
        ) : (
          <div className="rounded-[10px] border border-dashed border-line-strong px-6 py-12 text-center text-ink-3">{t(lang, "Полка собирается, скоро здесь появятся книги.", "The shelf is coming soon.")}</div>
        )}
      </div>
    </div>
  );
}
