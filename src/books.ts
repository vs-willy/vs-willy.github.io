// Книги для полки. Заполняется по списку от Виталия: название, автор, цвет корешка, по желанию фраза.
export type Book = { title: string; author: string; color: string; note?: string };

export const books: Book[] = [];
