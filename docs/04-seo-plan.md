# SEO Plan — Awl & Stitch (G3)

**Phase:** G3 SEO strategy
**Date:** 2026-11-07
**Owner:** seo-strategist
**Status:** PASS-ready for gate review. 1 money hub + 17 content spokes + 6 trust pages + home = 25-page sitemap; intent-mapped; 90-day calendar; internal-link matrix; schema plan; 6 complete briefs in `docs/05-content-briefs/`.
**Inputs:** `docs/00-brief.md`, `docs/01-market-research.md`, `docs/02-product-scorecard.md`, `docs/03-domain-options.md`
**Site:** Awl & Stitch — `awlandstitch.com` (temp: `awlandstitch.pages.dev`)

---

## 1. Strategy summary

- **Positioning:** the AliExpress-side buying guide for US leathercraft beginners. The strongest incumbent (LeatherCraftHaven, updated 2026-10-03) is Amazon-focused; nobody ranks with verified AliExpress listing prices, per-listing US shipping data, or the post-de-minimis landed-cost story. That is the wedge.
- **Winnability order:** long-tail comparisons and use-case pages first (3.38 vs 3.85, irons vs chisels, wallet sizing, size chart) where Reddit threads and thin brand blogs currently rank; the money hub publishes in week 1–2 but is expected to rank in months 3–6 as the cluster builds internal authority.
- **Monetization:** AliExpress affiliate (Portals or named network), planning commission **5–9% `needs verification`** — all revenue math in this plan uses that planning range and must be re-modeled after dashboard verification. Deep links only to the three shipping-verified listings plus two price-verified alternates. Base case ≈ $44 revenue per 1,000 visitors (research doc §9).
- **Trust posture:** research-based voice only. No "we tested" claims anywhere. Every price carries "price at time of writing" + date. Duties are described as ranges with the "checkout total is authoritative" framing until an HTS line is broker-confirmed.

---

## 2. Brand, domain, voice

| Item | Value |
|---|---|
| Brand | Awl & Stitch |
| Domain | `awlandstitch.com` (appears available per RDAP 2026-11-07; unverified at registrar) |
| Temp URL | `awlandstitch.pages.dev` (DNS-verified unclaimed 2026-11-07) |
| Voice | US English, plain, maker-respectful, honest about what we do and don't know |
| Hard voice rules | No "we tested / hands-on / in our shop"; use "based on our research", "reviewers report", "according to the manufacturer"; no fake urgency or fake discounts |

---

## 3. Keyword research method and demand signals

**Method (free/public only):** Google autocomplete and People-Also-Ask-style mining via Reddit threads, r/Leathercraft and r/Leatherworking search, Amazon search/category pages, YouTube suggestions, AliExpress search cards, and SERP snapshots taken 2026-11-06/07. **No search volumes are available** (no keyword tool access) — every demand label below is a qualitative estimate, not a measurement.

**Demand evidence (full detail in research doc §3):**

| Signal | Observation | Date |
|---|---|---|
| r/Leathercraft | 870K members; recurring "which pricking iron" threads (new threads Feb/Apr 2026) | 2026-11-06/07 |
| YouTube | "10 Basic Tools Every Beginner Leather Craftsman…" ~1M views | 2026-11-06 |
| Amazon | Weaver pricking irons 4.4★/949 ratings/100+ bought past month; WUTA 4mm 4.4★/254/50+ | 2026-11-06 |
| AliExpress | WUTA 1pc 517 sold/4.9★; interchangeable set 437 sold/4.8★; 2nd-gen 1K+ sold | 2026-11-06 |
| Reddit purchase threads | "Best sub $100 pricking irons" (May 2026) lists WUTA/Kevin Lee/Junlin with prices — buyers shop this category by brand and price | 2026-11-07 |

**Qualitative difficulty estimates (from SERP snapshots, not tool data):**

| Keyword cluster | Difficulty estimate | Rationale |
|---|---|---|
| best pricking irons (+ for beginners / for leather) | Medium-high | One strong fresh incumbent; rest are PDPs and thin roundups |
| 3.38mm vs 3.85mm | Low-medium | Reddit threads dominate; no dedicated editorial comparison |
| pricking irons vs stitching chisels | Medium | Established explainers exist; weak decision tables |
| best budget pricking irons | Low-medium | Budget-specific results thin/dated |
| what size pricking irons for wallets | Low | Forum Q&A dominates; no dedicated guide |
| how many teeth pricking iron / size chart / SPI | Low-medium | Brand blogs rank; snippet opportunity; one ranking source has a factual typo we can beat |
| WUTA vs Beagle | Low | Almost no dedicated content; low volume, high intent |
| WUTA pricking irons review | Low-medium | Reddit + PDPs only; no editorial review |

