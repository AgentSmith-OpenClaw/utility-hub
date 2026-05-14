# Toolisk.com SEO Audit — 2026-05-14 (Cross-Verified, re-run 2026-05-15)
**Status**: 🔄 IN PROGRESS — sitemap submitted; indexation lagging
**Indexation**: 25 / 203 URLs (12.3%) per URL Inspection API
**Sitemap**: submitted to GSC 2026-05-13 21:48 UTC, downloaded successfully, 0 errors

> Re-run on 2026-05-15 after sitemap was submitted. Indexing is the dominant issue. The full sitemap (all 203 URLs) was inspected via the GSC URL Inspection API. Several previously-flagged findings are now resolved; new findings are below.

---

## TL;DR — What changed since the 2026-05-14 audit

| Previous flag | Re-checked 2026-05-15 | Status |
|---|---|---|
| Sitemap not registered in GSC | Submitted 2026-05-13 21:48 UTC, downloaded by Google, 0 errors, 203 URLs accepted | ✅ Resolved |
| 14 of 25 inspected pages NOT indexed | Full sweep: 178/203 not indexed (12.3% indexation). Sitemap-driven crawl underway but still early (T+2 days) | 🔴 Still critical, but expected post-submission lag |
| www.toolisk.com not redirecting | Still returns HTTP/2 200 — no 301 in place | 🔴 Still open |
| `og:image` missing site-wide | Not re-checked — assume still open until code change ships | 🟡 Still open |
| Long titles on `/finance/learn/*` | Not re-checked | 🟡 Still open |
| Meta descriptions > 160 chars | Not re-checked | 🟡 Still open |
| Some calculators returning indexed | `auto-loan-calculator`, `credit-card-payoff-calculator` and 6 learn articles now show "Submitted and indexed" | ✅ Progress |
| **NEW: Sitemap has identical lastmod for all 203 URLs** | All entries stamped `2026-05-13` — kills the lastmod prioritisation signal | 🟡 Medium |
| **NEW: Stale 404 in Google's index for `/finance/learn/prepayment-strategies-guide`** | Page now returns 200, but Google's last crawl (2026-02-14) returned 404. Linked from homepage. | 🟡 Medium |
| **NEW: 51 URLs are "URL unknown to Google"** | All in the sitemap; mostly pages added in last 1–2 weeks (coast-fire-calc, lumpsum-vs-sip, biweekly-mortgage, social-security-* calcs, 11 new learn articles). Expected to resolve as Google processes the sitemap | 🟢 Watching |
| **NEW: Stale crawl on `/finance/learn/prepayment-strategies-guide`** | 89 days since last crawl | 🟢 Linked to above |

**Top three things to actually do now**:
1. Ship the **www → apex 301 redirect** in Cloudflare (still not in place).
2. **Manually request indexing** for the 7 highest-value pages that are still "Discovered – not indexed" 70+ days after first discovery.
3. **Fix the sitemap's lastmod logic** to emit real per-page last-changed timestamps instead of stamping every entry with the build date.

---

## 🔴 CRITICAL — Indexing (still the #1 problem, but the picture has changed)

### Issue 1.1: ✅ RESOLVED — Sitemap is now registered

GSC Sitemaps API as of 2026-05-15:

```
sitemap.xml         lastSubmitted 2026-05-13T21:48:57Z  errors:0  warnings:0  submitted:203  indexed:0
sitemap-0.xml       lastSubmitted 2026-05-13T21:48:35Z  errors:0  warnings:0  submitted:203  indexed:0
```

Google downloaded the sitemap, accepted all 203 URLs, and recorded no errors. The previous audit's #1 recommendation has shipped. **Note**: the `indexed:0` field is a known lagging metric in the Sitemaps endpoint — it can stay at 0 for weeks after submission. The real indexation status is in URL Inspection (Issue 1.2 below).

The previous audit's claim that "0 of 25 inspected pages have a referring sitemap" is technically still true in URL Inspection (the `referringSitemaps` field is still empty for every URL). This is a known GSC API quirk where the field doesn't propagate immediately even when the sitemap is registered; **do not over-interpret it** — the canonical source of truth is the Sitemaps endpoint above, which confirms registration.

---

### Issue 1.2: 178 of 203 URLs are still not indexed (12.3% indexation rate)

