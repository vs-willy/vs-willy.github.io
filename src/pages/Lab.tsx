import { PortraitFx, type Fx } from "../ui/PortraitFx";

// Скрытая страница для выбора эффекта портрета, в навигации ее нет
const variants: { fx: Fx; title: string; note: string }[] = [
  { fx: "repel", title: "1. Отталкивание", note: "Точки разбегаются от курсора и пружинят обратно." },
  { fx: "relief", title: "2. Голограмма", note: "Портрет как рельеф из точек, наклоняется за курсором." },
  { fx: "color", title: "3. Цвет", note: "Под курсором проявляется настоящее фото." },
];

export function Lab() {
  return (
    <div className="fade-up">
      <h1 className="text-[22px] font-semibold tracking-tight">Эффекты портрета</h1>
      <p className="mt-2 text-ink-2">Поводи курсором по каждому, на телефоне можно пальцем.</p>
      <div className="mt-10 space-y-14">
        {variants.map((v) => (
          <section key={v.fx}>
            <div className="font-medium">{v.title}</div>
            <div className="text-[13.5px] text-ink-3">{v.note}</div>
            <PortraitFx fx={v.fx} label={v.title} className="mt-4 aspect-square w-full max-w-[300px] touch-none" />
          </section>
        ))}
      </div>
    </div>
  );
}
