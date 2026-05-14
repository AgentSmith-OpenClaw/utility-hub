# New Calculator Skill

Scaffold a complete finance calculator for toolisk.com. Run this skill when the user asks to add a new calculator tool.

---

## Step 0 — Gather inputs

Ask for (if not already provided):
- **Tool name** (e.g. "SIP Step-Up Calculator")
- **Slug** (e.g. `sip-step-up-calculator`) — must not collide with slugs in `CONCRETE_FINANCE_PAGES` in `_registry.ts`
- **Pattern** — Heavy or Lightweight (decide based on complexity; see below)
- **calculatorId** — which existing calculator engine this tool wraps (for variants)

---

## Step 1 — Pick the pattern

| Condition | Pattern |
|---|---|
| Deep state, multi-sheet export, animated dashboard, 3–4 charts needed | **Heavy** |
| Simple inputs, one primary chart | **Lightweight** |

### Heavy file layout
```
src/components/[ToolName]/
  [ToolName].tsx
  [ToolName].types.ts
  [ToolName].utils.ts
src/hooks/use[ToolName].ts       # state + localStorage
src/pages/finance/[slug].tsx
```

### Lightweight file layout
```
src/components/Finance/[ToolName].tsx
src/pages/finance/[slug].tsx     # uses <ToolShell> + <ToolSEOContent>
```

---

## Step 2 — Implement the component

**Every calculator — heavy or lightweight — MUST:**

0. **Currency selection rule** — decide before writing any formatting code:

   | Calculator type | Currency handling |
   |---|---|
   | Country-specific (India income tax, US 401k, US paycheck, SIP, FD, RD, EMI, Social Security, Roth IRA) | Hardcode the country's currency; no `CurrencySelector` |
   | Generic / multi-region (loans, investments, compound interest, mortgage, buy-vs-rent, credit card payoff, tip, salary, net worth) | **Must include `CurrencySelector`** |
   | Region-selector already present (Sales Tax/VAT/GST) | Currency symbol comes from the region config; no separate `CurrencySelector` |

   **For generic calculators**, use this exact pattern — no inventing alternatives:

   ```tsx
   // Imports
   import CurrencySelector, { useCurrency } from '../CurrencySelector';
   import { CurrencyCode, CURRENCIES, formatCurrency, formatCurrencyCompact } from '../../utils/currency';

   // Inside component
   const [currency, setCurrency] = useCurrency();

   // Placement: add as first item in the export/share bar (flex-wrap row)
   <div className="flex flex-wrap gap-2 justify-center mb-6">
     <CurrencySelector value={currency} onChange={setCurrency} />
     {/* … export/share buttons … */}
   </div>

   // For compact placement (inside an input card header):
   <CurrencySelector value={currency} onChange={setCurrency} compact />

   // Formatting
   formatCurrency(value, currency)          // full format: "$1,234"
   formatCurrencyCompact(value, currency)   // compact:  "$1.2K"
   CURRENCIES[currency].symbol              // raw symbol: "$"

   // Chart tooltip — pass currency as a prop so it closes over the right value
   const MyTooltip = ({ active, payload, currency = 'USD' }: any) => { … };
   <Tooltip content={(props) => <MyTooltip {...props} currency={currency} />} />

   // Y-axis compact formatter
   tickFormatter={(v) => formatCurrencyCompact(v, currency)}

   // Input field prefix
   prefix={CURRENCIES[currency].symbol}
   ```

   `useCurrency()` reads/writes the user's choice to `localStorage` key `toolisk_currency` — the preference persists across all generic calculators automatically.

1. **`<ExportShareBar>`** is the first child in the component body (never recreate it).
   - Import from `src/components/Tools/ExportShareBar.tsx`
   - Provide `buildPdfConfig()` → `PDFReportConfig` and `buildExcelSheets()` → `GenericExcelSheet[]`
   - `shareMessage` must embed at least one headline result number

2. **Charts** — Recharts only, always with custom tooltips and `CHART_COLORS` constant.
   - Heavy: 3–4 visualizations (trend, breakdown pie/stack, comparison bar, insight)
   - Lightweight: ≥ 1 primary chart + recommended 1 supporting chart/table

3. **Sticky calculator** (heavy side-by-side layouts only): `className="lg:sticky lg:top-6 lg:self-start"`

4. **Design & styling** — see the full reference below; no exceptions allowed.

