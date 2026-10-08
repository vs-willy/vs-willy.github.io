import type { Logo as LogoName } from "../projects";

const base = import.meta.env.BASE_URL;
export const logoSrc = (name: LogoName) => `${base}logos/${name}.png`;

// Логотип одним цветом: маска из PNG, заливка текущим цветом текста, поэтому подстраивается под тему
export function Logo({ name, className = "h-4 w-4" }: { name: LogoName; className?: string }) {
  const url = `url(${logoSrc(name)})`;
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
    />
  );
}
