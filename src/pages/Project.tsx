import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { articles, readingMinutes, type Block } from "../articles";
import { sortedProjects, type DiagramKey, type Project as P } from "../projects";
import { href } from "../router";
import { sound } from "../sound";
import { Code, Compare, Figure, Flow, Note, Quote, Rich, Stats, Timeline } from "../ui/ArticleBlocks";
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

const sid = (i: number) => `s-${i}`;

function minutesLabel(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  const word = m10 === 1 && m100 !== 11 ? "минута" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? "минуты" : "минут";
  return `${n} ${word}`;
}

function BlockView({ b, index }: { b: Block; index: number }) {
  if ("h" in b)
    return (
      <h2 id={sid(index)} className="mt-12 scroll-mt-24 text-[18px] font-semibold tracking-tight first:mt-0">
        {b.h}
      </h2>
    );
  if ("p" in b)
    return (
      <p className="mt-4 leading-[1.75] text-ink-2">
        <Rich text={b.p} />
      </p>
    );
  if ("list" in b)
    return (
      <ul className="mt-4 space-y-1.5">
        {b.list.map((it) => (
          <li key={it} className="flex gap-2.5 leading-[1.6] text-ink-2">
            <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-ink-3" />
            <span>
              <Rich text={it} />
            </span>
          </li>
        ))}
      </ul>
    );
  if ("quote" in b) return <Quote text={b.quote} />;
  if ("note" in b) return <Note text={b.note} />;
  if ("figure" in b)
    return (
      <Figure caption={b.caption}>
        <div className="overflow-x-auto">
          <div className="min-w-[440px]">{diagrams[b.figure]()}</div>
        </div>
      </Figure>
    );
  if ("flow" in b)
    return (
      <Figure caption={b.caption}>
        <Flow steps={b.flow} />
      </Figure>
    );
  if ("compare" in b)
    return (
      <Figure caption={b.caption} bare>
        <Compare sides={b.compare} />
      </Figure>
    );
  if ("timeline" in b)
    return (
      <Figure caption={b.caption}>
        <Timeline items={b.timeline} />
      </Figure>
    );
  if ("stats" in b) return <Stats items={b.stats} />;
  if ("code" in b)
    return (
      <Figure caption={b.caption} bare>
        <Code code={b.code} />
      </Figure>
    );
  return null;
}

// Оглавление сбоку на широком экране, подсвечивает раздел, который сейчас читают
function Toc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  // через портал: у статьи анимация на transform, внутри нее fixed крепился бы к статье, а не к окну
  return createPortal(
    <nav aria-label="Содержание" className="fixed top-28 hidden w-[170px] xl:block" style={{ left: "calc(50% - 320px - 210px)" }}>
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">Содержание</div>
      <ul className="mt-3 space-y-1.5 border-l border-line">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`-ml-px block border-l py-0.5 pl-3 text-[13px] leading-snug transition ${active === i.id ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink-2"}`}
            >
              {i.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>,
    document.body,
  );
}

function Meta({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-3.5 sm:grid-cols-4">
      {items.map((m) => (
        <div key={m.k} className="min-w-0">
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">{m.k}</dt>
          <dd className="mt-0.5 text-[13px] leading-snug text-ink">{m.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Related({ p }: { p: P }) {
  const list = sortedProjects.filter((x) => x.slug !== p.slug && x.company === p.company).slice(0, 3);
  if (!list.length) return null;
  return (
    <section className="mt-14">
      <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">{p.company === "Хакатон" ? "Другие хакатоны" : `Еще в ${p.company}`}</h2>
      <ul className="mt-3">
        {list.map((x) => (
          <li key={x.slug}>
            <a href={href.project(x.slug)} onMouseEnter={sound.hover} onClick={sound.click} className="group flex items-center gap-3 py-1.5">
              <span className="min-w-0 truncate font-medium text-ink transition group-hover:text-accent-ink">{x.title}</span>
              <span aria-hidden className="leader max-sm:hidden" />
              <span className="ml-auto shrink-0 font-mono text-[12.5px] text-ink-3">{x.date}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

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
  const a = articles[p.slug];
  const next = sortedProjects[(i + 1) % sortedProjects.length];
  const toc = a ? a.blocks.flatMap((b, k) => ("h" in b ? [{ id: sid(k), title: b.h }] : [])) : [];

  return (
    <article className="fade-up" key={p.slug}>
      <a href={href.projects} onMouseEnter={sound.hover} onClick={sound.click} className="inline-flex items-center gap-1.5 text-[13.5px] text-ink-3 transition hover:text-ink">
        <ArrowLeft size={14} /> Все проекты
      </a>
      <div className="mt-6">
        <ProjectThumb p={p} big />
      </div>
      <h1 className="mt-7 text-[26px] font-semibold leading-tight tracking-tight">{p.title}</h1>

      {a ? (
        <>
          <Meta
            items={[
              { k: "Где", v: p.company },
              { k: "Когда", v: a.duration },
              { k: "Роль", v: a.role },
              { k: "Чтение", v: minutesLabel(readingMinutes(a)) },
            ]}
          />
          <p className="mt-6 text-[17px] leading-[1.65] text-ink">{a.lead}</p>
          <div className="mt-3 text-[13px] text-ink-3">Команда: {a.team}</div>
          {toc.length > 2 && <Toc items={toc} />}
          <div className="mt-10">
            {a.blocks.map((b, k) => (
              <BlockView key={k} b={b} index={k} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mt-2 font-mono text-[12.5px] text-ink-3">
            {p.company} · {p.date}
          </div>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{p.summary}</p>
          <div className="mt-10 space-y-10">
            {p.sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-[17px] font-semibold">{s.title}</h2>
                <p className="mt-2 leading-[1.7] text-ink-2">{s.text}</p>
              </section>
            ))}
          </div>
        </>
      )}

      <section className="mt-14 border-t border-line pt-6">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">Стек</h2>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <li key={s} className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-[12px] text-ink-2">
              {s}
            </li>
          ))}
        </ul>
        {a?.links && (
          <ul className="mt-5 space-y-1">
            {a.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1 text-[14px] text-ink">
                  {l.label} <ArrowUpRight size={12} className="text-ink-3" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Related p={p} />

      <a
        href={href.project(next.slug)}
        onMouseEnter={sound.hover}
        onClick={sound.click}
        className="group mt-12 flex items-center justify-between gap-4 border-y border-line py-5"
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
