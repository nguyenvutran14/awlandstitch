import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const siteConfig = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'data', 'site.json'), 'utf8'));
const SITE_URL = ((process.env.SITE_URL || '').trim() || String(siteConfig.domain)).replace(/\/+$/, '');

const errors = [];
const warnings = [];
const notes = [];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function read(filePath) {
  return fs.readFile(filePath, 'utf8');
}

function attrsFromTag(tag) {
  const attrs = {};
  const regex = /([a-zA-Z0-9:_-]+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(tag)) !== null) attrs[match[1].toLowerCase()] = match[2];
  return attrs;
}

function collect(html, tag) {
  const regex = new RegExp(`<${tag}\\b([^>]*)>`, 'gi');
  const items = [];
  let match;
  while ((match = regex.exec(html)) !== null) items.push(attrsFromTag(match[1]));
  return items;
}

function jsonLdBlocks(html) {
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) blocks.push(match[1]);
  return blocks;
}

function pagePathFromRelative(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return `/${normalized.slice(0, -'index.html'.length)}`;
  return `/${normalized}`;
}

function targetFileForPathname(pathname) {
  const clean = pathname.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(clean);
  if (decoded === '/') return path.join(DIST, 'index.html');
  const relative = decoded.replace(/^\/+/, '');
  if (decoded.endsWith('/')) return path.join(DIST, relative, 'index.html');
  if (path.extname(relative)) return path.join(DIST, relative);
  return path.join(DIST, relative, 'index.html');
}

async function walk(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...(await walk(full)));
    else results.push(full);
  }
  return results;
}

function includesAll(value, parts) {
  return parts.every((part) => new RegExp(`(^|\\s)${part}(\\s|$)`).test(value || ''));
}

