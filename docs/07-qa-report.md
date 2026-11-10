# QA Report — Awl & Stitch (G6 final QA & compliance gate)

**Date:** 2026-11-10
**Owner:** qa-reviewer
**Scope:** Built site in `dist/` (15 HTML pages), sources (`content/*.md`, `src/`, `scripts/`, `public/`), and artifacts (`docs/00-brief.md`, `docs/01-market-research.md`, `docs/02-product-scorecard.md`, `docs/04-seo-plan.md`, `docs/06-seo-audit.md`, `src/data/affiliates.json`, `src/data/site.json`). Builds on `docs/06-seo-audit.md` — its technical/crawlability/schema checks were not duplicated except where independently re-verified below.
**Build re-verified this session:** `npm run build` → 15 pages, 14 sitemap URLs, 6 RSS items; `npm run check` → **PASS** (0 errors); `npm audit` → **0 vulnerabilities**. Re-verified again on the 2026-11-10 re-audit (below): `npm run check` → **PASS**, `npm audit` → **0 vulnerabilities**.

---

## VERDICT: **PASS** (re-audited 2026-11-10 after fixes — see Re-audit section below)

- **P0 (blocks deploy): 0**
- **P1 (fix before deploy): 0** (P1-1 resolved 2026-11-10)
- **P2 (post-launch polish): 5 open** (P2-1 through P2-4 resolved 2026-11-10; P2-5 through P2-9 remain)

---

## P1 — fix before deploy

### P1-1. Contact mailbox `hello@awlandstitch.com` cannot receive mail at deploy, and the Contact page claims it is monitored — **RESOLVED 2026-11-10**

- **Files:** `dist/contact/index.html` (lines 108–109), also referenced in `dist/about/index.html`, `dist/privacy-policy/index.html`, `dist/affiliate-disclosure/index.html`, `dist/editorial-policy/index.html`, `dist/index.html` (contact-CTA section); source: `content/contact.md`, `src/data/site.json` (`"email"`).
- **Original evidence:** The Contact page stated: *"The fastest way to contact Awl & Stitch is email: **hello@awlandstitch.com** … The inbox is monitored."* But `docs/03-domain-options.md` records `awlandstitch.com` as **unregistered** ("NO MATCH (HTTP 404) + DNS NXDOMAIN — appears available", checked 2026-11-07), and `docs/00-brief.md` §7 defers domain purchase. A mail to this address today bounces with "domain does not exist."
- **Resolution (option 3 from the suggested fixes):** content-writer reworded `content/contact.md` and `content/privacy-policy.md`; site-builder rebuilt. The Contact page now says: *"One timing note: this mailbox becomes active once our custom domain is connected — until then, responses may be delayed."* The Response-expectations section is likewise conditioned: *"These timelines apply once the mailbox is active."* The privacy policy's CCPA section now reads *"we will respond as the law requires once your message reaches us."* No page claims the mailbox is monitored or gives an unconditional response time.
- **Re-verification (2026-11-10):** grep of all 15 dist HTML files for `monitored|monitoring|monitors` → **0 matches**; grep for stale phrases (`fastest way`, `The inbox`, `respond within`, `reply within`, `we respond`, `checked daily`) → **0 matches**. The 4 remaining email mentions (home, about, affiliate-disclosure, privacy-policy) are neutral invitations that point to `/contact/`, which carries the honest activation caveat. Source files match dist (`content/contact.md` contains the "becomes active" wording; 0 "monitored" hits in either reworded source file). The mailbox itself remains undeliverable until the domain is attached — that is now stated on the page instead of hidden, and activating/swapping the real mailbox at domain attach remains a **CEO-user** follow-up (tracked alongside the domain work in `docs/00-brief.md` §7).
- **Owner:** ~~CEO-user + site-builder~~ → **resolved**; residual follow-up (swap real mailbox behavior at domain attach) sits with **CEO-user**.

---

## P2 — post-launch polish (list, not blockers)