Full sweep via URL Inspection API on 2026-05-15. Coverage state breakdown:

| Coverage State | Count | What it means |
|---|---|---|
| Submitted and indexed | 25 | Indexed and serving. |
| Discovered – currently not indexed | 125 | Google knows the URL but has not crawled it. **Authority / crawl-budget bottleneck.** |
| URL is unknown to Google | 51 | Google has not discovered the URL yet. Almost all are pages added in the last 1–2 weeks (post the recent sitemap update). |
| Crawled – currently not indexed | 1 | Google fetched the page and chose not to index it. **Content-quality signal.** |
| Not found (404) | 1 | Stale Google record — page now returns 200. See Issue 1.4. |

**What's encouraging** vs the previous audit:

- 11 pages have been crawled by Googlebot in the last 5 days (post-sitemap submission), including `/auto-loan-calculator`, `/credit-card-payoff-calculator`, `/finance/reduce-emi-vs-reduce-tenure-calculator`, `/finance/learn/home-loan-prepayment-strategy`, `/finance/learn/four-percent-rule-explained`, `/finance/learn/fire-number-by-age`, `/tools/learn/sql-indexing-fundamentals`, `/tools/json-viewer`, `/tools/image-base64`, `/tools/learn/cd-ladders-vs-treasury-bills`, and the homepage. The sitemap is doing its job — Google is crawling new content.
- `auto-loan-calculator` and `credit-card-payoff-calculator`, both flagged as not-indexed in the previous audit, are now indexed.
- 6 of the new learn articles are now indexed.

**What's still broken**:

7 high-value US-targeted calculators have been "Discovered – currently not indexed" with **no crawl ever** despite all being linked from the homepage:

| URL | Coverage State | First seen |
|---|---|---|
| `/finance/401k-calculator` | Discovered – not indexed | pre-2026-05 |
| `/finance/roth-vs-traditional-ira` | Discovered – not indexed | pre-2026-05 |
| `/finance/us-paycheck-calculator` | Discovered – not indexed | pre-2026-05 |
| `/finance/student-loan-calculator` | Discovered – not indexed | pre-2026-05 |
| `/finance/buy-vs-rent-calculator` | Discovered – not indexed | pre-2026-05 |
| `/finance/inflation-calculator` | Discovered – not indexed | pre-2026-05 |
| `/finance/rental-roi-calculator` | Discovered – not indexed | pre-2026-05 |

These pages have correct titles, correct meta descriptions, and homepage links — they are not being held back by on-page issues. The signal is **low domain authority**: Google has prioritised crawling the older, higher-traffic pages first.

**Fix (in order):**

1. **Manually request indexing** in GSC URL Inspection for the 7 pages above (one-by-one, ~10/day GSC limit). This is the single fastest lever — a manual request typically gets a page crawled within 24–72 hours regardless of authority.

2. **Wait** for the sitemap processing to complete. The 51 "URL is unknown to Google" pages were added in the last ~2 weeks; sitemap submission was 2 days ago. Google typically processes new sitemap entries within 1–4 weeks for low-authority sites. Re-run URL Inspection in 7 days — expect this number to drop to <20.

3. **Fix the sitemap lastmod issue** (Issue 1.5 below). Identical lastmod on every URL gives Google no priority signal between recently-changed vs unchanged pages.

4. **Increase internal-link prominence** for the 7 stuck pages. They are linked from the homepage but likely buried in a long grid. Concrete code-level fix: on every indexed `*-calculator` page, add a "Related Calculators" footer section with 4–6 contextual links — and crucially, link FROM the indexed calculators TO the unindexed ones. Specifically:
   - From `/finance/mortgage-calculator` → link to `/finance/buy-vs-rent-calculator`, `/finance/house-affordability-calculator`, `/finance/auto-loan-calculator`, `/finance/student-loan-calculator`.
   - From `/finance/fire-calculator` → link to `/finance/401k-calculator`, `/finance/roth-vs-traditional-ira`, `/finance/us-paycheck-calculator`.
   - From `/finance/credit-card-payoff-calculator` (just indexed) → link to `/finance/student-loan-calculator`, `/finance/auto-loan-calculator`.
   - This funnels link equity from indexed pages to unindexed peers.

