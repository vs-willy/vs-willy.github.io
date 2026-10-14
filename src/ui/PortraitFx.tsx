import { useEffect, useRef } from "react";
import { sound } from "../sound";

// Портрет из точек (дизеринг Аткинсона): точки разбегаются от курсора и пружинят обратно,
// по клику или тапу разлетаются кругом.

type Props = { cols?: number; className?: string; label: string };

const base = import.meta.env.BASE_URL;

function loadPixels(src: string, n: number): Promise<Uint8ClampedArray> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = n;
      c.height = n;
      const x = c.getContext("2d", { willReadFrequently: true })!;
      x.drawImage(img, 0, 0, n, n);
      resolve(x.getImageData(0, 0, n, n).data);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function PortraitFx({ cols = 190, className, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const n = cols;
    let alive = true;
    let raf = 0;

    let gray: Uint8ClampedArray | null = null;
    // точки портрета: координаты в клетках, смещение и скорость для пружины
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let count = 0;

    // touch: палец закрывает маленький радиус, поэтому для касаний он больше
    const mouse = { x: 0, y: 0, in: false, touch: false };
    let burstAt = -1e9; // время последнего клика или тапа

    const dark = () => document.documentElement.dataset.theme === "dark";

    function build() {
      if (!gray) return;
      const err = new Float32Array(n * n);
      const xs: number[] = [];
      const ys: number[] = [];
      const isDark = dark();
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const i = y * n + x;
          const a = gray[i * 4 + 3] / 255;
          let v = gray[i * 4] / 255;
          if (isDark) v = Math.min(1 - v, 0.85);
          else v *= 0.86;
          v = 1 - (1 - v) * a;
          const old = v + err[i];
          const on = old < 0.5;
          const e = (old - (on ? 0 : 1)) / 8;
          if (x + 1 < n) err[i + 1] += e;
          if (x + 2 < n) err[i + 2] += e;
          if (y + 1 < n) {
            if (x > 0) err[i + n - 1] += e;
            err[i + n] += e;
            if (x + 1 < n) err[i + n + 1] += e;
          }
          if (y + 2 < n) err[i + 2 * n] += e;
          if (on && a > 0.02) {
            xs.push(x);
            ys.push(y);
          }
        }
      }
      count = xs.length;
      px = Float32Array.from(xs);
      py = Float32Array.from(ys);
      ox = new Float32Array(count);
      oy = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      draw();
    }

    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = canvas!.clientWidth;
      if (canvas!.width !== Math.round(w * dpr)) {
        canvas!.width = Math.round(w * dpr);
        canvas!.height = Math.round(w * dpr);
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      return w;
    }

    function draw() {
      const w = size();
      const c = w / n;
      const s = c * 0.82;
      ctx!.clearRect(0, 0, w, w);
      ctx!.fillStyle = getComputedStyle(canvas!).getPropertyValue("--ink").trim() || "#222";
      for (let i = 0; i < count; i++) {
        ctx!.fillRect((px[i] + ox[i]) * c + (c - s) / 2, (py[i] + oy[i]) * c + (c - s) / 2, s, s);
      }
    }

    function step() {
      let moving = false;
      const R = n * (mouse.touch ? 0.06 : 0.055);
      // после клика или тапа точки возвращаются медленнее, чтобы взрыв успели увидеть
      const slow = mouse.touch || performance.now() - burstAt < 900;
      const spring = slow ? 0.03 : 0.06;
      const damp = slow ? 0.88 : 0.82;
      for (let i = 0; i < count; i++) {
        let fxv = -ox[i] * spring;
        let fyv = -oy[i] * spring;
        if (mouse.in) {
          const dx = px[i] + ox[i] - mouse.x;
          const dy = py[i] + oy[i] - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < R && d > 0.001) {
            const f = (1 - d / R) ** 2 * 1.8;
            fxv += (dx / d) * f;
            fyv += (dy / d) * f;
          }
        }
        vx[i] = (vx[i] + fxv) * damp;
        vy[i] = (vy[i] + fyv) * damp;
        ox[i] += vx[i];
        oy[i] += vy[i];
        if (!moving && (Math.abs(vx[i]) > 0.01 || Math.abs(vy[i]) > 0.01 || Math.abs(ox[i]) > 0.05)) moving = true;
      }
      draw();
      if (moving || mouse.in) raf = requestAnimationFrame(step);
      else raf = 0;
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * n;
      mouse.y = ((e.clientY - r.top) / r.height) * n;
      mouse.touch = e.pointerType !== "mouse";
      mouse.in = true;
      kick();
    };
    // на клик или тап точки разлетаются и потом пружинят обратно
    const onDown = (e: PointerEvent) => {
      onMove(e);
      burstAt = performance.now();
      if (e.pointerType === "mouse") sound.click();
      const R = n * 0.13;
      for (let i = 0; i < count; i++) {
        const dx = px[i] + ox[i] - mouse.x;
        const dy = py[i] + oy[i] - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0.001) {
          const f = (1 - d / R) ** 0.6 * 3.4;
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
        }
      }
    };
    const onLeave = () => {
      mouse.in = false;
      kick();
    };
    // палец отпустили: у касаний нет наведения, поэтому эффект сразу отпускаем
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onLeave();
    };

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointercancel", onLeave);
    }

    loadPixels(`${base}portrait.png`, n)
      .then((g) => {
        if (!alive) return;
        gray = g;
        build();
      })
      .catch(() => {});

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    const mo = new MutationObserver(() => build());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
    };
  }, [cols]);

  return <canvas ref={ref} role="img" aria-label={label} className={className} style={{ touchAction: "none" }} />;
}
