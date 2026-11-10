import { escapeAttr, escapeHtml, formatDate, truncate } from '../lib/util.mjs';

export function brandMark(className = 'brand-mark') {
  return `<svg class="${className}" width="36" height="36" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
  <rect width="40" height="40" rx="10" fill="#2a1c14"></rect>
  <path d="M12 28 L27 13" stroke="#f7efe4" stroke-width="3" stroke-linecap="round"></path>
  <path d="M14 12 L28 26" stroke="#c98f5a" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="3 4"></path>
  <circle cx="12" cy="28" r="2.6" fill="#c98f5a"></circle>
</svg>`;
}

export function header(site, page) {
  const nav = site.nav
    .map((item) => {
      const active = item.match === page.slug;
      return `<li><a href="${escapeAttr(item.href)}"${active ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a></li>`;
    })
    .join('');

  return `<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${escapeAttr(site.brand)} home">
      ${brandMark()}
      <span class="brand-name">${escapeHtml(site.brand)}</span>
    </a>
    <input class="nav-toggle" type="checkbox" id="nav-toggle" aria-label="Toggle navigation menu">
    <label class="nav-toggle-label" for="nav-toggle"><span class="nav-toggle-icon" aria-hidden="true"></span> Menu</label>
    <nav class="site-nav" aria-label="Primary">
      <ul>${nav}</ul>
    </nav>
  </div>
</header>`;
}