5. **Investigate `coast-fire-strategy` quality issue** (still "Crawled – currently not indexed", last crawl 2026-04-01, unchanged since previous audit). See Issue 1.3.

---

### Issue 1.3: `/finance/learn/coast-fire-strategy` — Crawled but not indexed

**Evidence (URL Inspection, 2026-05-15):**

```
coverage_state:  Crawled - currently not indexed
last_crawl_time: 2026-04-01T03:42:26Z
google_canonical: https://toolisk.com/finance/learn/coast-fire-strategy  (self)
user_declared_canonical: (none set)
```

Google fetched the page over six weeks ago and decided not to index it. The page is 1,440 words, self-canonical, properly linked from the homepage. The "decline to index" decision is a content-quality judgement. Most likely causes:

- Near-duplicate framing relative to `/finance/learn/fire-movement-explained` (which IS indexed) — both pages discuss FIRE strategies as their primary topic.
- No unique computational value — unlike `/finance/learn/four-percent-rule-explained` (indexed) which is anchored to a specific number and rule, `coast-fire-strategy` is conceptual prose.
- No JSON-LD `Article` schema differentiation from sibling learn pages.

**Fix:**

1. Add a unique, calculator-driven worked example to the page (e.g. "Coast FIRE worked example: if you have $200k at age 30, can you stop contributing?" — show the actual math + chart).
2. Add a prominent embedded link/CTA to a Coast FIRE *calculator* (the new `/finance/coast-fire-calculator` page exists in the sitemap but is itself unindexed). The relationship between an explainer + dedicated calc is a strong differentiation signal vs pure-prose competitors.
3. Set a `user_declared_canonical` tag on the page explicitly (currently null — Google inferred self-canonical, but setting it removes ambiguity).
4. After the change, request indexing manually in GSC. Re-check after 14 days.

---

### Issue 1.4: Stale 404 record for `/finance/learn/prepayment-strategies-guide`

**Evidence:**

URL Inspection (2026-05-15) reports `Not found (404)` for this URL with `last_crawl_time: 2026-02-14`. But:

```
$ curl -sI https://toolisk.com/finance/learn/prepayment-strategies-guide
HTTP/2 200
```

The page now serves 200. It is in the sitemap. It is **still linked from the homepage** (alongside `/finance/learn/home-loan-prepayment-strategy`, which is the new, indexed equivalent). Google last crawled it on 2026-02-14 when it returned 404 and has cached that result for 90 days.

**Likely history:** this slug was the original draft; it got renamed to `home-loan-prepayment-strategy` and the old URL was either restored or never properly retired. Both URLs now coexist.

**Fix — pick one of two options:**

**Option A (keep both URLs)** — verify the content is genuinely distinct from `home-loan-prepayment-strategy`. Then request indexing manually in GSC to overwrite the stale 404 record.

**Option B (recommended — retire the duplicate)** — the cleaner path:
1. Delete the file/route for `prepayment-strategies-guide`.
2. Add a 301 redirect: `/finance/learn/prepayment-strategies-guide` → `/finance/learn/home-loan-prepayment-strategy`.
3. Remove the URL from the sitemap.
4. Remove the homepage link to `prepayment-strategies-guide` (currently in the homepage learn-articles list).

This eliminates the duplicate-content risk and the wasted crawl budget. Until done, Google will keep re-fetching a 404 every few months.

---

### Issue 1.5 — NEW: Sitemap stamps every URL with the same `lastmod`

**Evidence:**

```
$ curl -s https://toolisk.com/sitemap-0.xml | grep lastmod | sort -u | wc -l
1
$ curl -s https://toolisk.com/sitemap-0.xml | grep lastmod | head -1
<lastmod>2026-05-13</lastmod>
```

All 203 sitemap entries have `<lastmod>2026-05-13</lastmod>` — the date of the most recent build. The sitemap generator is using `Date.now()` (or `new Date().toISOString()`) at generation time, applying it uniformly.

**Why this matters:** Google uses `lastmod` to prioritise crawl. When every URL declares the same lastmod, it gives Google no signal about which pages are actually fresh. The pages Google chooses to crawl first become driven entirely by internal-link prominence and authority — which is exactly the problem we're trying to solve in Issue 1.2.

