// Печатает резюме в PDF: public/resume-ru.pdf и public/resume-en.pdf.
// Нужен запущенный превью-сервер: npm run build && npx vite preview --port 4176
// Запуск: node scripts/resume.mjs [адрес сервера]
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  // в облачной среде playwright стоит глобально
  ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
}

const base = process.argv[2] ?? "http://localhost:4176/";
const browser = await chromium.launch();
for (const lang of ["ru", "en"]) {
  const page = await browser.newPage();
  await page.goto(`${base}?lang=${lang}#/resume`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: `public/resume-${lang}.pdf`, format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log(`public/resume-${lang}.pdf`);
}
await browser.close();
