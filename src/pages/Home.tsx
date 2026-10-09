import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { contacts, education, stack } from "../content";
import { books } from "../books";
import { sortedProjects } from "../projects";
import { href } from "../router";
import { sound } from "../sound";
import { Logo } from "../ui/Logo";
import { ShieldStar } from "@phosphor-icons/react";
import { Dither } from "../ui/Dither";
import { PortraitFx } from "../ui/PortraitFx";
import { ProjectRow } from "../ui/ProjectRow";
import { SectionLabel } from "../ui/Section";
import { Shelf } from "../ui/Shelf";
import { Weather } from "../ui/Weather";
import { nb } from "../typo";

// Сменяющийся чип: ширина подстраивается под слово, у каждого слова свой цвет
const roles = [
  { text: "canvas-редактор", hue: 42 },
  { text: "дизайн-систему", hue: 285 },
  { text: "e2e-тесты", hue: 150 },
  { text: "бэкенд на C#", hue: 250 },
];

function Rotating() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);
  const r = roles[i];
  return (
    <motion.span
      layout
      transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className="inline-flex overflow-hidden rounded-[6px] px-1.5 align-baseline"
      style={{ backgroundColor: `oklch(0.66 0.16 ${r.hue} / 0.14)`, color: `oklch(0.52 0.16 ${r.hue})` }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={r.text}
          layout="position"
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
          className="whitespace-nowrap"
        >
          {r.text}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

const experience: { company: string; role: string; years: string; logo?: "pix" | "virtuum"; site?: string; muted?: boolean }[] = [
  { company: "PIX Robotics", role: "Middle Fullstack-разработчик", years: "2024 - сейчас", logo: "pix", site: "https://pixrobotics.com" },
  { company: "PIX Robotics", role: "Junior Fullstack-разработчик", years: "2023 - 2024", logo: "pix", site: "https://pixrobotics.com" },
  { company: "Срочная служба", role: "армия", years: "2022 - 2023", muted: true },
  { company: "ВиртуумЛаб", role: "Инженер-программист", years: "2021 - 2022", logo: "virtuum", site: "https://virtuumlab.ru" },
];

function Tile({ to, title, note, art }: { to: string; title: string; note: string; art: string }) {
  return (
    <a
      href={to}
      onMouseEnter={sound.hover}
      onClick={sound.click}
      className="group flex flex-col items-center gap-3 border-line px-2 py-6 text-center transition hover:bg-surface-2 [&:not(:last-child)]:border-r"
    >
      <Dither svg={art} cols={36} rows={24} label="" className="h-12 w-[72px] transition group-hover:-translate-y-0.5" />
      <span>
        <span className="block font-medium">{title}</span>
        <span className="mt-0.5 block text-[13px] text-ink-3">{note}</span>
      </span>
    </a>
  );
}

const tileArt = {
  projects: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 48"><rect width="72" height="48" fill="#fff"/><rect x="10" y="10" width="40" height="30" rx="4" fill="#bbb" stroke="#111" stroke-width="2"/><rect x="18" y="6" width="44" height="32" rx="4" fill="#eee" stroke="#111" stroke-width="2"/><path d="M26 18h26M26 24h18M26 30h22" stroke="#555" stroke-width="2"/></svg>`,
  hack: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 48"><rect width="72" height="48" fill="#fff"/><path d="M24 6h24v10a12 12 0 0 1-24 0z" fill="#999" stroke="#111" stroke-width="2"/><path d="M24 9h-6a6 6 0 0 0 6 8M48 9h6a6 6 0 0 1-6 8" fill="none" stroke="#111" stroke-width="2"/><rect x="33" y="28" width="6" height="8" fill="#555"/><rect x="26" y="36" width="20" height="6" rx="1" fill="#333"/></svg>`,
  books: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 48"><rect width="72" height="48" fill="#fff"/><rect x="14" y="8" width="9" height="32" fill="#444" stroke="#111"/><rect x="24" y="12" width="8" height="28" fill="#aaa" stroke="#111"/><rect x="33" y="6" width="10" height="34" fill="#666" stroke="#111"/><rect x="44" y="10" width="8" height="30" fill="#ccc" stroke="#111" transform="rotate(8 48 40)"/><rect x="10" y="40" width="52" height="3" fill="#222"/></svg>`,
};

export function Home() {
  const hackCount = sortedProjects.filter((p) => p.company === "Хакатон").length;
  return (
    <div className="fade-up">
      <header className="grid gap-8 sm:grid-cols-[1fr_230px] sm:gap-8">
        <div>
          <h1 className="text-[17px] font-semibold">Виталий Иванов</h1>
          <div className="mt-1.5 h-5 text-[13px] text-ink-3">
            <Weather />
          </div>
          <div className="mt-5 space-y-4 leading-[1.65] text-ink-2">
            <p>
              Я fullstack-разработчик с упором во фронт. Сейчас в PIX Robotics отвечаю <span className="whitespace-nowrap">за <Rotating /></span>
            </p>
            <p>{nb("Пишу на React и TypeScript, а когда браузера не хватает, сам делаю бэкенд на C#/.NET. Больше всего люблю сложные интерфейсы, где важны архитектура и скорость.")}</p>
            <p>{nb("Ищу команду с редакторами, графами или внутренними инструментами. Москва, офис или гибрид, а также удаленка и релокация.")}</p>
            <p>
              Пишите в{"\u00A0"}
              <a className="link text-ink" href={contacts.telegram.href} target="_blank" rel="noreferrer">
                Telegram ↗
              </a>
              , смотрите{" "}
              <a className="link text-ink" href={contacts.github.href} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>{" "}
              или на{"\u00A0"}почту{" "}
              <a className="link text-ink" href={contacts.email.href}>
                {contacts.email.label}
              </a>
            </p>
          </div>
        </div>
        <PortraitFx
          fx="repel"
          label="Портрет Виталия, нарисованный точками"
          className="aspect-square w-full max-w-[240px] max-sm:mx-auto max-sm:max-w-[220px]"
        />
      </header>

      <nav aria-label="Разделы" className="-mx-4 mt-12 grid grid-cols-3 border-y border-line sm:-mx-6">
        <Tile to={href.projects} title="Проекты" note={`${sortedProjects.length} кейсов`} art={tileArt.projects} />
        <Tile to={href.projects} title="Хакатоны" note={`${hackCount} призовых места`} art={tileArt.hack} />
        <Tile to={href.books} title="Книги" note={books.length ? `${books.length} книг` : "скоро"} art={tileArt.books} />
      </nav>

      <section className="section">
        <SectionLabel n="01">Опыт</SectionLabel>
        <ul className="mt-4">
          {experience.map((e) => (
            <li key={e.years} className="flex items-start gap-3 py-2.5">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[7px] border border-line bg-surface text-ink">
                {e.logo ? <Logo name={e.logo} className={e.logo === "pix" ? "h-3.5 w-5" : "h-5 w-3"} /> : <ShieldStar size={16} weight="duotone" className="text-ink-2" />}
              </span>
              <div className="min-w-0">
                {e.site ? (
                  <a href={e.site} target="_blank" rel="noreferrer" className="link font-medium no-underline hover:underline">
                    {e.company} <span className="text-ink-3">↗</span>
                  </a>
                ) : (
                  <div className={`font-medium ${e.muted ? "text-ink-2" : ""}`}>{e.company}</div>
                )}
                <div className="text-[13.5px] text-ink-3">{nb(e.role)}</div>
              </div>
              <span aria-hidden className="leader mx-1! mt-[13px]!" />
              <div className="mt-0.5 shrink-0 font-mono text-[12.5px] text-ink-3 tabular-nums">{e.years}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <SectionLabel
          n="02"
          aside={
            <a href={href.projects} onMouseEnter={sound.hover} onClick={sound.click} className="text-[13.5px] text-ink-2 transition hover:text-ink">
              Все проекты
            </a>
          }
        >
          Проекты
        </SectionLabel>
        <ul className="mt-4">
          {sortedProjects.slice(0, 6).map((p) => (
            <ProjectRow key={p.slug} p={p} />
          ))}
        </ul>
      </section>

      <section className="section">
        <SectionLabel n="03">Стек</SectionLabel>
        <div className="mt-5 space-y-4">
          {stack.map((g) => (
            <div key={g.group} className="grid gap-2 sm:grid-cols-[150px_1fr]">
              <div className="text-[13.5px] text-ink-3">{g.group}</div>
              <div className="text-ink-2">{g.items.join(", ")}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionLabel n="04">Учеба</SectionLabel>
        <ul className="mt-4">
          {education.map((e) => (
            <li key={e.title} className="flex items-start gap-3 py-2.5">
              <div className="min-w-0">
                <div className="font-medium">{nb(e.title)}</div>
                <div className="text-[13.5px] text-ink-3">{nb(e.detail)}</div>
              </div>
              <span aria-hidden className="leader mx-1! mt-[13px]!" />
              <div className="mt-0.5 shrink-0 font-mono text-[12.5px] text-ink-3 tabular-nums">{e.years}</div>
            </li>
          ))}
        </ul>
      </section>

      {books.length > 0 && (
        <section className="section">
          <SectionLabel n="05">Книги</SectionLabel>
          <p className="mt-4 text-[14.5px] text-ink-2">{nb("Книги, которые мне понравились и которые я советую.")}</p>
          <div className="mt-6">
            <Shelf />
          </div>
        </section>
      )}
    </div>
  );
}