Worse, Google's docs explicitly warn that consistently inaccurate `lastmod` causes Google to stop trusting the sitemap's `lastmod` signal entirely — even for pages that are genuinely fresh.

**Fix:**

The sitemap is being generated by the build (likely via `next-sitemap` given the Next.js stack). The fix depends on which generator is used; the principle is the same: pull the real per-page modification time, not the build time.

Likely locations to check / patches:

- If using `next-sitemap`: in `next-sitemap.config.js`, replace any global `autoLastmod: true` (which uses build time) with a per-page `transform` function that reads file mtime from the source `.tsx`/`.mdx` file, or reads from Git: `git log -1 --format=%cI -- <file>`.
- For statically authored pages, use the source-file mtime as the lastmod.
- For MDX/content collections, use the front-matter `updated` field if present, falling back to file mtime.

Concrete sketch (next-sitemap transform):

```js
// next-sitemap.config.js
const { execSync } = require('child_process')
const path = require('path')

function gitLastMod(loc) {
  const filePath = locToFilePath(loc)  // map URL → source file
  try {
    return execSync(`git log -1 --format=%cI -- "${filePath}"`).toString().trim()
  } catch { return new Date().toISOString() }
}

module.exports = {
  siteUrl: 'https://toolisk.com',
  generateRobotsTxt: false,
  autoLastmod: false,
  transform: async (config, loc) => ({
    loc,
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: gitLastMod(loc),
  }),
}
```

After deploy, re-fetch `/sitemap-0.xml` and confirm `lastmod` varies across URLs.

---

## 🔴 CRITICAL — Duplicate Content (still open from previous audit)

### Issue 2: www.toolisk.com is still NOT redirecting to toolisk.com

**Evidence (re-checked 2026-05-15):**

```
$ curl -sI https://www.toolisk.com/ | head -2
HTTP/2 200
content-type: text/html; charset=utf-8
```

Still returns 200, not 301. This recommendation from the previous audit has not been actioned. The Cloudflare redirect rule has not been added.

Adding to the existing GSC evidence:

```
https://toolisk.com/        — 80 imp,  6 clk, pos 6.4  (canonical, indexed)
https://www.toolisk.com/    —  2 imp,  2 clk, pos 1.0  (duplicate, indexed)
```

The www version is even *outranking* the apex on the rare queries it appears for (pos 1 with 100% CTR) — meaning every external backlink to `www.toolisk.com` continues to leak PageRank into the duplicate.

**Fix (Cloudflare, 2 minutes — copying from the previous audit, unchanged):**

1. Cloudflare dashboard → toolisk.com → **Rules → Redirect Rules**
2. Create rule:
   - **Name**: `Redirect www to apex`
   - **When incoming requests match**: `Hostname equals www.toolisk.com`
   - **Then**: `Dynamic redirect → concat("https://toolisk.com", http.request.uri.path)`
   - **Status code**: `301 Permanent`
   - **Preserve query string**: ✅
3. Verify:
   ```bash
   curl -sI https://www.toolisk.com/finance/sip-calculator | head -3
   # Expect: HTTP/2 301 + location: https://toolisk.com/finance/sip-calculator
   ```

---

## 🟡 HIGH — Discoverability & Sharing (not re-verified, presumed open)

### Issue 3: No Open Graph image on any page
*Status carried forward from previous audit — no code change has shipped that would affect this. Fix unchanged: create a 1200×630 OG image template, generate one per page, add `<meta property="og:image">` site-wide.*

### Issue 4: Long titles on `/finance/learn/*` get truncated in SERPs
*Status carried forward. Recommended shortenings unchanged.*

### Issue 5: Some meta descriptions are over the 160-char SERP limit
*Status carried forward. Recommended rewrites unchanged.*

---

## 🟡 MEDIUM — Indexing-related quality observations

### Issue 6 — NEW: Hub pages `/finance`, `/tools`, `/finance/learn` are all unindexed

**Evidence:**

| URL | State |
|---|---|
| `/finance` | Discovered – not indexed |
| `/tools` | URL is unknown to Google |
| `/finance/learn` | Discovered – not indexed |
| `/tools/learn` | Submitted and indexed ✅ |

Three of four hub pages are not indexed. The `/tools/learn` hub is indexed — confirming hub pages CAN get indexed; the others just have not yet.

