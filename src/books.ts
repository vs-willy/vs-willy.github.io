// Книги для полки: название, автор, цвет корешка, ссылка на книгу.
export type Book = { title: string; author: string; color: string; url: string; note?: string };

export const books: Book[] = [
  {
    title: "Накопительный эффект",
    author: "Даррен Харди",
    color: "oklch(0.32 0.04 255)",
    url: "https://www.amazon.com/-/es/%D0%A5%D0%B0%D1%80%D0%B4%D0%B8-%D0%94%D0%B0%D1%80%D1%80%D0%B5%D0%BD-ebook/dp/B0D6RLRXGS",
  },
  {
    title: "Номер 1",
    author: "Игорь Манн",
    color: "oklch(0.58 0.17 30)",
    url: "https://www.mann-ivanov-ferber.ru/catalog/product/nomer_odin/",
  },
  {
    title: "Грокаем алгоритмы",
    author: "Адитья Бхаргава",
    color: "oklch(0.72 0.11 85)",
    url: "https://www.amazon.com/%D0%93%D1%80%D0%BE%D0%BA%D0%B0%D0%B5%D0%BC-%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D1%8B-%D0%98%D0%BB%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5-%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%81%D1%82%D0%BE%D0%B2-%D0%BB%D1%8E%D0%B1%D0%BE%D0%BF%D1%8B%D1%82%D1%81%D1%82%D0%B2%D1%83%D1%8E%D1%89%D0%B8%D1%85-ebook/dp/B09Y5WMVFP",
  },
  {
    title: "Чистый код",
    author: "Роберт Мартин",
    color: "oklch(0.45 0.08 160)",
    url: "https://www.amazon.com/-/he/%D0%A0%D0%BE%D0%B1%D0%B5%D1%80%D1%82-%D0%9C%D0%B0%D1%80%D1%82%D0%B8%D0%BD-ebook/dp/B09Y5XJKPT",
  },
  {
    title: "Дизайнер интерфейсов",
    author: "Илья Сидоренко",
    color: "oklch(0.88 0.01 90)",
    url: "https://iskros.com/book",
  },
  {
    title: "Спортивная анатомия",
    author: "Торстен Герке",
    color: "oklch(0.5 0.12 300)",
    url: "https://knizhka.us/products/%D1%82%D0%BE%D1%80%D1%81%D1%82%D0%B5%D0%BD-%D0%B3%D0%B5%D1%80%D0%BA%D0%B5-%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D0%B0%D1%8F-%D0%B0%D0%BD%D0%B0%D1%82%D0%BE%D0%BC%D0%B8%D1%8F",
  },
];
