# Deployment Record — Awl & Stitch (G7)

**Date:** 2026-11-10
**Owner:** devops-deployer
**Gate:** G7 (playbook) — live 200 OK, repo pushed, no secrets, URLs documented
**Inputs:** `docs/07-qa-report.md` verdict **PASS / CLEARED TO DEPLOY** (2026-11-10 re-audit); `docs/03-domain-options.md` decision — primary domain `awlandstitch.com` **not purchased**; deploy on the free temp name `awlandstitch`.

---

## 1. Live URLs

| What | URL | Status |
|---|---|---|
| **Production alias (canonical)** | https://awlandstitch.pages.dev | 200 |
| Deployment-specific URL (this deploy) | https://772cd7ad.awlandstitch.pages.dev | 200 |
| Deployment ID | `772cd7ad` (prefix of the deployment URL) | — |
| GitHub repo | https://github.com/nguyenvutran14/awlandstitch | PUBLIC, branch `main` |

- Project name `awlandstitch` was free (DNS-verified NXDOMAIN on 2026-11-07 per `docs/03-domain-options.md` §6) and was claimed successfully — **no numeric suffix needed**.
- The production alias serves the latest deployment on the production branch (`main`).
- The custom domain `awlandstitch.com` is **not attached** (not purchased). The `pages.dev` URL is the temporary production URL, per the deployment plan.

## 2. GitHub repository