**Why this matters:** hub pages are the canonical entry points for topic-cluster authority. An unindexed `/finance` hub means Google has no anchor for "Toolisk Finance" as a topical entity, and internal links from individual calc pages to `/finance` are flowing into an unindexed sink.

**Fix:**

1. Confirm there are no accidental `noindex` tags on these three hub pages (`curl -s https://toolisk.com/finance | grep -i noindex` — should return nothing).
2. Manually request indexing for `/finance`, `/tools`, and `/finance/learn` in GSC.
3. Add unique on-page content to each hub: not just a grid of calculators, but 200–400 words of intro explaining the section, what's in it, who it's for. Currently these hubs are likely thin (just a tile grid), which Google deprioritises.

### Issue 7 — Stale crawl: `/finance/learn/prepayment-strategies-guide` (89 days)

Covered under Issue 1.4. Listed separately because the GSC summary flags it as a stale-crawl outlier.

---

## 🟢 MEDIUM — Long-tail content opportunities

*This section unchanged from the previous audit — see the original tables for the 110-query SIP cluster, 92-query FIRE cluster, and individual long-tail gaps. Re-prioritise after indexing improves: optimising on-page content for queries pointing at unindexed pages has no effect until those pages are indexed.*

GSC data summary (90 days, 2026-02-11 → 2026-05-12):

| Metric | Value |
|---|---|
| Total clicks | 15 |
| Total impressions | 2,983 |
| Avg CTR | 0.50% |
| Avg position | 65.8 |
| Unique queries | 406 |
| Pages with impressions | 14 |

The headline number — 14 of 25 indexed pages getting impressions — confirms the basic SEO is working *for the pages that are indexed*. The growth lever is overwhelmingly indexation, not on-page tuning.

---

## ⚪ LOW — Don't bother
*(Unchanged from previous audit. robots.txt conflict, homepage H1, international CTR noise, etc.)*

---

## 📋 Precise Action Plan (revised)

### Today — 20 minutes

- [ ] **Add 301 redirect www → apex** in Cloudflare (Issue 2) — still the cheapest fix and unactioned.
- [ ] **Manually request indexing** in GSC URL Inspection for these pages (split across two days, GSC limits ~10/day):
  - Day 1: `/finance/401k-calculator`, `/finance/roth-vs-traditional-ira`, `/finance/us-paycheck-calculator`, `/finance/auto-loan-calculator` (already indexed — skip), `/finance/student-loan-calculator`, `/finance/buy-vs-rent-calculator`, `/finance/inflation-calculator`, `/finance/house-affordability-calculator`, `/finance/rental-roi-calculator`, `/finance`, `/tools`.
  - Day 2: `/finance/learn`, `/finance/coast-fire-calculator`, `/finance/lumpsum-vs-sip-calculator`, `/finance/biweekly-mortgage-payment-calculator`, plus any of the 11 new learn articles still showing "URL unknown to Google".

### This week — code changes, ~3–5 hours total

