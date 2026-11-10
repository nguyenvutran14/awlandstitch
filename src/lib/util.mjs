const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

export function escapeAttr(value = '') {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

export function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function slugify(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/['\u2018\u2019]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'section';
}

export function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00Z`);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isoDate(value) {
  const date = toDate(value);
  if (!date) return '';
  return date.toISOString().slice(0, 10);
}

export function formatDate(value) {
  const date = toDate(value);
  if (!date) return String(value || '');
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

export function formatRssDate(value) {
  const date = toDate(value);
  if (!date) return '';
  return date.toUTCString();
}

export function stripHtml(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(markdown = '') {
  const text = String(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/[#>*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

export function readingMinutes(wordCount) {
  return Math.max(1, Math.round(wordCount / 220));
}

export function truncate(value = '', max = 155) {
  const text = String(value).replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).replace(/\s+\S*$/, '')}…`;
}

export function absoluteUrl(siteUrl, pathname) {
  return new URL(pathname, `${siteUrl}/`).href;
}

export function safeJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
}

export function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