---

## 4. Keyword map — every page, one primary keyword

Intent stages: **C** = commercial investigation, **K** = comparison, **I** = informational, **T** = trust/navigational.

| # | URL slug | Page | Primary keyword | Secondary keywords | Intent | Stage | Priority |
|---:|---|---|---|---|---|---|---|
| 1 | (home) | Home hub | awl and stitch (brand) | leathercraft tool guides, best pricking irons | T | — | P0 |
| 2 | about | About | awl and stitch about | who runs awl and stitch | T | — | P0 |
| 3 | contact | Contact | awl and stitch contact | — | T | — | P0 |
| 4 | privacy-policy | Privacy Policy | awl and stitch privacy policy | — | T | — | P0 |
| 5 | terms | Terms of Use | awl and stitch terms | — | T | — | P0 |
| 6 | affiliate-disclosure | Affiliate Disclosure | awl and stitch affiliate disclosure | affiliate links disclosure | T | — | P0 |
| 7 | editorial-policy | Editorial Policy | awl and stitch editorial policy | how we research leather tools | T | — | P0 |
| 8 | best-pricking-irons | **Money hub: Best Pricking Irons** | best pricking irons | best pricking irons for beginners, best pricking irons for leather, best stitching irons | C | BOFU | P0 |
| 9 | 3-38mm-vs-3-85mm-pricking-irons | 3.38mm vs 3.85mm | 3.38mm vs 3.85mm pricking irons | 3.38 vs 3.85, 7 spi vs 8 spi, french pricking iron sizes | K | BOFU | P0 |
| 10 | pricking-irons-vs-stitching-chisels | Irons vs Chisels | pricking irons vs stitching chisels | stitching chisel vs pricking iron, do pricking irons need an awl, diamond chisel vs french iron | K | MOFU/BOFU | P0 |
| 11 | best-budget-pricking-irons | Best Budget Pricking Irons | best budget pricking irons | cheap pricking irons, pricking irons under $30, aliexpress pricking irons | C | BOFU | P0 |
| 12 | what-size-pricking-irons-for-wallets | Wallet sizing | what size pricking irons for wallets | best pricking iron size for wallets, 3.38 vs 3.85 for wallets, pricking iron for cardholders | I | MOFU | P0 |
| 13 | pricking-iron-size-chart | Size/SPI chart | pricking iron size chart | pricking iron SPI chart, how many teeth pricking iron, pricking iron sizes, mm to SPI stitching | I | TOFU/MOFU | P0 |
| 14 | wuta-vs-beagle-pricking-irons | WUTA vs Beagle | wuta vs beagle pricking irons | wuta or beagle, beagle pricking irons review | K | BOFU | P1 |
| 15 | aliexpress-leather-tools-shipping-duties | Landed-cost guide | aliexpress import charges | aliexpress shipping to usa, aliexpress customs fees, de minimis ended | I | MOFU | P1 |
| 16 | wuta-pricking-irons-review | WUTA review | wuta pricking irons review | wuta pricking irons quality, are wuta tools good | C | MOFU/BOFU | P1 |
| 17 | how-to-use-pricking-irons | How to use | how to use pricking irons | how deep to punch pricking irons, pricking irons with or without awl | I | TOFU/MOFU | P1 |
| 18 | what-size-pricking-irons-for-belts | Belt sizing | what size pricking irons for belts | best pricking iron for belts, 20 tooth pricking iron belt | I | MOFU | P2 |
| 19 | what-thread-for-pricking-irons | Thread pairing | what thread for pricking irons | thread size for 3.85mm iron, 0.6mm thread wallet stitching | I | MOFU | P2 |
| 20 | pricking-iron-care | Care & polishing | how to polish pricking irons | pricking iron care, irons sticking in leather, remove burrs | I | MOFU | P2 |
| 21 | essential-leathercraft-tools | Beginner toolkit | essential leathercraft tools | leathercraft tools for beginners, leather working starter tools | I | TOFU | P2 |
| 22 | best-stitching-pony | Hub #2: Stitching Pony | best stitching pony | best stitching pony for leatherwork, stitching pony for beginners | C | BOFU | P2 |
| 23 | best-leathercraft-starter-kit | Hub #3: Starter Kit | best leathercraft starter kit | best leather craft kit for beginners, leather tool kit | C | BOFU | P2 |
| 24 | best-edge-beveler | Hub #4: Edge Beveler | best edge beveler | leather edge beveler, wuta edge beveler | C | BOFU | P3 |

**Cannibalization guards (hard rules):**

