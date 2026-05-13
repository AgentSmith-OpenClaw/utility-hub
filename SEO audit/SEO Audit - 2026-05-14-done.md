# Toolisk.com SEO Audit — 2026-05-14
**Status**: ✅ DONE

---

## TL;DR

The site is **already well-optimized on-page** (good titles, descriptions, schema on homepage). The bottleneck is **authority** (new site, 13 clicks/90 days, most pages rank position 40-90). On-page tweaks have limited remaining upside. Focus on the few real gaps below.

---

## What's Already Good — Don't Touch

- ✅ Every calculator page has a proper `<title>` and `<meta description>` (verified in HTML, not missing as a previous audit incorrectly suggested)
- ✅ Homepage has `ItemList` + `FAQPage` JSON-LD schema
- ✅ All audited pages are indexed and mobile-friendly (verified via URL Inspection API)
- ✅ Calculator pages cross-link to ~8 related calculators each

**Skip**: rewriting meta descriptions, rewriting titles, "reorganizing the homepage". Stop doing things that aren't broken.

---

## Real Issues (in priority order)

### 1. `/finance` returns 404 — build the hub page
**What**: `curl -I https://toolisk.com/finance` returns `HTTP/2 404`. `/tools` works (200). No internal links currently point to `/finance`, but Google will reasonably expect this section page to exist, and it would rank for queries like "free finance calculators".

**Do**: Create `/finance` as a category page. Mirror the existing `/tools` page structure. Include:
- H1: "Finance Calculators"
- Brief intro (2–3 sentences) describing what's covered
- Grid/list of all 26 finance calculators (the same data already on the homepage `ItemList`)
- `BreadcrumbList` schema: Home → Finance
- Title: `Free Finance Calculators — 26 Tools for Loans, Retirement & Investing | Toolisk`
- Meta description: one sentence summarizing the section

**Why it matters**: Currently a top-level URL on the site 404s. Also unlocks a hub page that can rank for short-head category queries.

---

### 2. FIRE Calculator: 853 impressions, 3 clicks — find why
**What**: `/finance/fire-calculator` ranks position 40.6 with 853 impressions over 90 days. The page title and meta description are fine. CTR is 0.35%, which is roughly what position 40 yields (~0.3%), so this is **not actually a CTR problem** — it's a **position problem**.

Separately, the query *"financial independence retire early"* ranks position 2.7–5.5 but receives **zero clicks** from ~5 impressions. Either the SERP snippet is being truncated, a Reddit/Wikipedia result is outcompeting, or the URL doesn't look like the answer to the query.

**Do**:
1. Manually Google `"financial independence retire early"` and look at the SERP. Note: (a) what URL of yours is shown, (b) what title/snippet Google is actually displaying, (c) what's above and below you.
2. If Google is showing the calculator page for an informational query, that's an intent mismatch — write a short informational intro at the top of the FIRE calculator page (200–300 words: "What is FIRE?", "How is it calculated?"). Don't redesign the page.
3. If Google is showing `/finance/learn/fire-movement-explained`, the page just needs a clearer title.

**Why it matters**: This is the only striking-distance keyword in the data. Everything else is on page 5+ and won't move from on-page changes alone.

---

### 3. EMI Calculator: position 17.6 — push to page 1
**What**: `/finance/emi-calculator` is position 17.6 (page 2). This is **the most movable page in the data** — small gap, real impressions.

**Do**:
1. Add 3–5 inbound internal links to this page from related content. Good link sources: the new `/finance` hub, `/finance/amortization-calculator`, `/finance/learn/*` posts about loans. Use anchor text like "EMI calculator" or "loan EMI calculator".
2. Add `SoftwareApplication` JSON-LD schema to the page (homepage has `ItemList` but individual calculator pages have nothing — verify with `curl -s URL | grep ld+json`).
3. Don't change the title or description. They're already good.

**Why it matters**: Moving from position 17 → 8–10 is realistic from internal linking + schema. Moving from position 80 → 8 (the other calculators) is not.

---

### 4. Add `SoftwareApplication` + `BreadcrumbList` schema to all calculator pages
**What**: Verify with `curl -s https://toolisk.com/finance/fire-calculator | grep 'application/ld+json'`. The homepage has rich schema; individual calculator pages likely have none or minimal.

**Do**: Add to each `/finance/*-calculator` page:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "<Calculator Name>",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
```
Plus a `BreadcrumbList` (Home → Finance → Calculator Name).

**Why it matters**: Enables rich result eligibility. Low effort, deploy once across all pages via the page template.

---

## What I'm Deliberately Not Recommending

- **Rewriting meta descriptions**: Already good. Verified in source HTML.
- **Rewriting titles**: Already good. Verified.
- **"Reorganize homepage"**: Speculative. Homepage already converts well (8% CTR at position 6.5).
- **Creating a `/finance/financial-independence` hub**: Premature. First find out *why* the FIRE queries aren't converting (#2 above). The page may not be needed.
- **Aggressive content expansion**: Without GSC data showing demand for specific long-tail queries, this is guessing. Wait until rankings improve and real data appears.

---

## The Honest Limitation

This site has **13 organic clicks in 90 days**. The biggest lever is **authority** (backlinks, brand mentions, time), which on-page work can't replicate. The four items above are the realistic on-page work remaining; after that, the next move is off-page (link building, content marketing) which is outside the agent's scope.

---

## Verification Steps (for the implementing agent)

Before marking DONE, confirm in a terminal:
```bash
curl -sI https://toolisk.com/finance | head -1                  # should be 200, not 404
curl -s https://toolisk.com/finance/emi-calculator | grep -c 'SoftwareApplication'   # should be ≥ 1
curl -s https://toolisk.com/finance/emi-calculator | grep -c 'BreadcrumbList'        # should be ≥ 1
```

Then rename this file: `SEO Audit - 2026-05-14-pending.md` → `SEO Audit - 2026-05-14-done.md`.
