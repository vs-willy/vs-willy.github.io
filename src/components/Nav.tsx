import { motion, useScroll, useSpring } from "motion/react";
import { contacts } from "../content";

const links = [
  { href: "#pix", label: "PIX Robotics" },
  { href: "#virtuum", label: "ВиртуумЛаб" },
  { href: "#hackathons", label: "Хакатоны" },
  { href: "#path", label: "Путь" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4">
      <nav className="relative mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 overflow-hidden rounded-full border border-line bg-bg/60 pl-5 pr-1.5 shadow-[inset_0_1px_0_oklch(1_0_0/0.06),0_10px_40px_oklch(0_0_0/0.35)] backdrop-blur-xl">
        <a href="#top" className="font-display text-[14px] font-semibold tracking-tight text-ink">
          ВИ
        </a>
        <ul className="hidden items-center gap-0.5 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 text-[14px] text-ink-2 transition hover:bg-surface-2 hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={contacts.telegram.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-bg transition hover:bg-accent active:scale-[0.97]"
        >
          Написать
        </a>
        <motion.span aria-hidden style={{ scaleX: progress }} className="absolute inset-x-6 bottom-0 h-px origin-left bg-accent" />
      </nav>
    </header>
  );
}
