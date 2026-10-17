import { contacts, education, educationEn, stack, stackGroupEn } from "../content";
import { useLang } from "../i18n";

// Резюме на лист A4. Из этой страницы scripts/resume.mjs печатает public/resume-ru.pdf и resume-en.pdf.
// Факты только те, что уже опубликованы на сайте, без внутренних метрик PIX.

type Job = { company: string; role: string; years: string; points: string[] };

const RU = {
  name: "Виталий Иванов",
  title: "Fullstack-разработчик с упором во фронт",
  place: "Москва · офис, гибрид, удаленка, релокация",
  summary:
    "Пишу на React и TypeScript, а когда браузера не хватает, сам делаю бэкенд на C#/.NET. Специализация: canvas-редакторы на @xyflow/react, дизайн-системы и производительность тяжелых интерфейсов. Ищу команду с редакторами, графами или внутренними инструментами.",
  sections: { exp: "Опыт", hack: "Хакатоны", stack: "Стек", edu: "Образование" },
  more: "Подробно о каждом проекте",
  jobs: [
    {
      company: "PIX Robotics",
      role: "Middle Fullstack-разработчик",
      years: "2024 - сейчас",
      points: [
        "Отвечаю за модуль canvas-редактора карт процессов (@xyflow/react) и за дизайн-систему компании",
        "Переделал крепление стрелок: карта на 1000 элементов открывается за 1,7 с вместо падения вкладки, памяти в 2,5-3 раза меньше",
        "Новая архитектура канваса: команды с откатом и undo/redo поверх Event Sourcing, слушатели изменений, фасад MapInstance",
        "Запустил e2e-тестирование с нуля: архитектура на Playwright и Page Objects, около 200 сценариев",
        "Дизайн-система из 3 npm-пакетов: UI-библиотека поверх Ant Design 5, 740+ иконок из Figma, токены. Используют 3 из 4 продуктов",
        "Перенес экспорт карт на сервер в headless Chromium (PuppeteerSharp), сделал фронт AI-ассистента продукта",
      ],
    },
    {
      company: "PIX Robotics",
      role: "Junior Fullstack-разработчик",
      years: "2023 - 2024",
      points: ["Загрузка журнала событий через COPY BINARY в PostgreSQL вместо EF Core: 10 млн строк примерно за минуту"],
    },
    { company: "Срочная служба в армии", role: "", years: "2022 - 2023", points: [] },
    {
      company: "ВиртуумЛаб",
      role: "Инженер-программист",
      years: "2021 - 2022",
      points: [
        "Переписал модуль кассы FudKit с Angular на React и подключил к ККМ Atol через локальный демон на C#",
        "Мультиязычность всего продукта на 4 языка через .resx-словари",
        "CRM и сайт для заказчика из Италии вдвоем с коллегой, на мне в основном бэкенд",
      ],
    },
  ] as Job[],
  hacks: [
    { what: "КосмоХакатон СПб, 1 место", note: "Роскосмос и МИРЭА, 2026. Стратегия снабжения орбитального узла и событийная проверка плана" },
    { what: "РОБОЗОН от Ozon Tech, 2 место", note: "2026, около 1000 команд в треке. Свой движок симуляции сортировочного центра, на мне фронт и 3D" },
  ],
};

const EN: typeof RU = {
  name: "Vitaly Ivanov",
  title: "Full stack developer with a frontend focus",
  place: "Moscow · office, hybrid, remote, relocation",
  summary:
    "I write React and TypeScript, and when the browser isn't enough, I build the backend myself in C#/.NET. I specialize in canvas editors on @xyflow/react, design systems and the performance of heavy interfaces. Looking for a team working on editors, graphs or internal tools.",
  sections: { exp: "Experience", hack: "Hackathons", stack: "Stack", edu: "Education" },
  more: "Details on every project",
  jobs: [
    {
      company: "PIX Robotics",
      role: "Middle Full Stack Developer",
      years: "2024 - now",
      points: [
        "Own the process map canvas editor module (@xyflow/react) and the company design system",
        "Reworked edge attachment: a 1000-element map opens in 1.7 s instead of crashing the tab, with 2.5-3x less memory",
        "New canvas architecture: commands with rollback and undo/redo on top of Event Sourcing, change listeners, a MapInstance facade",
        "Started e2e testing from scratch: Playwright and Page Objects architecture, about 200 scenarios",
        "Design system of 3 npm packages: a UI library on Ant Design 5, 740+ icons from Figma, tokens. Used by 3 of 4 products",
        "Moved map export to the server in headless Chromium (PuppeteerSharp), built the frontend of the product's AI assistant",
      ],
    },
    {
      company: "PIX Robotics",
      role: "Junior Full Stack Developer",
      years: "2023 - 2024",
      points: ["Event log loading via COPY BINARY in PostgreSQL instead of EF Core: 10M rows in about a minute"],
    },
    { company: "Military service", role: "", years: "2022 - 2023", points: [] },
    {
      company: "VirtuumLab",
      role: "Software Engineer",
      years: "2021 - 2022",
      points: [
        "Rewrote the FudKit POS module from Angular to React and connected it to an Atol fiscal printer via a local C# daemon",
        "Localized the whole product into 4 languages with .resx dictionaries",
        "A CRM and website for a client in Italy with one colleague, mostly on the backend",
      ],
    },
  ],
  hacks: [
    { what: "KosmoHackathon St. Petersburg, 1st place", note: "Roscosmos and MIREA, 2026. Supply strategy for an orbital depot with an event-driven plan check" },
    { what: "ROBOZON by Ozon Tech, 2nd place", note: "2026, about 1,000 teams in the track. Our own sorting center simulation engine, I did the frontend and 3D" },
  ],
};

