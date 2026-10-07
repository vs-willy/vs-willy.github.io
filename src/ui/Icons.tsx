import { renderToStaticMarkup } from "react-dom/server";
import {
  ArrowsSplit,
  ChartBar,
  CheckSquare,
  Database,
  Image as ImageIcon,
  Package,
  Receipt,
  Robot,
  Rocket,
  Stack,
  TreeStructure,
  type Icon,
} from "@phosphor-icons/react";

const map: Record<string, Icon> = {
  rocket: Rocket,
  package: Package,
  arrow: ArrowsSplit,
  flow: TreeStructure,
  check: CheckSquare,
  stack: Stack,
  image: ImageIcon,
  robot: Robot,
  database: Database,
  receipt: Receipt,
  chart: ChartBar,
};

// Внутренности svg иконки (без обертки), чтобы вставить в картинку для дизеринга
export function iconPaths(name: string) {
  const I = map[name] ?? Stack;
  const html = renderToStaticMarkup(<I weight="fill" />);
  return html.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
}
