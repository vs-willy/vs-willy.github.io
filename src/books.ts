// Книги для полки: название, автор, обложка (public/books, высота 600), цвет корешка и текста на нем, ссылка на книгу.
export type Book = {
  title: string;
  author: string;
  initials: string;
  cover: string;
  ratio: number; // ширина обложки к высоте
  color: string;
  ink: string;
  url: string;
  note?: string;
  en: { title: string; author: string; initials: string };
};

export const books: Book[] = [
  {
    title: "Накопительный эффект",
    en: {"title": "The Compound Effect", "author": "Darren Hardy", "initials": "DH"},
    author: "Даррен Харди",
    initials: "ДХ",
    cover: "compound-effect.jpg",
    ratio: 409 / 600,
    color: "#1d4467",
    ink: "#f4f1ea",
    url: "https://www.amazon.com/-/es/%D0%A5%D0%B0%D1%80%D0%B4%D0%B8-%D0%94%D0%B0%D1%80%D1%80%D0%B5%D0%BD-ebook/dp/B0D6RLRXGS",
  },
  {
    title: "Номер 1",
    en: {"title": "Number 1", "author": "Igor Mann", "initials": "IM"},
    author: "Игорь Манн",
    initials: "ИМ",
    cover: "number-one.jpg",
    ratio: 405 / 600,
    color: "#a3863f",
    ink: "#fbf7ec",
    url: "https://www.mann-ivanov-ferber.ru/catalog/product/nomer_odin/",
  },
  {
    title: "Грокаем алгоритмы",
    en: {"title": "Grokking Algorithms", "author": "Aditya Bhargava", "initials": "AB"},
    author: "Адитья Бхаргава",
    initials: "АБ",
    cover: "grokking-algorithms.jpg",
    ratio: 425 / 600,
    color: "#f3f1ec",
    ink: "#1b1b1b",
    url: "https://www.amazon.com/%D0%93%D1%80%D0%BE%D0%BA%D0%B0%D0%B5%D0%BC-%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D1%8B-%D0%98%D0%BB%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5-%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%81%D1%82%D0%BE%D0%B2-%D0%BB%D1%8E%D0%B1%D0%BE%D0%BF%D1%8B%D1%82%D1%81%D1%82%D0%B2%D1%83%D1%8E%D1%89%D0%B8%D1%85-ebook/dp/B09Y5WMVFP",
  },
  {
    title: "Чистый код",
    en: {"title": "Clean Code", "author": "Robert C. Martin", "initials": "RM"},
    author: "Роберт Мартин",
    initials: "РМ",
    cover: "clean-code.jpg",
    ratio: 428 / 600,
    color: "#f4d60c",
    ink: "#7a1d1d",
    url: "https://www.amazon.com/-/he/%D0%A0%D0%BE%D0%B1%D0%B5%D1%80%D1%82-%D0%9C%D0%B0%D1%80%D1%82%D0%B8%D0%BD-ebook/dp/B09Y5XJKPT",
  },
  {
    title: "Дизайнер интерфейсов",
    en: {"title": "Interface Designer", "author": "Ilya Sidorenko", "initials": "IS"},
    author: "Илья Сидоренко",
    initials: "ИС",
    cover: "interface-designer.jpg",
    ratio: 394 / 600,
    color: "#141414",
    ink: "#f4d60c",
    url: "https://iskros.com/book",
  },
  {
    title: "Спортивная анатомия",
    en: {"title": "Sports Anatomy", "author": "Torsten Gerke", "initials": "TG"},
    author: "Торстен Герке",
    initials: "ТГ",
    cover: "sport-anatomy.jpg",
    ratio: 416 / 600,
    color: "#3a5aa3",
    ink: "#f4f1ea",
    url: "https://knizhka.us/products/%D1%82%D0%BE%D1%80%D1%81%D1%82%D0%B5%D0%BD-%D0%B3%D0%B5%D1%80%D0%BA%D0%B5-%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D0%B0%D1%8F-%D0%B0%D0%BD%D0%B0%D1%82%D0%BE%D0%BC%D0%B8%D1%8F",
  },
  {
    title: "Lagom",
    en: {"title": "Lagom", "author": "Lola A. Åkerström", "initials": "LÅ"},
    author: "Лола Экерстрём",
    initials: "ЛЭ",
    cover: "lagom.jpg",
    ratio: 421 / 600,
    color: "#12aee3",
    ink: "#ffffff",
    url: "https://www.chitai-gorod.ru/product/lagom-sekret-shvedskogo-blagopoluchiya-2617833",
  },
];
