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
   - Use cases (200–300 words)
   - FAQs or tips (200+ words)

6. **Page wrapper** (`src/pages/finance/[slug].tsx`):
   - Full metadata: title, description, keywords, Open Graph, JSON-LD schema
   - Dynamic import with `ssr: false` if the component uses any browser API

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
- Add to homepage tools array
- Add to footer navigation
- Update sitemap if not auto-generated

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

- [ ] `<ExportShareBar>` is first child; PDF/Excel/Copy/WhatsApp/Twitter all wired
- [ ] `buildPdfConfig()` and `buildExcelSheets()` implemented
- [ ] Charts: correct count for pattern; custom tooltips; CHART_COLORS used
- [ ] Sticky calculator (heavy side-by-side only)
- [ ] SEO content 800+ words, full paragraphs, below the fold
- [ ] Cards: `rounded-2xl shadow-md border border-slate-100`; inputs/buttons `rounded-lg`
- [ ] Only `slate-*` colors (no `gray-*`); typography scale correct (900/700/600)
- [ ] CHART_COLORS constant used; series order correct; no legacy hex colors
- [ ] Touch targets ≥ 44px; tested at 375px, 768px, 1024px
- [ ] Input validation: no invalid state can trigger a calculation
- [ ] No `any` types; LocalStorage wired (heavy only)
- [ ] Page metadata complete (title, desc, keywords, OG, JSON-LD)
- [ ] `ssr: false` on dynamic import if any browser API used
- [ ] `calculatorId` registered in `_types.ts`, `_calculators.ts`, `_registry.ts`
- [ ] Added to homepage + footer nav
- [ ] 3–5 variants created and wired into `ALL_VARIANTS`
- [ ] `tsc --noEmit && npm run build` passes cleanly
- [ ] No console errors