- **Repo:** https://github.com/nguyenvutran14/awlandstitch
- **Visibility:** **public** — per `docs/00-brief.md` §5 assumption 4 ("Public GitHub repo unless the owner says otherwise").
- **Default branch:** `main`, working tree clean, tracking `origin/main`.
- **Initial commit:** `72972d5` — "Initial commit: Awl & Stitch leathercraft affiliate site (source, content, docs)" (89 files).
- **Committed:** site source (`src/`, `scripts/`, `public/`), content (`content/`), docs (`docs/`), `package.json`, `package-lock.json`, `.gitignore`, `README.md`, `MISSION.md`.
- **Excluded via `.gitignore`:** `node_modules/`, `dist/`, `.env`, `.env.*`, `.wrangler/`, `*.log`, plus local agent-tooling scratch (`.opencode/`, `opencode.json`) and wrangler's `.dev.vars*` entries.
- **Secrets:** none committed. Pre-commit scan found no token/key patterns (the only regex hit was the QA report's own description of its scan). Deployed HTML also scanned: 0 secret patterns, 0 `{{aff:` tokens.
- **Git identity:** repo-local only (`nguyenvutran14` / `nguyenvutran14@users.noreply.github.com`); global git config untouched.
- **Auth:** GitHub CLI (`gh`) authenticated by the user beforehand (account `nguyenvutran14`); no tokens were created, pasted, or stored by this task.

## 3. Cloudflare Pages

- **Account:** Cloudflare free tier, authenticated by the user beforehand (OAuth, `pages (write)` scope). No API tokens were created or stored by this task.
- **Project:** `awlandstitch`, production branch `main`, direct-upload (no Git integration).
- **Platform note (wrangler 4.159):** `wrangler pages project create` now *delegates* to the new Cloudflare Pages-in-Workers platform by default, which produces a `*.workers.dev` URL instead of `*.pages.dev`. The first attempt created a Worker at `awlandstitch.cool-mouse-984d.workers.dev` (wrong URL for this project's requirements). It was deleted, and the project was re-created on **classic Cloudflare Pages** using wrangler's documented opt-out `--force` on the *create* command only. Wrangler confirms `--force` is needed only once at creation; all later commands run directly against Pages without it. The stray Worker was deleted, so no orphaned `workers.dev` deployment remains.
- **Files deployed:** 58 assets (15 HTML pages, `_headers`, sitemap, RSS, robots, CSS, images, OG PNGs) — matches the QA-verified build exactly.

## 4. Exact commands used (for redeploy later)

Run from the project root (`C:\Users\PC\ali`). Auth must already be in place (`gh auth login` / `npx wrangler login` — user-run, one time; never paste tokens into chat or files).

```powershell
# 1. Build and self-check (must pass before every deploy)
npm install
npm run build
npm run check

# 2. Commit and push source changes
git add -A
git commit -m "<message>"
git push

# 3. Deploy dist/ to Cloudflare Pages (production branch main)
npx wrangler pages deploy dist --project-name awlandstitch --branch main
```

Notes:

- The project already exists, so **no** `pages project create` and **no** `--force` are needed for redeploys.
- Each deploy prints a new `https://<hash>.awlandstitch.pages.dev` URL; the production alias `https://awlandstitch.pages.dev` always serves the latest `main` deployment.
- If the project ever needs to be re-created from scratch: `npx wrangler pages project create awlandstitch --production-branch main --force` (the `--force` opt-out is required once on wrangler ≥4.14x to land on classic Pages and get the `pages.dev` URL; see §3).

## 5. Verification checklist (2026-11-10, against the production alias)

| # | Check | Result |
|---|---|---|
| 1 | `GET /` | **200** (432 ms) |
| 2 | `GET /best-pricking-irons/` (money hub) | **200** (338 ms) |
| 3 | `GET /what-size-pricking-irons-for-wallets/` (article) | **200** (254 ms) |
| 4 | `GET /sitemap.xml` | **200** — 14 URLs, all `https://awlandstitch.pages.dev/...` |
| 5 | `GET /robots.txt` | **200** — allows all, sitemap ref points at production URL |
| 6 | `GET /rss.xml` | **200** |
| 7 | `GET /404` (clean URL) | **200** |
| 8 | `GET /404.html` | **308** → `/404` (Cloudflare clean-URL redirect; expected) |
| 9 | `GET /no-such-page-xyz/` (bogus path) | **404** with the styled 404 page |
| 10 | Deployment-hash URL `https://772cd7ad.awlandstitch.pages.dev/` | **200** (via curl; see caveat below) |
| 11 | Home `<title>` | `Awl & Stitch - Leathercraft Tool Guides` |
| 12 | Home `<link rel="canonical">` and `og:url` | `https://awlandstitch.pages.dev/` (production URL) |
| 13 | Article canonical | `https://awlandstitch.pages.dev/what-size-pricking-irons-for-wallets/` |
| 14 | `{{aff:` placeholder tokens in deployed HTML | **0** |
| 15 | Secret patterns (`ghp_`, `sk_live`, `AKIA…`, token names) in deployed HTML | **0** |
| 16 | Security headers served (from `dist/_headers`) | CSP (`default-src 'self'`, `script-src 'self'`, no `unsafe-inline`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS, `Permissions-Policy`, `COOP: same-origin` — all present |

**Caveats / observations:**

1. The deployment-hash URL failed TLS from this environment for the first ~3 minutes after project creation (per-project certificate provisioning for `*.<project>.pages.dev`); it returned 200 on retry. The production alias worked immediately throughout.
2. Response times above are from this build environment (single client, first uncached fetch); not a PageSpeed measurement. QA P2-7 (run PageSpeed on the live URL) remains open for qa-reviewer.
3. `wrangler pages project list` shows only classic Pages projects; the project also appears in the Cloudflare dashboard under Pages.

## 6. GitHub Actions CI/CD (optional — skipped)

Not configured: the repo has **no** `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets set (verified with `gh secret list`), and creating/storing tokens is out of scope for this task. Deploys are currently manual via §4.

Optional next step (user-run, when wanted):

1. Create an API token in the Cloudflare dashboard (Account → Cloudflare Pages → Edit) and note the Account ID (visible in `npx wrangler whoami` output).
2. Set them as repository secrets — never in files or chat:
   `gh secret set CLOUDFLARE_API_TOKEN -R nguyenvutran14/awlandstitch` (paste value at the prompt), same for `CLOUDFLARE_ACCOUNT_ID`.
3. Add `.github/workflows/deploy.yml` that runs `npm run build` and `npx wrangler pages deploy dist --project-name awlandstitch --branch main` on push to `main`, reading those two secrets from the environment.

## 7. Attaching the custom domain `awlandstitch.com` later

Full decision context: `docs/03-domain-options.md` §5 and §7. Summary of steps:

1. **Purchase** `awlandstitch.com` — recheck RDAP first (`https://rdap.verisign.com/com/v1/domain/awlandstitch.com`; HTTP 404 = still available). Cloudflare Registrar ≈ $10–11/yr at-cost, or Porkbun/Namecheap ≈ $10–15/yr.
2. **Add the domain to Cloudflare** (free plan): automatic nameservers if bought at Cloudflare Registrar; otherwise change nameservers at the registrar to the ones Cloudflare assigns.
3. **Attach in Pages:** Cloudflare dashboard → Workers & Pages → `awlandstitch` → Custom domains → add `awlandstitch.com` and `www.awlandstitch.com`. Cloudflare issues SSL automatically.
4. **Update the site URL:** set `domain` in `src/data/site.json` to `https://awlandstitch.com`, rebuild (`npm run build`), redeploy (§4 command). Canonicals, sitemap, RSS, and OG URLs all derive from that field. Keep the `pages.dev` URL as a secondary/redirect.
5. **Post-launch SEO:** submit `https://awlandstitch.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools; verify the new canonicals render correctly.
6. **Mailbox follow-up (from QA P1-1):** once the domain is live, activate the real `hello@awlandstitch.com` mailbox (e.g., Cloudflare Email Routing) so the Contact page's "becomes active once our custom domain is connected" caveat becomes true.

## 8. Open items carried from QA (not deployment blockers)

- **P2-6 (hard precondition before monetized traffic):** fill the AliExpress affiliate tracking ID in `src/data/affiliates.json` (`_meta.trackingId`); the build appends it automatically once non-empty.
- P2-5 (optional home-H1 brand string), P2-7 (PageSpeed on live URL), P2-8 (6 planned spokes per the 90-day calendar), P2-9 (hub size watch).
