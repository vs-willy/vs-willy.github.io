import { animate } from "motion";

// Плавный переход по якорным ссылкам (#canvas, #work и т.д.).
// Длительность зависит от расстояния; если человек сам крутит колесо или касается экрана, анимация останавливается.

const NAV_OFFSET = 88; // высота плавающей шапки с запасом

let current: ReturnType<typeof animate> | null = null;

function stop() {
  current?.stop();
  current = null;
}

export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.slice(1));
  const target = id === "top" ? document.body : document.getElementById(id);
  if (!target) return false;

  const from = window.scrollY;
  // Секция может задать свой отступ (прилипающему кейсу шапка не мешает)
  const offset = Number(target.dataset.anchorOffset ?? NAV_OFFSET);
  const to = id === "top" ? 0 : Math.max(0, target.getBoundingClientRect().top + from - offset);
  const distance = Math.abs(to - from);

  stop();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || distance < 2) {
    window.scrollTo(0, to);
    return true;
  }

  const duration = Math.min(1.6, Math.max(0.6, distance / 2600));
  current = animate(from, to, {
    duration,
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (v) => window.scrollTo(0, v),
    onComplete: () => {
      current = null;
    },
  });
  return true;
}

export function initSmoothAnchors() {
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest?.("a[href^='#']");
    if (!link) return;
    const hash = link.getAttribute("href") ?? "";
    if (hash.length < 2) return;
    if (scrollToHash(hash)) {
      e.preventDefault();
      history.pushState(null, "", hash === "#top" ? location.pathname : hash);
    }
  });

  // Пользователь перехватил управление: не тянем страницу дальше
  for (const type of ["wheel", "touchstart", "keydown"] as const) {
    window.addEventListener(type, stop, { passive: true });
  }

  // Открыли сайт сразу со ссылкой на раздел: доезжаем после первой отрисовки
  if (location.hash.length > 1) {
    requestAnimationFrame(() => setTimeout(() => scrollToHash(location.hash), 300));
  }
}
