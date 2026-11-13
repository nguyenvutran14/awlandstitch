# Project State

Last updated: 2026-11-11 (session 5 — growth wave)
Current phase: Wave 2 (growth) — template upgrade + longtail content + real product imagery. Site LIVE from session 4.

## Decisions

- Project root: `C:\Users\PC\ali`.
- Primary product: French-style pricking irons (4.35/5). Backups: stitching pony
  (3.95), beginner kit (3.90). Owner approved continuation on 2026-11-07.
- Brand/domain: **awlandstitch.com** ("Awl & Stitch") primary; backups
  stitchandbench.com, thestitchbench.com; temp URL `awlandstitch.pages.dev`.
  Nothing purchased; recheck RDAP at buy time.
- Browser automation (bsk CLI) used successfully for AliExpress JS-only pages.

## Gate status

| Gate | Status | Artifact | Notes |
|---|---|---|---|
| G0 Brief | DONE | `docs/00-brief.md` | Assumptions documented |
| G1 Research | **PASS** | `docs/01-market-research.md` (§7.3), `docs/02-product-scorecard.md` | Per-listing US shipping verified 2026-11-07: free US-warehouse USPS 3–10d (budget listing), Standard 5–13d, ChuKouYi $1.72. US-storefront prices captured: $14.79 / $103.19 / $8.33 |
| G2 Domain | **PASS** | `docs/03-domain-options.md` | 20 candidates, dated RDAP/DNS + USPTO evidence; primary awlandstitch.com |
| G3 SEO plan | **PASS** | `docs/04-seo-plan.md`, `docs/05-content-briefs/*` | 1 hub + 17 spokes + 6 trust pages; 90-day plan; 6 briefs; CEO approved 2026-11-09 |
| G4 Content | **PASS** | `content/*.md` | 6 articles + 6 trust pages; disclosures, FAQs, internal links to live pages only; image alts corrected to illustration (no fake photos) |
| G5 Build | **PASS** | `src/`, `public/`, `dist/`, `docs/06-seo-audit.md` | 15 HTML pages; build+check PASS; seo-optimizer audit PASS WITH FIXES (2 fixes applied: duplicate hero image, check.mjs domain default); 0 P0/P1 open |
| G6 QA | **PASS** | `docs/07-qa-report.md` | Initial FAIL (P1: contact mailbox honesty) → fixed by content-writer + site-builder (contact wording, coming-soon framing, emoji in anchors, CSP tightened, _headers cache rules) → re-audit 2026-11-10: PASS, CLEARED TO DEPLOY. 5 P2 open (tracking ID, PageSpeed post-deploy, 6 spokes, hub size, optional H1) |
| G7 Deploy | **PASS** | `docs/08-deployment.md` | LIVE 2026-11-10: https://awlandstitch.pages.dev (deploy 772cd7ad). Repo: https://github.com/nguyenvutran14/awlandstitch (public, 3 commits). CEO-verified: home/hub/sitemap all 200, sitemap 14 URLs. Redeploy: `npx wrangler pages deploy dist --project-name awlandstitch --branch main` |

## Open items (tracked, non-blocking)

- Affiliate terms (commission/cookie/payout) still `needs verification` — needs
  owner's AliExpress Portals/Awin access; placeholders acceptable for first deploy.
- HTS duty line for pricking irons: planning range only (37.5–55.3%); needs a
  licensed broker for a ruling. Site copy must keep "duties may apply" framing.
- 20-tooth listing carrier brand undisclosed on item page — recheck at checkout.
- pages.dev HTTP status to be logged by devops-deployer at project creation.

## Wave 2 log (2026-11-11)

- Owner directive: money-site template upgrade, longtail pain-point content,
  real product images, faster path to first commission.
- New artifacts: `docs/09-product-images.md` (product-researcher),
  `docs/05-content-briefs/07…14-*.md` (seo-strategist), updated
  `docs/04-seo-plan.md` (wave-2 section).
- Image path conventions: product photos `/images/products/<product-key>-<n>.webp`
  (keys = `src/data/affiliates.json`), diagrams `/images/<slug>-<topic>.svg`.

## Next action

Owner next steps (post-launch, in priority order):
1. Apply to AliExpress Portals/Awin; when approved, give CEO the tracking ID → site-builder fills `src/data/affiliates.json` (QA P2-6: required BEFORE monetized traffic).
2. Buy awlandstitch.com, attach to Pages project per `docs/08-deployment.md` §7, then create the hello@ mailbox (closes the contact-page timing note).
3. Add site to Google Search Console, submit sitemap.xml.
4. First 3–5 backlinks (leathercraft communities, Reddit r/Leathercraft, Pinterest).
5. Optional: set CLOUDFLARE_API_TOKEN repo secret for auto-deploy CI (§6); PageSpeed check on live URL (QA P2-7).