- [ ] **Fix sitemap `lastmod`** (Issue 1.5) — per-page mtime instead of build time. Single biggest crawl-prioritisation lever.
- [ ] **Retire or 301-redirect `/finance/learn/prepayment-strategies-guide`** (Issue 1.4) — pick Option A or B, remove the dead duplicate.
- [ ] **Add "Related Calculators" footer** to every indexed calc page, linking specifically to the 7 stuck-but-homepage-linked calcs (Issue 1.2 fix #4). This is the highest-leverage internal-link change because it routes equity from indexed → unindexed peers.
- [ ] **Shorten 5 over-long titles** (Issue 4 — unchanged from previous audit).
- [ ] **Shorten 5 over-long meta descriptions** (Issue 5 — unchanged).
- [ ] **Add `og:image` site-wide** (Issue 3 — unchanged).

### This month

- [ ] **Rewrite `/finance/learn/coast-fire-strategy`** with a worked example and an embedded coast-FIRE calculator link (Issue 1.3).
- [ ] **Add 200–400 words of unique intro content** to `/finance`, `/tools`, and `/finance/learn` hubs (Issue 6).
- [ ] **Write 4 new long-tail learn articles** (Fat FIRE, Barista FIRE, FIRE by age, dual-income FIRE — unchanged from previous audit).
- [ ] **Add SIP synonym coverage** to `/finance/sip-calculator` (unchanged).
- [ ] **Add PITI framing** to mortgage calculator (unchanged).

### Verification (re-run in 7 days, 2026-05-22)

```bash
SKILL_SCRIPTS=/Users/sunny/.claude/plugins/cache/nowork-studio/toprank/0.18.0/seo/seo-analysis/scripts
python3 "$SKILL_SCRIPTS/url_inspection.py" \
  --site "sc-domain:toolisk.com" \
  --urls-file /tmp/all_urls.txt --max-urls 203 \
  --output /tmp/inspect_d7.json --concurrency 8

# Expected deltas:
# - "URL is unknown to Google" count: 51 → <20 (sitemap-driven discovery)
# - "Submitted and indexed" count:    25 → 35–45 (manual indexing + natural crawl)
# - "Discovered – not indexed" count: 125 → 100–115 (some pages crawled, mixed outcomes)
# - www.toolisk.com: HTTP 200 → 301 (post fix)
# - sitemap-0.xml lastmod: 1 unique value → 203 distinct values (post fix)
```

---

## Honest scope note

The previous audit's scope note was correct and stands: this is still a sub-20-clicks-per-90-days site, and the biggest unlock is getting more pages indexed — which is now mostly waiting on Google to process the sitemap that was submitted 2 days ago, plus the manual indexing requests and a handful of small code changes (www redirect, sitemap lastmod, related-calcs footer). Off-page authority (backlinks, brand mentions) remains the largest factor outside the agent's scope and the biggest reason the 7 homepage-linked US calcs have sat in "Discovered – not indexed" for so long.

---

## Data sources cross-verified for this re-run

- **GSC URL Inspection API** on all 203 sitemap URLs (2026-05-15, batch concurrency 8). Output: `/tmp/inspect_all.json`.
- **GSC Sitemaps API** — confirmed `sitemap.xml` + `sitemap-0.xml` registered 2026-05-13 21:48 UTC with 0 errors.
- **GSC Search Analytics API** — 90-day window 2026-02-11 → 2026-05-12 (15 clicks, 2,983 impressions, 406 queries, 14 pages with impressions).
- **Raw HTTP** checks on `https://www.toolisk.com/`, `/finance/learn/prepayment-strategies-guide`, hub pages.
- **Sitemap parse** of `https://toolisk.com/sitemap-0.xml` — 203 URLs, all with `lastmod 2026-05-13`.
- **Homepage HTML parse** — confirmed which calculators are linked from `/`.

---

# ✅ Execution To-Do (handoff)

Two lists. Agent does the code work. Human does anything that touches GSC, Cloudflare, or external dashboards. Do tasks in numbered order within each list — earlier tasks unblock later ones.

## 🤖 Agent tasks (code changes in this repo)

Before starting: run `tsc --noEmit && npm run build` to confirm a clean baseline. After each task, re-run the build gate. One focused commit per task.

### A1. Retire the duplicate prepayment-strategies-guide page
**Refs:** Issue 1.4
- Confirm `/finance/learn/home-loan-prepayment-strategy` exists and is the intended canonical (it is — currently indexed).
- Delete the route/file for `/finance/learn/prepayment-strategies-guide`.
- Add a 301 redirect from `/finance/learn/prepayment-strategies-guide` → `/finance/learn/home-loan-prepayment-strategy` (Next.js `next.config.*` `redirects()` or middleware, whichever the repo already uses).
- Remove the homepage link to `prepayment-strategies-guide` (the learn-articles list on `/`).
- Ensure it is excluded from the sitemap (depends on the sitemap generator config — likely auto-excluded once the route is gone, but verify the generated `sitemap-0.xml` no longer contains it).
- Verify: `curl -sI https://toolisk.com/finance/learn/prepayment-strategies-guide` returns `HTTP/2 301` with the right `location` header.

### A2. Fix sitemap `lastmod` to use real per-page modification time
**Refs:** Issue 1.5
- Locate the sitemap generator config (likely `next-sitemap.config.js`).
- Replace `autoLastmod: true` (or equivalent) with a `transform` function that derives `lastmod` from `git log -1 --format=%cI -- <source file>` for each route, falling back to file mtime if git fails.
- Map URL → source file: `/finance/sip-calculator` → `app/finance/sip-calculator/page.tsx` (adapt to the actual app-router layout).
- For MDX content, prefer front-matter `updated` field if present.
- Verify after build: `curl -s https://toolisk.com/sitemap-0.xml | grep lastmod | sort -u | wc -l` should be ≫ 1.

### A3. Add "Related Calculators" footer to every indexed calc page
**Refs:** Issue 1.2 fix #4
- Create a shared component, e.g. `components/RelatedCalculators.tsx`, that takes a list of `{ href, title, blurb }` and renders 4–6 contextual links as a footer block above the page footer.
- Wire it into every `/finance/*-calculator` page.
- **Routing — critical:** the links must specifically funnel from indexed → unindexed peers. Concrete mappings (these matter — do not just auto-pick "related" pages):
  - `/finance/mortgage-calculator` → links to `/finance/buy-vs-rent-calculator`, `/finance/house-affordability-calculator`, `/finance/auto-loan-calculator`, `/finance/student-loan-calculator`.
  - `/finance/fire-calculator` → links to `/finance/401k-calculator`, `/finance/roth-vs-traditional-ira`, `/finance/us-paycheck-calculator`, `/finance/inflation-calculator`.
  - `/finance/credit-card-payoff-calculator` → links to `/finance/student-loan-calculator`, `/finance/auto-loan-calculator`, `/finance/buy-vs-rent-calculator`.
  - `/finance/compound-interest-calculator` → links to `/finance/401k-calculator`, `/finance/roth-vs-traditional-ira`, `/finance/inflation-calculator`, `/finance/rental-roi-calculator`.
  - `/finance/emi-calculator` → links to `/finance/buy-vs-rent-calculator`, `/finance/auto-loan-calculator`, `/finance/student-loan-calculator`.
  - For other calc pages, link to 4 same-category siblings.
- Anchor text should be descriptive (the calculator's H1), not "click here".

### A4. Shorten 5 over-long titles
**Refs:** Issue 4 table in the previous audit (preserved above)
- Edit page metadata for each:
  - `/finance/fire-calculator` → `FIRE Calculator — Plan Early Retirement | Toolisk`
  - `/finance/amortization-calculator` → `Amortization Calculator — Loan Schedule | Toolisk`
  - `/finance/mortgage-calculator` → `Mortgage Calculator — PITI with PMI Breakdown | Toolisk`
  - `/finance/learn/coast-fire-strategy` → `Coast FIRE vs Traditional Retirement: Which Wins? | Toolisk`
  - `/finance/learn/fire-movement-explained` → `FIRE Movement Explained: Financial Independence, Retire Early`
- Each must be ≤62 characters. Verify in built HTML.

### A5. Shorten 5 over-long meta descriptions
**Refs:** Issue 5
- Rewrite to ≤155 chars (see suggested text in the original Issue 5 section above):
  - `/` (homepage), `/finance/emi-calculator`, `/finance/fire-calculator`, `/finance/compound-interest-calculator`, `/finance/mortgage-calculator`.

### A6. Add `og:image` site-wide
**Refs:** Issue 3
- Add one default OG image at `/public/og-default.png` (1200×630 PNG, Toolisk branding) — if no image asset exists, skip image generation and just use a solid-color placeholder for now; per-page custom images can come later.
- Add to a shared `<SEO>` / `<Head>` component used by every page:
  ```tsx
  <meta property="og:image" content="https://toolisk.com/og-default.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://toolisk.com/og-default.png" />
  ```
- Verify: `curl -s https://toolisk.com/finance/sip-calculator | grep -c 'og:image"'` returns ≥1.

### A7. Add unique intro content to hub pages
**Refs:** Issue 6
- For `/finance`, `/tools`, `/finance/learn`: add a 200–400 word intro block above the existing tile grid.
- Content: what the section covers, who it's for, what makes it distinctive (client-side, multi-currency, etc.). No fluff — concrete signal.
- Confirm no `noindex` tag is being injected on these routes.

### A8. Strengthen `/finance/learn/coast-fire-strategy` to overcome the "Crawled – not indexed" decision
**Refs:** Issue 1.3
- Add an explicit `<link rel="canonical" href="https://toolisk.com/finance/learn/coast-fire-strategy" />` to the page head (currently null per URL Inspection).
- Add a "Worked example" H2 section with a real numeric example (starting balance, growth rate, age timeline) and a chart or table.
- Add a prominent CTA/link to `/finance/coast-fire-calculator` (even though that calculator is itself currently unindexed — the cross-link helps both pages).
- Add `Article` JSON-LD if not already present.

### A9. (Optional, only if time) IndexNow integration
- `scripts/indexnow.js` already exists in the working tree. Read it; if it's already a working push to `api.indexnow.org`, wire it into the deploy pipeline (post-build) to ping Bing/Yandex/etc on every deploy. Skip if it's stubbed.
- Note: this does NOT help Google — Google does not use IndexNow.

### When all A1–A8 are merged
- Run a fresh URL Inspection sweep:
  ```bash
  SKILL_SCRIPTS=/Users/sunny/.claude/plugins/cache/nowork-studio/toprank/0.18.0/seo/seo-analysis/scripts
  curl -s https://toolisk.com/sitemap-0.xml | grep -oE '<loc>[^<]+</loc>' | sed -E 's|</?loc>||g' > /tmp/all_urls.txt
  python3 "$SKILL_SCRIPTS/url_inspection.py" --site sc-domain:toolisk.com --urls-file /tmp/all_urls.txt --max-urls 203 --output /tmp/inspect_post.json --concurrency 8
  ```
- Report back: how the indexed count moved vs the 25/203 baseline, and which of the 7 priority US calc pages are now indexed.

## 👤 Human tasks (external systems — agent cannot do these)

### H1. Add 301 redirect www → apex in Cloudflare
**Refs:** Issue 2 — still the single cheapest unactioned fix
1. Cloudflare dashboard → `toolisk.com` → **Rules → Redirect Rules → Create rule**.
2. Name: `Redirect www to apex`.
3. When: `Hostname equals www.toolisk.com`.
4. Then: Dynamic redirect → expression `concat("https://toolisk.com", http.request.uri.path)`, status `301 Permanent`, preserve query string ✅.
5. Verify: `curl -sI https://www.toolisk.com/finance/sip-calculator | head -3` should show `HTTP/2 301` + correct `location`.

### H2. Manually request indexing in GSC (split over 2 days, ~10/day quota)
**Refs:** Issue 1.2

Open GSC → property `sc-domain:toolisk.com` → URL Inspection tool. Paste each URL, then click **Request Indexing**. Wait for the live test to complete before the next.

**Day 1** (priority US calcs + hubs, ~9 requests):
- `/finance/401k-calculator`
- `/finance/roth-vs-traditional-ira`
- `/finance/us-paycheck-calculator`
- `/finance/student-loan-calculator`
- `/finance/buy-vs-rent-calculator`
- `/finance/inflation-calculator`
- `/finance/house-affordability-calculator`
- `/finance/rental-roi-calculator`
- `/finance` (hub)

**Day 2** (~9 requests):
- `/tools` (hub)
- `/finance/learn` (hub)
- `/finance/coast-fire-calculator`
- `/finance/lumpsum-vs-sip-calculator`
- `/finance/biweekly-mortgage-payment-calculator`
- `/finance/business-loan-emi-calculator`
- `/finance/home-loan-emi-calculator`
- `/finance/car-loan-emi-calculator`
- `/finance/interest-only-loan-calculator`

If GSC rejects with "Quota exceeded", just stop and continue the next day.

### H3. Re-check progress in 7 days (2026-05-22)
- Re-run the URL Inspection sweep (command in agent's verification step above).
- Watch for: "URL is unknown to Google" count dropping from 51 → <20; "Submitted and indexed" rising from 25 → 35+.
- If the 7 Day-1 priority pages are still "Discovered – not indexed" after manual requests + 7 days, that's a signal the issue is genuinely authority-bound and the next move is off-page (backlinks, brand mentions) rather than more on-page work.

### H4. (After A6 ships) Verify OG previews
- Paste a calculator URL into [opengraph.xyz](https://www.opengraph.xyz) — should render a card with the image. WhatsApp / LinkedIn previews refresh on their own schedule; if they still show no image after 24h, use LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) and Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) to force a re-scrape.

