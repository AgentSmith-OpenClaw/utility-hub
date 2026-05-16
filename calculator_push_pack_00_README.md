# Calculator Push Pack — US Finance (Tier 1)

This pack contains nine self-contained build briefs. Each `.md` file is a complete instruction set that an entry-level developer can hand to Claude Code (or follow themselves) to ship one calculator end-to-end.

## Files in this pack

| # | File | Slug | Tier 1 Reason |
|---|---|---|---|
| 01 | `calculator_push_pack_01_mortgage_refinance_breakeven.md` | `mortgage-refinance-breakeven-calculator` | Refi keywords are top-3 US finance CPC |
| 02 | `calculator_push_pack_02_heloc.md` | `heloc-calculator` | Home-equity CPC > $25 |
| 03 | `calculator_push_pack_03_annuity.md` | `annuity-calculator` | $20+ CPC, underserved |
| 04 | `calculator_push_pack_04_rmd.md` | `rmd-calculator` | Seasonal retirement traffic, narrow competition |
| 05 | `calculator_push_pack_05_hsa.md` | `hsa-calculator` | Health × finance = top RPM |
| 06 | `calculator_push_pack_06_roth_conversion.md` | `roth-conversion-calculator` | Premium retirement intent |
| 07 | `calculator_push_pack_07_529_college_savings.md` | `529-college-savings-calculator` | Education savings cluster |
| 08 | `calculator_push_pack_08_reverse_mortgage.md` | `reverse-mortgage-calculator` | Senior demographic, very high CPC |
| 09 | `calculator_push_pack_09_capital_gains_tax.md` | `capital-gains-tax-calculator` | Investing + tax, year-round demand |

Build sequence: **01 → 02 → 04 → 05 → 03 → 06 → 07 → 09 → 08**. Refi/HELOC first (biggest CPC), retirement cluster next, capital gains, then reverse mortgage (most complex tables).

---

## How to use each brief (mandatory workflow)

The repository has a skill at `.claude/skills/new-calculator/SKILL.md` that scaffolds the whole calculator. **Do not freelance.** Run the skill first, then copy values from the brief into its prompts.

### Step-by-step for every calculator in this pack

1. **Open the brief** (`calculator_push_pack_XX_*.md`).
2. **In Claude Code, invoke the skill:**
   ```
   /new-calculator
   ```
   When the skill asks for inputs, paste them from the brief's **"Step 0 inputs for the skill"** section:
   - Tool name
   - Slug
   - Pattern (Heavy or Lightweight — the brief tells you which)
   - `calculatorId`
3. **Follow the skill's Steps 1–5 exactly.** The brief supplies the calculator-specific content (formulas, inputs, copy, variants) but the skill owns the file layout, design system, ExportShareBar, currency rule, SEO scaffolding, and the build gate.
4. **Plug the brief's content into the skill's slots:**
   - "Implement the component" → use the brief's *Inputs*, *Calculations*, *Outputs*, *Charts* sections.
   - "SEO content (800+ words)" → use the brief's *SEO long-form outline* and *Worked numeric example*.
   - "Page wrapper SEO" → use the brief's *Title / Meta / Keywords / Canonical* block.
   - "Step 4 — Variants" → create the variant files listed in *Variants to create*.
   - "Step 3 — Wire into the site" → register everything the brief lists.
5. **Build gate** (non-negotiable, per CLAUDE.md):
   ```
   tsc --noEmit && npm run build
   ```
   Fix every error before moving on. Don't batch fixes across calculators — finish one, ship one.

---

## Rules that apply to all nine calculators

These are repeated in every brief for redundancy. If they conflict with a brief, **the skill wins**, then this README, then the brief.

### Currency
All nine calculators are **US-specific**. Hardcode `USD`, format with `formatCurrency(value, 'USD')`. **Do not add `CurrencySelector`.** (See the skill's Step 2 currency table.)

### Design
- Slate, not gray. Always.
- Cards: `rounded-2xl shadow-md border border-slate-100`.
- Inputs/buttons: `rounded-lg`, minimum 44px touch height.
- Charts: Recharts only. Use the `CHART_COLORS` constant from the skill.
- Page background: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20`.
- No `any` types.

### SEO (every page)
- `<title>` ≤ 60 chars total (including ` | Toolisk`).
- `<meta name="description">` ≤ 155 chars.
- Explicit `<link rel="canonical" href="https://toolisk.com/finance/[slug]" />`.
- OG: `og:title`, `og:description`, `og:url`, `og:type="website"`. **Do not set `og:image`** — inherited from `_document.tsx`.
- Twitter: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`.
- JSON-LD: `BreadcrumbList` + `SoftwareApplication` (or `WebApplication`).
- No `noindex`, ever.
- 800+ words of unique long-form content below the calculator, including **at least one worked numeric example** (concrete inputs → concrete outputs). The brief provides this.

### Internal linking (critical — prevents "Discovered – not indexed")
- Add page to `/finance` hub grid (`src/pages/finance/index.tsx`).
- Add to footer navigation.
- Add to `<RelatedCalculators>` arrays on **≥ 2 existing calculator pages** in the same intent cluster. The brief tells you which ones.
- Add a `<RelatedCalculators>` block on the new page with 4–6 contextual peers.

### Variants
Each brief lists 3–5 long-tail variants (`/finance/[variant-slug]`). Each variant must:
- Have a unique slug not in `CONCRETE_FINANCE_PAGES`.
- Target a distinct long-tail keyword (use-case, demographic, geo, comparison).
- Have unique long-form content — never paraphrased from a sibling.
- Be imported into `ALL_VARIANTS` in `_registry.ts`.

### Calculation integrity (non-negotiable)
Every formula in the briefs is written out explicitly. **Do not "improve" a formula or change a constant** without checking with the user — the IRS tables, FHA limits, and tax brackets in these briefs are the *correct* sources of truth for the year stated. If a brief says "2026 brackets," use 2026 brackets. If the calculator runs in a year the brackets change, surface that as a config constant at the top of `[ToolName].utils.ts` like:
```ts
// Update these annually when the IRS publishes new figures.
export const TAX_YEAR = 2026 as const;
export const FEDERAL_BRACKETS_SINGLE_2026 = [ ... ];
```
Never let a formula silently round in the middle of a chain — round only on display.

### Validation
- Reject negative/zero inputs where the math requires positives.
- Cap unrealistic inputs (e.g. age 200, rate 50%) with input `max` attributes plus a soft warning, not a crash.
- The calculator should never produce `NaN`, `Infinity`, or `undefined` on screen. Test by entering 0 in every numeric field.

### Build gate
Per `CLAUDE.md`: after any multi-file change run `tsc --noEmit && npm run build` and fix all errors before declaring done.

---

## When a brief is ambiguous

Briefs are written for clarity but cannot cover every edge case. The fallback order is:

1. **Skill** (`.claude/skills/new-calculator/SKILL.md`) — design, file layout, ExportShareBar, schema.
2. **`CLAUDE.md`** — repo-wide rules (slate not gray, build gate, no bulk bash).
3. **This README** — pack-wide rules.
4. **The brief.**
5. **An existing US calculator in `src/components/Finance/`** — look at the most-recently-shipped one for current patterns.

If still unclear, ask the user before writing speculative code.