async function main() {
  if (!(await exists(DIST))) {
    console.error('dist/ does not exist. Run npm run build first.');
    process.exit(1);
  }

  const site = JSON.parse(await read(path.join(ROOT, 'src', 'data', 'site.json')));
  const affiliates = JSON.parse(await read(path.join(ROOT, 'src', 'data', 'affiliates.json')));
  const articleSlugs = Object.keys(site.articleMeta || {});
  const trustSlugs = (site.trustPages || []).map((item) => item.slug);
  const expectedPages = [
    'index.html',
    ...articleSlugs.map((slug) => `${slug}/index.html`),
    ...trustSlugs.map((slug) => `${slug}/index.html`),
    'all-articles/index.html',
    '404.html',
    'sitemap.xml',
    'robots.txt',
    'rss.xml',
    'styles/main.css'
  ];

  for (const relative of expectedPages) {
    if (!(await exists(path.join(DIST, relative)))) errors.push(`Missing required output: dist/${relative}`);
  }

  for (const asset of ['og-default.png', 'favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'logo-512.png', '_headers']) {
    if (!(await exists(path.join(DIST, asset)))) errors.push(`Missing public asset: dist/${asset}`);
  }

  const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
  const htmlByPath = new Map();
  const internalTargets = new Set();
  let affiliateLinkCount = 0;
  let pendingCount = 0;
  let externalLinkCount = 0;
  let imageCount = 0;

  for (const file of htmlFiles) {
    const relative = path.relative(DIST, file).replace(/\\/g, '/');
    const html = await read(file);
    htmlByPath.set(relative, html);

    if (/{{aff:/i.test(html)) errors.push(`${relative}: unresolved {{aff:...}} token in output.`);
    if (/href="[^"]*PLACEHOLDER/i.test(html) || /src="[^"]*PLACEHOLDER/i.test(html)) {
      errors.push(`${relative}: PLACEHOLDER remains in an href/src attribute.`);
    }

    const h1s = html.match(/<h1\b[^>]*>/gi) || [];
    if (h1s.length !== 1) errors.push(`${relative}: expected exactly one H1, found ${h1s.length}.`);

    if (!/<main\b[^>]*id="main"/i.test(html)) errors.push(`${relative}: missing <main id="main">.`);
    if (!/<a\b[^>]*class="skip-link"[^>]*href="#main"/i.test(html)) errors.push(`${relative}: missing skip link.`);
    if (!/<html\b[^>]*lang="en-US"/i.test(html)) errors.push(`${relative}: html lang is not en-US.`);

    const titles = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (!titles) errors.push(`${relative}: missing <title>.`);
    else if (titles[1].length > 60) warnings.push(`${relative}: title is ${titles[1].length} chars (target <= 60).`);

    const descriptions = collect(html, 'meta').filter((meta) => meta.name === 'description');
    if (descriptions.length !== 1) errors.push(`${relative}: expected one meta description, found ${descriptions.length}.`);
    else if ((descriptions[0].content || '').length > 155) warnings.push(`${relative}: meta description is ${descriptions[0].content.length} chars.`);

    const canonicals = collect(html, 'link').filter((link) => link.rel === 'canonical');
    if (canonicals.length !== 1) errors.push(`${relative}: expected one canonical link, found ${canonicals.length}.`);

    const og = collect(html, 'meta').filter((meta) => meta.property && meta.property.startsWith('og:'));
    const ogMap = Object.fromEntries(og.map((meta) => [meta.property, meta.content]));
    for (const key of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:type']) {
      if (!ogMap[key]) errors.push(`${relative}: missing ${key}.`);
    }
    if (ogMap['og:image'] && !ogMap['og:image'].startsWith(`${SITE_URL}/`)) {
      errors.push(`${relative}: og:image is not absolute on the configured domain.`);
    }
    if (ogMap['og:image']) {
      const ogPath = new URL(ogMap['og:image']).pathname;
      if (!(await exists(path.join(DIST, ogPath)))) errors.push(`${relative}: og:image target missing: ${ogPath}`);
    }

    const twitters = collect(html, 'meta').filter((meta) => meta.name && meta.name.startsWith('twitter:'));
    if (!twitters.some((meta) => meta.name === 'twitter:card' && meta.content === 'summary_large_image')) {
      errors.push(`${relative}: missing twitter:card summary_large_image.`);
    }

    const robots = collect(html, 'meta').find((meta) => meta.name === 'robots');
    const is404 = relative === '404.html';
    if (is404 && !/noindex/i.test(robots?.content || '')) errors.push('404.html: expected noindex.');
    if (!is404 && /noindex/i.test(robots?.content || '')) errors.push(`${relative}: unexpected noindex on an indexable page.`);

    const jsonLd = jsonLdBlocks(html);
    if (!jsonLd.length && !is404) errors.push(`${relative}: missing JSON-LD.`);
    for (const block of jsonLd) {
      try {
        const data = JSON.parse(block);
        if (data['@context'] !== 'https://schema.org') errors.push(`${relative}: JSON-LD @context is not https://schema.org.`);
        if (!Array.isArray(data['@graph']) || data['@graph'].length === 0) {
          errors.push(`${relative}: JSON-LD is missing an @graph array.`);
          continue;
        }
        const types = data['@graph'].flatMap((node) => (Array.isArray(node['@type']) ? node['@type'] : [node['@type']]));
        const expected = relative === 'index.html'
          ? ['WebSite', 'Organization', 'WebPage', 'BreadcrumbList']
          : relative === 'all-articles/index.html'
            ? ['CollectionPage', 'BreadcrumbList']
            : is404
              ? []
              : articleSlugs.includes(relative.split('/')[0])
                ? ['BlogPosting', 'BreadcrumbList']
                : ['WebPage', 'BreadcrumbList'];
        for (const type of expected) {
          if (!types.includes(type)) errors.push(`${relative}: JSON-LD missing ${type}.`);
        }
        if (articleSlugs.includes(relative.split('/')[0])) {
          const post = data['@graph'].find((node) => node['@type'] === 'BlogPosting');
          if (!post?.headline) errors.push(`${relative}: BlogPosting missing headline.`);
          if (!post?.datePublished || !post?.dateModified) errors.push(`${relative}: BlogPosting missing dates.`);
          if (!post?.author) errors.push(`${relative}: BlogPosting missing author.`);
          const faq = data['@graph'].find((node) => node['@type'] === 'FAQPage');
          if (!faq || !Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) {
            errors.push(`${relative}: expected FAQPage with mainEntity.`);
          }
        }
        if (relative === site.hubSlug + '/index.html') {
          if (!types.includes('ItemList')) errors.push(`${relative}: hub missing ItemList.`);
        }
        if (types.includes('Review')) errors.push(`${relative}: Review schema is not allowed.`);
      } catch (error) {
        errors.push(`${relative}: JSON-LD parse error: ${error.message}`);
      }
    }

    const anchors = collect(html, 'a');
    for (const anchor of anchors) {
      const href = anchor.href || '';
      if (/aliexpress\.us/i.test(href)) {
        affiliateLinkCount += 1;
        if (anchor.target !== '_blank') errors.push(`${relative}: AliExpress link missing target="_blank" (${href}).`);
        if (!includesAll(anchor.rel, ['sponsored', 'nofollow', 'noopener'])) {
          errors.push(`${relative}: AliExpress link missing rel="sponsored nofollow noopener" (${href}).`);
        }
        if (/PLACEHOLDER|YOUR-|{{aff:/i.test(href)) errors.push(`${relative}: invalid AliExpress href (${href}).`);
      } else if (/^https?:\/\//i.test(href)) {
        externalLinkCount += 1;
        if (anchor.target !== '_blank') warnings.push(`${relative}: external link without target=_blank (${href}).`);
      }

      if (anchor['data-affiliate-pending'] === 'true') pendingCount += 1;

      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || href.startsWith('//')) continue;
      if (href.startsWith('#')) {
        const id = decodeURIComponent(href.slice(1));
        if (id && !new RegExp(`id="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html)) {
          errors.push(`${relative}: missing same-page anchor #${id}.`);
        }
        continue;
      }
      if (!href.startsWith('/')) {
        warnings.push(`${relative}: relative internal link (${href}); expected root-relative.`);
        continue;
      }

      const [pathname, hash] = href.split('#');
      const targetFile = targetFileForPathname(pathname);
      internalTargets.add(pathname);
      if (!(await exists(targetFile))) {
        errors.push(`${relative}: broken internal link ${href} -> ${path.relative(DIST, targetFile).replace(/\\/g, '/')}`);
        continue;
      }
      if (hash) {
        const targetHtml = await read(targetFile);
        const id = decodeURIComponent(hash);
        if (!new RegExp(`id="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(targetHtml)) {
          errors.push(`${relative}: missing anchor #${id} in ${pathname}.`);
        }
      }
    }

    const images = collect(html, 'img');
    for (const image of images) {
      imageCount += 1;
      const src = image.src || '';
      if (!src) {
        errors.push(`${relative}: img without src.`);
        continue;
      }
      if (!image.alt && image.alt !== '') errors.push(`${relative}: img missing alt (${src}).`);
      if (!image.width || !image.height) errors.push(`${relative}: img missing width/height (${src}).`);
      if (!image.loading) warnings.push(`${relative}: img missing loading attribute (${src}).`);
      if (src.startsWith('/')) {
        const target = path.join(DIST, src);
        if (!(await exists(target))) errors.push(`${relative}: missing image file ${src}.`);
      }
    }
  }

  const cssPath = path.join(DIST, 'styles', 'main.css');
  if (await exists(cssPath)) {
    const stats = await fs.stat(cssPath);
    if (stats.size > 30 * 1024) errors.push(`CSS is ${(stats.size / 1024).toFixed(1)} KB (budget < 30 KB).`);
    else notes.push(`CSS ${(stats.size / 1024).toFixed(1)} KB.`);
  }

  const jsFiles = (await walk(DIST)).filter((file) => file.endsWith('.js'));
  if (jsFiles.length) {
    const total = (await Promise.all(jsFiles.map(async (file) => (await fs.stat(file)).size))).reduce((sum, size) => sum + size, 0);
    if (total > 10 * 1024) errors.push(`Client JS is ${(total / 1024).toFixed(1)} KB (budget < 10 KB).`);
    else notes.push(`Client JS ${(total / 1024).toFixed(1)} KB in ${jsFiles.length} file(s).`);
  } else {
    notes.push('Client JS 0 KB.');
  }

  const sitemapPath = path.join(DIST, 'sitemap.xml');
  if (await exists(sitemapPath)) {
    const sitemap = await read(sitemapPath);
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    if (locs.length < expectedPages.filter((page) => page.endsWith('index.html') && page !== '404.html').length) {
      warnings.push(`Sitemap has ${locs.length} URLs; expected at least ${expectedPages.filter((page) => page.endsWith('index.html') && page !== '404.html').length}.`);
    }
    for (const loc of locs) {
      const pathname = new URL(loc).pathname;
      const target = targetFileForPathname(pathname);
      if (!(await exists(target))) errors.push(`Sitemap URL has no output file: ${loc}`);
    }
    for (const required of [
      '/',
      `/${site.hubSlug}/`,
      '/all-articles/',
      ...articleSlugs.map((slug) => `/${slug}/`),
      ...trustSlugs.map((slug) => `/${slug}/`)
    ]) {
      if (!locs.some((loc) => new URL(loc).pathname === required)) warnings.push(`Sitemap missing ${required}.`);
    }
    notes.push(`Sitemap ${locs.length} URLs.`);
  }

  const robotsPath = path.join(DIST, 'robots.txt');
  if (await exists(robotsPath)) {
    const robots = await read(robotsPath);
    if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) errors.push('robots.txt does not point at the configured sitemap.');
    if (!/Allow:\s*\//i.test(robots)) errors.push('robots.txt is missing Allow: /.');
  }

  const rssPath = path.join(DIST, 'rss.xml');
  if (await exists(rssPath)) {
    const rss = await read(rssPath);
    const items = [...rss.matchAll(/<item>/g)].length;
    if (items !== articleSlugs.length) warnings.push(`RSS has ${items} items; expected ${articleSlugs.length}.`);
    if (!rss.includes('<rss version="2.0"')) errors.push('rss.xml is not RSS 2.0.');
    notes.push(`RSS ${items} items.`);
  }

  const headersPath = path.join(DIST, '_headers');
  if (await exists(headersPath)) {
    const headers = await read(headersPath);
    if (!/X-Content-Type-Options:\s*nosniff/i.test(headers)) warnings.push('_headers missing X-Content-Type-Options: nosniff.');
    if (!/Referrer-Policy:/i.test(headers)) warnings.push('_headers missing Referrer-Policy.');
  }

  const placeholderLinks = [...htmlByPath.entries()].filter(([, html]) => /data-affiliate-pending="true"/i.test(html));
  if (placeholderLinks.length) {
    warnings.push(`Affiliate pending placeholders found in: ${placeholderLinks.map(([relative]) => relative).join(', ')}`);
  }

  const affiliateProducts = Object.values(affiliates.products || {});
  const verifiedRatings = affiliateProducts.filter((product) => product.ratingVerified).length;
  notes.push(`${affiliateProducts.length} affiliate products; ${verifiedRatings} with verified ratings.`);
  notes.push(`${htmlFiles.length} HTML pages; ${affiliateLinkCount} AliExpress links; ${externalLinkCount} other external links; ${imageCount} img tags; ${internalTargets.size} internal targets.`);

  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    for (const warning of warnings) console.log(`  - ${warning}`);
  }
  if (notes.length) {
    console.log('\nNotes:');
    for (const note of notes) console.log(`  - ${note}`);
  }
  if (errors.length) {
    console.log(`\nFAIL — ${errors.length} error(s):`);
    for (const error of errors) console.log(`  - ${error}`);
    process.exit(1);
  }

  console.log('\nPASS — required files, links, images, JSON-LD, affiliate attributes, sitemap, robots, and RSS checks passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
