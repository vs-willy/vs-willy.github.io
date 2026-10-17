// Проекты: рабочие задачи, разложенные как кейсы. Факты из материалов по карьере, без внутренних цифр PIX.

export type Company = "PIX Robotics" | "ВиртуумЛаб" | "Хакатон";
export type Logo = "pix" | "virtuum" | "kosmo" | "robozon";
export type DiagramKey = "commands" | "listeners" | "facade" | "handles" | "designSystem" | "kkm";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  company: Company;
  date: string; // как показывать
  sort: number; // для порядка: yyyymm
  logo: Logo;
  stack: string[];
  result?: string; // главный итог одной строкой
  sections: { title: string; text: string; diagram?: DiagramKey }[];
  en: { title: string; summary: string; date: string; result?: string };
};

export const projects: Project[] = [
  {
    slug: "kosmohackathon",
    en: {"title": "KosmoHackathon St. Petersburg: 1st place", "summary": "A fuel supply strategy for an orbital depot and an event-driven simulation that checks the plan", "date": "Sep 2026", "result": "1st place, Roscosmos and MIREA"},
    title: "КосмоХакатон СПб: 1 место",
    summary: "Стратегия снабжения орбитального топливного узла и событийная симуляция, которая проверяет план",
    company: "Хакатон",
    date: "сен 2026",
    sort: 202609,
    logo: "kosmo",
    stack: ["C#/.NET", "React", "DES"],
    result: "1 место, Роскосмос и МИРЭА",
    sections: [
      {
        title: "Кейс",
        text: "«Топливный космоконтур»: спрос на топливо на орбите в 2035-2040 годах растет со 100 до 390 тонн в год, есть пять каналов поставки с разными условиями. Нужно решить, что подписывать заранее, что держать опционом и как пережить обязательный стресс 2038 года.",
      },
      {
        title: "Решение",
        text: "Встроили кейс вторым доменом в нашу платформу Praxis, а не писали проект заново. Получилось два слоя: помесячная модель выбора стратегии снабжения и событийная симуляция, которая независимо пересчитывает запас и проверяет, исполним ли план на уровне отдельных поставок.",
      },
      {
        title: "Моя часть",
        text: "Интерфейс, включая публичный калькулятор по QR-коду для демонстрации, и защита решения: презентацию, демо и ответы жюри вел я.",
      },
    ],
  },
  {
    slug: "robozon",
    en: {"title": "ROBOZON by Ozon Tech: 2nd place", "summary": "Our own discrete-event engine for simulating a sorting center", "date": "Sep 2026", "result": "2nd place out of 3,600+ participants"},
    title: "РОБОЗОН от Ozon Tech: 2 место",
    summary: "Свой дискретно-событийный движок для моделирования сортировочного центра",
    company: "Хакатон",
    date: "сен 2026",
    sort: 202608,
    logo: "robozon",
    stack: ["C#/.NET", "React", "three.js", "Gym"],
    result: "2 место из 3600+ участников",
    sections: [
      {
        title: "Кейс",
        text: "Трек имитационного моделирования сортировочного центра. Финал проходил очно в Москве.",
      },
      {
        title: "Движок",
        text: "Сделали свой движок вместо SimPy и AnyLogic: очередь событий, логистические узлы, backpressure как в реальном сортировочном центре (если места нет, затор сам распространяется вверх по линии) и полный детерминизм по seed. Сверху Gym-интерфейс для обучения RL-агентов.",
      },
      {
        title: "Моя часть",
        text: "Редактор модели, 3D-сцена на three.js, дашборды и демо-стенд для очной защиты.",
      },
    ],
  },
  {
    slug: "arrows",
    en: {"title": "New edge attachment", "summary": "Replaced about 30 handles per element with one, and large maps stopped crashing the tab", "date": "2025-2026", "result": "A 1000-element map opens in 1.7 s instead of crashing the tab, with 2.5-3x less memory"},
    title: "Новое крепление стрелок",
    summary: "Около 30 точек крепления на элемент заменил одной, и большие карты перестали ронять вкладку",
    company: "PIX Robotics",
    date: "2025-2026",
    sort: 202607,
    logo: "pix",
    stack: ["@xyflow/react", "TypeScript", "миграция данных"],
    result: "Карта на 1000 элементов открывается за 1,7 с вместо падения вкладки, памяти уходит в 2,5-3 раза меньше",
    sections: [
      {
        title: "Проблема",
        text: "Каждый элемент на канвасе рендерил около 30 точек крепления: по три на каждую сторону для входа и выхода, углы, точка на весь элемент и быстрый коннектор. На картах в 500-1000 элементов, обычных для клиентов, это давало сильную деградацию, вплоть до падения вкладки при открытии.",
        diagram: "handles",
      },
      {
        title: "Новая модель",
        text: "Стрелка теперь хранит позицию в долях от рамки элемента и крепится в любую точку границы. Вход и выход линии считаются на лету, а не берутся из фиксированного набора. Старые карты мигрировали без визуальных искажений: у старых точек были известные координаты, и пересчет получился однозначным.",
      },
      {
        title: "Что пришлось переделать",
        text: "Автокомпоновку, импорт внешних форматов, экспорт и импорт своих карт, генерацию карт из других модулей и автотесты, чтобы всё это работало с новой моделью. Сама переделка заняла несколько недель.",
      },
    ],
  },
  {
    slug: "canvas",
    en: {"title": "Canvas editor architecture", "summary": "Commands with rollback, listeners every change goes through, and one facade over the canvas API", "date": "2025"},
    title: "Архитектура canvas-редактора",
    summary: "Команды с откатом, слушатели, через которые проходит каждое изменение, и единый фасад над API канваса",
    company: "PIX Robotics",
    date: "2025",
    sort: 202506,
    logo: "pix",
    stack: ["React", "@xyflow/react", "CQRS", "SignalR"],
    sections: [
      {
        title: "Команды",
        text: "Действие пользователя превращается в команду: она уходит на бэкенд одна или пачкой и откатывается, если не применилась. Отсюда undo/redo и стыковка с Event Sourcing на бэкенде. Executor применяет изменения, которые приходят с сервера через SignalR.",
        diagram: "commands",
      },
      {
        title: "Слушатели",
        text: "Раньше карту в Redux мог поменять любой компонент напрямую, и один и тот же баг чинили в разных местах. Теперь события @xyflow/react сначала проходят через слушатели: они проверяют, корректируют, дополняют или блокируют изменение, и вся логика изменений карты живет в одном месте.",
        diagram: "listeners",
      },
      {
        title: "MapInstance",
        text: "Типизированный фасад над API канваса: выделение, позиции, навигация, загрузка данных. Одна точка входа для всей команды вместо своего подхода у каждого разработчика, плюс отдельное хранилище вместо Redux, поэтому элементы меньше перерисовываются.",
        diagram: "facade",
      },
    ],
  },
  {
    slug: "e2e",
    en: {"title": "E2E testing from scratch", "summary": "From zero tests to ~200 Playwright scenarios that both QA and developers rely on", "date": "2026", "result": "~200 full scenarios"},
    title: "E2E-тестирование с нуля",
    summary: "От нуля тестов до ~200 сценариев на Playwright, которым доверяют и QA, и разработчики",
    company: "PIX Robotics",
    date: "2026",
    sort: 202602,
    logo: "pix",
    stack: ["Playwright", "TypeScript", "Page Objects"],
    result: "~200 полноценных сценариев",
    sections: [
      {
        title: "Архитектура",
        text: "Page Objects со строгим DSL: разработчики готовят и поддерживают Page Object'ы и прячут в них всю сложность системы, тестировщики пишут сценарии поверх готовых классов. Каждый метод оборачивается в шаг, поэтому отчеты читаются как документация.",
      },
      {
        title: "С чего начали",
        text: "Первым покрыли самое сложное, undo/redo. Это заодно заставило довести до рабочего состояния многие функции канваса и дало базу, на которой остальные тесты добавлялись быстро. Для карты отдельный конструктор окружения, через него делаются все предусловия.",
      },
    ],
  },
  {
    slug: "design-system",
    en: {"title": "Design system of 3 npm packages", "summary": "A UI library on top of Ant Design 5, 740+ icons from Figma and design tokens", "date": "2025", "result": "Used by 3 of the company's 4 products"},
    title: "Дизайн-система из 3 npm-пакетов",
    summary: "UI-библиотека поверх Ant Design 5, 740+ иконок из Figma и дизайн-токены",
    company: "PIX Robotics",
    date: "2025",
    sort: 202504,
    logo: "pix",
    stack: ["Ant Design 5", "SVGO", "SVGR", "GitLab Registry"],
    result: "Пакеты используют 3 из 4 продуктов компании",
    sections: [
      {
        title: "Три пакета",
        text: "UI-библиотека: многие компоненты Ant Design пришлось оборачивать вручную, штатной темизации не хватало. Пакет иконок собрал с нуля: иконки выгружаются из Figma, проходят через SVGO и SVGR и становятся TypeScript-компонентами. Третий пакет с токенами цветов и типографики.",
        diagram: "designSystem",
      },
      {
        title: "Публикация",
        text: "Пакеты публикуются в GitLab Package Registry. Патч-версии CI выпускает сам, минорные и мажорные с архитектурными изменениями публикуются вручную.",
      },
    ],
  },
  {
    slug: "export",
    en: {"title": "Server-side map export", "summary": "Moved export from the browser to the server in headless Chromium, so large maps no longer freeze the tab", "date": "2025"},
    title: "Серверный экспорт карт",
    summary: "Экспорт перенес из браузера на сервер в headless Chromium, большие карты перестали вешать вкладку",
    company: "PIX Robotics",
    date: "2025",
    sort: 202503,
    logo: "pix",
    stack: ["C#", "PuppeteerSharp", "headless Chromium"],
    sections: [
      {
        title: "Было",
        text: "Картинки карт собирались прямо на фронте. На больших картах интерфейс замирал или падал, и точечные исправления не помогали.",
      },
      {
        title: "Стало",
        text: "Предложил и сделал другой подход: сервер мощнее машины клиента. Фронт отправляет настройки выгрузки, сервер открывает карту от имени пользователя в headless Chromium, дожидается готовности по скрытым маркерам и снимает скриншот в нужном качестве. Браузер поднимается один раз на сервис и переиспользуется.",
      },
      {
        title: "Что это дало потом",
        text: "Когда понадобилась выгрузка карты вместе с дочерними, решение уже было: сервер по очереди открывает каждую карту, проверяет права и упаковывает результат в zip. На клиенте такое было бы не сделать.",
      },
    ],
  },
  {
    slug: "igor",
    en: {"title": "IIgor, the product's AI assistant", "summary": "The assistant's frontend: streaming answers, animations and awareness of where the user is", "date": "2025"},
    title: "ИИгорь, AI-ассистент продукта",
    summary: "Фронт ассистента: стриминг ответов, анимации и понимание того, где сейчас пользователь",
    company: "PIX Robotics",
    date: "2025",
    sort: 202506,
    logo: "pix",
    stack: ["React", "стриминг", "Semantic Kernel"],
    sections: [
      {
        title: "Моя часть",
        text: "Делали вместе с техлидом, на мне был фронт: стриминг ответов, анимации и ситуационная модель. Ассистент знает, где сейчас пользователь, на канвасе или в Process Mining, и отвечает с учетом этого, а не как чат в вакууме.",
      },
    ],
  },
  {
    slug: "event-log",
    en: {"title": "Event log of 10M rows", "summary": "Replaced EF Core inserts with native COPY BINARY in PostgreSQL", "date": "2024", "result": "10M rows in about a minute"},
    title: "Журнал событий на 10 млн строк",
    summary: "Заменил вставку через EF Core на нативный COPY BINARY в PostgreSQL",
    company: "PIX Robotics",
    date: "2024",
    sort: 202410,
    logo: "pix",
    stack: ["C#", "PostgreSQL", "Npgsql"],
    result: "10 млн строк примерно за минуту",
    sections: [
      {
        title: "Было",
        text: "Журнал событий загружался через EF Core: миллион строк шел 1-2 минуты, а 10 миллионов почти не загружались.",
      },
      {
        title: "Стало",
        text: "Перешел на нативную загрузку COPY BINARY через Npgsql в обход EF Core. Протокол готовый, я написал потоковый парсинг файла и сопоставление типов. Миллион строк теперь грузится за 20-30 секунд, десять миллионов примерно за минуту. После загрузки фоновая задача приводит файл из 3-5 столбцов к единой схеме.",
      },
    ],
  },
  {
    slug: "fudkit",
    en: {"title": "FudKit: a POS in React", "summary": "Rewrote the POS module from Angular to React and connected it to an Atol fiscal printer", "date": "2021-2022"},
    title: "FudKit: касса на React",
    summary: "Переписал модуль кассы с Angular на React и подключил его к ККМ Atol",
    company: "ВиртуумЛаб",
    date: "2021-2022",
    sort: 202112,
    logo: "virtuum",
    stack: ["React", "TypeScript", "Redux", "C#"],
    sections: [
      {
        title: "Касса",
        text: "При миграции продукта с Angular на React полностью переписал модуль кассы вместе с редизайном, на собственных UI-компонентах без готовых китов. Касса печатает чек через локальный демон на C#, а на фронте своя обертка, чтобы код кассы не зависел от деталей оборудования.",
        diagram: "kkm",
      },
      {
        title: "Мультиязычность",
        text: "Сделал перевод всего продукта с нуля: бэкенд отдает .resx-словари на ru, en, de и it, фронт читает их по ключу. Переводы живут в одном месте и не расходятся.",
      },
    ],
  },
  {
    slug: "crm",
    en: {"title": "CRM for a client abroad", "summary": "Inventory, components and sales with analytics, built from scratch with one colleague", "date": "2022"},
    title: "CRM для зарубежного заказчика",
    summary: "Учет товаров, компонентов и продаж с аналитикой, с нуля вдвоем с коллегой",
    company: "ВиртуумЛаб",
    date: "2022",
    sort: 202203,
    logo: "virtuum",
    stack: ["C#", ".NET 6", "PostgreSQL", "React"],
    sections: [
      {
        title: "Моя часть",
        text: "Подняли систему с нуля вдвоем с коллегой. На мне был в основном бэкенд по архитектурным стандартам компании и мультиязычность, иногда помогал с фронтом.",
      },
    ],
  },
];

// Название места работы на нужном языке
export const companyLabel = (c: Company, lang: "ru" | "en") =>
  lang === "en" ? ({ "PIX Robotics": "PIX Robotics", ВиртуумЛаб: "VirtuumLab", Хакатон: "Hackathon" } as const)[c] : c;

// Текстовые поля проекта на нужном языке
export const projectText = (p: Project, lang: "ru" | "en") =>
  lang === "en" ? p.en : { title: p.title, summary: p.summary, date: p.date, result: p.result };

export const sortedProjects = [...projects].sort((a, b) => b.sort - a.sort);