5. **SEO content** — 800+ words below the calculator, in `<article className="prose prose-slate max-w-none">`:
   - What it calculates (200–300 words)
   - How it works (200–300 words)
   - Use cases (200–300 words) — include at least one **worked numeric example** (concrete inputs → concrete outputs) so the page has unique computational value vs. prose-only competitors
   - FAQs or tips (200+ words)
   - Content must be unique — do not paraphrase a sibling page. If a related explainer exists at `/finance/learn/*`, cross-link it (and add a link back from there to this calculator).

6. **`<RelatedCalculators>` footer** (MANDATORY, above the page footer):
   - Import `src/components/RelatedCalculators.tsx`; pass 4–6 contextual links.
   - Routing rule: from an indexed/established calc → link to less-indexed peers in the same intent cluster (loans → loans, retirement → retirement). This funnels link equity. Anchor text = the target calculator's H1, never "click here".
   - For brand-new calcs with no obvious peers, link to 4 same-category siblings from `_calculators.ts`.

7. **Page wrapper** (`src/pages/finance/[slug].tsx`) — **SEO baked in from day 1**:
   - `<title>` — **≤ 60 chars total** including the ` | Toolisk` suffix (so the unique part is ≤ 50 chars). Format: `"<Headline> | Toolisk"`. Test in built HTML.
   - `<meta name="description">` — **≤ 155 chars**, includes a result-oriented verb and 1 distinguishing feature (multi-currency, India + US, PITI, etc.).
   - `<meta name="keywords">` — 6–10 terms, comma-separated, lowercase.
   - `<link rel="canonical" href="https://toolisk.com/finance/[slug]" />` — **explicit, never rely on Google to infer self-canonical**.
   - Open Graph: `og:title`, `og:description`, `og:url`, `og:type="website"`. The site-wide default `og:image` is set in `_document.tsx` — **do not duplicate** unless shipping a page-specific OG image.
   - Twitter: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description` (inherits `twitter:image` from `_document.tsx`).
   - JSON-LD: emit both `BreadcrumbList` (via `generateBreadcrumbs()`) and a `SoftwareApplication` or `WebApplication` schema for the calculator. For `/finance/learn/*` pages, emit `Article` schema with `datePublished`, `dateModified`, `author`.
   - **No `noindex`** unless the page is intentionally private (it isn't).
   - Dynamic import with `ssr: false` if the component uses any browser API.

8. **For `/finance/learn/[slug]` content articles** — same rules plus:
   - Title template appends `| Toolisk` automatically — so `article.title` field must be ≤ 50 chars.
   - Article must have a calculator anchor: either a worked example with numbers, or a prominent CTA linking to the relevant calculator. Pure prose without a numeric/computational hook frequently lands in "Crawled – currently not indexed".

---

## Design & Styling Reference

### Layout
- Container: `max-w-6xl mx-auto` (use `max-w-7xl` for large tools)
- Page bg: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20` — never omit `/30` or `/20` (too saturated without)
- Heavy side-by-side: `grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start`
- Simple stacked: `grid grid-cols-1 lg:grid-cols-3 gap-6`
- Section spacing: `gap-6` / `mb-6`; card padding `p-5` (inputs) or `p-6` (results)

### Cards
```
rounded-2xl shadow-md border border-slate-100   ← ALL cards, no exceptions
rounded-lg                                       ← input fields, buttons only
```

### Colors & typography
- All text/borders use `slate-*` — never `gray-*`
- Headings: `text-slate-900 font-bold`
- Labels: `text-slate-700 text-sm font-semibold`
- Body/helper: `text-slate-600 text-sm`
- Section badges: `bg-blue-600 text-white` (primary) or `bg-teal-500 text-white` (secondary)
- Gradient buttons: `bg-gradient-to-r from-blue-600 to-indigo-600`
- Input focus ring: `ring-2 ring-blue-50 border-blue-400`
- Slider fill / active toggles: `#007AFF`

### Chart colors — copy into every tool
```ts
const CHART_COLORS = {
  primary:   '#007AFF',  // main series / total value
  secondary: '#4CC9F0',  // second series / comparison
  accent:    '#7209B7',  // third series
  teal:      '#2ECC71',  // gains / growth / success
  rose:      '#E74C3C',  // costs / interest / warning
  purple:    '#5E60CE',  // 6th series if needed
  grid:      '#f1f5f9',  // slate-100
  axis:      '#94a3b8',  // slate-400
};
```
Chart series order: primary → secondary → accent → teal → rose → purple. Never use `#6366f1`, `#f59e0b`, or `#f43f5e`.

### Responsive & touch
- Breakpoints: mobile default → `md:` 2-col → `lg:` 3-col/sidebar
- Touch targets: minimum **44px** height on all buttons and inputs
- Test at 375px, 768px, 1024px before declaring done

### Other
- Animations: Framer Motion for micro-interactions (entry fades, result reveals)
- LocalStorage persistence: heavy pattern only, optional for lightweight
- Input validation: prevent invalid/empty states; never let a calculation run on bad input
- TypeScript: no `any` types

---

## Step 3 — Wire into the site

- Add `calculatorId` to `_types.ts` (the `CalculatorId` union)
- Add entry to `_calculators.ts` (canonical path map)
- Add slug to `CONCRETE_FINANCE_PAGES` set in `_registry.ts`
- Add to **`/finance` hub page** tool grid (`src/pages/finance/index.tsx`) — required so the new page has at least one indexed inbound link
- Add to **at least 2 existing calculator pages'** `<RelatedCalculators>` arrays — choose calculators in the same intent cluster. This is the highest-leverage internal-link signal; skipping it is the reason pages sit in "Discovered – not indexed".
- Add to footer navigation
- Sitemap auto-regenerates from `next-sitemap.config.js`; the per-page `lastmod` is read from `git log` of the source file — **no manual sitemap edits needed**, just commit the new page.

---

## Step 4 — Create 3–5 SEO variants (MANDATORY)

For each variant, create `src/content/finance-variants/[variant-slug].ts`:

```ts
import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'variant-slug-here',
  calculatorId: 'the-calculator-id',
  seo: { title, metaDescription, keywords, ogTitle, ogDescription },
  hero: { icon, h1, tagline, gradient, breadcrumbLabel },
  content: { aboutDescription, features, steps, faqs },
  longform: [ /* LongformBlock[] — 800+ words unique content */ ],
};

