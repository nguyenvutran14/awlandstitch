import { escapeAttr, escapeHtml, safeJson } from '../lib/util.mjs';
import { footer, header } from './partials.mjs';

export function renderDocument({ site, siteUrl, page, main, jsonLd, heroPreload, bodyClass = '' }) {
  const canonical = page.canonical;
  const ogImage = page.ogImage ? new URL(page.ogImage, `${siteUrl}/`).href : `${siteUrl}/og-default.png`;
  const ogImageAlt = page.ogImageAlt || page.title;
  const robots = page.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large';
  const pageClass = `page-${page.slug || page.type}${bodyClass ? ` ${bodyClass}` : ''}`;
  const articleMeta =
    page.type === 'article'
      ? `<meta property="article:published_time" content="${escapeAttr(page.datePublished)}">
<meta property="article:modified_time" content="${escapeAttr(page.dateModified)}">
<meta property="article:author" content="${escapeAttr(page.author)}">
<meta property="article:section" content="${escapeAttr(page.category)}">`
      : '';

  const jsonLdScript = jsonLd
    ? `<script type="application/ld+json">${safeJson(jsonLd)}</script>`
    : '';

  return `<!doctype html>
<html lang="${escapeAttr(site.locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page.metaTitle)}</title>
<meta name="description" content="${escapeAttr(page.metaDescription)}">
<meta name="robots" content="${robots}">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#2a1c14">
<link rel="canonical" href="${escapeAttr(canonical)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/styles/main.css">
<link rel="alternate" type="application/rss+xml" title="${escapeAttr(site.brand)} RSS" href="${siteUrl}/rss.xml">
${heroPreload ? `<link rel="preload" as="image" href="${escapeAttr(heroPreload)}" type="image/svg+xml" fetchpriority="high">` : ''}
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="${escapeAttr(site.brand)}">
<meta property="og:type" content="${page.type === 'article' ? 'article' : 'website'}">
<meta property="og:title" content="${escapeAttr(page.metaTitle)}">
<meta property="og:description" content="${escapeAttr(page.metaDescription)}">
<meta property="og:url" content="${escapeAttr(canonical)}">
<meta property="og:image" content="${escapeAttr(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeAttr(ogImageAlt)}">
${articleMeta}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(page.metaTitle)}">
<meta name="twitter:description" content="${escapeAttr(page.metaDescription)}">
<meta name="twitter:image" content="${escapeAttr(ogImage)}">
<meta name="twitter:image:alt" content="${escapeAttr(ogImageAlt)}">
${jsonLdScript}
</head>
<body class="${escapeAttr(pageClass)}">
<a class="skip-link" href="#main">Skip to content</a>
${header(site, page)}
<main id="main" class="site-main">
${main}
</main>
${footer(site, page)}
</body>
</html>
`;
}
