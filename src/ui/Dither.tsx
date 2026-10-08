import { useEffect, useRef } from "react";

// Растрирует SVG в пиксельный дизеринг (матрица Байера 4x4), как точечные картинки на cali.so.
// Фото растрируется диффузией ошибки Аткинсона: Байер съедает полутона, и лицо превращается в пятна.
// Цвет точек берется из токена --ink, поэтому картинка сама подстраивается под тему.
// С interactive курсор работает как фонарик: рядом с ним картинка проявляется плотнее.

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

type Props = {
  svg?: string; // разметка svg с viewBox
  src?: string; // или путь к картинке (черное на прозрачном или фото)
  fit?: number; // доля площади, которую занимает картинка (для логотипов)
  gamma?: number; // меньше 1 осветляет средние тона
  photo?: boolean; // фото: прозрачный фон пустой, в темной теме яркость инвертируется, чтобы не было негатива
  cols: number; // разрешение сетки по ширине
  rows: number;
  className?: string;
  interactive?: boolean;
  label: string;
};

export function Dither({ svg, src, fit = 1, gamma = 1, photo, cols, rows, className, interactive, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lum: Float32Array | null = null;
    let alpha: Float32Array | null = null;
    let mouse: { x: number; y: number } | null = null;
    let raf = 0;
    let alive = true;

    const buf = document.createElement("canvas");
    buf.width = cols;
    buf.height = rows;
    const sctx = buf.getContext("2d", { willReadFrequently: true })!;

    const img = new Image();
    img.onload = () => {
      if (!alive) return;
      sctx.clearRect(0, 0, cols, rows);
      if (!photo) {
        sctx.fillStyle = "#fff";
        sctx.fillRect(0, 0, cols, rows);
      }
      // вписываем с сохранением пропорций и отступом fit
      const k = Math.min(cols / img.naturalWidth, rows / img.naturalHeight) * fit;
      const dw = img.naturalWidth * k;
      const dh = img.naturalHeight * k;
      sctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
      const d = sctx.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      alpha = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        alpha[i] = d[i * 4 + 3] / 255;
        lum[i] = Math.pow((0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255, gamma);
      }
      draw();
    };
    img.src = src ?? "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg ?? "");

    function draw() {
      if (!lum || !ctx || !canvas) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cw = w / cols;
      const ch = h / rows;
      const ink = getComputedStyle(canvas).getPropertyValue("--ink").trim() || "#222";
      ctx.fillStyle = ink;
      const dark = document.documentElement.dataset.theme === "dark";
      const size = Math.max(1, Math.min(cw, ch) * 0.82);
      const err = photo ? new Float32Array(cols * rows) : null;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          let v = lum[idx];
          // в темной теме светлое лицо становится плотными светлыми точками, а темным местам оставляем немного точек, чтобы силуэт не пропадал
          if (photo && dark) v = Math.min(1 - v, 0.85);
          // Аткинсон теряет часть ошибки и светлая кожа почти пропадает, в светлой теме чуть притемняем
          else if (photo) v *= 0.86;
          // полупрозрачные края фото дают меньше точек: портрет плавно растворяется
          if (photo) v = 1 - (1 - v) * alpha![idx];
          if (mouse) {
            const dx = (x - mouse.x) / cols;
            const dy = (y - mouse.y) / rows;
            const k = Math.exp(-(dx * dx + dy * dy) * 28);
            v = v - k * 0.28 * (1 - v) - k * 0.12;
          }
          let on: boolean;
          if (err) {
            const old = v + err[idx];
            on = old < 0.5;
            const e = (old - (on ? 0 : 1)) / 8;
            if (x + 1 < cols) err[idx + 1] += e;
            if (x + 2 < cols) err[idx + 2] += e;
            if (y + 1 < rows) {
              if (x > 0) err[idx + cols - 1] += e;
              err[idx + cols] += e;
              if (x + 1 < cols) err[idx + cols + 1] += e;
            }
            if (y + 2 < rows) err[idx + 2 * cols] += e;
            if (alpha![idx] < 0.02) on = false;
          } else {
            on = 1 - v > BAYER[(y % 4) * 4 + (x % 4)];
          }
          if (on) ctx.fillRect(x * cw + (cw - size) / 2, y * ch + (ch - size) / 2, size, size);
        }
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: ((e.clientX - r.left) / r.width) * cols, y: ((e.clientY - r.top) / r.height) * rows };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const onLeave = () => {
      mouse = null;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (interactive && !reduce) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    // Перерисовка при смене темы
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [svg, src, fit, gamma, photo, cols, rows, interactive]);

  return <canvas ref={ref} role="img" aria-label={label} className={className} />;
}
