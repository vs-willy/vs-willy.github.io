import { useEffect, useRef } from "react";

// Живое поле нод: процессная карта, которая реагирует на курсор.
// Рисуется на canvas 2D в своем цикле requestAnimationFrame, React не перерисовывается.

type Node = { x: number; y: number; vx: number; vy: number; w: number; h: number; hot: number };
type Packet = { a: number; b: number; t: number; speed: number };

const ACCENT = [255, 138, 76];
const LINK_DIST = 170;

export function HeroField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let visible = true;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const seed = () => {
      const count = Math.round(Math.min(90, Math.max(28, (w * h) / 16000)));
      nodes = Array.from({ length: count }, () => {
        const big = Math.random() < 0.18;
        return {
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.12, 0.12),
          vy: rand(-0.12, 0.12),
          w: big ? rand(34, 52) : rand(8, 16),
          h: big ? rand(18, 24) : rand(8, 16),
          hot: 0,
        };
      });
      packets = [];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) draw();
    };

    const roundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x - rw / 2, y - rh / 2, rw, rh, r);
    };

    const step = () => {
      for (const n of nodes) {
        // Курсор слегка притягивает ближние ноды
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 200 && d > 40) {
            const f = (1 - d / 200) * 0.012;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
            n.hot = Math.min(1, n.hot + 0.06);
          }
        }
        n.hot *= 0.96;
        n.vx *= 0.97;
        n.vy *= 0.97;
        // Ограничение скорости: ноды не слипаются в кучу у курсора
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 0.9) {
          n.vx *= 0.9 / sp;
          n.vy *= 0.9 / sp;
        }
        // Минимальный дрейф, чтобы поле не замирало
        n.vx += rand(-0.008, 0.008);
        n.vy += rand(-0.008, 0.008);
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -60) n.x = w + 60;
        if (n.x > w + 60) n.x = -60;
        if (n.y < -60) n.y = h + 60;
        if (n.y > h + 60) n.y = -60;
      }

      // Новые пакеты данных бегут по существующим связям
      if (packets.length < 14 && Math.random() < 0.08) {
        const a = Math.floor(Math.random() * nodes.length);
        let best = -1;
        let bestD = LINK_DIST;
        for (let j = 0; j < nodes.length; j++) {
          if (j === a) continue;
          const d = Math.hypot(nodes[a].x - nodes[j].x, nodes[a].y - nodes[j].y);
          if (d < bestD && Math.random() < 0.6) {
            bestD = d;
            best = j;
          }
        }
        if (best >= 0) packets.push({ a, b: best, t: 0, speed: rand(0.006, 0.014) });
      }
      for (const p of packets) p.t += p.speed;
      packets = packets.filter((p) => p.t < 1 && Math.hypot(nodes[p.a].x - nodes[p.b].x, nodes[p.a].y - nodes[p.b].y) < LINK_DIST * 1.2);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Связи
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK_DIST) continue;
          const k = 1 - d / LINK_DIST;
          const hot = Math.max(a.hot, b.hot);
          ctx.strokeStyle = hot > 0.05
            ? `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${(0.12 + hot * 0.5) * k})`
            : `rgba(255,255,255,${0.09 * k})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          // Ортогональная связь, как стрелка на процессной карте
          const mx = (a.x + b.x) / 2;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mx, a.y);
          ctx.lineTo(mx, b.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Пакеты
      for (const p of packets) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        const mx = (a.x + b.x) / 2;
        // Позиция по ломаной из трех отрезков
        const l1 = Math.abs(mx - a.x);
        const l2 = Math.abs(b.y - a.y);
        const l3 = Math.abs(b.x - mx);
        let s = p.t * (l1 + l2 + l3);
        let x: number;
        let y: number;
        if (s <= l1) {
          x = a.x + Math.sign(mx - a.x) * s;
          y = a.y;
        } else if ((s -= l1) <= l2) {
          x = mx;
          y = a.y + Math.sign(b.y - a.y) * s;
        } else {
          s -= l2;
          x = mx + Math.sign(b.x - mx) * s;
          y = b.y;
        }
        ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ноды
      for (const n of nodes) {
        const big = n.w > 30;
        roundRect(n.x, n.y, n.w, n.h, big ? 5 : 3);
        ctx.fillStyle = "rgba(20,20,26,0.9)";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = n.hot > 0.05
          ? `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${0.3 + n.hot * 0.7})`
          : `rgba(255,255,255,${big ? 0.22 : 0.14})`;
        ctx.stroke();
      }
    };

    const loop = () => {
      if (visible && !document.hidden) {
        step();
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y >= 0 && mouse.y <= rect.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    resize();
    if (!reduce) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
