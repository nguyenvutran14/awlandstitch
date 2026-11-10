# SEO Audit — Awl & Stitch (G5/G6 audit step)

**Date:** 2026-11-10
**Owner:** seo-optimizer
**Scope:** Technical + on-page audit of the built static site in `dist/` (source `src/`, `scripts/`, `public/`, content `content/*.md`), checked against `docs/04-seo-plan.md` and `docs/03-domain-options.md`.
**Site URL (placeholder):** `https://awlandstitch.pages.dev` — canonicals, sitemap, robots, RSS, and OG tags all use this host consistently, matching `src/data/site.json` → `"domain"`.

---

## VERDICT: PASS WITH FIXES

Two technical fixes were applied and re-verified (see *Fixes applied*). No P0 or P1 issues remain open. All remaining items are P2 polish or pre-deploy owner actions.

- **P0 (blocks indexing/ranking): 0**
- **P1 (fix before deploy): 0 open**
- **P2 (polish / owner actions): 6** (listed at the end)

Commands proving the final state:

```
> npm run build
SITE_URL: https://awlandstitch.pages.dev
Built 15 HTML pages (home, 6 articles, 6 trust pages, all-articles, 404).
Sitemap URLs: 14. RSS items: 6.
Assets: 28 SVG illustrations, 6 article OG images, 1 default OG image. CSS: 25.9 KB.

> npm run check
PASS — required files, links, images, JSON-LD, affiliate attributes, sitemap, robots, and RSS checks passed.
Notes: CSS 25.9 KB. Client JS 0 KB. Sitemap 14 URLs. RSS 6 items.
15 HTML pages; 36 AliExpress links; 46 other external links; 40 img tags; 14 internal targets.
```

---

## 1. Crawlability and indexing

| Check | Result | Evidence |
|---|---|---|
| robots.txt allows all, references sitemap | PASS | `dist/robots.txt`: `User-agent: *` / `Allow: /` / `Sitemap: https://awlandstitch.pages.dev/sitemap.xml`. No CSS/JS/content blocked. |
| Sitemap completeness | PASS | `dist/sitemap.xml` contains exactly 14 URLs: `/`, 6 articles, 6 trust pages, `/all-articles/`. 404 and draft/none pages excluded. Every `<loc>` resolves to a built file (verified by `npm run check` sitemap walk). |
| Sitemap lastmod correctness | PASS | All 14 `<lastmod>` values are `2026-11-07`, matching each page's `dateModified` from content frontmatter and the visible "Last updated November 7, 2026" bylines. |
| Canonicals | PASS | Every page has exactly one self-referencing absolute canonical on the configured host, e.g. `dist/best-pricking-irons/index.html` line 11: `<link rel="canonical" href="https://awlandstitch.pages.dev/best-pricking-irons/">`. 404 canonical points to `/404.html` and the page is `noindex,follow` (line 8). |
| No accidental noindex | PASS | Only `404.html` carries `noindex`. All 14 indexable pages carry `index,follow,max-image-preview:large`. Verified by `npm run check` (errors on unexpected noindex / missing 404 noindex). |
| 404 returns 404 status | PASS | Served locally via `npm run preview` (node `scripts/serve.mjs`): `GET /does-not-exist/` → **404** with the styled `dist/404.html` body (links to home, hub, top 3 guides). Cloudflare Pages serves `404.html` with HTTP 404 automatically at deploy. All 20 tested real URLs returned 200. |
| Trailing slash + case consistency | PASS | All internal `<a href>` page links use lowercase root-relative paths with trailing slashes (regex sweep of all 15 HTML files found zero slash-less page links; slugs are all lowercase-hyphenated per plan §5). Canonicals and sitemap `<loc>` use the same trailing-slash form — no duplicate-path risk. |

## 2. Metadata and headings

