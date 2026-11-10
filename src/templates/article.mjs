import { escapeAttr, escapeHtml, formatDate } from '../lib/util.mjs';
import {
  authorBox,
  breadcrumbs,
  disclosureReminder,
  hubCluster,
  pageHeroImage,
  relatedGuides,
  tocBlock
} from './partials.mjs';

export function renderArticle({ page, related, hubArticles, imageDimensions }) {
  const hero = pageHeroImage(page, imageDimensions);
  const toc = tocBlock(page.toc);
  const hubBlock = page.isHub ? hubCluster(hubArticles) : '';
  const reminder = page.hasAffiliateLinks ? disclosureReminder() : '';

  return `<div class="article-shell">
  ${breadcrumbs(page)}
  <article class="article">
    <header class="article-header">
      <p class="eyebrow">${escapeHtml(page.category)}${page.isHub ? ' <span aria-hidden="true">·</span> Buying hub' : ''}</p>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="article-dek">${escapeHtml(page.metaDescription)}</p>
      <div class="byline">
        <span>By ${escapeHtml(page.author)}</span>
        <span>Last updated ${escapeHtml(formatDate(page.dateModified))}</span>
        <span>${page.readingMinutes} min read</span>
      </div>
      ${hero}
    </header>

    <div class="article-layout">
      <aside class="article-aside" aria-label="Article navigation">
        ${toc}
        <div class="aside-note">
          <p class="eyebrow">Research note</p>
          <p>This guide is research-based. We have not bench-tested these tools, and we do not pretend otherwise.</p>
          <a href="/editorial-policy/">How we research</a>
        </div>
      </aside>
      <div class="article-body prose">
        ${page.html}
      </div>
    </div>

    ${hubBlock}

    ${authorBox(page)}

    ${reminder}

    ${relatedGuides(related)}
  </article>
</div>`;
}