export function footer(site, page) {
  const trustLinks = site.trustPages
    .map((item) => `<li><a href="/${escapeAttr(item.slug)}/">${escapeHtml(item.label)}</a></li>`)
    .join('');

  const year = site.copyrightYear || '2026';

  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <a class="footer-brand-link" href="/" aria-label="${escapeAttr(site.brand)} home">
        ${brandMark('brand-mark brand-mark-light')}
        <span>${escapeHtml(site.brand)}</span>
      </a>
      <p>${escapeHtml(site.tagline)}.</p>
      <p class="footer-small">We publish research-based guides, date every price, and never claim hands-on testing we did not do.</p>
    </div>
    <nav class="footer-nav" aria-label="Explore">
      <h2>Explore</h2>
      <ul>
        <li><a href="/best-pricking-irons/">Best pricking irons</a></li>
        <li><a href="/best-budget-pricking-irons/">Budget pricking irons</a></li>
        <li><a href="/pricking-iron-size-chart/">Pricking iron size chart</a></li>
        <li><a href="/all-articles/">All articles</a></li>
        <li><a href="/about/">About Awl &amp; Stitch</a></li>
      </ul>
    </nav>
    <nav class="footer-nav" aria-label="Trust and legal">
      <h2>Trust &amp; legal</h2>
      <ul>${trustLinks}</ul>
    </nav>
  </div>
  <div class="wrap footer-bottom">
    <p>&copy; ${year} ${escapeHtml(site.brand)}. Prices are shown at time of writing; verify the current price and shipping at checkout.</p>
    <p>Awl &amp; Stitch is reader-supported. If you buy through links on our site, we may earn an affiliate commission at no extra cost to you. We never accept payment for rankings. <a href="/affiliate-disclosure/">Read the affiliate disclosure</a>.</p>
  </div>
</footer>`;
}

export function breadcrumbs(page) {
  if (!page.breadcrumb?.length) return '';
  const items = page.breadcrumb
    .map((item, index) => {
      const last = index === page.breadcrumb.length - 1;
      const label = escapeHtml(item.name);
      return `<li>${last ? `<span aria-current="page">${label}</span>` : `<a href="${escapeAttr(item.path)}">${label}</a>`}</li>`;
    })
    .join('');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

export function tocBlock(toc) {
  if (!toc?.length) return '';
  const items = toc
    .map((heading) => `<li><a href="#${escapeAttr(heading.id)}">${escapeHtml(heading.text)}</a></li>`)
    .join('');
  return `<details class="toc">
  <summary>On this page</summary>
  <nav aria-label="Table of contents">
    <ol>${items}</ol>
  </nav>
</details>`;
}

export function articleCard(article, { showImage = true, compact = false } = {}) {
  const image = article.heroImage
    ? `<img src="${escapeAttr(article.heroImage)}" alt="" width="1200" height="675" loading="lazy" decoding="async">`
    : '';
  const media =
    showImage && image
      ? `<a class="card-media" href="${escapeAttr(article.path)}" tabindex="-1" aria-hidden="true">${image}</a>`
      : '';
  const description = truncate(article.featuredNote || article.metaDescription, compact ? 150 : 175);

  return `<article class="card${compact ? ' card-compact' : ''}">
  ${media}
  <div class="card-body">
    <p class="card-tag">${escapeHtml(article.category)}</p>
    <h3><a href="${escapeAttr(article.path)}">${escapeHtml(article.title)}</a></h3>
    <p class="card-description">${escapeHtml(description)}</p>
    <p class="card-meta">Updated ${escapeHtml(formatDate(article.dateModified))} <span aria-hidden="true">·</span> ${article.readingMinutes} min read</p>
  </div>
</article>`;
}

export function authorBox(page) {
  return `<aside class="author-box" aria-label="About the author">
  <div class="author-mark" aria-hidden="true">A&amp;S</div>
  <div>
    <p class="eyebrow">About the author</p>
    <h2>${escapeHtml(page.author)}</h2>
    <p>${escapeHtml(page.authorBio)}</p>
    <p class="author-links"><a href="/about/">Who we are</a> <span aria-hidden="true">·</span> <a href="/editorial-policy/">How we research</a></p>
  </div>
</aside>`;
}

export function disclosureReminder() {
  return `<p class="article-disclosure-reminder"><strong>Disclosure reminder:</strong> Awl &amp; Stitch may earn a commission from qualifying purchases made through links on this page, at no extra cost to you. <a href="/affiliate-disclosure/">Read the full affiliate disclosure</a>.</p>`;
}

export function relatedGuides(articles) {
  if (!articles?.length) return '';
  return `<section class="related-guides" aria-labelledby="related-heading">
  <div class="section-heading">
    <p class="eyebrow">Keep reading</p>
    <h2 id="related-heading">Related guides</h2>
  </div>
  <div class="card-grid card-grid-2">
    ${articles.map((article) => articleCard(article, { showImage: false, compact: true })).join('\n')}
  </div>
</section>`;
}

export function hubCluster(articles) {
  if (!articles?.length) return '';
  return `<section class="hub-cluster" aria-labelledby="hub-cluster-heading">
  <div class="section-heading">
    <p class="eyebrow">The cluster</p>
    <h2 id="hub-cluster-heading">All pricking iron guides</h2>
    <p>The hub answers which iron to buy. These guides go deeper on one question each.</p>
  </div>
  <div class="card-grid card-grid-2">
    ${articles.map((article) => articleCard(article, { showImage: false, compact: true })).join('\n')}
  </div>
</section>`;
}

export function trustNav(site, currentSlug) {
  const links = site.trustPages
    .filter((item) => item.slug !== currentSlug)
    .map((item) => `<li><a href="/${escapeAttr(item.slug)}/">${escapeHtml(item.label)}</a></li>`)
    .join('');
  return `<nav class="trust-nav" aria-label="Trust and standards">
  <h2>Trust &amp; standards</h2>
  <ul>${links}</ul>
</nav>`;
}

export function pageHeroImage(page, imageDimensions) {
  if (!page.heroImage) return '';
  const dimensions = imageDimensions?.[page.heroImage] || { width: 1200, height: 675 };
  const title = page.heroTitle ? ` title="${escapeAttr(page.heroTitle)}"` : '';
  return `<figure class="article-hero">
  <img src="${escapeAttr(page.heroImage)}" alt="${escapeAttr(page.heroAlt)}" width="${dimensions.width}" height="${dimensions.height}" loading="eager" fetchpriority="high" decoding="async"${title}>
</figure>`;
}
