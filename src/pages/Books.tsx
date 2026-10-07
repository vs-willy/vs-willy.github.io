import { books } from "../books";
import { Shelf } from "../ui/Shelf";

export function Books() {
  return (
    <div className="fade-up">
      <h1 className="text-[22px] font-semibold tracking-tight">Книги</h1>
      <p className="mt-2 text-ink-2">Книги, которые повлияли на то, как я пишу код и думаю о продуктах.</p>
      <div className="mt-10">
        {books.length ? (
          <Shelf />
        ) : (
          <div className="rounded-[10px] border border-dashed border-line-strong px-6 py-12 text-center text-ink-3">Полка собирается, скоро здесь появятся книги.</div>
        )}
      </div>
    </div>
  );
}
