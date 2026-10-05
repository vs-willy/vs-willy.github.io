import { CanvasCase } from "./components/CanvasCase";
import { Contact } from "./components/Contact";
import { Hackathons } from "./components/Hackathons";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { Path } from "./components/Path";
import { PixEras } from "./components/PixEras";
import { PixIntro } from "./components/PixIntro";
import { Stack } from "./components/Stack";
import { Stats } from "./components/Stats";
import { Virtuum } from "./components/Virtuum";
import { Work } from "./components/Work";

// Главы по местам работы: PIX Robotics, ВиртуумЛаб, затем хакатоны и общий путь
export function App() {
  return (
    <div className="grain">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <PixIntro />
        <Stats />
        <CanvasCase />
        <PixEras />
        <Work />
        <Virtuum />
        <Hackathons />
        <Path />
        <Stack />
      </main>
      <Contact />
    </div>
  );
}