export default variant;
```

Each variant must:
- Target a distinct long-tail keyword (use-case, demographic, comparison, geo-modifier)
- Have unique content — no cloning
- Not collide with any slug in `CONCRETE_FINANCE_PAGES`

Import and add each to `ALL_VARIANTS` in `_registry.ts`.

---

## Step 5 — Build gate (mandatory before declaring done)

```bash
tsc --noEmit && npm run build
```

Fix all errors. Re-run after each fix until both pass cleanly. Report final page count.

---

## Checklist (verify every item)

- [ ] Currency rule applied: generic calcs have `CurrencySelector` (pattern from Step 2); country-specific calcs do not
- [ ] `<ExportShareBar>` is first child; PDF/Excel/Copy/WhatsApp/Twitter all wired
- [ ] `buildPdfConfig()` and `buildExcelSheets()` implemented
- [ ] Charts: correct count for pattern; custom tooltips; CHART_COLORS used
- [ ] Sticky calculator (heavy side-by-side only)
- [ ] SEO content 800+ words, full paragraphs, below the fold; includes ≥1 worked numeric example
- [ ] Content is unique — not a paraphrase of any sibling page (run a quick diff if unsure)
- [ ] `<RelatedCalculators>` footer present with 4–6 contextual links
- [ ] Added to ≥2 existing calc pages' `<RelatedCalculators>` (inbound links)
- [ ] Cards: `rounded-2xl shadow-md border border-slate-100`; inputs/buttons `rounded-lg`
- [ ] Only `slate-*` colors (no `gray-*`); typography scale correct (900/700/600)
- [ ] CHART_COLORS constant used; series order correct; no legacy hex colors
- [ ] Touch targets ≥ 44px; tested at 375px, 768px, 1024px
- [ ] Input validation: no invalid state can trigger a calculation
- [ ] No `any` types; LocalStorage wired (heavy only)
- [ ] `<title>` ≤ 60 chars total (including ` | Toolisk`); verified in built HTML
- [ ] `<meta name="description">` ≤ 155 chars
- [ ] Explicit `<link rel="canonical">` set — not relying on Google to infer
- [ ] OG tags (title, description, url, type) present; `og:image` NOT duplicated (inherited from `_document.tsx`)
- [ ] `twitter:card="summary_large_image"` + title/description present
- [ ] JSON-LD: `BreadcrumbList` + (`SoftwareApplication`|`WebApplication`); `Article` schema for `/finance/learn/*`
- [ ] No `noindex`, no `robots: 'noindex'` on the page
- [ ] `ssr: false` on dynamic import if any browser API used
- [ ] For `/finance/learn/*`: `article.title` ≤ 50 chars; calculator CTA or worked example present
- [ ] `calculatorId` registered in `_types.ts`, `_calculators.ts`, `_registry.ts`
- [ ] Added to `/finance` hub grid + footer nav
- [ ] 3–5 variants created and wired into `ALL_VARIANTS`
- [ ] `tsc --noEmit && npm run build` passes cleanly
- [ ] No console errors
