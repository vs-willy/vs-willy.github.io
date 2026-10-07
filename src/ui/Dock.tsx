import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { Books, FolderSimple, House, Moon, SpeakerHigh, SpeakerSlash, Sun, TelegramLogo } from "@phosphor-icons/react";
import { contacts } from "../content";
import { href, useRoute } from "../router";
import { sound } from "../sound";

// Плавающий док внизу, как на cali.so. Наведение и клик со звуком, звук и тему можно переключить
function Item({ label, active, children, ...rest }: { label: string; active?: boolean; children: ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls =
    "group relative grid h-10 w-10 place-items-center rounded-full text-ink-2 transition hover:bg-surface-2 hover:text-ink active:scale-90";
  const inner = (
    <>
      {children}
      {active && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-ink" />}
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[12px] text-bg opacity-0 transition group-hover:opacity-100">
        {label}
      </span>
    </>
  );
  const common = { "aria-label": label, className: cls, onMouseEnter: sound.hover, onFocus: sound.hover };
  if ("href" in rest && rest.href) {
    return (
      <a {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} {...common} onClick={sound.click}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} {...common}>
      {inner}
    </button>
  );
}

export function Dock() {
  const route = useRoute();
  const soundOn = useSyncExternalStore(sound.subscribe, sound.isOn, () => true);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "light");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* не запомнится */
    }
  }, [theme]);

  const sep = <span aria-hidden className="mx-1 h-5 w-px bg-line-strong" />;
  return (
    <nav
      aria-label="Навигация"
      className="fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-1/2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-line bg-surface/85 p-1.5 shadow-[var(--shadow)] backdrop-blur-md"
    >
      <Item label="Главная" href={href.home} active={route.name === "home"}>
        <House size={18} />
      </Item>
      {sep}
      <Item label="Проекты" href={href.projects} active={route.name === "projects" || route.name === "project"}>
        <FolderSimple size={18} />
      </Item>
      <Item label="Книги" href={href.books} active={route.name === "books"}>
        <Books size={18} />
      </Item>
      <Item label="Написать в Telegram" href={contacts.telegram.href} target="_blank" rel="noreferrer">
        <TelegramLogo size={18} />
      </Item>
      {sep}
      <Item
        label={soundOn ? "Выключить звук" : "Включить звук"}
        onClick={() => {
          sound.set(!soundOn);
          if (!soundOn) setTimeout(sound.toggle, 0);
        }}
      >
        {soundOn ? <SpeakerHigh size={18} /> : <SpeakerSlash size={18} />}
      </Item>
      <Item
        label={theme === "dark" ? "Светлая тема" : "Темная тема"}
        onClick={() => {
          sound.toggle();
          setTheme((t) => (t === "dark" ? "light" : "dark"));
        }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </Item>
    </nav>
  );
}
