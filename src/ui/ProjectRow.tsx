import type { Project } from "../projects";
import { href } from "../router";
import { sound } from "../sound";
import { Dither } from "./Dither";
import { Logo, logoSrc } from "./Logo";

// Миниатюра проекта: логотип места, где он сделан, в точечном стиле
export function ProjectThumb({ p, big }: { p: Project; big?: boolean }) {
  const wide = p.logo === "robozon";
  return (
    <Dither
      src={logoSrc(p.logo)}
      fit={big ? (wide ? 0.62 : 0.42) : wide ? 0.82 : 0.6}
      cols={big ? 140 : 40}
      rows={big ? 88 : 25}
      label={`Логотип: ${p.company}`}
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
        <span className="grid h-10 w-16 shrink-0 place-items-center rounded-[6px] border border-line bg-surface text-ink transition group-hover:text-accent-ink">
          <Logo name={p.logo} className={p.logo === "robozon" ? "h-3 w-12" : p.logo === "pix" ? "h-3.5 w-6" : p.logo === "virtuum" ? "h-5 w-3" : "h-5 w-7"} />
        </span>
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
