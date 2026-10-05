import { CanvasCase } from "./components/CanvasCase";
import { Contact } from "./components/Contact";
import { Hackathons } from "./components/Hackathons";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { Path } from "./components/Path";
import { Stack } from "./components/Stack";
import { Stats } from "./components/Stats";
import { Work } from "./components/Work";

export function App() {
  return (
    <div className="grain">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <CanvasCase />
        <Work />
        <Hackathons />
        <Path />
        <Stack />
      </main>
      <Contact />
    </div>
  );
}
