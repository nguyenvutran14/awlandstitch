# Project Brief — US AliExpress Affiliate Content Site

Status: Active
Owner: CEO agent (delegates all specialist work)
Date: 2026-11-06
Source: `MISSION.md`

## 1. Goal

Build and deploy a live, fast, trustworthy US-English affiliate content site
that earns commissions through the AliExpress affiliate program from organic
search traffic. The site must be good enough to compete with established
affiliate publishers on content quality, structure, trust signals, and page
experience.

## 2. Target market

- Primary: United States, English (US).
- Audience: shoppers researching a physical product category before buying.
- Traffic: organic search (Google/Bing), no paid ads, no daily manual work.

## 3. Business model

- Monetization: AliExpress affiliate program (AliExpress Portals or a named
  network). Commission, cookie window, and payout terms must be verified
  during research; if unverifiable, flag as `needs verification`.
- Content model: one focused niche, one money hub (best-of buying guide),
  supporting spokes (reviews, comparisons, use-case guides), trust/legal pages.
- Affiliate links: deep links to specific products/variants, configured in
  `src/data/affiliates.json`, rendered with
  `rel="sponsored nofollow noopener"` and `target="_blank"`.

## 4. Constraints

- Static site only (Node-based generator; Astro preferred), output in `dist/`.
- Hosting: GitHub repo + Cloudflare Pages free `https://<project>.pages.dev`
  first; custom domain researched now and attached later.
- No secrets in the repo or artifacts. Auth only via user-run login or env
  vars supplied by the user.
- No fabricated testing, prices, ratings, sources, or expertise claims.
- FTC affiliate disclosure above the first affiliate link on every monetized
  page.
- Initial scope: 6+ publishable articles, SEO plan for 15–25 pages,
  trust/legal pages, affiliate placeholders acceptable for first deploy.
- Team: only the CEO talks to the user. Subagents write to their own artifact
  paths only (see playbook section 8).

## 5. Documented assumptions

1. The owner approves the niche chosen by the research gate (score ≥ 3.8) and
   does not need to pre-approve categories.
2. AliExpress affiliate tracking ID may be unavailable at first deploy;
   placeholders in `src/data/affiliates.json` are acceptable, clearly marked,
   with swap instructions.
3. GitHub and Cloudflare accounts are free-tier and can be authenticated by
   the owner when Phase 7 is reached.
4. Public GitHub repo unless the owner says otherwise.
5. No analytics beyond privacy-friendly, cookie-less Cloudflare Web Analytics
   (optional, off until configured); privacy policy must match reality.
6. English content is research-based; no first-hand testing claims unless real
   test data is supplied.
7. Budget: $0 for tooling/hosting; domain purchase deferred.
8. The site launches with 6–8 strong articles, then follows the 90-day plan.

## 6. Acceptance criteria (project done)

- G1: ≥ 8 candidates scored on the playbook rubric; primary product scores
  ≥ 3.8/5; US shipping evidence; affiliate terms verified or flagged; no
  restricted category.
- G2: 12–20 domain candidates with availability evidence; 1 primary + 2
  backups; trademark-safe; free `.pages.dev` name chosen.
- G3: keyword map, hub-and-spoke architecture for 15–25 pages, 90-day plan,
  internal-link matrix, schema plan, and 6 complete article briefs.
- G4: 6+ publishable US-English articles with disclosure, sources, comparison
  table, pros/cons, FAQ, meta tags, internal links, schema plan.
- G5: `npm run build` passes; mobile-first; sitemap, robots, RSS, schema,
  legal pages, affiliate component with correct rel attributes.
- G6: QA report PASS with no open P0/P1 issues.
- G7: GitHub repo pushed (no secrets); live `https://<name>.pages.dev`
  verified HTTP 200 for home, hub, article, sitemap, robots; deployment doc
  written.
- Final report in Vietnamese with URLs, decisions, placeholders vs real,
  next actions, and honest risks.

## 7. Out of scope (for this run)

- Paid advertising, email marketing, social automation.
- Custom domain purchase and DNS attachment (recommended only).
- Search Console/Bing verification (documented as next action).
- Real affiliate ID integration if the owner has not supplied it.
