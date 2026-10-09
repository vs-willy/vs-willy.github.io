import { useEffect } from "react";
import { Books } from "./pages/Books";
import { Home } from "./pages/Home";
import { Lab } from "./pages/Lab";
import { Project } from "./pages/Project";
import { Projects } from "./pages/Projects";
import { useRoute } from "./router";
import { Dock } from "./ui/Dock";
import { Footer } from "./ui/Footer";

// Узкая колонка с пунктирными направляющими по краям, страницы переключаются по хэшу
export function App() {
  const route = useRoute();
  const key = route.name === "project" ? `p-${route.slug}` : route.name;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);

  return (
    <>
      <div className="guides mx-auto max-w-[640px]">
        <main className="px-4 pt-14 sm:px-6 sm:pt-20" key={key}>
          {route.name === "home" && <Home />}
          {route.name === "projects" && <Projects />}
          {route.name === "project" && <Project slug={route.slug} />}
          {route.name === "books" && <Books />}
          {route.name === "lab" && <Lab />}
        </main>
        <div className="px-4 sm:px-6">
          <Footer />
        </div>
      </div>
      <Dock />
    </>
  );
}
