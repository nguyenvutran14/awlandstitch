import { escapeAttr, escapeHtml, formatDate } from '../lib/util.mjs';
import { articleCard } from './partials.mjs';

export function renderHome({ site, hub, spokes, imageDimensions }) {
  const homeHeroDimensions = imageDimensions['/images/home-hero.svg'] || { width: 1200, height: 675 };
  const hubImageDimensions = imageDimensions[hub.heroImage] || { width: 1200, height: 675 };

  return `<div class="home">
  <section class="home-hero">
    <div class="home-hero-copy">
      <p class="eyebrow">Independent leathercraft tool research</p>
      <h1>Leathercraft tools, researched before you buy.</h1>
      <p class="lede">Awl &amp; Stitch is a US-focused buying guide for pricking irons, stitching chisels, and the hand-stitching bench. We check live marketplace listings, date every price, and never claim hands-on testing we did not do.</p>
      <div class="hero-actions">
        <a class="button button-primary" href="/best-pricking-irons/">Best pricking irons for beginners</a>
        <a class="button button-secondary" href="/best-budget-pricking-irons/">Best budget picks under $30</a>
      </div>
      <ul class="trust-chips" aria-label="What we check">
        <li>Prices dated</li>
        <li>US shipping checked</li>
        <li>No paid rankings</li>
      </ul>
    </div>
    <div class="home-hero-art">
      <img src="/images/home-hero.svg" alt="Illustration of leathercraft hand tools: a pricking iron, an awl, thread, and a stitched leather swatch" width="${homeHeroDimensions.width}" height="${homeHeroDimensions.height}" loading="eager" fetchpriority="high" decoding="async">
    </div>
  </section>

  <section class="section hub-feature" aria-labelledby="hub-feature-heading">
    <div class="section-heading">
      <p class="eyebrow">Start here</p>
      <h2 id="hub-feature-heading">The pricking iron hub</h2>
      <p>One page with the ranked shortlist, verified US shipping, and the sizing decision that trips up most beginners.</p>
    </div>
    <div class="hub-feature-card">
      <div class="hub-feature-copy">
        <p class="card-tag">${escapeHtml(hub.category)}</p>
        <h3><a href="${escapeAttr(hub.path)}">${escapeHtml(hub.title)}</a></h3>
        <p>${escapeHtml(hub.featuredNote || hub.metaDescription)}</p>
        <ul class="mini-facts">
          <li>5 ranked picks</li>
          <li>US shipping verified</li>
          <li>Prices dated ${escapeHtml(formatDate(hub.dateModified))}</li>
        </ul>
        <a class="text-link" href="${escapeAttr(hub.path)}">Read the buying guide</a>
      </div>
      <a class="hub-feature-media" href="${escapeAttr(hub.path)}" tabindex="-1" aria-hidden="true">
        <img src="${escapeAttr(hub.heroImage)}" alt="" width="${hubImageDimensions.width}" height="${hubImageDimensions.height}" loading="lazy" decoding="async">
      </a>
    </div>
  </section>

  <section class="section latest-guides" aria-labelledby="latest-heading">
    <div class="section-heading section-heading-row">
      <div>
        <p class="eyebrow">Latest guides</p>
        <h2 id="latest-heading">Pick your next question</h2>
      </div>
      <a class="text-link" href="/all-articles/">All articles</a>
    </div>
    <div class="card-grid">
      ${spokes.map((article) => articleCard(article)).join('\n')}
    </div>
  </section>

  <section class="trust-strip" aria-labelledby="trust-heading">
    <div class="trust-strip-intro">
      <p class="eyebrow">How we research</p>
      <h2 id="trust-heading">Show the work, date the claim.</h2>
      <p>Every guide starts with dated marketplace listings, published specs, and buyer threads. If we cannot source a number, we do not publish it.</p>
      <p class="trust-strip-links"><a href="/about/">About Awl &amp; Stitch</a> <span aria-hidden="true">·</span> <a href="/editorial-policy/">Editorial policy</a></p>
    </div>
    <div class="trust-grid">
      <div class="trust-item">
        <span class="trust-number" aria-hidden="true">01</span>
        <h3>Listings captured with dates</h3>
        <p>Price, variants, ratings, and shipping windows are read from the live AliExpress US storefront and dated.</p>
      </div>
      <div class="trust-item">
        <span class="trust-number" aria-hidden="true">02</span>
        <h3>No fake testing claims</h3>
        <p>We are researchers, not a test bench. Quality claims are attributed to buyers, sellers, or manufacturers.</p>
      </div>
      <div class="trust-item">
        <span class="trust-number" aria-hidden="true">03</span>
        <h3>Corrections get priority</h3>
        <p>Wrong price or dead listing? Email us and we verify the source, fix the page, and log the change.</p>
      </div>
    </div>
  </section>

  <section class="disclosure-summary" aria-labelledby="money-heading">
    <div>
      <p class="eyebrow">How we make money</p>
      <h2 id="money-heading">Reader-supported, never pay-for-ranking.</h2>
    </div>
    <div>
      <p>Awl &amp; Stitch is reader-supported. If you buy through links on our site, we may earn an affiliate commission at no extra cost to you. We never accept payment for rankings, sponsored posts, or placements. Commissions are our only income.</p>
      <p><a class="text-link" href="/affiliate-disclosure/">Read the full affiliate disclosure</a></p>
    </div>
  </section>

  <section class="contact-cta" aria-labelledby="contact-heading">
    <div>
      <p class="eyebrow">Corrections &amp; questions</p>
      <h2 id="contact-heading">Have a source we missed?</h2>
      <p>Email the editorial team at <a href="mailto:${escapeAttr(site.email)}">${escapeHtml(site.email)}</a>. We do not run a newsletter, a contact form, or a popup.</p>
    </div>
    <a class="button button-secondary" href="/contact/">Contact the team</a>
  </section>
</div>`;
}