| # | Issue | File / evidence | Suggested fix | Owner |
|---|---|---|---|---|
| P2-1 | **RESOLVED 2026-11-10** — Present-tense references to unbuilt spokes reworded to "coming soon" in all 4 content files, including the copy that had leaked into the chisels page's FAQPage JSON-LD. Re-verified: 9 "coming soon" framings in dist (hub ×2, budget ×3, chisels ×3 incl. JSON-LD, 3.38-vs ×1); old phrases ("pulls together every buyer signal", "breaks the math down", "walks through each fix") → 0 matches; 0 live links to the 6 unbuilt spoke slugs; 0 rendered pending links. | `dist/best-pricking-irons/index.html`, `dist/best-budget-pricking-irons/index.html`, `dist/pricking-irons-vs-stitching-chisels/index.html`, `dist/3-38mm-vs-3-85mm-pricking-irons/index.html` | — | ~~content-writer~~ resolved |
| P2-2 | **RESOLVED 2026-11-10** — All 14 `👉` markers now sit **inside** the CTA anchor text (immediately after the opening `<a …>` tag, before "Check price on AliExpress"): 5+5+2+2 across the 4 files, verified in both source markdown (inside `[…](…)` link text) and rendered dist. Screen readers now announce the emoji as part of the link, not as stray noise. | `content/best-pricking-irons.md`, `content/best-budget-pricking-irons.md`, `content/pricking-irons-vs-stitching-chisels.md`, `content/3-38mm-vs-3-85mm-pricking-irons.md` + their dist pages | — | ~~content-writer~~ resolved |
| P2-3 | **RESOLVED 2026-11-10** — CSP `script-src` tightened to `'self'` with no `'unsafe-inline'`/`'unsafe-eval'` (`dist/_headers` line 8). Verified safe to tighten: 0 non-JSON-LD `<script>` tags and 0 inline `on*=` handlers across all 15 pages (JSON-LD data blocks are inert and unaffected). | `dist/_headers` | — | ~~site-builder~~ resolved |
| P2-4 | **RESOLVED 2026-11-10** — `_headers` rewritten extension-agnostic: catch-all `/*` sets `Cache-Control: public, max-age=0, must-revalidate` (covers clean URLs, `/404.html`, XML, txt alike), and `/styles/*`, `/images/*`, `/og/*` detach it via `! Cache-Control` + immutable, with a comment documenting the mechanism. `dist/_headers` is byte-identical to `public/_headers`. | `dist/_headers` | — | ~~site-builder~~ resolved |
| P2-5 | Home H1 ("Leathercraft tools, researched before you buy.") does not contain the literal brand string "Awl & Stitch" (brand is in `<title>`, header, schema) — carried over from `docs/06-seo-audit.md` P2-1, optional | `dist/index.html` | Optional editorial tweak | content-writer |
| P2-6 | Affiliate tracking ID intentionally empty — links go direct with no tracking param; **must be filled before any monetization** | `src/data/affiliates.json` `_meta.trackingId` = `""` | Fill from the AliExpress affiliate dashboard when approved; build appends the param automatically | site-builder / CEO-user |
| P2-7 | Lighthouse/PageSpeed not runnable in this audit environment; static proxies all pass (0 KB client JS, 25.9 KB CSS, preloaded LCP, explicit image dimensions, no third parties) | n/a (post-deploy) | Run PageSpeed on the deployed `pages.dev` URL | qa-reviewer (post-deploy) |
| P2-8 | 6 planned spokes not yet written (`wuta-vs-beagle`, `aliexpress-leather-tools-shipping-duties`, `wuta-pricking-irons-review`, `how-to-use-pricking-irons`, `what-thread-for-pricking-irons`, `pricking-iron-care`) — matches the plan's 90-day calendar; pending-link comments correctly suppressed, nothing renders broken | `docs/04-seo-plan.md` §8; build warning (6 pending-link comments) | Write per calendar | content-writer |
| P2-9 | Hub HTML at 58.4 KB is near the 60 KB budget — fine today, watch on the next hub edit | `dist/best-pricking-irons/index.html` | Trim or split when the prices table grows | site-builder |

---

## Compliance checklist results

