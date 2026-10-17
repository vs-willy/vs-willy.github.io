// Аналитика посещений на GoatCounter: без cookie, считает уникальных посетителей и отсекает ботов.
// Не считаем: локальный сервер, автотесты (navigator.webdriver) и браузер владельца сайта.
// Владелец отключает подсчет себя ссылкой #/ignore-me, включает обратно ссылкой #/count-me.

const CODE = "vs-willy"; // адрес счетчика: https://vs-willy.goatcounter.com
const SKIP = "skipgc"; // этот ключ понимает и сам GoatCounter

type GC = { count: (v: { path: string; title?: string; event?: boolean }) => void };
declare global {
  interface Window {
    goatcounter?: GC & Record<string, unknown>;
  }
}

function skipped() {
  try {
    return localStorage.getItem(SKIP) === "t";
  } catch {
    return false;
  }
}

// Короткая плашка внизу экрана, чтобы владелец видел, что переключение сработало
function toast(text: string) {
  const el = document.createElement("div");
  el.textContent = text;
  el.style.cssText =
    "position:fixed;left:50%;top:20px;transform:translateX(-50%);z-index:60;padding:8px 14px;border-radius:999px;font:500 13px/1.3 system-ui,sans-serif;background:#111;color:#fff;box-shadow:0 6px 24px rgb(0 0 0/.2)";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// Служебные ссылки владельца: переключают подсчет и возвращают на главную
function handleOwnerLinks() {
  const h = location.hash;
  if (h !== "#/ignore-me" && h !== "#/count-me") return;
  const ignore = h === "#/ignore-me";
  try {
    if (ignore) localStorage.setItem(SKIP, "t");
    else localStorage.removeItem(SKIP);
  } catch {
    /* без хранилища переключить не выйдет */
  }
  history.replaceState(history.state, "", location.pathname + location.search + "#/");
  setTimeout(() => toast(ignore ? "Твои визиты больше не считаются в аналитике" : "Твои визиты снова считаются"), 300);
}

function currentPath() {
  const route = location.hash.replace(/^#/, "") || "/";
  const lang = new URLSearchParams(location.search).get("lang");
  return lang === "en" ? `${route} [en]` : route;
}

export function initAnalytics() {
  handleOwnerLinks();
  // ссылку могут вставить и в уже открытую вкладку, тогда страница не перезагружается
  window.addEventListener("hashchange", handleOwnerLinks);
  if (location.hostname !== `${CODE}.github.io`) return;
  if (navigator.webdriver) return;
  if (skipped()) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`;
  // страницы у нас на хэше, поэтому считаем сами: при загрузке и при каждом переходе
  s.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
  let last = "";
  const count = () => {
    const path = currentPath();
    if (path === last || skipped()) return;
    last = path;
    window.goatcounter?.count({ path, title: document.title });
  };
  s.onload = () => {
    count();
    window.addEventListener("hashchange", () => setTimeout(count, 0));
  };
  document.head.appendChild(s);
}
