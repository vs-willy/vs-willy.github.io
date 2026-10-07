// Короткие звуки интерфейса, синтез через WebAudio без файлов.
// Браузер дает играть звук только после первого действия пользователя, до этого вызовы молча пропускаются.

const KEY = "sound";
let enabled = true;
try {
  enabled = localStorage.getItem(KEY) !== "off";
} catch {
  /* без localStorage просто включено */
}

let ctx: AudioContext | null = null;
let unlocked = false;
const listeners = new Set<() => void>();

function unlock() {
  unlocked = true;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
}
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlock, { once: true, capture: true });
  window.addEventListener("keydown", unlock, { once: true, capture: true });
}

function blip(freq: number, dur: number, gain: number, type: OscillatorType = "sine") {
  if (!enabled || !unlocked || !ctx) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sound = {
  hover: () => blip(1900, 0.035, 0.025, "triangle"),
  click: () => blip(620, 0.08, 0.06, "sine"),
  toggle: () => blip(980, 0.06, 0.05, "square"),
  isOn: () => enabled,
  set(on: boolean) {
    enabled = on;
    try {
      localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* не запомнится */
    }
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
