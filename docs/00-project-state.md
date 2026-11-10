# Project State

Last updated: 2026-11-10 (session 4)
Current phase: 7 — Deploy (G7). G0–G6 all PASS. Waiting on owner auth.

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
| G7 Deploy | BLOCKED | `docs/08-deployment.md` | Needs owner action: install+auth GitHub CLI (`winget install GitHub.cli` then `gh auth login`), `npx wrangler login`. Affiliate ID stays placeholder until program approval |

## Open items (tracked, non-blocking)

- Affiliate terms (commission/cookie/payout) still `needs verification` — needs
  owner's AliExpress Portals/Awin access; placeholders acceptable for first deploy.
- HTS duty line for pricking irons: planning range only (37.5–55.3%); needs a
  licensed broker for a ruling. Site copy must keep "duties may apply" framing.
- 20-tooth listing carrier brand undisclosed on item page — recheck at checkout.
- pages.dev HTTP status to be logged by devops-deployer at project creation.

## Next action

Owner (you) runs two auth commands, then CEO delegates devops-deployer:
1. `winget install GitHub.cli` then `gh auth login` (choose GitHub.com → HTTPS → browser login).
2. `npx wrangler login` in `C:\Users\PC\ali` (browser login to Cloudflare).
Then deploy to `awlandstitch.pages.dev` + GitHub repo, verify live URL, final report.
