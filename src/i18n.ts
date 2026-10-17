import { useSyncExternalStore } from "react";

// Язык сайта. Порядок выбора: ?lang= в ссылке, потом ручной выбор из дока, потом языки браузера.
// При переключении язык пишется в ссылку, чтобы ее можно было отправить уже на нужном языке.
export type Lang = "ru" | "en";

// Если в списке браузера нет ни русского, ни английского, русский получают близкие языки
const RU_NEAR = ["uk", "be", "kk"];

// Браузер отдает языки в порядке предпочтения пользователя (настройка «Языки»):
// берем первый, который есть на сайте
export function browserLang(list: readonly string[] = navigator.languages?.length ? navigator.languages : [navigator.language || "ru"]): Lang {
  const codes = list.map((l) => l.slice(0, 2).toLowerCase());
  for (const c of codes) {
    if (c === "ru" || c === "en") return c;
  }
  return codes.some((c) => RU_NEAR.includes(c)) ? "ru" : "en";
}

function initial(): Lang {
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ru" || q === "en") return q;
    // сохраняется только ручной выбор из дока, автоматический не запоминаем
    const saved = localStorage.getItem("lang");
    if (saved === "ru" || saved === "en") return saved;
  } catch {
    /* без хранилища решает браузер */
  }
  return browserLang();
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
