# Mission — AliExpress Affiliate Site (US Market)

## Owner's goal (from the user, in Vietnamese)

Build a fully automated affiliate content site for the US market:

- Monetize via the AliExpress affiliate program.
- Traffic must be organic/passive; the owner does not want to run ads or
  daily manual work.
- The site must be good enough to compete with the top affiliate sites:
  proper product research, SEO, content, layout, trust signals, performance.
- Deliver a real website hosted on GitHub and deployed to Cloudflare Pages
  with the free `*.pages.dev` domain first.
- Research and recommend a proper custom domain now so it can be attached
  later for SEO.
- The owner only talks to the CEO agent. The CEO delegates everything to the
  specialist subagents and returns a finished product.

## Operating assumptions

- Site language: US English. Owner-facing communication: Vietnamese.
- Business model: AliExpress affiliate (AliExpress Portals or a named
  network). Commission/cookie terms must be verified during research.
- Initial scope: one focused niche, one money hub, 6+ publishable articles,
  SEO plan for 15–25 pages, trust/legal pages, affiliate disclosure.
- Stack: static site generated in Node, deployed to Cloudflare Pages.
- The first live URL will be `https://<project>.pages.dev`; the custom domain
  is recommended now and purchased later.

## Non-negotiables

- No fabricated testing, prices, ratings, sources, or expertise claims.
- FTC affiliate disclosure above the first affiliate link on every monetized
  page.
- Affiliate links: `rel="sponsored nofollow noopener"`, `target="_blank"`, no
  cloaking.
- No secrets committed to GitHub.
- No fake deployment claims; verify the live URL.
- Income is not guaranteed. Indexing and traffic take time; the CEO must
  report honestly.

## User-provided inputs (only when the CEO reaches these gates)

1. **AliExpress affiliate tracking ID / deep-link format** — needed before
   real monetization. Placeholders are acceptable for the first deploy.
2. **GitHub authentication** — the user runs `gh auth login` once, or sets
   `GH_TOKEN` in the environment. Never paste tokens into chat.
3. **Cloudflare authentication** — the user runs `npx wrangler login` once, or
   sets `CLOUDFLARE_API_TOKEN` in the environment.
4. **Custom domain purchase** — later, after the `pages.dev` version is live
   and the domain recommendation is approved.
5. **Google Search Console / Bing Webmaster** — later, for sitemap submission
   and indexing.

## First action for the CEO

Read `docs/00-brief.md` if it exists; otherwise create it from this mission.
Then start Phase 1 (product research) and proceed through the gates. Do not
wait for the owner unless a gate explicitly requires one of the inputs above.
