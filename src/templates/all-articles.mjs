import { escapeHtml } from '../lib/util.mjs';
import { articleCard, breadcrumbs } from './partials.mjs';

export function renderAllArticles({ page, articles, hub }) {
  return `<div class="index-shell">
  ${breadcrumbs(page)}
  <header class="index-header">
    <p class="eyebrow">The library</p>
    <h1>All Articles</h1>
    <p class="lede">Every Awl &amp; Stitch guide in one place: buying hubs, comparisons, sizing references, and budget picks. All prices are shown at time of writing and dated.</p>
  </header>

  <section class="index-callout" aria-labelledby="index-callout-heading">
    <div>
      <p class="eyebrow">New here?</p>
      <h2 id="index-callout-heading">Start with the pricking iron hub</h2>
      <p>${escapeHtml(hub.featuredNote || hub.metaDescription)}</p>
    </div>
    <a class="button button-primary" href="${escapeHtml(hub.path)}">Read the hub</a>
  </section>

  <section class="section" aria-labelledby="all-articles-heading">
    <div class="section-heading">
      <p class="eyebrow">${articles.length} guides</p>
      <h2 id="all-articles-heading">Browse the guides</h2>
    </div>
    <div class="card-grid">
      ${articles.map((article) => articleCard(article)).join('\n')}
    </div>
  </section>

  <section class="index-trust" aria-labelledby="index-trust-heading">
    <h2 id="index-trust-heading">What every guide has in common</h2>
    <ul>
      <li>A dated research basis and a visible last-updated date.</li>
      <li>Prices shown as “at time of writing,” with the checkout total treated as authoritative.</li>
      <li>No invented testing claims, no fake reviews, and no paid rankings.</li>
      <li>A clear affiliate disclosure above the first affiliate link.</li>
    </ul>
    <p><a href="/editorial-policy/">Read the editorial policy</a> or <a href="/about/">meet the editorial team</a>.</p>
  </section>
</div>`;
}