| Area | Result | Evidence (observed this session) |
|---|---|---|
| FTC disclosure before first affiliate link, every monetized page | **PASS** | Scripted position check on all 6 monetized pages (hub, budget, 3.38-vs, chisels, wallets, size-chart): `disclosure-box` appears at a lower character offset than the first `aliexpress.us` link on every one (e.g., hub: disclosure @12360 < first link @20950). Box is a visible styled blockquote (`.prose .disclosure-box`: accent border, `#fff4e6` background, 0.95rem ink text — not hidden). Plain English + link to `/affiliate-disclosure/`. Footer repeats a short disclosure sitewide; articles add a closing "Disclosure reminder." |
| Affiliate link attributes | **PASS** | 36/36 AliExpress-domain links carry `target="_blank" rel="sponsored nofollow noopener"` (scripted scan; 0 misses). Deep links to exact item URLs; no cloaking/redirect paths. External (non-affiliate) links carry `rel="noopener noreferrer"`. |
| No placeholder tokens / invented URLs | **PASS** | Grep for `{{aff:`, `YOUR-ALIEXPRESS`, `PLACEHOLDER`, secret patterns across `dist/`: 0 matches. All 5 affiliate URLs match `src/data/affiliates.json` exactly; tracking ID honestly empty (no fake tracking param appended). |
| No deceptive claims | **PASS** | Scan for "guaranteed / income / limited time / act now / #1 pick / award-winning": every match is an honest **negation** (e.g., "we never claim hands-on testing we did not do", "we don't sell … 'guaranteed' rankings"). No fake urgency, no income claims, no fake discounts (list prices shown only as "was $X" with verification dates, per research doc §7.3). |
| No fabricated testing / expertise | **PASS** | Every article carries "We have not bench-tested these tools; this guide is research-based" + "We do not claim to have tested these irons" (How We Picked). About page: "we are researchers and leathercraft hobbyists, not master leatherworkers… no invented names or fake bios." Author box: "Drafts are AI-assisted and human-reviewed." No "we tested / hands-on / in our shop" claims anywhere in dist. |
| Legal/trust pages present + linked | **PASS** | All 6 built (about, contact, editorial-policy, affiliate-disclosure, privacy-policy, terms) and linked from the footer "Trust & legal" nav on **all 15 pages** (verified in page sources), plus trust-page side-nav cross-links. |
| Privacy policy matches reality | **PASS** | Names actual practice: static site, no cookies set by us, **no analytics right now** (true — `site.json.cloudflareToken` is empty), host server logs, AliExpress third-party handoff, CCPA/CPRA section with rights + contact method, children's note, update commitment. |
| Terms / editorial policy content | **PASS** | Terms: plain-English use rules, no-professional-advice, **sharp-tool safety warning**, prices/availability disclaimer, nominative-fair-use trademark section (WUTA/MOZHE/JOTUN/Beagle), liability cap, change procedure. Editorial policy: 4-source methodology, 5 pick criteria, sourcing rule, refresh cadence, corrections procedure, AI-assistance disclosure. |
| Trademark / branding | **PASS** | No brand names in the domain (`awlandstitch.pages.dev`); brands used nominatively for identification; no third-party logos; explicit non-affiliation statement in Terms. |
| Product safety warnings | **PASS** | Terms ("Tools can hurt you… keep guards and cutting mats between you and the blade"), budget page arrival-QC checklist (burrs, sharpness, "run a fingertip **gently**"), mallet-pressure guidance. Appropriate for a sharp hand tool. |
| No health/financial claims | **PASS** | None found. Duty content is framed as a cited planning range (37.5–55.3%, HTS 8205) with "checkout total is authoritative" — exactly per plan §14. |
| Secrets / tokens | **PASS** | No `.env`, `.pem`, `.key` files; no `sk_live`/`ghp_`/`AKIA`/token patterns in repo or dist; `.gitignore` covers `.env`, `dist/`, `node_modules/`, `.wrangler/`. |
| Inline event handlers / mixed content | **PASS** | 0 inline `on*=` handlers across 15 pages; 0 `http://` resource URLs (only XML namespace strings in sitemap/RSS). |
| `_headers` sanity | **PASS** | nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, COOP/CORP, CSP (`default-src 'self'`, `script-src 'self'` — no `unsafe-inline`, `frame-ancestors 'none'`), HSTS, extension-agnostic revalidate catch-all + immutable caching for `/styles`, `/images`, `/og`. (Former hardening nits P2-3/P2-4 resolved 2026-11-10; see Re-audit.) |
| npm audit / dependencies | **PASS** | `npm audit`: 0 vulnerabilities. Dependencies minimal and pinned in `package-lock.json`. |

## Accuracy of numbers vs research docs