| Check | Result | Evidence |
|---|---|---|
| Unique titles ≤60 chars | PASS | All 15 pages unique; lengths 31–56 chars (max: irons-vs-chisels at 56). `npm run check` warns >60 — zero warnings. |
| Unique meta descriptions ≤155 chars | PASS | All 15 unique; lengths 115–155 (home exactly 155, under the cap). Zero length warnings from check. |
| Keyword alignment to plan §4 | PASS | Scripted check of primary keyword in title/H1/first-100-words/≥1 H2 for all 6 articles: all Y/Y/Y/Y (e.g. hub: "best pricking irons" in title, H1 "Best Pricking Irons for Beginners (2026)", first paragraph, and H2 "Our Top Picks" section context). Home targets brand "Awl & Stitch" — present in `<title>`, header brand, and Organization schema (see P2-1). |
| One H1 per page | PASS | Exactly one `<h1>` on every page (check.mjs enforces; manual recount confirms). |
| Heading hierarchy | PASS | Scripted h1–h6 sequence scan across all 15 pages: no level skips (no h2→h4 jumps). H2 counts 3–16 per page, logical H2→H3 order. |
| No cannibalization | PASS | One primary keyword per URL per plan §4; budget page always carries "budget" modifier, hub owns "best pricking irons", comparisons own their "vs" phrases. No overlap found in titles/H1s. |
| Open Graph + Twitter | PASS | Every page: `og:title/description/url/image/image:width/image:height/image:alt/type/locale/site_name`; articles add `article:published_time/modified_time/author/section`. `twitter:card summary_large_image` + title/description/image/image:alt on every page (check.mjs enforces). |
| og:image resolves | PASS | All 7 OG PNGs exist and are exactly **1200×630** (verified with System.Drawing): `og-default.png` + 6 per-article images in `dist/og/`. `og:image` URLs are absolute on the configured host (check.mjs errors otherwise). |

## 3. Content and intent

| Check | Result | Evidence |
|---|---|---|
| Answer above the fold | PASS | Hub renders verdict in first body paragraph ("The best pricking irons for most US beginners come down to one listing: the WUTA 1-piece French-style iron…") before the comparison table; informational pages open with the direct answer (spot-checked wallets, size-chart). |
| No thin/duplicate pages | PASS | 6 articles, word counts ~1,500–3,000 (hub `wordCount: 3005` in JSON-LD); intros and verdicts are page-specific — no boilerplate intros observed across the 6 articles. |
| Sources present | PASS | All 6 articles have a visible `### Sources` section (`sources-heading` class present in every article HTML; build warns if missing — zero warnings). Claims carry inline dated citations (e.g. "verified November 7, 2026", Reddit thread dates). |
| No fabricated testing | PASS | Explicit disclaimers on every article: "This guide is research-based. We have not bench-tested these tools" (aside note) + "We do not claim to have tested these irons" (How We Picked). No "we tested" phrasing found in dist. |
| Internal links: no orphans, no broken | PASS | Scripted link-graph crawl of `<main>` content areas: **zero orphans** (every page receives ≥1 contextual in-link; trust pages additionally linked sitewide from footer). `npm run check` validates every internal href resolves to a built file and every `#anchor` target id exists — zero errors. |
| Link matrix vs plan §9 | PASS | Published-page rows of the plan matrix all satisfied: hub → all 5 published spokes; 3.38-vs → hub + wallets + chart + budget; chisels → hub + chart + budget; budget → hub; wallets → hub + 3.38-vs + chart; chart → hub + wallets + 3.38-vs. Links to the 6 not-yet-built spokes are correctly suppressed (pending-link comments stripped at build; nothing renders as a broken link). |
| E-E-A-T | PASS | Author box on every article ("By The Awl & Stitch Editorial Team" + honest AI-assisted/human-reviewed bio in schema); visible "Last updated" dates; About/Contact/Editorial Policy/Affiliate Disclosure/Privacy/Terms all built and footer-linked sitewide; Editorial Policy documents methodology + corrections + AI disclosure. |

## 4. Schema (JSON-LD)

| Check | Result | Evidence |
|---|---|---|
| Parses | PASS | All blocks `JSON.parse` cleanly via check.mjs; `@context: https://schema.org`, `@graph` on every page. |
| BlogPosting | PASS | All 6 articles: headline, name, description, datePublished/dateModified (2026-11-07), author Person with honest description + About URL, publisher `@id` ref, image, mainEntityOfPage, keywords, wordCount. |
| BreadcrumbList | PASS | Every page including home (Home → Page 2-level; home is single-item Home). |
| FAQPage | PASS | Exactly the 6 planned pages (hub, budget, 3.38-vs, chisels, wallets, chart), 3–6 Q&As each, extracted at build from the visible FAQ sections (`<h2 id="faq" class="faq-heading">` present on all 6) — no invented questions. |
| ItemList | PASS | Hub (5 picks) and budget (3 picks) — exactly the pages plan §10 assigns ItemList to among built pages; `itemListElement` with position + Product `@id` refs. |
| Product | PASS | Hub 5 Products, budget 3 Products, generated from `src/data/affiliates.json`: name, brand, sku, url, offers.price/priceCurrency + "price at time of writing" description, priceChecked/verification `additionalProperty`. `aggregateRating` only on the 3 listings with ratings verified 2026-11-07 (4.9/82, 5.0/5, 4.8/55) — omitted for MOZHE/JOTUN exactly as the plan requires. |
| No fake Review markup | PASS | Zero `Review` types (check.mjs fails if any). |
| Organization + WebSite on home | PASS | `dist/index.html` @graph: BreadcrumbList, Organization, WebSite, WebPage. No SearchAction (correct — no site search). |

