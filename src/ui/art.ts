// Исходники для точечных картинок. Серые градиенты превращаются в фактуру дизеринга.

const defs = `<defs>
<linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#555"/></linearGradient>
<linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ddd"/><stop offset="1" stop-color="#333"/></linearGradient>
<radialGradient id="g3" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#222"/></radialGradient>
</defs>`;

// Главная картинка вместо портрета: процессная карта с развилкой и обратной веткой
export const heroArt = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">${defs}
<rect width="240" height="240" fill="#fff"/>
<g stroke="#111" stroke-width="3" fill="none" stroke-linecap="round">
<path d="M46 52 V84"/><path d="M46 124 V150"/><path d="M68 170 H112"/><path d="M180 170 H196 V128"/>
<path d="M150 150 V112 H66"/><path d="M196 88 V60 H150"/>
</g>
<circle cx="46" cy="38" r="14" fill="url(#g3)" stroke="#111" stroke-width="3"/>
<rect x="14" y="84" width="64" height="40" rx="9" fill="url(#g1)" stroke="#111" stroke-width="3"/>
<rect x="31" y="148" width="30" height="30" rx="5" transform="rotate(45 46 163)" fill="url(#g2)" stroke="#111" stroke-width="3"/>
<rect x="112" y="150" width="68" height="40" rx="9" fill="url(#g1)" stroke="#111" stroke-width="3"/>
<rect x="164" y="88" width="64" height="40" rx="9" fill="url(#g2)" stroke="#111" stroke-width="3"/>
<circle cx="132" cy="60" r="16" fill="url(#g3)" stroke="#111" stroke-width="5"/>
<path d="M106 112 l-10 -6 v12 z" fill="#111"/><path d="M196 132 l-6 -10 h12 z" fill="#111"/>
</svg>`;

// Обертка иконки в квадрат с градиентным фоном для миниатюр проектов
export function thumbArt(iconPath: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40">${defs}
<rect width="64" height="40" fill="#fff"/>
<g transform="translate(17 5) scale(0.1172)" fill="url(#g2)">${iconPath}</g>
</svg>`;
}
