import { useSyncExternalStore } from "react";

// Язык сайта. Выбирается так: ?lang=en в ссылке, потом сохраненный выбор, потом язык браузера.
// При переключении язык пишется в ссылку, чтобы ее можно было отправить уже на нужном языке.
export type Lang = "ru" | "en";

const RU_LIKE = ["ru", "uk", "be", "kk"];

function initial(): Lang {
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ru" || q === "en") return q;
    const saved = localStorage.getItem("lang");
    if (saved === "ru" || saved === "en") return saved;
  } catch {
    /* без хранилища решает браузер */
  }
  const nav = (navigator.language || "ru").slice(0, 2).toLowerCase();
  return RU_LIKE.includes(nav) ? "ru" : "en";
}

let current: Lang = initial();
const listeners = new Set<() => void>();

const TITLES: Record<Lang, string> = {
  ru: "Виталий Иванов - fullstack-разработчик",
  en: "Vitaly Ivanov - full stack developer",
};

function apply() {
  document.documentElement.lang = current;
  document.title = TITLES[current];
}
apply();

export function setLang(l: Lang) {
  if (l === current) return;
  current = l;
  try {
    localStorage.setItem("lang", l);
  } catch {
    /* не запомнится, но ссылка сохранит выбор */
  }
  const url = new URL(location.href);
  if (l === "en") url.searchParams.set("lang", "en");
  else url.searchParams.delete("lang");
  history.replaceState(history.state, "", url);
  apply();
  listeners.forEach((f) => f());
}

export const getLang = () => current;

export function useLang(): Lang {
  return useSyncExternalStore(
    (f) => {
      listeners.add(f);
      return () => listeners.delete(f);
    },
    () => current,
    () => "ru",
  );
}

// Короткий выбор текста по языку: t(lang, "Привет", "Hello")
export const t = <T,>(lang: Lang, ru: T, en: T): T => (lang === "en" ? en : ru);

// Хук для компонентов со множеством подписей: const L = useT(); L("Канвас", "Canvas")
export function useT() {
  const lang = useLang();
  return <T,>(ru: T, en: T): T => (lang === "en" ? en : ru);
}
