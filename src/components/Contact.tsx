import { ArrowUpRight, EnvelopeSimple, GithubLogo, LinkedinLogo, TelegramLogo } from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { contacts } from "../content";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";

type ContactItem = { name: string; label: string; href: string; Icon: PhosphorIcon };

const items: ContactItem[] = [
  { name: "Почта", ...contacts.email, Icon: EnvelopeSimple },
  { name: "GitHub", ...contacts.github, Icon: GithubLogo },
  { name: "LinkedIn", ...contacts.linkedin, Icon: LinkedinLogo },
];

export function Contact() {
  return (
    <footer id="contact" className="relative isolate overflow-hidden border-t border-line">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:pt-36">
        <Reveal>
          <h2 className="max-w-[14ch] font-display text-[clamp(2.4rem,6.5vw,6rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
            Ищу команду со сложными <span className="text-accent">интерфейсами</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal delay={0.08}>
            <p className="max-w-[52ch] text-[17px] leading-relaxed text-ink-2">
              Редакторы, графы, внутренние инструменты, дизайн-системы. Люблю вести задачу целиком: если фиче нужен бэкенд, делаю его сам. Москва, офис или гибрид, а также удаленка и релокация.
            </p>
            <ul className="mt-10 flex flex-wrap gap-3">
              {items.map(({ name, label, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong px-4 py-2.5 text-[15px] text-ink transition hover:border-accent hover:text-accent"
                  >
                    <Icon size={18} />
                    <span className="sr-only">{name}: </span>
                    {label}
                    <ArrowUpRight size={14} className="text-ink-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Magnetic>
            <a
              href={contacts.telegram.href}
              target="_blank"
              rel="noreferrer"
              className="group grid h-44 w-44 place-items-center rounded-full bg-accent text-center text-[oklch(0.18_0.02_40)] shadow-[0_0_60px_oklch(0.72_0.19_42/0.35)] transition hover:shadow-[0_0_90px_oklch(0.72_0.19_42/0.55)] active:scale-[0.97] sm:h-52 sm:w-52"
            >
              <span>
                <TelegramLogo size={30} weight="fill" className="mx-auto transition group-hover:-rotate-12" />
                <span className="mt-2 block text-[17px] font-semibold">Написать</span>
                <span className="block font-mono text-[12px] opacity-75">{contacts.telegram.label}</span>
              </span>
            </a>
          </Magnetic>
        </div>

        <div className="mt-24 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[13px] text-ink-3">
          <span>Виталий Иванов, 2026</span>
          <a href="#top" className="transition hover:text-ink">
            Наверх
          </a>
        </div>
      </div>
    </footer>
  );
}
