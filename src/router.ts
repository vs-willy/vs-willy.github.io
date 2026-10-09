import { useSyncExternalStore } from "react";

// Маршруты на хэше: GitHub Pages отдает только index.html, поэтому #/projects надежнее путей
export type Route = { name: "home" } | { name: "projects" } | { name: "project"; slug: string } | { name: "books" } | { name: "lab" };

function parse(hash: string): Route {
  const h = hash.replace(/^#\/?/, "");
  if (h === "projects") return { name: "projects" };
  if (h === "books") return { name: "books" };
  if (h === "lab") return { name: "lab" };
  const m = h.match(/^projects\/([\w-]+)$/);
  if (m) return { name: "project", slug: m[1] };
  return { name: "home" };
}

let current = location.hash;
function subscribe(cb: () => void) {
  const on = () => {
    current = location.hash;
    cb();
  };
  window.addEventListener("hashchange", on);
  return () => window.removeEventListener("hashchange", on);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => current, () => "");
  return parse(hash);
}

export const href = {
  home: "#/",
  projects: "#/projects",
  books: "#/books",
  project: (slug: string) => `#/projects/${slug}`,
};
