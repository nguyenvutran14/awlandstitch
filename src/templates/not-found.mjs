import { escapeHtml } from '../lib/util.mjs';

export function renderNotFound({ topArticles, hub }) {
  return `<div class="not-found">
  <p class="eyebrow">404</p>
  <h1>Page not found</h1>
  <p class="lede">The page you are looking for does not exist or has moved. Here are the routes most readers want.</p>
  <div class="not-found-links">
    <a class="button button-primary" href="/">Go home</a>
    <a class="button button-secondary" href="${escapeHtml(hub.path)}">Best pricking irons hub</a>
  </div>
  <section class="not-found-guides" aria-labelledby="not-found-heading">
    <h2 id="not-found-heading">Top guides</h2>
    <ul>
      ${topArticles
        .map(
          (article) =>
            `<li><a href="${escapeHtml(article.path)}">${escapeHtml(article.title)}</a><span>${escapeHtml(article.category)}</span></li>`
        )
        .join('\n')}
    </ul>
  </section>
  <p class="not-found-note">Or browse <a href="/all-articles/">all articles</a> and the <a href="/pricking-iron-size-chart/">pricking iron size chart</a>.</p>
</div>`;
}
