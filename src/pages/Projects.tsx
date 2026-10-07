import { useState } from "react";
import { sortedProjects, type Company } from "../projects";
import { sound } from "../sound";
import { ProjectRow } from "../ui/ProjectRow";

const filters: ("Все" | Company)[] = ["Все", "PIX Robotics", "ВиртуумЛаб", "Хакатон"];
const filterLabel = (f: string) => (f === "Хакатон" ? "Хакатоны" : f);

// Все проекты с фильтром по месту работы, сгруппированы по году
export function Projects() {
  const [f, setF] = useState<(typeof filters)[number]>("Все");
  const list = sortedProjects.filter((p) => f === "Все" || p.company === f);
  const groups = new Map<string, typeof list>();
  for (const p of list) {
    const y = String(p.sort).slice(0, 4);
    groups.set(y, [...(groups.get(y) ?? []), p]);
  }
  return (
    <div className="fade-up">
      <h1 className="text-[22px] font-semibold tracking-tight">Проекты</h1>
      <p className="mt-2 text-ink-2">Работа в компаниях и на хакатонах. У каждого проекта своя страница с подробностями.</p>
      <div role="group" aria-label="Фильтр" className="mt-6 flex flex-wrap gap-1.5">
        {filters.map((x) => (
          <button
            key={x}
            type="button"
            aria-pressed={f === x}
            onMouseEnter={sound.hover}
            onClick={() => {
              sound.click();
              setF(x);
            }}
            className={`rounded-full border px-3 py-1 text-[13.5px] transition active:scale-95 ${f === x ? "border-ink bg-ink text-bg" : "border-line-strong text-ink-2 hover:text-ink"}`}
          >
            {filterLabel(x)}
          </button>
        ))}
      </div>
      {[...groups].map(([year, items]) => (
        <section key={year} className="mt-10">
          <h2 className="font-mono text-[12.5px] text-ink-3">{year}</h2>
          <ul className="mt-2 border-t border-line">
            {items.map((p) => (
              <ProjectRow key={p.slug} p={p} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