| Claim on site | Research source | Result |
|---|---|---|
| WUTA 1-pc: $14.79 (was $43.14), 500+ sold, 4.9★ (82 reviews), ~38 variants, USPS US-warehouse free 3–10 days, YunExpress 5–13 days, seller 98.1% / 51.4K followers | `docs/01-market-research.md` §7.3 (2026-11-07 US storefront) | **MATCH** (hub, budget, 3.38-vs, chisels, wallets, size-chart all consistent) |
| MOZHE $22.86 ±10% (VND conv. Nov 6), 3 sold, 5.0★, shipping unverified | §7.2 + `affiliates.json` | **MATCH**, honestly flagged "not verified per-listing" |
| JOTUN M2 $35.17 ±10% (Nov 6), 2 sold, 5.0★ | §7.2 | **MATCH** |
| WUTA 20-tooth $103.19 (was $270.50), 28 sold, 5.0★ (5 reviews), unnamed "Standard" free 5–13 days | §7.3 | **MATCH**, carrier-unnamed caveat preserved |
| WUTA set $8.33 single head (was $15.43), ≈$162 full set, 437 sold, 4.8★ (55), ChuKouYi $1.72, Nov 15–Jan 05, 90-day returns | §7.3 + `affiliates.json` | **MATCH**, "one head, not the set" caveat repeated at every mention |
| De minimis ended Aug 29, 2025; HTS 8205 range 37.5–55.3% "planning range, not a ruling"; Pango 2–6 weeks | §6.1–6.3 | **MATCH** with correct framing |
| SPI math: 25.4 ÷ 3.38 = 7.51 (7.5 SPI); 25.4 ÷ 3.85 = 6.59 (6.6 SPI); Borderland 8.5-SPI typo called out | plan §7 row 8 | **MATCH** (independently recomputed) |
| Dates: every price carries "at time of writing" + verification date; "Last updated November 7, 2026" bylines; sitemap `lastmod` 2026-11-07 ×14; RSS `lastBuildDate` Nov 7 | `affiliates.json` `asOf` | **CONSISTENT** |

## What was verified and how

| Check | Method / command |
|---|---|
| Build + site checks | `npm run build` then `npm run check` — both PASS (15 pages, 14 sitemap URLs, 6 RSS items, 36 affiliate links, 0 errors) |
| Vulnerabilities | `npm audit` → 0 found |
| Affiliate attributes | PowerShell regex sweep of all 15 dist HTML files for `aliexpress.us|com` hrefs → 36/36 correct |
| Disclosure position | Character-offset comparison of `class="disclosure-box"` vs first AliExpress href per page → 6/6 correct order |
| Placeholder/secret scan | Grep across `dist/` and repo for token/secret patterns → 0 matches |
| Internal links + anchors | Scripted resolution of every root-relative href against built files; every `#anchor` against page ids → 0 broken |
| Headings / images / lang | Scripted: exactly 1 H1 per page, no level skips (15/15); 40/40 `<img>` have alt + width/height; 15/15 `lang="en-US"` |
| Focus / skip / keyboard | CSS inspection: `:focus-visible` 3px outline, `.skip-link:focus`, `.table-scroll:focus-visible`; skip link present on all pages; nav is a CSS checkbox pattern (keyboard-operable, no JS → no trap possible); 0 inline handlers |
| Contrast (WCAG) | Computed ratios from `src/styles/main.css` tokens: body 15.95:1, muted 7.76:1, links 7.78:1, white-on-accent buttons 6.76:1, focus 6.66:1, footer 15.43:1 — all pass AA, most AAA |
| Mobile | `min-height: 44px` tap targets, mobile-first `min-width` breakpoints, `prefers-reduced-motion` + print styles, scrollable `role="region"` table wrappers |
| Editorial / fabrication | Full read of hub, budget, 3.38-vs + targeted reads of chisels, wallets, size-chart, home, 404, all 6 trust pages; regex scans for testing claims, urgency, filler (1 hit = legitimate "in today's listings"); numbers cross-checked against research docs (table above) |
| Encoding | Codepoint inspection of suspect characters (em-dash U+2014, ÷ U+00F7, ↔ U+2194) — all valid UTF-8, no mojibake (0 U+FFFD) |
| Sitemap / robots / RSS / 404 | Read all four files: 14 URLs all resolving, robots allows all + sitemap ref, RSS 2.0 with 6 items, 404 noindex + helpful links |
| Schema accuracy | Parsed hub JSON-LD: 5 Products with prices matching `affiliates.json`; `aggregateRating` only on the 3 verified listings (4.9/82, 5.0/5, 4.8/55); no Review markup |

## Deployment recommendation

**CLEARED TO DEPLOY (updated 2026-11-10).** P1-1 is resolved (contact copy no longer claims an active/monitored mailbox; the activation caveat is stated honestly) and P2-1 through P2-4 are resolved. 0 P0, 0 P1 open. The 5 remaining P2s are post-launch polish and do not block deploy — with one hard precondition: **P2-6 (fill the affiliate tracking ID) must be completed before any monetized traffic**, per the playbook's monetization rules.

**Exact open P0 list:** (none)

**Exact open P1 list:** (none)

