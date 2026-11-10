import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  countWords,
  escapeXml,
  formatRssDate,
  isoDate,
  readingMinutes,
  truncate,
  uniqueBy
} from '../src/lib/util.mjs';
import {
  createMarkdown,
  expandAffiliateTokens,
  extractInternalLinks,
  hasSourcesSection,
  renderMarkdown,
  stripComments
} from '../src/lib/markdown.mjs';
import { buildSchemaGraph } from '../src/lib/schema.mjs';
import { renderDocument } from '../src/templates/layout.mjs';
import { renderArticle } from '../src/templates/article.mjs';
import { renderHome } from '../src/templates/home.mjs';
import { renderTrust } from '../src/templates/trust.mjs';
import { renderAllArticles } from '../src/templates/all-articles.mjs';
import { renderNotFound } from '../src/templates/not-found.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const CONTENT_DIR = path.join(ROOT, 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SRC_DIR = path.join(ROOT, 'src');
const DIST_DIR = path.join(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

async function loadImageDimensions() {
  const dimensions = {};
  const imagesDir = path.join(PUBLIC_DIR, 'images');
  if (!(await fileExists(imagesDir))) return dimensions;
  const files = await fs.readdir(imagesDir);
  for (const file of files) {
    if (!file.endsWith('.svg')) continue;
    const source = await fs.readFile(path.join(imagesDir, file), 'utf8');
    const width = Number((source.match(/<svg[^>]*\bwidth="(\d+)"/) || [])[1]);
    const height = Number((source.match(/<svg[^>]*\bheight="(\d+)"/) || [])[1]);
    if (width && height) {
      dimensions[`/images/${file}`] = { width, height };
    }
  }
  return dimensions;
}

async function loadOgImage(slug) {
  const relative = `/og/${slug}.png`;
  const exists = await fileExists(path.join(PUBLIC_DIR, 'og', `${slug}.png`));
  return exists ? relative : '/og-default.png';
}

function buildBreadcrumb(type, title, pathname) {
  if (type === 'home') return [{ name: 'Home', path: '/' }];
  if (type === 'all-articles') {
    return [
      { name: 'Home', path: '/' },
      { name: 'All Articles', path: '/all-articles/' }
    ];
  }
  if (type === '404') return [];
  return [
    { name: 'Home', path: '/' },
    { name: title, path: pathname }
  ];
}

function slugFromPath(href) {
  if (!href || href === '/') return 'home';
  return href.replace(/^\/+|\/+$/g, '').split('/')[0];
}

function pageTypeFromSchema(schemaTypes) {
  if (schemaTypes.includes('BlogPosting') || schemaTypes.includes('Article')) return 'article';
  return 'trust';
}

function sortArticles(articles, site) {
  return [...articles].sort((a, b) => {
    const aOrder = site.articleMeta?.[a.slug]?.order ?? 99;
    const bOrder = site.articleMeta?.[b.slug]?.order ?? 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.datePublished.localeCompare(b.datePublished);
  });
}

function makePageBase({ slug, type, title, metaTitle, metaDescription, datePublished, dateModified, pathname, siteUrl, breadcrumb, ogImage, ogImageAlt, noindex = false }) {
  return {
    slug,
    type,
    title,
    metaTitle,
    metaDescription,
    datePublished,
    dateModified,
    path: pathname,
    canonical: new URL(pathname, `${siteUrl}/`).href,
    breadcrumb,
    ogImage,
    ogImageAlt,
    noindex
  };
}

async function main() {
  const site = await readJson(path.join(SRC_DIR, 'data', 'site.json'));
  const affiliates = await readJson(path.join(SRC_DIR, 'data', 'affiliates.json'));
  const siteUrl = SITE_URL || String(site.domain).replace(/\/+$/, '');
  if (!/^https?:\/\//.test(siteUrl)) {
    throw new Error(`SITE_URL must be an absolute http(s) URL. Received: ${siteUrl}`);
  }

  const imageDimensions = await loadImageDimensions();
  const affiliateByListingId = new Map(
    Object.values(affiliates.products || {}).map((product) => [product.listingId, product])
  );
  const md = createMarkdown();
  const warnings = [];
  const contentWarnings = [];
  const pendingLinks = new Set();
  const contentFiles = (await fs.readdir(CONTENT_DIR))
    .filter((file) => file.endsWith('.md'))
    .sort();

  const pages = [];

  for (const file of contentFiles) {
    const source = await fs.readFile(path.join(CONTENT_DIR, file), 'utf8');
    const parsed = matter(source);
    const data = parsed.data || {};

    if (data.draft === true) continue;

    const slug = String(data.slug || path.basename(file, '.md')).trim();
    const schemaTypes = Array.isArray(data.schema) ? data.schema : [];
    const type = pageTypeFromSchema(schemaTypes);
    const title = String(data.title || data.metaTitle || slug);
    const metaTitle = String(data.metaTitle || data.title || slug);
    const metaDescription = truncate(String(data.metaDescription || data.description || site.description), 155);
    const datePublished = isoDate(data.datePublished || data.dateModified);
    const dateModified = isoDate(data.dateModified || data.datePublished);
    const category = site.articleMeta?.[slug]?.category || (type === 'trust' ? 'Trust & standards' : 'Guide');
    const featuredNote = site.articleMeta?.[slug]?.featuredNote || '';
    const pathname = `/${slug}/`;
    const isHub = slug === site.hubSlug;

    const stripped = stripComments(parsed.content);
    for (const comment of stripped.comments) {
      const pending = comment.match(/pending-link:\s*(\S+)/i);
      if (pending) pendingLinks.add(pending[1]);
    }

    const expanded = expandAffiliateTokens(stripped.markdown, affiliates);
    warnings.push(...expanded.warnings.map((warning) => `${slug}: ${warning}`));

    const heroConfig = site.heroImages?.[slug] || null;
    const heroImage = heroConfig?.src || null;
    const render = renderMarkdown(expanded.markdown, {
      md,
      site,
      siteUrl,
      affiliates,
      affiliateByListingId,
      imageDimensions,
      heroImage,
      warnings,
      extractFaq: schemaTypes.includes('FAQPage')
    });

    const hero = render.hero || (heroConfig ? { src: heroConfig.src, alt: heroConfig.alt, title: heroConfig.title } : null);
    const faq = schemaTypes.includes('FAQPage') ? render.faq : [];
    const wordCount = countWords(stripped.markdown);
    const ogImage = type === 'article' ? await loadOgImage(slug) : '/og-default.png';

    const page = {
      ...makePageBase({
        slug,
        type,
        title,
        metaTitle,
        metaDescription,
        datePublished,
        dateModified,
        pathname,
        siteUrl,
        breadcrumb: buildBreadcrumb(type, title, pathname),
        ogImage,
        ogImageAlt: `${title} — ${site.brand}`,
        noindex: false
      }),
      author: String(data.author || site.author),
      authorBio: String(data.authorBio || ''),
      primaryKeyword: String(data.primaryKeyword || ''),
      schemaTypes,
      category,
      featuredNote,
      html: render.html,
      toc: render.toc,
      faq,
      heroImage: hero?.src || null,
      heroAlt: hero?.alt || '',
      heroTitle: hero?.title || '',
      wordCount,
      readingMinutes: readingMinutes(wordCount),
      hasAffiliateLinks: /aliexpress\.us/i.test(render.html),
      isHub,
      relatedPaths: extractInternalLinks(stripped.markdown)
    };

    if (type === 'article') {
      if (!hasSourcesSection(stripped.markdown)) {
        contentWarnings.push(`${slug}: no visible "### Sources" section found.`);
      }
      if (!data.authorBio) contentWarnings.push(`${slug}: missing authorBio in frontmatter.`);
      if (!hero) contentWarnings.push(`${slug}: no hero image configured.`);
      if (schemaTypes.includes('FAQPage') && faq.length === 0) {
        contentWarnings.push(`${slug}: FAQPage schema requested but no FAQ Q&As were extracted.`);
      }
      if ((schemaTypes.includes('ItemList') || schemaTypes.includes('Product')) && !(affiliates.itemLists?.[slug] || []).length) {
        contentWarnings.push(`${slug}: ItemList/Product schema requested but no product list is configured in affiliates.json.`);
      }
    }

    if (metaTitle.length > 60) {
      contentWarnings.push(`${slug}: meta title is ${metaTitle.length} characters (target <= 60).`);
    }
    if (metaDescription.length > 155) {
      contentWarnings.push(`${slug}: meta description is ${metaDescription.length} characters (target <= 155).`);
    }
    if (!datePublished || !dateModified) {
      contentWarnings.push(`${slug}: missing datePublished/dateModified.`);
    }

    pages.push(page);
  }

  const articles = sortArticles(pages.filter((page) => page.type === 'article'), site);
  const trustPages = site.trustPages
    .map((item) => pages.find((page) => page.slug === item.slug && page.type === 'trust'))
    .filter(Boolean);
  const articlesBySlug = new Map(articles.map((page) => [page.slug, page]));
  const hub = articlesBySlug.get(site.hubSlug);
  if (!hub) throw new Error(`Hub page "${site.hubSlug}" was not found in content.`);

  for (const page of articles) {
    const related = uniqueBy(
      page.relatedPaths
        .map((href) => articlesBySlug.get(slugFromPath(href)))
        .filter((article) => article && article.slug !== page.slug),
      (article) => article.slug
    );
    if (!related.some((article) => article.slug === hub.slug)) related.unshift(hub);
    page.related = related.slice(0, 4);
  }

  const latestDate = articles
    .map((page) => page.dateModified)
    .sort()
    .at(-1) || '2026-11-07';

  const home = {
    ...makePageBase({
      slug: 'home',
      type: 'home',
      title: site.title,
      metaTitle: site.title,
      metaDescription: truncate(site.description, 155),
      datePublished: latestDate,
      dateModified: latestDate,
      pathname: '/',
      siteUrl,
      breadcrumb: buildBreadcrumb('home', site.title, '/'),
      ogImage: '/og-default.png',
      ogImageAlt: `${site.brand} — ${site.tagline}`,
      noindex: false
    }),
    category: 'Home',
    featuredNote: '',
    html: '',
    toc: [],
    faq: [],
    heroImage: '/images/home-hero.svg',
    heroAlt: 'Illustration of leathercraft hand tools: a pricking iron, an awl, thread, and a stitched leather swatch',
    heroTitle: 'Leathercraft hand tools',
    wordCount: 0,
    readingMinutes: 1,
    hasAffiliateLinks: false,
    isHub: false,
    schemaTypes: ['WebSite', 'Organization', 'WebPage', 'BreadcrumbList']
  };

  const allArticles = {
    ...makePageBase({
      slug: 'all-articles',
      type: 'all-articles',
      title: 'All Articles',
      metaTitle: `All Articles — ${site.brand}`,
      metaDescription: truncate('Browse every Awl & Stitch leathercraft tool guide: pricking iron buying guides, comparisons, wallet sizing, budget picks, and the mm-to-SPI chart.', 155),
      datePublished: latestDate,
      dateModified: latestDate,
      pathname: '/all-articles/',
      siteUrl,
      breadcrumb: buildBreadcrumb('all-articles', 'All Articles', '/all-articles/'),
      ogImage: '/og-default.png',
      ogImageAlt: `All articles — ${site.brand}`,
      noindex: false
    }),
    category: 'Library',
    featuredNote: '',
    html: '',
    toc: [],
    faq: [],
    heroImage: null,
    heroAlt: '',
    heroTitle: '',
    wordCount: 0,
    readingMinutes: 1,
    hasAffiliateLinks: false,
    isHub: false,
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    articles
  };

  const notFound = {
    ...makePageBase({
      slug: '404',
      type: '404',
      title: 'Page Not Found',
      metaTitle: `Page Not Found — ${site.brand}`,
      metaDescription: 'The page you are looking for does not exist or has moved. Browse Awl & Stitch guides or return to the homepage.',
      datePublished: latestDate,
      dateModified: latestDate,
      pathname: '/404.html',
      siteUrl,
      breadcrumb: [],
      ogImage: '/og-default.png',
      ogImageAlt: `Page not found — ${site.brand}`,
      noindex: true
    }),
    category: '404',
    featuredNote: '',
    html: '',
    toc: [],
    faq: [],
    heroImage: null,
    heroAlt: '',
    heroTitle: '',
    wordCount: 0,
    readingMinutes: 1,
    hasAffiliateLinks: false,
    isHub: false,
    schemaTypes: []
  };

  const spokes = articles.filter((page) => page.slug !== hub.slug);
  const hubArticles = articles.filter((page) => page.slug !== hub.slug);
  const topArticles = spokes.slice(0, 3);

  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });
  await copyDirectory(PUBLIC_DIR, DIST_DIR);
  await fs.mkdir(path.join(DIST_DIR, 'styles'), { recursive: true });
  await fs.copyFile(path.join(SRC_DIR, 'styles', 'main.css'), path.join(DIST_DIR, 'styles', 'main.css'));

  async function writePage(page, html) {
    const target = page.path === '/' ? path.join(DIST_DIR, 'index.html') : page.path === '/404.html' ? path.join(DIST_DIR, '404.html') : path.join(DIST_DIR, page.slug, 'index.html');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, html, 'utf8');
  }

  const homeHtml = renderDocument({
    site,
    siteUrl,
    page: home,
    main: renderHome({ site, hub, spokes, imageDimensions }),
    jsonLd: buildSchemaGraph(home, { site, siteUrl, affiliates }),
    heroPreload: '/images/home-hero.svg',
    bodyClass: 'is-home'
  });
  await writePage(home, homeHtml);

  for (const page of articles) {
    const html = renderDocument({
      site,
      siteUrl,
      page,
      main: renderArticle({ page, related: page.related, hubArticles, imageDimensions }),
      jsonLd: buildSchemaGraph(page, { site, siteUrl, affiliates }),
      heroPreload: page.heroImage,
      bodyClass: page.isHub ? 'is-article is-hub' : 'is-article'
    });
    await writePage(page, html);
  }

  for (const page of trustPages) {
    const html = renderDocument({
      site,
      siteUrl,
      page,
      main: renderTrust({ site, page }),
      jsonLd: buildSchemaGraph(page, { site, siteUrl, affiliates }),
      heroPreload: null,
      bodyClass: 'is-trust'
    });
    await writePage(page, html);
  }

  const allArticlesHtml = renderDocument({
    site,
    siteUrl,
    page: allArticles,
    main: renderAllArticles({ page: allArticles, articles, hub }),
    jsonLd: buildSchemaGraph(allArticles, { site, siteUrl, affiliates }),
    heroPreload: null,
    bodyClass: 'is-index'
  });
  await writePage(allArticles, allArticlesHtml);

  const notFoundHtml = renderDocument({
    site,
    siteUrl,
    page: notFound,
    main: renderNotFound({ topArticles, hub }),
    jsonLd: null,
    heroPreload: null,
    bodyClass: 'is-404'
  });
  await writePage(notFound, notFoundHtml);

  const sitemapPages = [home, ...articles, ...trustPages, allArticles];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map((page) => {
    const priority = page.type === 'home' ? '1.0' : page.slug === hub.slug ? '0.9' : page.type === 'article' ? '0.8' : page.type === 'all-articles' ? '0.6' : '0.5';
    const changefreq = page.type === 'home' || page.type === 'all-articles' ? 'weekly' : page.type === 'article' ? 'monthly' : 'yearly';
    return `  <url>
    <loc>${escapeXml(page.canonical)}</loc>
    <lastmod>${escapeXml(page.dateModified)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

  const rssItems = [...articles]
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified) || (site.articleMeta?.[a.slug]?.order ?? 99) - (site.articleMeta?.[b.slug]?.order ?? 99))
    .map(
      (page) => `    <item>
      <title>${escapeXml(page.title)}</title>
      <link>${escapeXml(page.canonical)}</link>
      <guid isPermaLink="true">${escapeXml(page.canonical)}</guid>
      <pubDate>${escapeXml(formatRssDate(page.datePublished))}</pubDate>
      <description>${escapeXml(page.metaDescription)}</description>
      <category>${escapeXml(page.primaryKeyword)}</category>
    </item>`
    )
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.brand)}</title>
    <link>${escapeXml(`${siteUrl}/`)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>${escapeXml(site.locale)}</language>
    <lastBuildDate>${escapeXml(formatRssDate(latestDate))}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;

  const robots = `# ${site.brand}
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf8');
  await fs.writeFile(path.join(DIST_DIR, 'robots.txt'), robots, 'utf8');
  await fs.writeFile(path.join(DIST_DIR, 'rss.xml'), rss, 'utf8');

  const cssStats = await fs.stat(path.join(DIST_DIR, 'styles', 'main.css'));
  const svgCount = (await fs.readdir(path.join(DIST_DIR, 'images'))).filter((file) => file.endsWith('.svg')).length;
  const ogCount = (await fs.readdir(path.join(DIST_DIR, 'og'))).filter((file) => file.endsWith('.png')).length;

  console.log(`SITE_URL: ${siteUrl}`);
  console.log(`Built ${2 + articles.length + trustPages.length + 1} HTML pages (home, ${articles.length} articles, ${trustPages.length} trust pages, all-articles, 404).`);
  console.log(`Sitemap URLs: ${sitemapPages.length}. RSS items: ${articles.length}.`);
  console.log(`Assets: ${svgCount} SVG illustrations, ${ogCount} article OG images, 1 default OG image. CSS: ${(cssStats.size / 1024).toFixed(1)} KB.`);
  console.log(`Affiliate tracking ID: ${affiliates._meta?.trackingId ? 'configured' : 'empty (direct item URLs)'}.`);

  const allWarnings = [...contentWarnings, ...warnings];
  if (pendingLinks.size) {
    allWarnings.push(`Content contains ${pendingLinks.size} unique pending-link comments for unbuilt pages (not rendered): ${[...pendingLinks].join(', ')}`);
  }
  allWarnings.push('Content frontmatter uses metaTitle/metaDescription and body FAQ/Sources sections rather than the generic faq/sources frontmatter arrays; the build supports this layout.');
  allWarnings.push('Contact email hello@awlandstitch.com appears in content and site config; confirm the mailbox exists before launch.');

  if (allWarnings.length) {
    console.log(`\nWarnings (${allWarnings.length}):`);
    for (const warning of allWarnings) console.log(`  - ${warning}`);
  } else {
    console.log('\nWarnings: none.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