1. "best pricking irons" lives only on the hub. The budget page always carries the "budget" modifier; the review page carries "review"; brand-vs pages carry both brand names.
2. Use-case sizing pages own "what size … for wallets/belts"; the chart page owns chart/SPI queries and links to the use-case pages instead of answering them in depth.
3. The hub may *mention* any spoke topic in one or two sentences, always with a descriptive link to the spoke that owns it. No spoke may re-answer the hub's verdict ("which iron to buy") — spokes answer their own narrower question and link up for the verdict.
4. No page targets "best pricking irons for leather" as its own primary; it is a secondary on the hub only.
5. If two pages ever rank for the same query in Search Console, consolidate: merge the weaker into the stronger with a 301.

---

## 5. Site architecture

```
                        HOME (brand hub)
        ┌───────────────┬───────────────┬──────────────┐
   MONEY HUB      HUB #2 pony     HUB #3 kit      HUB #4 beveler
 best-pricking-irons  best-stitching-  best-leathercraft- best-edge-
        │             pony            starter-kit       beveler
        │
   ┌────┴─────────────────────────────────────────────────┐
   │ SPOKES (all link UP to hub + 2–4 siblings)           │
   │                                                      │
   │ Commercial: best-budget-pricking-irons,              │
   │             wuta-pricking-irons-review               │
   │ Comparison: 3-38mm-vs-3-85mm, irons-vs-chisels,      │
   │             wuta-vs-beagle                           │
   │ Informational: size-chart, wallets, belts, thread,   │
   │             care, how-to-use, landed-cost            │
   │ Top-funnel: essential-leathercraft-tools (links to   │
   │             all four hubs)                           │
   └──────────────────────────────────────────────────────┘
   TRUST PAGES (footer sitewide): about, contact, privacy,
   terms, affiliate-disclosure, editorial-policy
```

**URL patterns:** flat, lowercase, hyphenated slugs, no `/blog/` or date prefixes. Hubs use `/best-<product>/`. One slug = one primary keyword. Slugs never change once published (if a slug must change: 301 + sitemap update + internal-link sweep).

**Breadcrumbs:** `Home → Article title` (2-level `BreadcrumbList`) on all posts; trust pages get `Home → Page`. Spokes additionally show an eyebrow line "Part of: Best Pricking Irons" linking to the hub — topical clustering is expressed through links, not URL nesting, so URLs stay stable if the hub is later renamed.

**Pagination/facets:** none (no archives beyond a simple blog index at `/all-articles/`, linked from footer, noindexed-optional).

---

## 6. Intent map

| Stage | Definition | Pages |
|---|---|---|
| TOFU | "What is / how do I" — no purchase intent yet | size-chart, how-to-use, essential-leathercraft-tools |
| MOFU | "Which/what size/what thread for my project" — narrowing | wallets, belts, thread, care, landed-cost, wuta-review |
| BOFU | "Best / vs / review / budget" — ready to buy | hub, budget, 3.38-vs-3.85, irons-vs-chisels, wuta-vs-beagle, pony, kit, beveler |
| Trust | Who is behind this site; policies | about, contact, privacy, terms, affiliate-disclosure, editorial-policy |

Every BOFU page carries affiliate CTAs; MOFU pages carry one contextual CTA; TOFU pages carry at most one soft CTA. No page exists only to host links (no doorway pages).

---

## 7. SERP analysis — 10 priority keywords

Snapshot dates: 2026-11-06 (research doc §5) and 2026-11-07 (fresh Reddit/SERP mining for this plan). Rankings are dynamic; strength assessments are qualitative.