## 5. Affiliate and compliance

| Check | Result | Evidence |
|---|---|---|
| Disclosure above first affiliate link | PASS | Scripted position check on all 6 monetized pages: `disclosure-box` appears before the first `aliexpress.us` link on every one. Standard plan §12 text rendered: "Awl & Stitch is reader-supported… We never accept payment for rankings." + link to /affiliate-disclosure/. Footer repeats a short disclosure sitewide. |
| Affiliate link attributes | PASS | All 36 AliExpress links carry `target="_blank" rel="sponsored nofollow noopener"` (check.mjs errors on any miss; manual recount: 36/36 clean). Deep links to exact item URLs (`/item/<id>.html`); no cloaking or redirect paths. |
| No placeholder tokens | PASS | Zero `{{aff:` tokens, zero `PLACEHOLDER`/`YOUR-` strings in any href/src (check.mjs enforces). Tracking ID is intentionally empty in `affiliates.json`, so no fake tracking param is appended (see P2-3). |
| Pending links visibly disabled, not broken | PASS | No pending placeholders rendered in the current dist (the 6 unbuilt spoke targets are suppressed entirely rather than shown disabled — safer than broken). The disabled-render path exists in `src/lib/markdown.mjs` (`is-disabled` + `aria-disabled="true"`) for future use. |
| Trust pages exist and are linked | PASS | All 6 trust pages built; footer "Trust & legal" nav on every page links About/Contact/Editorial Policy/Affiliate Disclosure/Privacy/Terms; About ↔ Editorial Policy ↔ Affiliate Disclosure cross-link; Privacy names Cloudflare Web Analytics status + CCPA/CPRA rights; Contact has `mailto:hello@awlandstitch.com`; Affiliate Disclosure cites FTC/16 CFR framing. |

## 6. Performance and mobile

| Check | Result | Evidence |
|---|---|---|
| CSS budget | PASS | Single self-hosted stylesheet `dist/styles/main.css` = **25.9 KB** (< 30 KB check budget, < 40 KB plan budget). No external fonts (`@font-face`/Google Fonts absent — system font stack). |
| Zero client JS | PASS | **0 KB** client JS; no `<script src>` anywhere; the only scripts are the JSON-LD blocks. Nav is a CSS-only checkbox toggle. |
| No render-blocking third parties | PASS | Zero external CSS/JS/font origins in any `<head>` (scripted scan: 0). Only preload is the LCP hero (`<link rel="preload" as="image" … fetchpriority="high">`). |
| HTML size | PASS | Largest page 58.4 KB (hub) < 60 KB plan budget; next 45.2 KB (budget); rest ≤ 34 KB. |
| Images: dimensions/alt/lazy | PASS | All 40 `<img>` tags have `alt`, explicit `width`/`height` (1200×675 from intrinsic SVG dims), `decoding="async"`. Exactly one eager image per article (the preloaded LCP hero, `loading="eager" fetchpriority="high"`); all below-fold images `loading="lazy"`. Zero missing image files (check.mjs verifies targets exist). |
| Mobile viewport | PASS | `<meta name="viewport" content="width=device-width, initial-scale=1">` on all 15 pages; responsive tables wrapped in scrollable `role="region"` containers; CSS-only mobile nav. |
| Lighthouse/PageSpeed | NOT RUN | No browser/Lighthouse available in this audit environment. Static proxies are all clean (0 KB JS, 25.9 KB CSS, preloaded LCP, explicit dimensions → low CLS risk). Recommend QA runs PageSpeed on the deployed `pages.dev` URL (see P2-6). |

## 7. Technical hygiene

