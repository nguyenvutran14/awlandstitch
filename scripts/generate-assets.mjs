import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = path.join(ROOT, 'public', 'images');

const C = {
  paper: '#f7efe4',
  paper2: '#efe2d2',
  surface: '#fffaf2',
  ink: '#241a14',
  muted: '#5c4b3f',
  line: '#d9cbbd',
  leather: '#8a4b1f',
  leatherDark: '#5e2f12',
  tan: '#c98f5a',
  tanLight: '#e6c39f',
  steel: '#b9c2c7',
  steelDark: '#7d8a91',
  blue: '#145c8e',
  green: '#3f6b4a',
  white: '#fffdf9'
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', Arial, sans-serif";

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function t(x, y, text, options = {}) {
  const {
    size = 24,
    fill = C.ink,
    weight = 400,
    anchor = 'start',
    family = 'sans',
    opacity = 1,
    letter = 0
  } = options;
  return `<text x="${x}" y="${y}" font-family="${family === 'serif' ? SERIF : SANS}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}"${letter ? ` letter-spacing="${letter}"` : ''}>${esc(text)}</text>`;
}

function rect(x, y, w, h, fill, rx = 0, stroke = 'none', sw = 0, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"/>`;
}

function line(x1, y1, x2, y2, stroke, sw = 2, dash = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-linecap="round"/>`;
}

function circle(cx, cy, r, fill, stroke = 'none', sw = 0) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function pathEl(d, fill = 'none', stroke = 'none', sw = 2, opacity = 1) {
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function label(x, y, text, options = {}) {
  const { size = 18, fill = C.surface, textFill = C.ink, stroke = C.line, pad = 16 } = options;
  const width = Math.max(70, text.length * size * 0.55 + pad * 2);
  return `${rect(x, y - size - 8, width, size + 16, fill, (size + 16) / 2, stroke, 1)}${t(x + pad, y, text, { size, fill: textFill, weight: 600 })}`;
}

function card(x, y, w, h, fill = C.surface, stroke = C.line) {
  return `${rect(x + 7, y + 9, w, h, '#000', 18, 'none', 0, 0.06)}${rect(x, y, w, h, fill, 18, stroke, 1.5)}`;
}

function iron({ x, y, teeth = 5, scale = 1, angle = 0, handle = C.leather, metal = C.steel, pitch = 18, toothLength = 52 }) {
  const toothWidth = 8;
  const start = 360;
  const teethSvg = Array.from({ length: teeth }, (_, index) => {
    const tx = start + index * pitch;
    return pathEl(`M ${tx} 26 L ${tx + toothWidth} 26 L ${tx + toothWidth - 2} ${26 + toothLength} L ${tx + 2} ${26 + toothLength} Z`, metal);
  }).join('');
  const shaftWidth = teeth === 1 ? 175 : 170 + teeth * pitch;
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
    ${rect(0, 0, 180, 38, handle, 19)}
    ${rect(14, 6, 148, 8, '#ffffff', 4, 'none', 0, 0.2)}
    ${rect(172, -2, 18, 42, C.steelDark, 5)}
    ${rect(188, 8, shaftWidth, 22, metal, 4)}
    ${rect(196, 12, shaftWidth - 20, 5, '#ffffff', 2.5, 'none', 0, 0.25)}
    ${teethSvg}
  </g>`;
}

function awl({ x, y, scale = 1, angle = 0, handle = C.leatherDark }) {
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
    ${rect(0, 0, 148, 30, handle, 15)}
    ${rect(12, 5, 118, 6, '#ffffff', 3, 'none', 0, 0.18)}
    ${rect(140, -1, 16, 32, C.steelDark, 4)}
    ${pathEl('M 156 15 L 272 15 L 292 12 L 272 18 Z', C.steel)}
    ${circle(292, 12, 2.5, C.steelDark)}
  </g>`;
}

function spool({ x, y, scale = 1, thread = C.tan }) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    ${rect(0, 0, 96, 20, C.leatherDark, 8)}
    ${rect(0, 96, 96, 20, C.leatherDark, 8)}
    ${rect(16, 18, 64, 80, thread, 4)}
    ${Array.from({ length: 8 }, (_, i) => line(18, 26 + i * 9, 78, 26 + i * 9, '#ffffff', 2, '')).join('')}
    ${pathEl('M 80 30 C 150 10, 190 70, 160 120', 'none', thread, 4)}
  </g>`;
}

function swatch({ x, y, w = 420, h = 250, angle = 0, stitches = 9, fill = C.leather }) {
  const holes = Array.from({ length: stitches }, (_, i) => {
    const px = 34 + (i * (w - 68)) / (stitches - 1);
    return `${circle(px, 34, 5, C.paper)}${circle(px, h - 34, 5, C.paper)}`;
  }).join('');
  const threads = Array.from({ length: stitches - 1 }, (_, i) => {
    const x1 = 34 + (i * (w - 68)) / (stitches - 1);
    const x2 = 34 + ((i + 1) * (w - 68)) / (stitches - 1);
    return `${line(x1 + 4, 34, x2 - 4, h - 34, C.tanLight, 3)}${line(x1 + 4, h - 34, x2 - 4, 34, C.tanLight, 3)}`;
  }).join('');
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    ${rect(0, 0, w, h, fill, 16, C.leatherDark, 2)}
    ${rect(10, 10, w - 20, h - 20, 'none', 12, C.tanLight, 1, 0.5)}
    ${holes}
    ${threads}
  </g>`;
}

function holes({ x, y, count = 8, pitch = 24, angle = 0, thread = true, hole = 5 }) {
  const circles = Array.from({ length: count }, (_, i) => circle(i * pitch, 0, hole, C.paper, C.leatherDark, 1.5)).join('');
  const threads = thread
    ? Array.from({ length: count - 1 }, (_, i) => line(i * pitch + hole, -hole, (i + 1) * pitch - hole, hole, C.tan, 2)).join('')
    : '';
  return `<g transform="translate(${x} ${y}) rotate(${angle})">${rect(-18, -18, (count - 1) * pitch + 36, 36, C.leather, 10)}${circles}${threads}</g>`;
}

function ruler({ x, y, width = 520, labels = ['0', '10', '20', '25.4 mm'], ticks = 20 }) {
  const tickSvg = Array.from({ length: ticks + 1 }, (_, i) => {
    const tx = x + (i * width) / ticks;
    const tall = i % 5 === 0;
    return line(tx, y, tx, y + (tall ? 24 : 12), C.muted, tall ? 2 : 1);
  }).join('');
  const labelSvg = labels
    .map((text, index) => t(x + (index * width) / (labels.length - 1), y + 52, text, { size: 18, fill: C.muted, anchor: index === 0 ? 'start' : index === labels.length - 1 ? 'end' : 'middle' }))
    .join('');
  return `${line(x, y, x + width, y, C.ink, 3)}${tickSvg}${labelSvg}`;
}

function bar({ x, y, w, h, fill, value, name, note = '' }) {
  return `<g>
    ${rect(x, y, w, h, fill, 8)}
    ${t(x, y - 12, value, { size: 24, weight: 700, fill: C.ink })}
    ${t(x, y + h + 28, name, { size: 16, weight: 600, fill: C.ink })}
    ${note ? t(x, y + h + 50, note, { size: 13, fill: C.muted }) : ''}
  </g>`;
}

function check(x, y, text, size = 22) {
  return `<g>
    ${circle(x + 14, y - 7, 14, C.green)}
    ${pathEl(`M ${x + 7} ${y - 7} L ${x + 12} ${y - 2} L ${x + 21} ${y - 13}`, 'none', C.white, 3)}
    ${t(x + 40, y, text, { size, fill: C.ink, weight: 500 })}
  </g>`;
}

function arrow(x1, y1, x2, y2, color = C.leather, sw = 3) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 10;
  const p1 = `${x2 - head * Math.cos(angle - Math.PI / 6)} ${y2 - head * Math.sin(angle - Math.PI / 6)}`;
  const p2 = `${x2 - head * Math.cos(angle + Math.PI / 6)} ${y2 - head * Math.sin(angle + Math.PI / 6)}`;
  return `${line(x1, y1, x2, y2, color, sw)}${pathEl(`M ${x2} ${y2} L ${p1} L ${p2} Z`, color)}`;
}

function svg(title, desc, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title>
<desc id="desc">${esc(desc)}</desc>
${rect(0, 0, 1200, 675, C.paper)}
${body}
</svg>
`;
}

function heroFrame(eyebrow, title, subtitle) {
  return `${circle(1040, 120, 220, C.paper2, 'none', 0, 0.7)}
    ${t(64, 82, eyebrow, { size: 18, weight: 700, fill: C.leatherDark, letter: 3 })}
    ${t(64, 148, title, { size: 52, weight: 700, family: 'serif', fill: C.ink })}
    ${t(64, 194, subtitle, { size: 20, fill: C.muted })}`;
}

const assets = {};

/* Home hero */
assets['home-hero.svg'] = svg(
  'Leathercraft hand tools illustration',
  'A pricking iron, an awl, a spool of waxed thread, and a stitched leather swatch.',
  `${heroFrame('AWL & STITCH', 'Prick. Stitch. Repeat.', 'The hand-stitching bench, researched before you buy.')}
  ${swatch({ x: 690, y: 230, w: 390, h: 250, angle: -4, stitches: 10 })}
  ${iron({ x: 120, y: 300, teeth: 8, scale: 1.25, angle: -12 })}
  ${iron({ x: 160, y: 390, teeth: 2, scale: 1.1, angle: -8, handle: C.tan })}
  ${awl({ x: 150, y: 510, scale: 1.05, angle: -18 })}
  ${spool({ x: 870, y: 510, scale: 0.85 })}
  ${label(170, 575, 'pricking iron', { fill: C.surface, textFill: C.ink })}
  ${label(400, 610, 'awl', { fill: C.surface, textFill: C.ink })}
  ${label(875, 640, 'waxed thread', { fill: C.surface, textFill: C.ink })}
  ${t(64, 620, 'No bench tests. Dated listings. Direct links.', { size: 18, fill: C.muted })}`
);

/* Hub hero */
assets['best-pricking-irons-hero.svg'] = svg(
  'Five pricking iron picks illustration',
  'Five pricking iron silhouettes with labels for WUTA, MOZHE, JOTUN, a 20-tooth iron, and an interchangeable set.',
  `${heroFrame('THE SHORTLIST', 'Five pricking irons, one decision.', 'US shipping checked Â· prices dated November 2026')}
  ${iron({ x: 100, y: 300, teeth: 2, scale: 1.15, angle: -16 })}
  ${iron({ x: 170, y: 380, teeth: 5, scale: 1.12, angle: -10, handle: C.leatherDark })}
  ${iron({ x: 240, y: 460, teeth: 8, scale: 1.08, angle: -4, handle: C.tan })}
  ${iron({ x: 410, y: 500, teeth: 20, scale: 0.78, angle: 0, pitch: 14, handle: C.leatherDark })}
  ${iron({ x: 720, y: 330, teeth: 5, scale: 0.95, angle: 8, handle: C.leather })}
  ${label(80, 265, 'WUTA 1pc', { fill: C.surface })}
  ${label(170, 345, 'MOZHE', { fill: C.surface })}
  ${label(250, 425, 'JOTUN M2', { fill: C.surface })}
  ${label(430, 590, 'WUTA 20T', { fill: C.surface })}
  ${label(760, 295, 'WUTA set', { fill: C.surface })}
  ${t(760, 520, 'Prices at time of writing.', { size: 16, fill: C.muted })}
  ${t(760, 548, 'Check the variant and checkout total.', { size: 16, fill: C.muted })}`
);

/* Hub pick 1 */
assets['best-pricking-irons-pick1-wuta-1pc.svg'] = svg(
  'WUTA one-piece pricking iron illustration',
  'A WUTA one-piece pricking iron with two-tooth and eight-tooth options, labeled $14.79 at time of writing.',
  `${heroFrame('PICK 1 Â· BEST OVERALL', 'WUTA 1-piece French iron', '2, 5, or 8 teeth Â· 2.7â€“3.85mm Â· obverse or reverse')}
  ${card(70, 245, 700, 340)}
  ${iron({ x: 120, y: 330, teeth: 8, scale: 1.15, angle: -8 })}
  ${iron({ x: 160, y: 455, teeth: 2, scale: 1.05, angle: -4, handle: C.tan })}
  ${label(620, 300, '$14.79', { size: 24, fill: C.leather, textFill: C.white })}
  ${t(620, 360, 'List $43.14', { size: 18, fill: C.muted })}
  ${t(620, 405, '4.9 / 5 Â· 82 reviews', { size: 18, fill: C.ink, weight: 600 })}
  ${t(620, 445, '500+ sold', { size: 18, fill: C.ink, weight: 600 })}
  ${t(620, 490, 'US warehouse: 3â€“10 days', { size: 16, fill: C.muted })}
  ${t(620, 518, 'YunExpress: 5â€“13 days', { size: 16, fill: C.muted })}
  ${t(70, 625, 'Roughly 38 variants. Match pitch, teeth, and obverse/reverse before checkout.', { size: 16, fill: C.muted })}`
);

/* Hub pick 2 */
assets['best-pricking-irons-pick2-mozhe.svg'] = svg(
  'MOZHE pricking iron illustration',
  'A five-tooth MOZHE pricking iron with a dark handle, labeled $22.86 approximate at time of writing.',
  `${heroFrame('PICK 2 Â· BEST FINISH', 'MOZHE French iron', '5 teeth Â· polished finish Â· price converted from VND')}
  ${card(70, 245, 700, 340)}
  ${iron({ x: 140, y: 355, teeth: 5, scale: 1.35, angle: -6, handle: C.leatherDark, metal: C.steel })}
  ${label(620, 300, '$22.86 Â±10%', { size: 22, fill: C.leather, textFill: C.white })}
  ${t(620, 360, 'VND conversion, Nov 6, 2026', { size: 16, fill: C.muted })}
  ${t(620, 405, '5.0 / 5 Â· 3 ratings', { size: 18, fill: C.ink, weight: 600 })}
  ${t(620, 445, 'Shipping not verified', { size: 18, fill: C.leatherDark, weight: 700 })}
  ${t(620, 490, 'Check the live variant price', { size: 16, fill: C.muted })}
  ${t(70, 625, 'The finish looks more expensive than the price. Confirm the seller and variant.', { size: 16, fill: C.muted })}`
);

/* Hub pick 3 */
assets['best-pricking-irons-pick3-jotun.svg'] = svg(
  'JOTUN M2 pricking iron illustration',
  'A five-tooth JOTUN M2 steel pricking iron labeled $35.17 approximate at time of writing.',
  `${heroFrame('PICK 3 Â· BEST STEEL', 'JOTUN M2 French iron', 'M2 steel Â· 5 teeth Â· price converted from VND')}
  ${card(70, 245, 700, 340)}
  ${iron({ x: 140, y: 355, teeth: 5, scale: 1.35, angle: -6, handle: C.leather, metal: C.steelDark })}
  ${label(620, 300, '$35.17 Â±10%', { size: 22, fill: C.leather, textFill: C.white })}
  ${t(620, 360, 'VND conversion, Nov 6, 2026', { size: 16, fill: C.muted })}
  ${t(620, 405, '5.0 / 5 Â· 2 ratings', { size: 18, fill: C.ink, weight: 600 })}
  ${t(620, 445, 'Shipping not verified', { size: 18, fill: C.leatherDark, weight: 700 })}
  ${t(620, 490, 'M2 tool steel is the draw', { size: 16, fill: C.muted })}
  ${t(70, 625, 'A niche pick for buyers who want the steel spec, not the lowest price.', { size: 16, fill: C.muted })}`
);

/* Hub pick 4 */
assets['best-pricking-irons-pick4-wuta-20tooth.svg'] = svg(
  'WUTA twenty-tooth pricking iron illustration',
  'A long twenty-tooth WUTA pricking iron for straight runs, labeled $103.19 at time of writing.',
  `${heroFrame('PICK 4 Â· LONG RUNS', 'WUTA 20-tooth iron', '20 teeth Â· long straight runs Â· not a beginner first buy')}
  ${card(60, 270, 760, 300)}
  ${iron({ x: 100, y: 380, teeth: 20, scale: 0.9, angle: -2, pitch: 14, handle: C.leatherDark })}
  ${label(860, 300, '$103.19', { size: 24, fill: C.leather, textFill: C.white })}
  ${t(860, 360, '5.0 / 5 Â· 5 ratings', { size: 18, fill: C.ink, weight: 600 })}
  ${t(860, 400, '28 sold', { size: 18, fill: C.ink, weight: 600 })}
  ${t(860, 445, 'Free standard shipping', { size: 16, fill: C.muted })}
  ${t(860, 473, 'Carrier not named', { size: 16, fill: C.leatherDark, weight: 700 })}
  ${t(70, 625, 'Buy this only after you know your pitch. It is a specialist straight-run tool.', { size: 16, fill: C.muted })}`
);

/* Hub pick 5 */
assets['best-pricking-irons-pick5-wuta-set.svg'] = svg(
  'WUTA interchangeable head set illustration',
  'A WUTA interchangeable-head set with a handle and multiple heads, labeled $8.33 for a single head and about $162 for a full set.',
  `${heroFrame('PICK 5 Â· THE SYSTEM', 'WUTA interchangeable set', '29 heads Â· one handle Â· buy heads as you need them')}
  ${card(60, 245, 760, 340)}
  ${rect(120, 300, 210, 40, C.leather, 20)}
  ${rect(310, 296, 28, 48, C.steelDark, 6)}
  ${pathEl('M 338 320 L 470 320', 'none', C.steel, 8)}
  ${Array.from({ length: 4 }, (_, i) => iron({ x: 360 + i * 95, y: 350 + i * 42, teeth: i === 3 ? 8 : 5, scale: 0.55, angle: i * 4, handle: C.tan, metal: C.steel })).join('')}
  ${label(860, 300, '$8.33', { size: 24, fill: C.leather, textFill: C.white })}
  ${t(860, 360, 'single head, at time of writing', { size: 15, fill: C.muted })}
  ${t(860, 405, 'â‰ˆ$162 full set', { size: 20, fill: C.ink, weight: 700 })}
  ${t(860, 445, '4.8 / 5 Â· 55 reviews', { size: 16, fill: C.muted })}
  ${t(860, 473, '437 sold', { size: 16, fill: C.muted })}
  ${t(70, 625, 'The entry price is a single head, not the whole set. Read the variant list carefully.', { size: 16, fill: C.muted })}`
);

/* Hub tooth counts */
assets['best-pricking-irons-tooth-counts.svg'] = svg(
  'Pricking iron tooth counts diagram',
  'Tooth counts two, five, eight, and twenty with their typical uses: corners, short runs, straight runs, and long runs.',
  `${heroFrame('TOOTH COUNTS', 'More teeth is not always better.', 'Match the head to the length of the run.')}
  ${card(60, 235, 1080, 370)}
  ${t(100, 285, '2 teeth', { size: 22, weight: 700, family: 'serif' })}
  ${holes({ x: 140, y: 330, count: 2, pitch: 34, thread: false })}
  ${t(100, 380, 'Corners and tight curves', { size: 16, fill: C.muted })}
  ${t(100, 455, '5 teeth', { size: 22, weight: 700, family: 'serif' })}
  ${holes({ x: 140, y: 500, count: 5, pitch: 30, thread: false })}
  ${t(100, 550, 'Short runs and small goods', { size: 16, fill: C.muted })}
  ${t(520, 285, '8 teeth', { size: 22, weight: 700, family: 'serif' })}
  ${holes({ x: 560, y: 330, count: 8, pitch: 26, thread: false })}
  ${t(520, 380, 'Straight runs and wallets', { size: 16, fill: C.muted })}
  ${t(520, 455, '20 teeth', { size: 22, weight: 700, family: 'serif' })}
  ${holes({ x: 560, y: 500, count: 20, pitch: 15, thread: false, hole: 4 })}
  ${t(520, 550, 'Long straight runs and production', { size: 16, fill: C.muted })}
  ${t(60, 645, 'A 2-tooth plus 8-tooth pair covers most beginner wallet work.', { size: 16, fill: C.muted })}`
);

/* Hub landed cost */
assets['best-pricking-irons-landed-cost.svg'] = svg(
  'Item price comparison chart',
  'Bar chart comparing item prices: WUTA 1-piece $14.79, MOZHE $22.86, JOTUN $35.17, WUTA 20-tooth $103.19, and WUTA set full set about $162.',
  `${heroFrame('CHECKOUT MATH', 'Item price is not the landed cost.', 'Shipping, variant, and duties change the total.')}
  ${card(60, 235, 1080, 360)}
  ${bar({ x: 110, y: 390, w: 80, h: 80, fill: C.leather, value: '$14.79', name: 'WUTA 1pc', note: 'US warehouse' })}
  ${bar({ x: 270, y: 360, w: 80, h: 110, fill: C.leather, value: '$22.86', name: 'MOZHE', note: 'Â±10%' })}
  ${bar({ x: 430, y: 320, w: 80, h: 150, fill: C.leather, value: '$35.17', name: 'JOTUN', note: 'Â±10%' })}
  ${bar({ x: 590, y: 280, w: 80, h: 190, fill: C.leather, value: '$103.19', name: 'WUTA 20T', note: 'carrier unnamed' })}
  ${bar({ x: 750, y: 250, w: 80, h: 220, fill: C.leatherDark, value: 'â‰ˆ$162', name: 'WUTA set', note: 'full set' })}
  ${t(900, 300, 'Add shipping and any duties at checkout.', { size: 18, fill: C.ink, weight: 600 })}
  ${t(900, 332, 'We show item prices only.', { size: 16, fill: C.muted })}
  ${t(900, 360, 'Verify the variant total.', { size: 16, fill: C.muted })}
  ${t(60, 645, 'Prices at time of writing, November 2026. Checkout total is authoritative.', { size: 16, fill: C.muted })}`
);

/* Budget hero */
assets['best-budget-pricking-irons-hero.svg'] = svg(
  'Budget pricking irons illustration',
  'Three budget pricking iron options with price tags under thirty dollars at time of writing.',
  `${heroFrame('UNDER $30', 'Three budget irons that make sense.', 'Prices dated November 2026 Â· shipping checked separately')}
  ${iron({ x: 100, y: 320, teeth: 8, scale: 1.2, angle: -12 })}
  ${iron({ x: 180, y: 430, teeth: 5, scale: 1.1, angle: -5, handle: C.leatherDark })}
  ${iron({ x: 260, y: 530, teeth: 5, scale: 0.9, angle: 2, handle: C.tan })}
  ${label(110, 285, '$14.79', { size: 20, fill: C.leather, textFill: C.white })}
  ${label(190, 395, '$22.86 Â±10%', { size: 20, fill: C.leather, textFill: C.white })}
  ${label(270, 495, '$8.33 head', { size: 20, fill: C.leather, textFill: C.white })}
  ${t(760, 300, 'Budget does not mean disposable.', { size: 34, weight: 700, family: 'serif' })}
  ${t(760, 345, 'Check teeth alignment, burrs, and the variant.', { size: 18, fill: C.muted })}
  ${t(760, 395, 'The cheapest listing is rarely the cheapest mistake.', { size: 18, fill: C.muted })}
  ${t(760, 470, 'All three picks are under $30 at time of writing.', { size: 16, fill: C.muted })}`
);

/* Budget pick 1 */
assets['best-budget-pricking-irons-pick1-wuta-1pc.svg'] = svg(
  'Budget WUTA one-piece pricking iron illustration',
  'A WUTA one-piece pricking iron labeled $14.79, the budget pick for a first iron.',
  `${heroFrame('BUDGET PICK 1', 'WUTA 1-piece', 'The safest first iron under $30')}
  ${card(70, 250, 700, 330)}
  ${iron({ x: 130, y: 350, teeth: 8, scale: 1.25, angle: -7 })}
  ${iron({ x: 170, y: 470, teeth: 2, scale: 1.05, angle: -2, handle: C.tan })}
  ${label(620, 300, '$14.79', { size: 24, fill: C.leather, textFill: C.white })}
  ${t(620, 360, '4.9 / 5 Â· 82 reviews', { size: 18, fill: C.ink, weight: 600 })}
  ${t(620, 400, '500+ sold', { size: 18, fill: C.ink, weight: 600 })}
  ${t(620, 445, 'US warehouse: 3â€“10 days', { size: 16, fill: C.muted })}
  ${t(620, 473, 'YunExpress: 5â€“13 days', { size: 16, fill: C.muted })}
  ${t(70, 625, 'Pick 3.38mm or 3.85mm, 2-tooth plus 8-tooth, and inspect on arrival.', { size: 16, fill: C.muted })}`
);

/* Budget pick 2 */
assets['best-budget-pricking-irons-pick2-mozhe.svg'] = svg(
  'Budget MOZHE pricking iron illustration',
  'A five-tooth MOZHE pricking iron labeled $22.86 approximate, the budget pick for a polished finish.',
  `${heroFrame('BUDGET PICK 2', 'MOZHE French iron', 'A polished look for a mid-budget price')}
  ${card(70, 250, 700, 330)}
  ${iron({ x: 150, y: 365, teeth: 5, scale: 1.4, angle: -5, handle: C.leatherDark })}
  ${label(620, 300, '$22.86 Â±10%', { size: 22, fill: C.leather, textFill: C.white })}
  ${t(620, 360, 'VND conversion, Nov 6, 2026', { size: 16, fill: C.muted })}
  ${t(620, 400, '5.0 / 5 Â· 3 ratings', { size: 18, fill: C.ink, weight: 600 })}
  ${t(620, 440, 'Shipping not verified', { size: 18, fill: C.leatherDark, weight: 700 })}
  ${t(620, 485, 'Check the live variant price', { size: 16, fill: C.muted })}
  ${t(70, 625, 'A finish upgrade, not a specs upgrade. Confirm the seller before buying.', { size: 16, fill: C.muted })}`
);

/* Budget pick 3 */
assets['best-budget-pricking-irons-pick3-wuta-set.svg'] = svg(
  'Budget WUTA interchangeable head set illustration',
  'A WUTA interchangeable head set with a single head price of $8.33, the budget entry into a modular system.',
  `${heroFrame('BUDGET PICK 3', 'WUTA interchangeable set', 'Start with one head, add as you need')}
  ${card(60, 250, 760, 330)}
  ${rect(120, 340, 200, 38, C.leather, 19)}
  ${rect(300, 336, 26, 46, C.steelDark, 6)}
  ${pathEl('M 326 360 L 440 360', 'none', C.steel, 7)}
  ${iron({ x: 330, y: 400, teeth: 5, scale: 0.7, angle: 4, handle: C.tan })}
  ${iron({ x: 430, y: 440, teeth: 8, scale: 0.65, angle: 8, handle: C.tan })}
  ${label(860, 300, '$8.33', { size: 24, fill: C.leather, textFill: C.white })}
  ${t(860, 360, 'single head, at time of writing', { size: 15, fill: C.muted })}
  ${t(860, 405, 'â‰ˆ$162 full set', { size: 20, fill: C.ink, weight: 700 })}
  ${t(860, 445, '4.8 / 5 Â· 55 reviews', { size: 16, fill: C.muted })}
  ${t(860, 473, '437 sold', { size: 16, fill: C.muted })}
  ${t(70, 625, 'The $8.33 price is one head. The full set is a different purchase.', { size: 16, fill: C.muted })}`
);

/* Budget landed cost */
assets['best-budget-pricking-irons-landed-cost.svg'] = svg(
  'Budget item price comparison chart',
  'Bar chart comparing budget item prices: WUTA 1-piece $14.79, MOZHE $22.86, and WUTA single head $8.33, with a note that shipping and duties are extra.',
  `${heroFrame('BUDGET MATH', 'The sticker price is the start.', 'Shipping and duties decide the real total.')}
  ${card(60, 235, 1080, 360)}
  ${bar({ x: 150, y: 340, w: 90, h: 130, fill: C.leather, value: '$8.33', name: 'WUTA head', note: 'single head' })}
  ${bar({ x: 360, y: 310, w: 90, h: 160, fill: C.leather, value: '$14.79', name: 'WUTA 1pc', note: 'US warehouse' })}
  ${bar({ x: 570, y: 270, w: 90, h: 200, fill: C.leather, value: '$22.86', name: 'MOZHE', note: 'Â±10%' })}
  ${t(760, 300, 'All three are under $30.', { size: 22, weight: 700, family: 'serif' })}
  ${t(760, 340, 'Shipping can still push one over.', { size: 18, fill: C.muted })}
  ${t(760, 380, 'Check the variant and checkout total.', { size: 18, fill: C.muted })}
  ${t(60, 645, 'Item prices only. Shipping and any duties are extra and vary by variant.', { size: 16, fill: C.muted })}`
);

/* Budget QC checklist */
assets['best-budget-pricking-irons-qc-checklist.svg'] = svg(
  'Budget pricking iron quality check checklist',
  'A six-item checklist for inspecting a budget pricking iron on arrival.',
  `${heroFrame('ON ARRIVAL', 'Six checks before you stitch.', 'A budget iron can be good. Inspect it like a budget iron.')}
  ${card(60, 230, 1080, 370)}
  ${check(100, 285, 'Teeth are aligned and evenly spaced', 20)}
  ${check(100, 340, 'No burrs or rolled tips', 20)}
  ${check(100, 395, 'Handle is tight, no wobble', 20)}
  ${check(100, 450, 'Variant matches the listing', 20)}
  ${check(100, 505, 'Return window is still open', 20)}
  ${check(100, 560, 'Test on scrap leather first', 20)}
  ${t(650, 300, 'If any check fails,', { size: 22, weight: 700, family: 'serif' })}
  ${t(650, 335, 'open a return before use.', { size: 22, weight: 700, family: 'serif' })}
  ${t(650, 385, 'Do not â€œfixâ€ a burr by force.', { size: 17, fill: C.muted })}
  ${t(650, 415, 'A return is cheaper than a ruined panel.', { size: 17, fill: C.muted })}`
);

/* Budget price ladder */
assets['best-budget-pricking-irons-price-ladder.svg'] = svg(
  'Budget pricking iron price ladder',
  'A price ladder showing a WUTA single head at $8.33, a WUTA one-piece at $14.79, a MOZHE at $22.86, and a WUTA full set at about $162.',
  `${heroFrame('PRICE LADDER', 'Buy the entry point, not the system.', 'Prices at time of writing.')}
  ${card(60, 230, 1080, 370)}
  ${rect(120, 530, 900, 12, C.line, 6)}
  ${rect(120, 480, 160, 44, C.tanLight, 8)}
  ${rect(310, 420, 160, 104, C.tan, 8)}
  ${rect(500, 350, 160, 174, C.leather, 8)}
  ${rect(690, 270, 160, 254, C.leatherDark, 8)}
  ${t(200, 510, '$8.33', { size: 24, weight: 700, anchor: 'middle' })}
  ${t(390, 450, '$14.79', { size: 24, weight: 700, anchor: 'middle' })}
  ${t(580, 380, '$22.86', { size: 24, weight: 700, anchor: 'middle', fill: C.white })}
  ${t(770, 300, 'â‰ˆ$162', { size: 24, weight: 700, anchor: 'middle', fill: C.white })}
  ${t(200, 565, 'one head', { size: 14, fill: C.muted, anchor: 'middle' })}
  ${t(390, 565, 'one iron', { size: 14, fill: C.muted, anchor: 'middle' })}
  ${t(580, 565, 'one iron', { size: 14, fill: C.muted, anchor: 'middle' })}
  ${t(770, 565, 'full set', { size: 14, fill: C.muted, anchor: 'middle' })}
  ${t(60, 645, 'The cheapest entry is a single interchangeable head, not a complete tool.', { size: 16, fill: C.muted })}`
);

/* 3.38 vs 3.85 hero */
assets['3-38mm-vs-3-85mm-pricking-irons-hero.svg'] = svg(
  '3.38mm versus 3.85mm pricking iron illustration',
  'Two pricking irons side by side, one at 3.38mm pitch and one at 3.85mm pitch, with a ruler between them.',
  `${heroFrame('PITCH DECISION', '3.38mm vs 3.85mm', 'A 0.47mm difference you can see in the finished line.')}
  ${card(60, 245, 520, 320)}
  ${card(620, 245, 520, 320)}
  ${t(100, 295, '3.38mm', { size: 34, weight: 700, family: 'serif' })}
  ${t(100, 330, 'â‰ˆ7.5 SPI Â· finer line', { size: 17, fill: C.muted })}
  ${iron({ x: 110, y: 380, teeth: 8, scale: 0.95, angle: -4, pitch: 15 })}
  ${t(100, 520, 'Wallets and small goods', { size: 17, fill: C.ink, weight: 600 })}
  ${t(660, 295, '3.85mm', { size: 34, weight: 700, family: 'serif' })}
  ${t(660, 330, 'â‰ˆ6.6 SPI Â· easier learning', { size: 17, fill: C.muted })}
  ${iron({ x: 670, y: 380, teeth: 8, scale: 0.95, angle: -4, pitch: 18 })}
  ${t(660, 520, 'First irons and thicker thread', { size: 17, fill: C.ink, weight: 600 })}
  ${t(60, 625, 'Pick one pitch and learn it. The finished stitch line matters more than the spec sheet.', { size: 16, fill: C.muted })}`
);

/* 3.38 vs 3.85 SPI */
assets['3-38mm-vs-3-85mm-pricking-irons-spi.svg'] = svg(
  'Pitch to SPI scale diagram',
  'A 25.4mm ruler showing 3.38mm pitch at about 7.5 stitches per inch and 3.85mm pitch at about 6.6 stitches per inch.',
  `${heroFrame('MM TO SPI', '25.4mm Ã· pitch = approximate SPI', 'The math is simple. The feel is not.')}
  ${card(60, 245, 1080, 330)}
  ${t(100, 300, '3.38mm pitch', { size: 24, weight: 700, family: 'serif' })}
  ${t(100, 330, '25.4 Ã· 3.38 â‰ˆ 7.5 SPI', { size: 17, fill: C.muted })}
  ${ruler({ x: 100, y: 380, width: 440, labels: ['0', '10', '20', '25.4 mm'] })}
  ${holes({ x: 120, y: 360, count: 8, pitch: 58, thread: true, hole: 5 })}
  ${t(100, 480, '7.5 stitches across the inch', { size: 16, fill: C.ink, weight: 600 })}
  ${t(600, 300, '3.85mm pitch', { size: 24, weight: 700, family: 'serif' })}
  ${t(600, 330, '25.4 Ã· 3.85 â‰ˆ 6.6 SPI (often rounded to 7)', { size: 17, fill: C.muted })}
  ${ruler({ x: 600, y: 380, width: 440, labels: ['0', '10', '20', '25.4 mm'] })}
  ${holes({ x: 620, y: 360, count: 7, pitch: 66, thread: true, hole: 5 })}
  ${t(600, 480, '6.6 stitches across the inch', { size: 16, fill: C.ink, weight: 600 })}
  ${t(60, 625, 'Listings often round 3.85mm to 7 SPI. Check the millimeter pitch, not the label.', { size: 16, fill: C.muted })}`
);

/* 3.38 vs 3.85 thread */
assets['3-38mm-vs-3-85mm-pricking-irons-thread.svg'] = svg(
  'Thread pairing diagram for 3.38mm and 3.85mm pricking irons',
  'Two leather cross-sections showing thread ranges: 0.3 to 0.55mm for 3.38mm pitch and 0.55 to 0.8mm for 3.85mm pitch.',
  `${heroFrame('THREAD PAIRING', 'The hole sets the thread ceiling.', 'Fill the hole without bulging the leather.')}
  ${card(60, 245, 520, 320)}
  ${card(620, 245, 520, 320)}
  ${t(100, 295, '3.38mm pitch', { size: 30, weight: 700, family: 'serif' })}
  ${t(100, 330, 'usual thread: 0.3â€“0.55mm', { size: 18, fill: C.muted })}
  ${rect(100, 380, 420, 90, C.leather, 12)}
  ${holes({ x: 140, y: 425, count: 6, pitch: 62, thread: true, hole: 6 })}
  ${t(100, 510, 'Refined wallet: 0.3â€“0.4mm', { size: 16, fill: C.ink, weight: 600 })}
  ${t(660, 295, '3.85mm pitch', { size: 30, weight: 700, family: 'serif' })}
  ${t(660, 330, 'usual thread: 0.55â€“0.8mm', { size: 18, fill: C.muted })}
  ${rect(660, 380, 420, 90, C.leather, 12)}
  ${holes({ x: 700, y: 425, count: 6, pitch: 62, thread: true, hole: 8 })}
  ${t(660, 510, 'Refined wallet: 0.55â€“0.6mm', { size: 16, fill: C.ink, weight: 600 })}
  ${t(60, 625, 'If the thread barely fits, size down the thread before you size up the iron.', { size: 16, fill: C.muted })}`
);

/* Chisels vs irons hero */
assets['pricking-irons-vs-stitching-chisels-hero.svg'] = svg(
  'Pricking iron versus stitching chisel illustration',
  'A traditional pricking iron with short teeth beside a stitching chisel with long teeth, with leather cross-sections showing marking versus punching through.',
  `${heroFrame('TOOL HISTORY', 'Pricking iron or stitching chisel?', 'The words are often used interchangeably. The teeth tell the story.')}
  ${card(60, 245, 520, 330)}
  ${card(620, 245, 520, 330)}
  ${t(100, 295, 'Traditional pricking iron', { size: 24, weight: 700, family: 'serif' })}
  ${t(100, 328, 'short teeth Â· marks the line', { size: 17, fill: C.muted })}
  ${iron({ x: 110, y: 385, teeth: 5, scale: 0.95, angle: -3, toothLength: 30 })}
  ${rect(100, 500, 420, 24, C.leather, 8)}
  ${t(100, 550, 'Then an awl opens each hole.', { size: 16, fill: C.ink, weight: 600 })}
  ${t(660, 295, 'Modern stitching chisel', { size: 24, weight: 700, family: 'serif' })}
  ${t(660, 328, 'long teeth Â· punches through', { size: 17, fill: C.muted })}
  ${iron({ x: 670, y: 375, teeth: 5, scale: 0.95, angle: -3, toothLength: 60 })}
  ${rect(660, 500, 420, 24, C.leather, 8)}
  ${t(660, 550, 'The hole is formed in one hit.', { size: 16, fill: C.ink, weight: 600 })}
  ${t(60, 625, 'Most listings sold today as â€œpricking ironsâ€ are French-style chisels.', { size: 16, fill: C.muted })}`
);

/* Chisels vs irons holes */
assets['pricking-irons-vs-stitching-chisels-holes.svg'] = svg(
  'Marking versus punching through diagram',
  'Cross-section of leather showing a mark-and-awl process on the left and a chisel punching through on the right.',
  `${heroFrame('THE HOLE', 'Mark, then awl. Or punch through.', 'Two workflows, two tool designs.')}
  ${card(60, 245, 1080, 330)}
  ${rect(100, 380, 420, 90, C.leather, 12)}
  ${line(100, 380, 520, 380, C.leatherDark, 3)}
  ${pathEl('M 180 380 L 180 440', 'none', C.ink, 3, 0.5)}
  ${pathEl('M 180 380 L 170 410 L 190 410 Z', C.steel)}
  ${t(100, 330, '1. Mark with a pricking iron', { size: 20, weight: 700, family: 'serif' })}
  ${t(100, 510, '2. Open each mark with an awl', { size: 18, fill: C.muted })}
  ${t(100, 540, 'Slower, traditional, very clean.', { size: 16, fill: C.ink })}
  ${rect(660, 380, 420, 90, C.leather, 12)}
  ${line(660, 380, 1080, 380, C.leatherDark, 3)}
  ${Array.from({ length: 5 }, (_, i) => pathEl(`M ${720 + i * 70} 360 L ${720 + i * 70} 460`, 'none', C.steel, 7)).join('')}
  ${t(660, 330, '1. Punch through with a chisel', { size: 20, weight: 700, family: 'serif' })}
  ${t(660, 510, '2. Stitch immediately', { size: 18, fill: C.muted })}
  ${t(660, 540, 'Faster, modern, needs clean exit holes.', { size: 16, fill: C.ink })}
  ${t(60, 625, 'A chisel that does not exit cleanly will tear the thread on the way back.', { size: 16, fill: C.muted })}`
);

/* Chisels vs irons tooth length */
assets['pricking-irons-vs-stitching-chisels-tooth-length.svg'] = svg(
  'Tooth length comparison diagram',
  'Side profile of a short-tooth marking iron and a long-tooth stitching chisel, with leather depth marked.',
  `${heroFrame('TOOTH LENGTH', 'Short teeth mark. Long teeth cut.', 'The listing photo rarely makes this obvious.')}
  ${card(60, 245, 1080, 330)}
  ${rect(100, 420, 420, 50, C.leather, 10)}
  ${iron({ x: 120, y: 330, teeth: 5, scale: 0.9, angle: 0, toothLength: 28 })}
  ${t(100, 300, 'Marking iron', { size: 24, weight: 700, family: 'serif' })}
  ${t(100, 520, 'Teeth stop at the surface.', { size: 17, fill: C.muted })}
  ${t(100, 550, 'Leather stays intact.', { size: 17, fill: C.ink, weight: 600 })}
  ${rect(660, 420, 420, 50, C.leather, 10)}
  ${iron({ x: 680, y: 300, teeth: 5, scale: 0.9, angle: 0, toothLength: 78 })}
  ${t(660, 270, 'Stitching chisel', { size: 24, weight: 700, family: 'serif' })}
  ${t(660, 520, 'Teeth pass through the leather.', { size: 17, fill: C.muted })}
  ${t(660, 550, 'Holes are ready to stitch.', { size: 17, fill: C.ink, weight: 600 })}
  ${t(60, 625, 'If the teeth are short, you are looking at a marking tool, not a punch-through chisel.', { size: 16, fill: C.muted })}`
);

/* Size chart hero */
assets['size-chart-hero.svg'] = svg(
  'Pricking iron size chart illustration',
  'A chart of common pricking iron pitches 2.7, 3.0, 3.38, 3.85, and 4.0 millimeters with approximate SPI and typical uses.',
  `${heroFrame('SIZE CHART', 'Millimeters first. SPI second.', 'The listing label is not the spec. The pitch is.')}
  ${card(60, 230, 1080, 380)}
  ${['2.7mm', '3.0mm', '3.38mm', '3.85mm', '4.0mm'].map((labelText, index) => {
    const x = 100 + index * 205;
    const spi = (25.4 / [2.7, 3.0, 3.38, 3.85, 4.0][index]).toFixed(1);
    return `${rect(x, 280, 180, 250, index === 2 ? C.leather : C.surface, 12, C.line, 1)}
      ${t(x + 18, 320, labelText, { size: 26, weight: 700, family: 'serif', fill: index === 2 ? C.white : C.ink })}
      ${t(x + 18, 355, `â‰ˆ${spi} SPI`, { size: 18, fill: index === 2 ? C.tanLight : C.muted })}
      ${holes({ x: x + 26, y: 405, count: 5, pitch: 26, thread: false, hole: 4 })}
      ${t(x + 18, 465, ['Watch straps', 'Fine small goods', 'Wallets', 'First irons', 'Bags'][index], { size: 15, fill: index === 2 ? C.white : C.ink, weight: 600 })}
      ${t(x + 18, 492, ['Size down', 'Refined', 'Default', 'Easier', 'Open'][index], { size: 14, fill: index === 2 ? C.tanLight : C.muted })}`;
  }).join('')}
  ${t(60, 645, 'Approximate SPI = 25.4 Ã· pitch. Listings round; the millimeter pitch is the reliable number.', { size: 16, fill: C.muted })}`
);

/* Size chart pitch scale */
assets['size-chart-pitch-scale.svg'] = svg(
  'Pitch scale diagram',
  'A scale drawing of 2.7, 3.0, 3.38, 3.85, and 4.0 millimeter pricking iron pitches.',
  `${heroFrame('PITCH SCALE', 'What 0.1mm looks like.', 'Small changes in pitch change the whole rhythm.')}
  ${card(60, 245, 1080, 330)}
  ${[2.7, 3.0, 3.38, 3.85, 4.0].map((pitch, index) => {
    const y = 300 + index * 52;
    const width = pitch * 90;
    return `${t(100, y + 8, `${pitch}mm`, { size: 18, weight: 700 })}
      ${rect(210, y - 10, width, 22, index === 2 ? C.leather : C.tan, 6)}
      ${t(230 + width, y + 8, `â‰ˆ${(25.4 / pitch).toFixed(1)} SPI`, { size: 16, fill: C.muted })}`;
  }).join('')}
  ${t(60, 625, 'Drawn to relative scale. Use the millimeter pitch when comparing listings.', { size: 16, fill: C.muted })}`
);

/* Size chart teeth */
assets['size-chart-teeth.svg'] = svg(
  'Tooth count options diagram',
  'Pricking iron tooth counts two, five, eight, ten, and twenty with typical use cases.',
  `${heroFrame('TEETH', 'Choose the head for the run.', 'Corners want fewer teeth. Long runs want more.')}
  ${card(60, 230, 1080, 380)}
  ${[2, 5, 8, 10, 20].map((count, index) => {
    const y = 290 + index * 58;
    return `${t(100, y + 8, `${count} teeth`, { size: 20, weight: 700, family: 'serif' })}
      ${holes({ x: 260, y, count, pitch: count === 20 ? 15 : 24, thread: false, hole: 4 })}
      ${t(700, y + 8, ['Corners', 'Short runs', 'Straight runs', 'Long runs', 'Production'][index], { size: 16, fill: C.muted })}`;
  }).join('')}
  ${t(60, 645, 'A 2-tooth and 8-tooth pair is the standard beginner wallet setup.', { size: 16, fill: C.muted })}`
);

/* Wallet sizing hero */
assets['wallets-sizing-hero.svg'] = svg(
  'Wallet stitching pitch illustration',
  'A wallet panel with two stitch lines, one at 3.38mm pitch and one at 3.85mm pitch.',
  `${heroFrame('WALLET SIZING', 'One wallet panel, two rhythms.', '3.38mm for a finer line. 3.85mm for a more open line.')}
  ${card(60, 245, 1080, 330)}
  ${rect(120, 290, 460, 240, C.leather, 14)}
  ${rect(130, 300, 440, 220, 'none', 10, C.tanLight, 1, 0.5)}
  ${holes({ x: 160, y: 345, count: 10, pitch: 38, thread: true, hole: 4 })}
  ${holes({ x: 160, y: 455, count: 8, pitch: 50, thread: true, hole: 6 })}
  ${t(620, 320, '3.38mm', { size: 30, weight: 700, family: 'serif' })}
  ${t(620, 355, 'Finer, denser, wallet default.', { size: 17, fill: C.muted })}
  ${t(620, 410, '3.85mm', { size: 30, weight: 700, family: 'serif' })}
  ${t(620, 445, 'More open, easier to learn.', { size: 17, fill: C.muted })}
  ${t(620, 500, 'Both are defensible. Pick one and practice.', { size: 16, fill: C.ink, weight: 600 })}
  ${t(60, 625, 'The wallet is small enough that 0.47mm of pitch is visible in the finished edge.', { size: 16, fill: C.muted })}`
);

/* Wallet thread pairing */
assets['wallets-thread-pairing.svg'] = svg(
  'Wallet thread pairing diagram',
  'A pairing chart for 3.38mm and 3.85mm pitches with usual and refined thread ranges.',
  `${heroFrame('WALLET THREAD', 'Match the thread to the hole.', 'A tight hole with thick thread looks crowded.')}
  ${card(60, 245, 1080, 330)}
  ${t(100, 300, '3.38mm pitch', { size: 28, weight: 700, family: 'serif' })}
  ${t(100, 335, 'Usual: 0.3â€“0.55mm', { size: 18, fill: C.muted })}
  ${t(100, 365, 'Refined: 0.3â€“0.4mm', { size: 18, fill: C.ink, weight: 600 })}
  ${rect(100, 400, 420, 34, C.tan, 17)}
  ${rect(100, 450, 420, 22, C.tanLight, 11)}
  ${t(560, 300, '3.85mm pitch', { size: 28, weight: 700, family: 'serif' })}
  ${t(560, 335, 'Usual: 0.55â€“0.8mm', { size: 18, fill: C.muted })}
  ${t(560, 365, 'Refined: 0.55â€“0.6mm', { size: 18, fill: C.ink, weight: 600 })}
  ${rect(560, 400, 420, 34, C.leather, 17)}
  ${rect(560, 450, 420, 22, C.leatherDark, 11)}
  ${t(60, 625, 'If the thread barely fits, size down the thread before you size up the iron.', { size: 16, fill: C.muted })}`
);

/* Wallet teeth combo */
assets['wallets-teeth-combo.svg'] = svg(
  'Two-tooth and eight-tooth wallet stitching combination',
  'A two-tooth iron for corners and an eight-tooth iron for straight runs on a wallet panel.',
  `${heroFrame('THE COMBO', '2-tooth corners. 8-tooth runs.', 'The pair that covers most wallet work.')}
  ${card(60, 245, 1080, 330)}
  ${rect(120, 300, 420, 220, C.leather, 14)}
  ${pathEl('M 150 330 L 510 330 L 510 490', 'none', C.tanLight, 5, 0.8)}
  ${holes({ x: 170, y: 360, count: 8, pitch: 42, thread: true, hole: 4 })}
  ${holes({ x: 480, y: 390, count: 2, pitch: 38, thread: true, hole: 5 })}
  ${t(620, 320, '8-tooth', { size: 30, weight: 700, family: 'serif' })}
  ${t(620, 355, 'Straight runs', { size: 18, fill: C.muted })}
  ${t(620, 410, '2-tooth', { size: 30, weight: 700, family: 'serif' })}
  ${t(620, 445, 'Corners and curves', { size: 18, fill: C.muted })}
  ${t(620, 500, 'Add a 20-tooth later for long runs.', { size: 16, fill: C.ink, weight: 600 })}
  ${t(60, 625, 'The 2-tooth head is not a starter gimmick. It is the corner tool.', { size: 16, fill: C.muted })}`
);

/* Favicon */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="10" fill="#2a1c14"/>
  <path d="M12 28 L27 13" stroke="#f7efe4" stroke-width="3" stroke-linecap="round"/>
  <path d="M14 12 L28 26" stroke="#c98f5a" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="3 4"/>
  <circle cx="12" cy="28" r="2.6" fill="#c98f5a"/>
</svg>
`;

await fs.mkdir(OUT, { recursive: true });
for (const [file, content] of Object.entries(assets)) {
  await fs.writeFile(path.join(OUT, file), content, 'utf8');
}
await fs.writeFile(path.join(ROOT, 'public', 'favicon.svg'), favicon, 'utf8');

console.log(`Wrote ${Object.keys(assets).length} SVG illustrations to public/images.`);
console.log('Wrote public/favicon.svg.');