| # | Keyword | Who ranks now | Content type / freshness | Gap we exploit | Winnability | Realistic timeline |
|---:|---|---|---|---|---|---|
| 1 | best pricking irons (for beginners / for leather) | LeatherCraftHaven (strong, updated 2026-10-03); stitchmath calculator guide; leatherworknest roundup; Junlin/Tandy/Van Dijk PDPs | Long-form buying guide, fresh; PDPs | No AliExpress-specific picks, no live price table, no landed-cost analysis, no 3.38-vs-3.85 decision tool | Medium | 3–6 months |
| 2 | 3.38mm vs 3.85mm pricking irons | Reddit threads (2018–2026); scattered brand-blog mentions | Forum threads, evergreen | No dedicated editorial comparison with a decision table, thread pairings, and photos/diagrams | High | 1–3 months |
| 3 | pricking irons vs stitching chisels | Reddit (multiple threads incl. 25-point top comment); LeatherCraftHaven chisels guide (2026-06-12); Borderland Leather (2022) | Forum + explainer | No single page with a clear "which should a beginner buy" verdict + comparison table + hole-size/awl discussion | High-medium | 1–3 months |
| 4 | best budget pricking irons | Thin/dated roundups; Reddit "sub $100" thread (May 2026) | Forum + weak affiliates | Verified under-$30 AliExpress picks with real US shipping data and landed-cost math | High | 1–3 months |
| 5 | what size pricking irons for wallets | Reddit Q&A threads (incl. 65K-follower crafter survey comment); brand blogs | Forum Q&A | No dedicated guide with a size decision table + thread pairing + reverse-iron answer | High | 1–2 months |
| 6 | how many teeth pricking iron | WUTA official blog (2026-09-04); British Leather Supplies (2025-10-15); Kevin Lee PDP; One & Awl (2024) | Brand blogs, fresh-ish | Independent tooth-count table (1/2/5–6/8/20) tied to project types + "start with 2+8" beginner answer; snippet-friendly | Medium-high | 2–4 months |
| 7 | WUTA vs Beagle pricking irons | Reddit mentions only; no dedicated page | Forum | First dedicated brand-vs page; honest "what buyers report" framing | High (low volume) | 1–3 months |
| 8 | pricking iron size chart / SPI chart | Borderland Leather (2022); brand blogs | Reference pages, some dated | Accurate mm↔SPI table (Borderland lists 3.38mm ≈ 8.5 SPI — a typo; exact is 25.4÷3.38 = 7.5) + print-friendly chart + tooth guide | Medium-high | 2–4 months |
| 9 | WUTA pricking irons review | Reddit first-impressions threads; AliExpress PDPs | Forum + PDP | Honest research-aggregated review (buyer signals, specs, what to check on arrival) — clearly not a fake hands-on | High | 2–4 months |
| 10 | best stitching pony for leatherwork | Programmatic/off-topic affiliates (thebrucehighqualityfoundation, rosenberryrooms); leatherworknest; Tandy PDP | Weak affiliates, 2026 | Data-driven guide with jaw width, bench fit, AliExpress landed cost | High | 2–4 months (P2 — backup product) |

**Realistic 3–6-month win set:** keywords 2, 3, 4, 5, 7 (+9). The hub (1) and chart (8) follow as cluster authority accrues. This matches the calendar sequencing in §8.

---

## 8. 90-day publishing calendar (weeks 1–12)

Cadence: ~1.5 articles/week. Trust pages and home ship with the site build (week 1). "Priority" = publish order within the week.

