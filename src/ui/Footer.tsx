import { useEffect, useState } from "react";
import { Clock, GlobeHemisphereEast } from "@phosphor-icons/react";
import { contacts } from "../content";
import { href } from "../router";

function useMoscowTime() {
  const fmt = () => new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const linkCls = "relative pl-4 text-ink-2 transition hover:text-ink before:absolute before:left-0 before:top-1/2 before:h-px before:w-2.5 before:bg-line-strong";

export function Footer() {
  const time = useMoscowTime();
  return (
    <footer className="mt-24 border-t border-line pt-8 pb-32 text-[14px]">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        <div className="col-span-2 flex flex-col justify-between gap-6 sm:col-span-1">
          <div className="text-ink-2">© 2026 Виталий Иванов</div>
          <div className="space-y-2 font-mono text-[12px] text-ink-3">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>
                Москва, UTC+3
                <br />
                <span className="text-ink-2 tabular-nums">{time}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GlobeHemisphereEast size={16} />
              <span>
                55.7558° N
                <br />
                37.6173° E
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">Контакты</div>
          <ul className="mt-3 space-y-1.5 border-l border-line">
            <li><a className={linkCls} href={contacts.telegram.href} target="_blank" rel="noreferrer">Telegram ↗</a></li>
            <li><a className={linkCls} href={contacts.github.href} target="_blank" rel="noreferrer">GitHub ↗</a></li>
            <li><a className={linkCls} href={contacts.linkedin.href} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
            <li><a className={linkCls} href={contacts.email.href}>{contacts.email.label}</a></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">Разделы</div>
          <ul className="mt-3 space-y-1.5 border-l border-line">
            <li><a className={linkCls} href={href.home}>Главная</a></li>
            <li><a className={linkCls} href={href.projects}>Проекты</a></li>
            <li><a className={linkCls} href={href.books}>Книги</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
