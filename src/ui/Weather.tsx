import { useEffect, useState } from "react";

// Живая погода в Москве под именем. Open-Meteo бесплатный и без ключа.
// Ответ кэшируется на 15 минут, при ошибке остается просто «Москва».

const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current=temperature_2m,weather_code,is_day&timezone=Europe%2FMoscow";
const KEY = "weather-msk";
const TTL = 15 * 60 * 1000;

type Kind = "sun" | "moon" | "partly" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "storm";
type Now = { t: number; code: number; day: boolean };

// коды погоды WMO в слова и иконку
function describe(code: number, day: boolean): { text: string; kind: Kind } {
  if (code === 0) return { text: "ясно", kind: day ? "sun" : "moon" };
  if (code === 1) return { text: "почти ясно", kind: day ? "sun" : "moon" };
  if (code === 2) return { text: "переменная облачность", kind: day ? "partly" : "cloud" };
  if (code === 3) return { text: "пасмурно", kind: "cloud" };
  if (code === 45 || code === 48) return { text: "туман", kind: "fog" };
  if (code >= 51 && code <= 57) return { text: "морось", kind: "drizzle" };
  if (code === 61) return { text: "небольшой дождь", kind: "rain" };
  if (code >= 62 && code <= 67) return { text: code >= 65 ? "сильный дождь" : "дождь", kind: "rain" };
  if (code >= 71 && code <= 77) return { text: code === 71 ? "небольшой снег" : "снег", kind: "snow" };
  if (code >= 80 && code <= 82) return { text: "ливень", kind: "rain" };
  if (code === 85 || code === 86) return { text: "снегопад", kind: "snow" };
  if (code >= 95) return { text: "гроза", kind: "storm" };
  return { text: "", kind: "cloud" };
}

// иконки 9x9 из точек, в стиле портрета
const ICONS: Record<Kind, string[]> = {
  sun: ["....1....", ".1.....1.", "...111...", "..11111..", "1.11111.1", "..11111..", "...111...", ".1.....1.", "....1...."],
  moon: ["...111...", "..11.....", ".11......", ".11......", ".11......", ".11......", "..11...1.", "...11111.", "........."],
  partly: [".1..1....", "...111...", "1.1111...", "...1111..", "..111111.", ".11111111", ".11111111", "..111111.", "........."],
  cloud: [".........", ".........", "...111...", "..11111..", ".1111111.", "111111111", "111111111", ".1111111.", "........."],
  fog: [".........", ".1111111.", ".........", "111111111", ".........", ".1111111.", ".........", "1111111..", "........."],
  drizzle: ["...111...", "..11111..", ".1111111.", "111111111", ".1111111.", ".........", "..1...1..", ".........", "...1...1."],
  rain: ["...111...", "..11111..", ".1111111.", "111111111", ".1111111.", ".........", ".1..1..1.", "1..1..1..", "........."],
  snow: ["...111...", "..11111..", ".1111111.", "111111111", ".1111111.", ".........", ".1.1.1.1.", ".........", "1.1.1.1.."],
  storm: ["...111...", "..11111..", ".1111111.", "111111111", ".1111111.", ".....1...", "....1....", "...1111..", ".....1..."],
};

function Icon({ kind }: { kind: Kind }) {
  const rows = ICONS[kind];
  return (
    <svg viewBox="0 0 9 9" className="h-4 w-4 shrink-0 text-ink-2" aria-hidden>
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => (c === "1" ? <circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.45} fill="currentColor" /> : null)),
      )}
    </svg>
  );
}

function readCache(): Now | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Now & { at: number };
    return Date.now() - v.at < TTL ? v : null;
  } catch {
    return null;
  }
}

export function Weather() {
  const [now, setNow] = useState<Now | null>(() => readCache());

  useEffect(() => {
    if (now) return;
    const ctrl = new AbortController();
    fetch(URL, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const v: Now = { t: d.current.temperature_2m, code: d.current.weather_code, day: d.current.is_day === 1 };
        setNow(v);
        try {
          sessionStorage.setItem(KEY, JSON.stringify({ ...v, at: Date.now() }));
        } catch {
          /* хранилище может быть недоступно, это не страшно */
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [now]);

  if (!now) return <span>Москва</span>;
  const { text, kind } = describe(now.code, now.day);
  const t = Math.round(now.t);
  const temp = `${t > 0 ? "+" : t < 0 ? "-" : ""}${Math.abs(t)}°`;
  return (
    <span className="inline-flex items-center gap-2" title="Погода сейчас, Open-Meteo">
      <Icon kind={kind} />
      <span>
        В Москве {temp}
        {text && `, ${text}`}
      </span>
    </span>
  );
}
