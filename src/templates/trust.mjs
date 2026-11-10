import { escapeHtml, formatDate } from '../lib/util.mjs';
import { breadcrumbs, trustNav } from './partials.mjs';

export function renderTrust({ site, page }) {
  return `<div class="trust-shell">
  ${breadcrumbs(page)}
  <article class="trust-page">
    <header class="trust-header">
      <p class="eyebrow">Trust &amp; standards</p>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="trust-meta">Last updated ${escapeHtml(formatDate(page.dateModified))}</p>
    </header>
    <div class="prose trust-body">
      ${page.html}
    </div>
    ${trustNav(site, page.slug)}
  </article>
</div>`;
}