**Exact open P2 list:** P2-5 (optional home-H1 brand string), P2-6 (tracking ID before monetization), P2-7 (PageSpeed post-deploy), P2-8 (6 planned spokes per calendar), P2-9 (hub size watch).

---

## Re-audit — 2026-11-10 (post-fix verification)

Scope: re-verification of the four fix batches reported by the team (contact/privacy rewording, coming-soon rewording incl. JSON-LD, emoji-in-anchor, `_headers` rewrite), plus a regression sweep of everything the fixes touched. No files outside `docs/07-qa-report.md` were modified in this pass; no rebuild or deploy was performed.

| Re-check | Method / command | Result |
|---|---|---|
| P1-1 contact wording | Read `dist/contact/index.html` in full; grep all 15 dist HTML files for `monitored\|monitoring\|monitors` | **RESOLVED** — line 109 now reads "this mailbox becomes active once our custom domain is connected — until then, responses may be delayed"; response-timelines section conditioned ("apply once the mailbox is active"); 0 matches for monitored/monitoring/monitors sitewide |
| Stale response-time claims | Grep dist for `fastest way`, `The inbox`, `respond within`, `reply within`, `we respond`, `responses? within`, `checked daily`, `checked regularly` | 0 matches — no unconditioned response-time or activity claims remain |
| Privacy policy rewording | Read the CCPA/contact section of `dist/privacy-policy/index.html`; grep source | **RESOLVED** — "we will respond as the law requires once your message reaches us"; source `content/privacy-policy.md` matches |
| Other email mentions | Context extraction of all 4 `hello@awlandstitch.com` occurrences (home, about, affiliate-disclosure, privacy-policy) | All are neutral invitations pointing to `/contact/`; none claim the mailbox is live |
| P2-1 coming-soon framing | Grep dist for `coming soon` (9 hits) and for the three old present-tense phrases (0 hits); grep all `dedicated` references; live-link scan for the 6 unbuilt spoke slugs; count `data-affiliate-pending="true"` | **RESOLVED** — 9/9 future-guide references framed "coming soon", including the chisels FAQPage JSON-LD answer text; 0 live links to unbuilt spokes; 0 rendered pending links |
| P2-2 emoji placement | UTF-8 regex sweep (surrogate-pair pattern, PS 5.1-safe) of the 4 content files and their dist pages: total count, and position relative to `<a …>` opening tags | **RESOLVED** — 14/14 emoji (5+5+2+2) inside markdown link text in source and immediately after the opening `<a>` tag in dist, inside the anchor text |
| P2-3 CSP | Read `dist/_headers`; grep for `unsafe-inline`/`unsafe-eval`; sweep all 15 pages for non-JSON-LD `<script>` tags and inline `on*=` handlers | **RESOLVED** — `script-src 'self'` only; 0 non-JSON-LD scripts; 0 inline handlers, so the tightened CSP cannot break anything |
| P2-4 cache rules | Read `dist/_headers` and `public/_headers`; compare byte-equality | **RESOLVED** — extension-agnostic revalidate catch-all + documented `! Cache-Control` detach overrides for `/styles/*`, `/images/*`, `/og/*`; dist identical to public |
| Build artifacts intact | `npm run check` (read-only validator) | **PASS** — 15 HTML pages, 14 sitemap URLs, 6 RSS items, 36 affiliate links, 46 external links, 40 img tags, 14 internal targets, CSS 25.9 KB, client JS 0 KB — identical to the pre-fix session's numbers |
| JSON-LD on touched pages | Node script parsing every `application/ld+json` block on the 6 touched pages (contact, privacy-policy, hub, budget, chisels, 3.38-vs) | 6/6 pages parse; expected types present (contact/privacy: BreadcrumbList+WebPage; hub: BlogPosting+FAQPage(6)+5×Product+ItemList; budget: BlogPosting+FAQPage(6)+3×Product; chisels: BlogPosting+FAQPage(6); 3.38-vs: BlogPosting+FAQPage(5)) |
| Affiliate attributes on touched pages | Regex sweep of all dist HTML for AliExpress hrefs with attribute check | 36/36 carry `target="_blank" rel="sponsored nofollow noopener"` — unchanged, including the 14 emoji-bearing CTA anchors |
| Internal links / sitemap / robots / RSS / 404 | `npm run check` link + file resolution | 0 broken internal links or anchors; sitemap 14 URLs all resolving; robots + RSS valid; 404 noindex intact |
| Vulnerabilities | `npm audit` | 0 vulnerabilities |

**Re-audit verdict: PASS.** All four fix batches verified in `dist/`; no regressions found.
