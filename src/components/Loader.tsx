import { useEffect, useRef, useState } from "react";
import { animate, motion, AnimatePresence } from "motion/react";

// Заставка при открытии: собирается маленькая процессная карта, по ней пробегает токен,
// потом экран уезжает вверх. Один раз за сессию, без нее при reduce-motion.

const KEY = "intro-seen";

function shouldShow() {
  try {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return false;
  }
}

export const introShown = shouldShow();
// Сколько первый экран ждет, прежде чем запускать свои анимации
export const INTRO_DELAY = introShown ? 2.25 : 0;

const ease = [0.65, 0, 0.35, 1] as const;
const Y = 64;

function Draw({ d, delay, accent }: { d: string; delay: number; accent?: boolean }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={accent ? "var(--accent)" : "var(--ink-3)"}
      strokeWidth={1.5}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration: 0.45, delay, ease }, opacity: { duration: 0.01, delay } }}
    />
  );
}

function Pop({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      {children}
    </motion.g>
  );
}

function Diagram() {
  return (
    <svg viewBox="0 0 400 112" className="h-auto w-[min(86vw,560px)]" aria-hidden>
      {/* элементы */}
      <Pop delay={0.05}>
        <circle cx="24" cy={Y} r="10" fill="var(--surface-2)" stroke="var(--ink-3)" strokeWidth={1.5} />
      </Pop>
      <Pop delay={0.15}>
        <rect x="64" y={Y - 18} width="80" height="36" rx="8" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={1.5} />
        <rect x="80" y={Y - 3} width="48" height="6" rx="3" fill="var(--ink-3)" opacity={0.6} />
      </Pop>
      <Pop delay={0.25}>
        <rect x="184" y={Y - 12} width="24" height="24" rx="4" transform={`rotate(45 196 ${Y})`} fill="var(--surface-2)" stroke="var(--ink-3)" strokeWidth={1.5} />
      </Pop>
      <Pop delay={0.35}>
        <rect x="248" y={Y - 18} width="80" height="36" rx="8" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={1.5} />
        <rect x="264" y={Y - 3} width="36" height="6" rx="3" fill="var(--ink-3)" opacity={0.6} />
      </Pop>
      <Pop delay={0.45}>
        <circle cx="370" cy={Y} r="10" fill="var(--surface-2)" stroke="var(--ink-3)" strokeWidth={2.5} />
      </Pop>

      {/* связи */}
      <Draw d={`M34 ${Y} H64`} delay={0.55} />
      <Draw d={`M144 ${Y} H179`} delay={0.65} />
      <Draw d={`M213 ${Y} H248`} delay={0.75} />
      <Draw d={`M328 ${Y} H360`} delay={0.85} />
      {/* обратная ветка от развилки к первой задаче */}
      <Draw d={`M196 ${Y - 17} V18 H104 V${Y - 18}`} delay={0.8} accent />

      {/* токен */}
      <motion.circle
        r="4.5"
        fill="var(--accent)"
        style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}
        initial={{ cx: 24, cy: Y, opacity: 0 }}
        animate={{ cx: [24, 104, 196, 288, 370], opacity: [0, 1, 1, 1, 0] }}
        transition={{ duration: 0.75, delay: 1.05, ease: "easeInOut" }}
      />

      {/* финиш загорается */}
      <motion.circle
        cx="370"
        cy={Y}
        r="10"
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2.5}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 1.75 }}
        style={{ filter: "drop-shadow(0 0 10px var(--accent))" }}
      />
    </svg>
  );
}

export function Loader() {
  const [visible, setVisible] = useState(introShown);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!introShown) return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* без sessionStorage просто покажем еще раз */
    }
    document.documentElement.style.overflow = "hidden";
    const counter = animate(0, 100, {
      duration: 1.8,
      ease: [0.3, 0, 0.2, 1],
      onUpdate: (v) => {
        if (pct.current) pct.current.textContent = String(Math.round(v));
      },
    });
    const t = setTimeout(() => setVisible(false), 1950);
    return () => {
      counter.stop();
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => (document.documentElement.style.overflow = "")}>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[70] grid place-items-center bg-bg"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000,transparent)]" />
          <motion.div
            className="relative flex flex-col items-center gap-8"
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Diagram />
            <div className="flex w-[min(86vw,560px)] items-center justify-between font-mono text-[12px] text-ink-3">
              <span>
                <span className="text-ink">Виталий Иванов</span> / портфолио
              </span>
              <span>
                <span ref={pct} className="tabular-nums text-ink">
                  0
                </span>
                %
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
