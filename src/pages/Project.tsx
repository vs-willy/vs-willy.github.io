import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { sortedProjects, type DiagramKey } from "../projects";
import { href } from "../router";
import { sound } from "../sound";
import { CommandsVisual, FacadeVisual, HandlesVisual, ListenersVisual } from "../ui/CanvasVisuals";
import { DesignSystemDiagram, KkmDiagram } from "../ui/Diagrams";
import { ProjectThumb } from "../ui/ProjectRow";

const diagrams: Record<DiagramKey, () => React.ReactNode> = {
  commands: () => <CommandsVisual />,
  listeners: () => <ListenersVisual />,
  facade: () => <FacadeVisual />,
  handles: () => <HandlesVisual />,
  designSystem: () => <DesignSystemDiagram />,
  kkm: () => <KkmDiagram />,
};

export function Project({ slug }: { slug: string }) {
  const i = sortedProjects.findIndex((p) => p.slug === slug);
  const p = sortedProjects[i];
  if (!p) {
    return (
      <div className="fade-up">
        <p className="text-ink-2">Такого проекта нет.</p>
        <a className="link mt-3 inline-block" href={href.projects}>
          Все проекты
        </a>
      </div>
    );
  }
  const next = sortedProjects[(i + 1) % sortedProjects.length];
  return (
    <article className="fade-up" key={p.slug}>
      <a href={href.projects} onMouseEnter={sound.hover} onClick={sound.click} className="inline-flex items-center gap-1.5 text-[13.5px] text-ink-3 transition hover:text-ink">
        <ArrowLeft size={14} /> Все проекты
      </a>
      <div className="mt-6">
        <ProjectThumb p={p} big />
      </div>
      <div className="mt-6 font-mono text-[12.5px] text-ink-3">
        {p.company} · {p.date}
      </div>
      <h1 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight">{p.title}</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{p.summary}</p>
      {p.result && (
        <div className="mt-6 border-l-2 border-accent pl-4 text-ink">
          <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">Итог</div>
          <div className="mt-1">{p.result}</div>
        </div>
      )}
      <ul className="mt-6 flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <li key={s} className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-[12px] text-ink-2">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-10 space-y-10">
        {p.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-[17px] font-semibold">{s.title}</h2>
            <p className="mt-2 leading-[1.7] text-ink-2">{s.text}</p>
            {s.diagram && (
              <figure className="mt-5 overflow-x-auto rounded-[10px] border border-line bg-surface p-3 sm:p-4">
                <div className="min-w-[440px]">{diagrams[s.diagram]()}</div>
              </figure>
            )}
          </section>
        ))}
      </div>
      <a
        href={href.project(next.slug)}
        onMouseEnter={sound.hover}
        onClick={sound.click}
        className="group mt-16 flex items-center justify-between gap-4 border-y border-line py-5"
      >
        <span>
          <span className="block font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">Следующий проект</span>
          <span className="mt-1 block font-medium transition group-hover:text-accent-ink">{next.title}</span>
        </span>
        <ArrowRight size={18} className="shrink-0 text-ink-3 transition group-hover:translate-x-1 group-hover:text-ink" />
      </a>
    </article>
  );
}
