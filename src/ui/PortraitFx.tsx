import { useEffect, useRef } from "react";

// Портрет из точек (дизеринг Аткинсона) с одним из трех эффектов при наведении:
// repel — точки разбегаются от курсора и пружинят обратно,
// relief — портрет становится рельефом и наклоняется за курсором, как голограмма,
// color — под курсором проявляется настоящее цветное фото, точками.

export type Fx = "repel" | "relief" | "color";

type Props = { fx: Fx; cols?: number; className?: string; label: string };

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

export function PortraitFx({ fx, cols = 190, className, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const n = cols;
    let alive = true;
    let raf = 0;

    let gray: Uint8ClampedArray | null = null;
    let scene: Uint8ClampedArray | null = null;
    // точки портрета: координаты в клетках, глубина для рельефа
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let depth = new Float32Array(0);
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let count = 0;

    // touch: палец закрывает маленький радиус, поэтому для касаний он больше
    const mouse = { x: 0, y: 0, in: false, touch: false };
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const lens = { x: 0, y: 0, r: 0, tr: 0 };

    const dark = () => document.documentElement.dataset.theme === "dark";

    function build() {
      if (!gray) return;
      const N = n * n;
      const err = new Float32Array(N);
      const xs: number[] = [];
      const ys: number[] = [];
      const ds: number[] = [];
      const isDark = dark();
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const i = y * n + x;
          const a = gray[i * 4 + 3] / 255;
          let v = gray[i * 4] / 255;
          const raw = v;
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
            // светлые места (лицо, нос) ближе к зрителю, края портрета дальше
            ds.push(raw * a);
          }
        }
      }
      count = xs.length;
      px = Float32Array.from(xs);
      py = Float32Array.from(ys);
      depth = Float32Array.from(ds);
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
      const ink = getComputedStyle(canvas!).getPropertyValue("--ink").trim() || "#222";

      if (fx === "color" && scene && lens.r > 0.5) {
        // внутри линзы рисуем всю сцену цветными точками, портрет вокруг остается как есть
        const R = lens.r;
        for (let y = Math.max(0, Math.floor(lens.y - R)); y < Math.min(n, lens.y + R); y++) {
          for (let x = Math.max(0, Math.floor(lens.x - R)); x < Math.min(n, lens.x + R); x++) {
            const d = Math.hypot(x - lens.x, y - lens.y);
            if (d > R) continue;
            const sx = Math.min(239, Math.floor((x / n) * 240));
            const sy = Math.min(239, Math.floor((y / n) * 240));
            const j = (sy * 240 + sx) * 4;
            const k = Math.min(1, (R - d) / (R * 0.3));
            ctx!.fillStyle = `rgb(${scene[j]} ${scene[j + 1]} ${scene[j + 2]})`;
            const ss = s * (0.55 + 0.45 * k);
            ctx!.fillRect(x * c + (c - ss) / 2, y * c + (c - ss) / 2, ss, ss);
          }
        }
      }

      ctx!.fillStyle = ink;
      for (let i = 0; i < count; i++) {
        let x = px[i];
        let y = py[i];
        let ss = s;
        if (fx === "repel") {
          x += ox[i];
          y += oy[i];
        } else if (fx === "relief") {
          const z = depth[i] - 0.45;
          x += z * tilt.x * 14;
          y += z * tilt.y * 14;
          ss = s * (0.8 + depth[i] * 0.4 * (Math.abs(tilt.x) + Math.abs(tilt.y) > 0.02 ? 1 : 0.5));
        } else if (fx === "color" && lens.r > 0.5) {
          if (Math.hypot(x - lens.x, y - lens.y) < lens.r) continue;
        }
        ctx!.fillRect(x * c + (c - ss) / 2, y * c + (c - ss) / 2, ss, ss);
      }
    }

    function step() {
      let moving = false;
      if (fx === "repel") {
        const R = n * (mouse.touch ? 0.12 : 0.075);
        // после тапа точки возвращаются медленнее, чтобы взрыв успели увидеть
        const spring = mouse.touch ? 0.03 : 0.06;
        const damp = mouse.touch ? 0.88 : 0.82;
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
      } else if (fx === "relief") {
        tilt.x += (tilt.tx - tilt.x) * 0.12;
        tilt.y += (tilt.ty - tilt.y) * 0.12;
        moving = Math.abs(tilt.tx - tilt.x) + Math.abs(tilt.ty - tilt.y) > 0.002;
      } else {
        lens.x += (mouse.x - lens.x) * 0.25;
        lens.y += (mouse.y - lens.y) * 0.25;
        lens.r += (lens.tr - lens.r) * 0.2;
        moving = Math.abs(lens.tr - lens.r) > 0.05 || Math.abs(mouse.x - lens.x) + Math.abs(mouse.y - lens.y) > 0.05;
      }
      draw();
      if (moving || (fx === "repel" && mouse.in)) raf = requestAnimationFrame(step);
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
      if (fx === "color" && !mouse.in) {
        lens.x = mouse.x;
        lens.y = mouse.y;
      }
      mouse.in = true;
      tilt.tx = (mouse.x / n - 0.5) * 2;
      tilt.ty = (mouse.y / n - 0.5) * 2;
      lens.tr = n * 0.2;
      kick();
    };
    // на тап точки разлетаются от пальца и потом пружинят обратно
    const onDown = (e: PointerEvent) => {
      onMove(e);
      if (fx !== "repel" || e.pointerType === "mouse") return;
      const R = n * 0.26;
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
      tilt.tx = 0;
      tilt.ty = 0;
      lens.tr = 0;
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

    Promise.all([loadPixels(`${base}portrait.png`, n), fx === "color" ? loadPixels(`${base}portrait-scene.jpg`, 240) : Promise.resolve(null)])
      .then(([g, sc]) => {
        if (!alive) return;
        gray = g;
        scene = sc;
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
  }, [fx, cols]);

  return <canvas ref={ref} role="img" aria-label={label} className={className} style={{ touchAction: "none" }} />;
}