| Check | Result | Evidence |
|---|---|---|
| RSS valid | PASS | `dist/rss.xml`: RSS 2.0 + `atom:link rel="self"`, 6 items (one per article) with permalink guids, pubDates, language `en-US`, `lastBuildDate` = latest article date. Linked from every page via `<link rel="alternate" type="application/rss+xml">`. |
| Favicon | PASS | `favicon.svg` + `favicon-32.png` + `apple-touch-icon.png` present in dist and referenced on every page. |
| 404 styled | PASS | See §1; branded layout, noindex, helpful links. |
| Console errors / mixed content | PASS | No client JS to error; zero `http://` href/src in any HTML/XML (scripted scan) — no mixed content. |
| Security headers | PASS | `dist/_headers`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP, strict CSP (`default-src 'self'`, `frame-ancestors 'none'`), HSTS, plus immutable cache rules for /styles, /images, /og and must-revalidate for HTML. |
| npm audit | PASS | `npm audit` → **found 0 vulnerabilities**. |

---

## Fixes applied (verified after rebuild)

### Fix 1 — Hero image rendered twice on 5 of 6 articles (P2 → fixed)

- **Files:** `src/lib/markdown.mjs` (`extractHero`).
- **Evidence (before):** `dist/best-pricking-irons/index.html` contained the hero twice — header figure (line 426, `loading="eager"`) and again in the body (line 452, `loading="lazy"`). Same duplication on 3-38mm-vs, chisels, wallets, size-chart (45 total `<img>` tags). Root cause: markdown-it parses `![alt](src)` as an inline child of an `inline` token, but `extractHero` only searched for top-level `image` tokens, so it never matched; the hero fell back to the `site.json` config (rendered in the header) while the markdown copy stayed in the body.
- **Fix:** `extractHero` now scans inline token children for the hero image and removes it (removing the whole wrapping paragraph when the image is the paragraph's only content).
- **Verification (after rebuild):** `<img>` count 45 → 40; scripted duplicate-src scan across all 15 pages: *"No duplicate img src in any dist page."*; hub hero now referenced exactly twice (preload link + header img) and absent from the article body. `npm run build` + `npm run check` → **PASS**.

### Fix 2 — `check.mjs` domain default could diverge from the build (P2 → fixed)

- **Files:** `scripts/check.mjs`.
- **Evidence (before):** `check.mjs` hardcoded `SITE_URL` default `https://awlandstitch.pages.dev`, while `build.mjs` resolves `SITE_URL` env → `site.json.domain`. If the custom domain is later set via `SITE_URL` for the build but not for check, check would fail against the wrong host (og:image host check, robots sitemap check).
- **Fix:** `check.mjs` now resolves the default from `src/data/site.json` exactly like `build.mjs` (env override still wins).
- **Verification:** `npm run build` + `npm run check` re-run → **PASS** with identical output (SITE_URL `https://awlandstitch.pages.dev`, 14 sitemap URLs, 0 errors).

---

## Remaining for owners (P1: none · P2: 6)

1. **P2 — Home H1 does not contain the literal brand string.** H1 is "Leathercraft tools, researched before you buy."; the brand "Awl & Stitch" appears in `<title>`, header brand, and Organization schema, which satisfies brand-navigational queries. Optional tweak only. **Owner: content-writer (optional, editorial).**
2. **P2 — Contact mailbox unverified.** Build warning: `hello@awlandstitch.com` must exist before launch (Contact page + policies reference it). **Owner: site-builder/CEO at deploy.**
3. **P2 — Affiliate tracking ID empty (by design).** Links go direct to item URLs with no tracking param until the AliExpress affiliate account is approved; `affiliates.json._meta.trackingId` must be filled before monetization (build appends the param automatically once non-placeholder). **Owner: site-builder when the account is live.**
4. **P2 — Hub HTML at 58.4 KB is near the 60 KB budget.** Fine today; watch on the next hub edit (prices table grows). **Owner: site-builder.**
5. **P2 — 6 planned spokes not yet written** (`what-thread-for-pricking-irons`, `aliexpress-leather-tools-shipping-duties`, `pricking-iron-care`, `wuta-vs-beagle-pricking-irons`, `wuta-pricking-irons-review`, `how-to-use-pricking-irons`). Pending-link comments in content are correctly suppressed — no broken links. Matches the plan's 90-day calendar and the 14-URL build scope. **Owner: content-writer per calendar.**
6. **P2 — Lighthouse/PageSpeed not runnable in this environment.** Static proxies all pass (0 KB JS, 25.9 KB CSS, preloaded LCP, explicit image dimensions, no third parties). Run PageSpeed on the deployed `pages.dev` URL at QA/deploy. **Owner: qa-reviewer (post-deploy).**

No items routed back to `site-builder` or `content-writer` as blockers — the site is clear to proceed to QA (G6) on the current build.