const H = ({ children }: { children: string }) => (
  <h2 className="mt-4 mb-1.5 border-b border-[#ddd] pb-1 font-mono text-[9.5pt] uppercase tracking-[0.14em] text-[#777]">{children}</h2>
);

export function Resume() {
  const lang = useLang();
  const d = lang === "en" ? EN : RU;
  const edu = lang === "en" ? educationEn : education;
  const site = "vs-willy.github.io";
  return (
    <div className="resume mx-auto bg-white px-[14mm] py-[9mm] text-[10pt] leading-[1.45] text-[#222]" style={{ width: "210mm", minHeight: "296mm" }}>
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[20pt] font-semibold leading-tight tracking-tight text-[#111]">{d.name}</h1>
          <div className="mt-0.5 text-[11.5pt] text-[#333]">{d.title}</div>
          <div className="mt-1 text-[9.5pt] text-[#777]">{d.place}</div>
        </div>
        <ul className="shrink-0 space-y-0.5 text-right font-mono text-[8.8pt] text-[#444]">
          <li>
            <a href={`https://${site}${lang === "en" ? "/?lang=en" : ""}`}>{site}</a>
          </li>
          <li>
            <a href={contacts.email.href}>{contacts.email.label}</a>
          </li>
          <li>
            <a href={contacts.telegram.href}>t.me/vs_willy</a>
          </li>
          <li>
            <a href={contacts.github.href}>github.com/vs-willy</a>
          </li>
          <li>
            <a href={contacts.linkedin.href}>linkedin.com/in/vs-willy</a>
          </li>
        </ul>
      </header>

      <p className="mt-3 text-[10pt] text-[#333]">{d.summary}</p>

      <H>{d.sections.exp}</H>
      <div className="space-y-2">
        {d.jobs.map((j) => (
          <div key={j.role + j.years} className="break-inside-avoid">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="font-semibold text-[#111]">{j.company}</span>
                {j.role && <span className="text-[#555]"> · {j.role}</span>}
              </div>
              <div className="shrink-0 font-mono text-[8.8pt] text-[#777]">{j.years}</div>
            </div>
            {j.points.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {j.points.map((p) => (
                  <li key={p} className="relative pl-3.5 text-[9.4pt] text-[#333] before:absolute before:left-0.5 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[#999]">
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <H>{d.sections.hack}</H>
      <ul className="space-y-1">
        {d.hacks.map((h) => (
          <li key={h.what} className="break-inside-avoid">
            <span className="font-semibold text-[#111]">{h.what}</span>
            <span className="text-[9.4pt] text-[#555]"> · {h.note}</span>
          </li>
        ))}
      </ul>

      <H>{d.sections.stack}</H>
      <div className="space-y-0.5 text-[9.4pt]">
        {stack.map((g) => (
          <div key={g.group} className="flex gap-3">
            <div className="w-[34mm] shrink-0 text-[#777]">{lang === "en" ? stackGroupEn[g.group] : g.group}</div>
            <div className="text-[#333]">{g.items.map((i) => (lang === "en" && i === "npm-пакеты" ? "npm packages" : i)).join(", ")}</div>
          </div>
        ))}
      </div>

      <H>{d.sections.edu}</H>
      <ul className="space-y-0.5 text-[9.4pt]">
        {edu.map((e) => (
          <li key={e.title} className="flex items-baseline justify-between gap-4">
            <span>
              <span className="font-medium text-[#111]">{e.title}</span>
              <span className="text-[#666]"> · {e.detail}</span>
            </span>
            <span className="shrink-0 font-mono text-[8.8pt] text-[#777]">{e.years}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[9pt] text-[#777]">
        {d.more}: <a href={`https://${site}${lang === "en" ? "/?lang=en" : ""}`}>{site}</a>
      </p>
    </div>
  );
}