| Week | Pages shipping | Priority | Notes |
|---:|---|---|---|
| 1 | Home + 6 trust pages (about, contact, privacy, terms, affiliate-disclosure, editorial-policy) | P0 | Ship with site build; About/Editorial Policy must exist before any affiliate link goes live |
| 1–2 | **Money hub** `/best-pricking-irons/` (brief 01) | P0 | The cluster anchor; recheck all 5 listing prices on publish day |
| 2 | `/3-38mm-vs-3-85mm-pricking-irons/` (brief 02) | P0 | Highest winnability comparison; links up to hub |
| 3 | `/pricking-irons-vs-stitching-chisels/` (brief 03) | P0 | |
| 3 | `/best-budget-pricking-irons/` (brief 04) | P0 | Landed-cost angle; coordinate with week-6 guide |
| 4 | `/what-size-pricking-irons-for-wallets/` (brief 05) | P0 | |
| 4 | `/pricking-iron-size-chart/` (brief 06) | P0 | Chart asset = link magnet; add printable PDF later |
| 5 | `/wuta-vs-beagle-pricking-irons/` | P1 | Brand-vs gap |
| 6 | `/aliexpress-leather-tools-shipping-duties/` | P1 | Landed-cost explainer; supports budget page |
| 7 | `/wuta-pricking-irons-review/` | P1 | Research-aggregated review, honest framing |
| 8 | `/how-to-use-pricking-irons/` | P1 | TOFU support; pulls from Reddit technique threads |
| 9 | `/what-size-pricking-irons-for-belts/` | P2 | Features the 20-tooth pick |
| 9 | `/what-thread-for-pricking-irons/` | P2 | |
| 10 | `/pricking-iron-care/` | P2 | Burr/sticking fixes from buyer reports |
| 11 | `/essential-leathercraft-tools/` | P2 | TOFU; links to all four hubs |
| 12 | `/best-stitching-pony/` (hub #2) | P2 | Second product family; re-verify pony listings before writing (shipping not yet verified) |
| 13+ (Q2) | `/best-leathercraft-starter-kit/`, `/best-edge-beveler/`, watch-strap sizing, gift guide (Q4) | P3 | Kit/beveler listings need per-listing shipping verification first |

**Update cadence and refresh rules:**

- **Price check (hub, budget, review, pony, kit, beveler):** monthly, and always within 48h before any planned push/announcement. Update "price at time of writing" + date; log in changelog.
- **Shipping re-check:** before publish and quarterly (carrier options change; the 20-tooth listing's unnamed "Standard" carrier must be re-checked at checkout before any carrier brand is named).
- **Full content refresh:** every 6 months per money page, or immediately if: (a) a listing dies/price moves >20%, (b) a new competitor clearly out-formats us, (c) Search Console shows a query we lose after ranking.
- **Changelog:** every money/comparison page carries a visible "Last updated" date + a short changelog line ("Nov 2026: verified US shipping for all picks").
- **Duty claims:** never publish a precise duty %; keep the 37.5–55.3% planning range with citations until a broker confirms the HTS line.

---

## 9. Internal-link matrix

**Rules:** every spoke links UP to its hub (once, in the first third of the page) and sideways to 2–4 siblings with descriptive anchors; every hub links DOWN to all its spokes; no orphans; no "click here"; 1–3 internal links per 500 words; anchors describe the target page's primary topic (partial-match anchors, never exact-match-stuffed).

| Source page | Links OUT (target → anchor → placement) |
|---|---|
| Home | → /best-pricking-irons/ "best pricking irons for beginners" (hero) · → /best-budget-pricking-irons/ "best budget pricking irons" (hero secondary) · → /essential-leathercraft-tools/ "essential leathercraft tools" (body) · → all hubs + about/editorial-policy (nav/footer) |
| **Hub** /best-pricking-irons/ | → /best-budget-pricking-irons/ "best budget pricking irons under $30" (after verdict) · → /3-38mm-vs-3-85mm-pricking-irons/ "3.38mm vs 3.85mm pricking irons" (size section) · → /pricking-irons-vs-stitching-chisels/ "pricking irons vs stitching chisels" (terminology section) · → /pricking-iron-size-chart/ "pricking iron size chart" (sizing section) · → /what-size-pricking-irons-for-wallets/ "what size pricking irons for wallets" (use-case section) · → /aliexpress-leather-tools-shipping-duties/ "what AliExpress orders really cost landed in the US" (shipping section) · → /wuta-pricking-irons-review/ "WUTA pricking irons review" (brand section) · UP → Home "Awl & Stitch leathercraft guides" (breadcrumb/eyebrow) |
| /3-38mm-vs-3-85mm-pricking-irons/ | UP → hub "best pricking irons for beginners" (intro) · → /what-size-pricking-irons-for-wallets/ "what size pricking irons for wallets" (decision section) · → /pricking-iron-size-chart/ "full pricking iron size chart" (SPI section) · → /what-thread-for-pricking-irons/ "what thread for pricking irons" (thread section) · → /best-budget-pricking-irons/ "best budget pricking irons" (where to buy) |
| /pricking-irons-vs-stitching-chisels/ | UP → hub "best pricking irons for beginners" (verdict) · → /how-to-use-pricking-irons/ "how to use pricking irons" (technique section) · → /pricking-iron-size-chart/ "pricking iron size chart" (sizing note) · → /best-budget-pricking-irons/ "best budget pricking irons" (buying section) |
| /best-budget-pricking-irons/ | UP → hub "best pricking irons" (intro) · → /aliexpress-leather-tools-shipping-duties/ "AliExpress shipping, duties, and landed cost" (landed-cost section) · → /wuta-vs-beagle-pricking-irons/ "WUTA vs Beagle pricking irons" (brand section) · → /pricking-iron-care/ "how to polish pricking irons" (sticking/burr section) |
| /what-size-pricking-irons-for-wallets/ | UP → hub "best pricking irons" (intro) · → /3-38mm-vs-3-85mm-pricking-irons/ "3.38mm vs 3.85mm pricking irons" (core decision) · → /pricking-iron-size-chart/ "pricking iron size chart" (full table) · → /what-thread-for-pricking-irons/ "what thread for wallet stitching" (thread section) |
| /pricking-iron-size-chart/ | UP → hub "best pricking irons" (intro) · → /what-size-pricking-irons-for-wallets/ "what size pricking irons for wallets" (wallet row) · → /what-size-pricking-irons-for-belts/ "what size pricking irons for belts" (belt row) · → /3-38mm-vs-3-85mm-pricking-irons/ "3.38mm vs 3.85mm compared" (popular sizes) |
| /wuta-vs-beagle-pricking-irons/ | UP → hub "best pricking irons" (verdict) · → /wuta-pricking-irons-review/ "WUTA pricking irons review" (WUTA deep-dive) · → /best-budget-pricking-irons/ "best budget pricking irons" (budget context) |
| /aliexpress-leather-tools-shipping-duties/ | UP → hub "best pricking irons" (worked example uses hub picks) · → /best-budget-pricking-irons/ "best budget pricking irons" (budget picks) · → /pricking-iron-care/ "what to check when your irons arrive" (arrival QC) |
| /wuta-pricking-irons-review/ | UP → hub "best pricking irons" (verdict context) · → /wuta-vs-beagle-pricking-irons/ "WUTA vs Beagle pricking irons" (alternative) · → /best-budget-pricking-irons/ "best budget pricking irons" (price context) · → /pricking-iron-care/ "how to polish pricking irons" (out-of-box QC) |
| /how-to-use-pricking-irons/ | UP → hub "best pricking irons" (tool recs) · → /pricking-irons-vs-stitching-chisels/ "pricking irons vs stitching chisels" (tool choice) · → /pricking-iron-care/ "cleaning and polishing pricking irons" (maintenance) · → /pricking-iron-size-chart/ "pricking iron size chart" (spacing) |
| /what-size-pricking-irons-for-belts/ | UP → hub "best pricking irons" (intro) · → /pricking-iron-size-chart/ "pricking iron size chart" (full table) · → /what-thread-for-pricking-irons/ "what thread for belt stitching" (thread) · → hub's 20-tooth pick anchor "WUTA 20-tooth pricking iron" (long runs) |
| /what-thread-for-pricking-irons/ | UP → hub "best pricking irons" (intro) · → /pricking-iron-size-chart/ "pricking iron size chart" (pitch table) · → /what-size-pricking-irons-for-wallets/ "wallet stitch pairing" (use case) · → /3-38mm-vs-3-85mm-pricking-irons/ "3.38mm vs 3.85mm" (pitch choice) |
| /pricking-iron-care/ | UP → hub "best pricking irons" (intro) · → /how-to-use-pricking-irons/ "how to use pricking irons" (technique) · → /best-budget-pricking-irons/ "best budget pricking irons" (replacement economics) |
| /essential-leathercraft-tools/ | UP → Home "Awl & Stitch guides" · → hub "best pricking irons" (stitching section) · → /best-stitching-pony/ "best stitching pony" (workholding) · → /best-leathercraft-starter-kit/ "best leathercraft starter kit" (one-box option) · → /best-edge-beveler/ "best edge beveler" (finishing) · → /how-to-use-pricking-irons/ "how to use pricking irons" |
| /best-stitching-pony/ (hub #2) | UP → Home · → /essential-leathercraft-tools/ "essential leathercraft tools" · → /best-leathercraft-starter-kit/ "best leathercraft starter kit" · → hub "best pricking irons" (you'll need irons too) |
| /best-leathercraft-starter-kit/ (hub #3) | UP → Home · → /essential-leathercraft-tools/ "essential leathercraft tools" · → /best-stitching-pony/ "best stitching pony" · → hub "best pricking irons" (upgrade path) |
| /best-edge-beveler/ (hub #4) | UP → Home · → /essential-leathercraft-tools/ "essential leathercraft tools" · → hub "best pricking irons" |
| Trust pages | Footer sitewide; About ↔ Editorial Policy ↔ Affiliate Disclosure cross-links; Privacy ↔ Contact |

**In-link floor check:** every page above receives ≥1 contextual in-link (hub receives from all spokes + home; spokes receive from hub + ≥2 siblings). No orphans.

---

## 10. Schema plan

Global: every page gets `BreadcrumbList` (Home → Page). Site-wide `Organization` + `WebSite` on the home page. All schema is US-English, generated at build time from `src/data/`.

| Page type | Schema types | Required fields / accuracy rules |
|---|---|---|
| Home | `WebSite`, `Organization`, `BreadcrumbList` | name, url, logo; no `SearchAction` (no site search) |
| Trust pages | `WebPage` + `BreadcrumbList` | — |
| All articles | `BlogPosting` (or `Article`) + `BreadcrumbList` | headline, datePublished, dateModified, author (Person with honest bio), publisher (Organization), image, mainEntityOfPage |
| Money/comparison pages with real FAQ sections (hub, budget, 3.38-vs-3.85, irons-vs-chisels, wallets, chart) | + `FAQPage` | Only questions that actually appear on the page with answers; 3–6 Q&As; no invented questions |
| Hub, budget, pony, kit, beveler | + `ItemList` (ordered picks) | itemListElement with position + referenced Product |
| Pages featuring specific listings (hub, budget, review, belts) | + `Product` (per featured listing) | name, brand, image (AliExpress listing image hotlinked or self-hosted copy), offers.price (USD, "price at time of writing", regenerated at build from `src/data/affiliates.json`), priceCurrency, availability, url. `aggregateRating` ONLY where review count was verified 2026-11-07 (32856254322: 4.9/82; 1005005065670235: 5.0/5; 1005008415646222: 4.8/55) — omit if stale at build time |
| — | `Review` **NOT used** | We do no first-hand testing; fake review markup is prohibited by playbook |

**Data hygiene:** prices/ratings in schema come from one source of truth (`src/data/affiliates.json`) with an `asOf` date; the build fails or warns if `asOf` is older than 45 days on money pages.

---

## 11. E-E-A-T and trust pages plan

**Site-level trust assets (ship week 1):**

| Page | Must contain |
|---|---|
| About | Who runs Awl & Stitch (real name/handle, honest background: researcher/leathercraft hobbyist, no invented credentials); why the site exists; how it makes money (affiliate links to AliExpress); what we never do (fake testing, fake reviews); photo/logo; link to Editorial Policy and Contact |
| Contact | Working email address + short form or mailto; response expectation; what we can/can't help with (we can't service AliExpress orders — direct buyers to AliExpress support) |
| Privacy Policy | Exact data reality: static site, no cookies set by us, optional privacy-friendly Cloudflare Web Analytics (off until configured — policy must match reality), server logs by host; CCPA/CPRA note for California residents (no sale of personal information; contact method); affiliate-link disclosure cross-reference; last-updated date |
| Terms | Use of site, no professional advice, trademark/nominative-fair-use note for brand names (WUTA, Beagle, etc.), limitation of liability, prices/availability disclaimer |
| Affiliate Disclosure | Plain-English FTC disclosure: we earn commissions on qualifying AliExpress purchases, at no extra cost to the buyer; how links are marked (`rel="sponsored"`); editorial independence statement; 16 CFR Part 255 alignment |
| Editorial Policy | Research methodology (sources used: manufacturer specs, marketplace listings with dates, community threads, regulator pages); how picks are made (criteria list); update/refresh policy; corrections procedure (email + changelog); AI-assistance disclosure (honest statement that drafts are AI-assisted and human-reviewed, per playbook); sourcing rule: every factual claim traceable to a dated source |

**Per-article E-E-A-T signals:**

- Author box on every article: name, one-line honest bio, link to About.
- "How we picked" methodology section on every money page (criteria: verified US shipping, seller reputation, order/rating signals, variant coverage, price position, corroboration from buyer communities) + explicit "we do not claim to have tested these tools" line.
- Visible "Last updated" + changelog line on every article.
- Inline citations: claims about prices/shipping/duties link to their dated sources (AliExpress listing pages, CBP pages, HTS reference); community claims link to the specific Reddit thread.
- Disclosure placement: FTC disclosure box above the first affiliate link on every monetized page (see §12).

---

## 12. On-page rules summary

1. One H1 per page; primary keyword in URL, meta title, H1, first 100 words, and at least one H2 — naturally, never stuffed.
2. Inverted pyramid: the answer/verdict in the first screen (hub: verdict box above the fold; informational: direct answer in the first paragraph).
3. Meta title ≤60 chars, meta description ≤155 chars, unique per page.
4. Short paragraphs (2–4 sentences), scannable lists, tables for comparisons; descriptive internal anchors only.
5. **FTC disclosure:** a short, plain-English disclosure box appears above the first affiliate link on every monetized page (not footer-only). Standard text: "Awl & Stitch is reader-supported. If you buy through links on this page, we may earn a commission at no extra cost to you. We never accept payment for rankings. [How we make money]"
6. **Affiliate links:** deep links to the exact listing/variant; `rel="sponsored nofollow noopener"` + `target="_blank"`; "Prices shown were verified on [date] and may change" note near every price/CTA; no cloaked redirects, no auto-redirects.
7. Prices always rendered as "$X at time of writing (verified YYYY-MM-DD)".
8. No fabricated testing claims; community input attributed ("reviewers report", "crafter consensus on r/Leathercraft").
9. Images: original diagrams/illustrations or clearly-captioned listing images; compressed WebP; explicit width/height; lazy-load below the fold; descriptive alt text.
10. Every page answers its primary question completely enough that the reader doesn't need a second tab (information gain over the current top results).

**Core Web Vitals budget (targets, tested on mobile throttling):**

| Metric | Target | Budget |
|---|---|---|
| LCP | < 2.5s (goal < 2.0s) | Hero image ≤ 120KB WebP, preloaded; HTML ≤ 60KB |
| CLS | < 0.1 (goal < 0.05) | Explicit width/height on all media; no late-loading banners; system font stack or preloaded subset |
| INP | < 200ms | Minimal JS (no framework hydration on content pages); no intrusive interstitials |
| Total initial transfer | < 500KB | CSS ≤ 40KB inline-or-single-file; fonts ≤ 2 files; analytics deferred (Cloudflare Web Analytics, cookie-less) |

---

## 13. Technical plan

- **Generator:** Astro static build (`npm run build` → `dist/`); content in `content/*.md`; affiliate data single-source in `src/data/affiliates.json` (IDs, URLs, prices, asOf dates, `needs verification` flags).
- **Sitemap:** `sitemap.xml` auto-generated, includes all 25 pages, `<lastmod>` from git/build dates.
- **Robots:** `robots.txt` allowing all, pointing to sitemap; no crawl traps; `/all-articles/` index crawlable.
- **RSS:** `/rss.xml` full-text or summary feed for the niche's feed readers.
- **Canonical:** self-referencing canonical on every page; `pages.dev` → `awlandstitch.com` 301 when the custom domain attaches (Cloudflare Pages redirect rule); `www` → apex canonical choice documented at deploy.
- **OG/Twitter:** og:title, og:description, og:image (1200×630 template per article), twitter:card summary_large_image.
- **404:** custom 404 with links to home, money hub, and top 3 articles; returns proper 404 status.
- **Redirect policy:** no link cloaking or interstitial redirects; affiliate links go direct to `aliexpress.us` item URLs with required rel attributes; any retired article 301s to its nearest sibling (never to home by default).
- **Analytics:** Cloudflare Web Analytics (cookie-less), off until configured; privacy policy updated only when actually enabled.
- **Search Console/Bing:** submit sitemap after deploy (documented as next action in `docs/00-brief.md` §7).
- **Performance:** static HTML, no client framework on content pages; tables render server-side; images `loading="lazy"` below fold + `decoding="async"`; preloaded LCP image.

---

## 14. Risks and mitigations (SEO-specific)

| Risk | Severity | Mitigation |
|---|---|---|
| Affiliate terms unverified (commission 5–9% `needs verification`, cookie window unknown) | P1 | Model conservative case; verify dashboard before scaling content; economics don't change the SEO plan's structure |
| Price volatility breaks trust/schema accuracy | P1 | Single data file with `asOf`; monthly recheck; build-time staleness warning; "price at time of writing" everywhere |
| Strong incumbent on the money keyword | P2 | Differentiate on AliExpress prices + landed cost + decision tools; win long-tail first; expect 3–6 months for the hub |
| Cannibalization between hub/budget/review/vs pages | P2 | §4 guard rules + Search Console monitoring + consolidation procedure |
| Landed-cost claims (duties) | P2 | Ranges only, cited, "checkout total is authoritative"; broker confirmation before any precise % |
| Listing death (AliExpress items go offline) | P2 | Each money page lists ≥3 picks; swap procedure in changelog; 404-checked monthly |
| No hands-on testing = thinner "experience" signals | P2 | Compensate with verifiable buyer-signal aggregation, honest methodology, and specific arrival-QC guidance; never fake experience |
| `pages.dev` temp URL indexed before custom domain | P3 | `robots.txt` allows it (we need indexing for the temp launch), but canonical stays consistent; when domain attaches, 301 pages.dev → domain and update sitemap |

---

## 15. Sources for this plan

| Source | Access date |
|---|---|
| `docs/01-market-research.md` §5 (SERP snapshots), §6 (import reality), §7 (listing + shipping evidence), §8 (affiliate terms), §10 (seed keywords) | 2026-11-06/07 |
| `docs/02-product-scorecard.md` §3–§5 (scores, shortlist) | 2026-11-06 |
| `docs/03-domain-options.md` §5–§6 (brand/domain) | 2026-11-07 |
| Reddit: r/Leathercraft threads 1nwn4of, l3emcn, pzqkgm, vnnusc, vnq97u, a23zrc, 77nucc, 1f8l74f, 1r5pcdg, 1px6676, 1sszmb1, 138bgfl, 1p47oxo, 14ir83d, rs7l7z, 86b5vd, 1tmbjhu, 1r6h7tg, kk6cms, 1cy6dfu, 1fe4lns, 5n2c4m, 1klkhw8, 1vk80vr | 2026-11-07 |
| britishleathersupplies.co.uk pricking-iron guide | 2026-11-07 |
| wutaleather.com tooth-count guide | 2026-11-07 |
| kevinleetools.com KL French-style pricking iron page | 2026-11-07 |
| borderlandleather.com pricking irons & chisels intro | 2026-11-07 |
| armitageleather.com pricking iron review PDF (Jan 2020) | 2026-11-07 |
| leathercrafthaven.com stitching chisels guide | 2026-11-07 |
| oneandawl.org irons/chisels reference | 2026-11-07 |
| lwleatherworking.com "Which pricking irons" | 2026-11-07 |

Briefs for the first six articles: `docs/05-content-briefs/01…06-*.md`.
