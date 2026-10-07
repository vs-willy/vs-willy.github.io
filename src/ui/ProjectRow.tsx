import { useMemo } from "react";
import type { Project } from "../projects";
import { href } from "../router";
import { sound } from "../sound";
import { thumbArt } from "./art";
import { Dither } from "./Dither";
import { iconPaths } from "./Icons";

export function ProjectThumb({ p, big }: { p: Project; big?: boolean }) {
  const svg = useMemo(() => thumbArt(iconPaths(p.icon)), [p.icon]);
  return (
    <Dither
      svg={svg}
      cols={big ? 64 : 32}
      rows={big ? 40 : 20}
      label={`Иллюстрация к проекту ${p.title}`}
      className={big ? "aspect-[8/5] w-full rounded-[10px] border border-line bg-surface" : "h-10 w-16 shrink-0 rounded-[6px] border border-line bg-surface"}
    />
  );
}

// Строка проекта как строка статьи на cali.so: миниатюра, название, точки, дата
export function ProjectRow({ p }: { p: Project }) {
  return (
    <li>
      <a
        href={href.project(p.slug)}
        onMouseEnter={sound.hover}
        onClick={sound.click}
        className="group flex items-center gap-3 border-b border-line py-3 transition"
      >
        <ProjectThumb p={p} />
        <span className="min-w-0">
          <span className="block truncate font-medium text-ink transition group-hover:text-accent-ink">{p.title}</span>
          <span className="block truncate text-[13px] text-ink-3">{p.company}</span>
        </span>
        <span aria-hidden className="leader max-sm:hidden" />
        <span className="ml-auto shrink-0 font-mono text-[12.5px] text-ink-3 tabular-nums">{p.date}</span>
      </a>
    </li>
  );
}
