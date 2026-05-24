# Internal Linking Action Plan — toolisk.com

> Based on GSC data (90 days: 2026-02-21 to 2026-05-22)
> 10 clicks | 9,212 impressions | 0.11% CTR | avg position 76.1

## Problem Statement

The site is technically well-optimized (all pages indexed, proper schema, meta tags, canonicals, sitemap). The core SEO problem is **low domain authority combined with almost zero internal link juice flow between pages**. The site has 147 tools and 58+ blog articles, but most calculator pages exist as orphans — no cross-links to related tools and no links to/from blog content.

### GSC Evidence

- **Only 2 pages rank on page 1** (homepage at pos 7.6, EMI calculator at pos 4.5)
- **Zero pages in positions 11-30** (the "striking distance" zone)
- **28 pages rank position 50-100** — they exist in Google's index but get no clicks
- **Top opportunity pages by impressions** are buried on pages 7-10:

| Page | Impressions | Position | Clicks |
|------|-------------|----------|--------|
| /finance/sip-calculator | 1,299 | 82.8 | 2 |
| /finance/fire-calculator | 830 | 44.6 | 1 |
| /finance/compound-interest-calculator | 410 | 81.3 | 0 |
| /finance/annuity-payout-calculator | 387 | 88.4 | 0 |
| /finance/daily-compound-interest-calculator | 339 | 84.3 | 0 |
| /finance/amortization-calculator | 290 | 78.7 | 2 |
| /finance/529-college-savings-calculator | 229 | 76.1 | 0 |
| /finance/capital-gains-tax-calculator | 174 | 84.8 | 0 |

### Why Internal Linking Matters Here

Internal links pass PageRank between pages. Right now:
- The homepage (pos 7.6, 4 clicks) has authority but links to tools only through a card grid
- The EMI calculator (pos 4.5, 10.53% CTR) has authority but links to only 4 related tools
- 12 finance calculator pages have **zero** related tool links
- 8 older finance pages use an inline pattern that doesn't support blog article links
- Blog articles link TO tools, but tools **never link back** to blog articles

This means authority bleeds out to tools via the homepage and hub pages, but tools don't redistribute that authority among themselves or back to the blog. The result: every tool page is an island.

---

## Current Architecture Summary

### Two Component Patterns for Related Tools

**Pattern A: `ToolSEOContent` component** (newer, preferred)
- Supports `relatedTools: Array<{ name, href, icon }>` — displayed as cards
- Supports `relatedArticles: Array<{ title, href }>` — displayed as blog links
- Used by: 401k, Roth vs Traditional IRA, auto loan, student loan, investment, rental ROI, net worth, inflation, sales tax, tip, HSA, RMD, annuity, roth conversion, 529 college savings, capital gains tax, reverse mortgage, HELOC, mortgage refinance breakeven, credit card payoff, US paycheck, house affordability, salary hike, FD, RD, discount, social security

**Pattern B: Inline "Related Finance Tools" section** (older, inferior)
- Hand-coded `<Link>` elements inside a `<section>`
- No `relatedArticles` support
- Used by: EMI, SIP, compound interest, FIRE, mortgage, amortization, buy-vs-rent, income tax

### Pages With NO Related Tools At All (12 pages)

These are the biggest gaps — they have zero internal links beyond header/footer:

1. `annuity-calculator.tsx` — 143 impressions, pos 84.8
2. `capital-gains-tax-calculator.tsx` — 174 impressions, pos 84.8
3. `credit-card-payoff-calculator.tsx`
4. `529-college-savings-calculator.tsx` — 229 impressions, pos 76.1
5. `heloc-calculator.tsx`
6. `hsa-calculator.tsx`
7. `mortgage-refinance-breakeven-calculator.tsx`
8. `reverse-mortgage-calculator.tsx`
9. `rmd-calculator.tsx` — 62 impressions, pos 81.7
10. `roth-conversion-calculator.tsx`
11. `us-paycheck-calculator.tsx`
12. `amortization-calculator.tsx` — 290 impressions, pos 78.7

Note: Some of these (annuity, 529, capital gains, HELOC, roth conversion, reverse mortgage, mortgage refinance breakeven) already use `ToolSEOContent` but with the `relatedTools` prop omitted or empty. Others (amortization, credit card payoff, HSA, RMD, US paycheck) don't use `ToolSEOContent` at all.

---

## Action Items

### Priority 1: Add `relatedTools` and `relatedArticles` to the 12 Orphan Pages

These pages have zero internal links. Adding related tools and articles is the single highest-impact change.

#### 1.1 Pages already using `ToolSEOContent` (just need props added)

**`annuity-calculator.tsx`** (143 imp, pos 84.8)
```tsx
relatedTools={[
  { name: 'RMD Calculator', href: '/finance/rmd-calculator', icon: '📋' },
  { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏦' },
  { name: 'Roth Conversion Calculator', href: '/finance/roth-conversion-calculator', icon: '🔄' },
]}
relatedArticles={[
  { title: 'Retirement Savings Age Milestones', href: '/finance/learn/retirement-savings-age-milestones' },
]}
```

**`capital-gains-tax-calculator.tsx`** (174 imp, pos 84.8)
```tsx
relatedTools={[
  { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '🧾' },
  { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator', icon: '💵' },
  { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
]}
relatedArticles={[
  { title: 'Tax-Loss Harvesting Explained', href: '/finance/learn/tax-loss-harvesting-explained' },
  { title: 'Capital Gains Tax Strategies', href: '/finance/learn/capital-gains-tax-strategies' },
]}
```

**`529-college-savings-calculator.tsx`** (229 imp, pos 76.1)
```tsx
relatedTools={[
  { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
  { name: 'Inflation Calculator', href: '/finance/inflation-calculator', icon: '📉' },
  { name: 'Roth vs Traditional IRA', href: '/finance/roth-vs-traditional-ira', icon: '⚖️' },
]}
relatedArticles={[
  { title: 'Inflation-Proof Investing Guide', href: '/finance/learn/inflation-proof-investing-guide' },
]}
```

**`heloc-calculator.tsx`**
```tsx
relatedTools={[
  { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
  { name: 'Mortgage Refinance Calculator', href: '/finance/mortgage-refinance-breakeven-calculator', icon: '📊' },
  { name: 'House Affordability Calculator', href: '/finance/house-affordability-calculator', icon: '🏡' },
]}
relatedArticles={[
  { title: 'When Mortgage Refinance Is Worth It', href: '/finance/learn/when-mortgage-refinance-is-worth-it' },
]}
```

**`reverse-mortgage-calculator.tsx`**
```tsx
relatedTools={[
  { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
  { name: 'HELOC Calculator', href: '/finance/heloc-calculator', icon: '💳' },
  { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏦' },
]}
relatedArticles={[
  { title: 'Retirement Savings Age Milestones', href: '/finance/learn/retirement-savings-age-milestones' },
]}
```

**`mortgage-refinance-breakeven-calculator.tsx`**
```tsx
relatedTools={[
  { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
  { name: 'HELOC Calculator', href: '/finance/heloc-calculator', icon: '💳' },
  { name: 'Buy vs Rent Calculator', href: '/finance/buy-vs-rent-calculator', icon: '🏘️' },
]}
relatedArticles={[
  { title: 'When Mortgage Refinance Is Worth It', href: '/finance/learn/when-mortgage-refinance-is-worth-it' },
  { title: 'Mortgage Refinance Break-Even', href: '/finance/learn/mortgage-refinance-break-even' },
]}
```

**`roth-conversion-calculator.tsx`**
```tsx
relatedTools={[
  { name: 'Roth vs Traditional IRA', href: '/finance/roth-vs-traditional-ira', icon: '⚖️' },
  { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
  { name: 'RMD Calculator', href: '/finance/rmd-calculator', icon: '📋' },
]}
relatedArticles={[
  { title: 'Backdoor Roth Strategy', href: '/finance/learn/backdoor-roth-strategy' },
  { title: 'Roth vs Traditional IRA', href: '/finance/learn/roth-vs-traditional-ira' },
]}
```

**`credit-card-payoff-calculator.tsx`**
```tsx
relatedTools={[
  { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '💳' },
  { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator', icon: '📈' },
  { name: 'Net Worth Calculator', href: '/finance/net-worth-calculator', icon: '💰' },
]}
relatedArticles={[
  { title: 'Credit Card Snowball vs Avalanche', href: '/finance/learn/credit-card-snowball-vs-avalanche' },
  { title: 'Debt Snowball vs Avalanche', href: '/finance/learn/debt-snowball-vs-avalanche' },
]}
```

#### 1.2 Pages NOT using `ToolSEOContent` (need component migration + props)

These pages use the old inline "Related Finance Tools" section or have nothing at all:

**`amortization-calculator.tsx`** (290 imp, pos 78.7) — has inline related tools, no articles
- Migrate to `ToolSEOContent`
- Add `relatedArticles` pointing to `/finance/learn/amortization-explained-why-interest-heavy-early`

**`hsa-calculator.tsx`** — no related tools
- Migrate to `ToolSEOContent`
- Add relatedTools: 401k, Roth vs Traditional IRA, Roth Conversion
- Add `relatedArticles`: `/finance/learn/hsa-triple-tax-advantage`, `/finance/learn/hdhp-vs-ppo-comparison`

**`rmd-calculator.tsx`** (62 imp, pos 81.7) — no related tools
- Migrate to `ToolSEOContent`
- Add relatedTools: 401k, Roth Conversion, Social Security, Roth vs Traditional IRA
- Add `relatedArticles`: `/finance/learn/retirement-savings-age-milestones`

**`us-paycheck-calculator.tsx`** — no related tools
- Migrate to `ToolSEOContent`
- Add relatedTools: Income Tax, 401k, HSA
- Add `relatedArticles`: `/finance/learn/us-tax-brackets-deductions-take-home-pay`, `/finance/learn/gross-pay-vs-net-pay`

### Priority 2: Add `relatedArticles` to the 8 Older Finance Pages

These pages use the inline "Related Finance Tools" pattern and have NO blog article links. They need `ToolSEOContent` migration to gain `relatedArticles` support.

| Page | Blog Article to Link |
|------|---------------------|
| `/finance/emi-calculator` | `/finance/learn/understanding-emi-calculations`, `/finance/learn/reduce-emi-vs-reduce-tenure` |
| `/finance/sip-calculator` (1,299 imp!) | `/finance/learn/step-up-sip-vs-flat-sip` |
| `/finance/compound-interest-calculator` (410 imp) | `/finance/learn/understanding-compound-interest` |
| `/finance/fire-calculator` (830 imp) | `/finance/learn/fire-movement-explained`, `/finance/learn/how-to-calculate-fire-number` |
| `/finance/mortgage-calculator` | `/finance/learn/mortgage-basics-finding-the-best-deal` |
| `/finance/amortization-calculator` | `/finance/learn/amortization-explained-why-interest-heavy-early` |
| `/finance/buy-vs-rent-calculator` | `/finance/learn/buy-vs-rent-decision-framework` |
| `/finance/income-tax-calculator` | `/finance/learn/us-tax-brackets-deductions-take-home-pay` |

**Migration approach**: Replace the inline `<section>` with the `<ToolSEOContent>` component, preserving all existing content. The `description`, `features`, `steps`, `faqs`, and `body` props should capture the existing page content, and the `relatedTools` + `relatedArticles` should include the current links plus the new article links.

### Priority 3: Cross-Link Calculator Variant Families

The variant system ([variant].tsx) already auto-links variants within the same calculator family. Add cross-family links in each variant's `relatedTools` to connect semantically adjacent families:

**Retirement cluster** (401k ↔ Roth IRA ↔ Roth Conversion ↔ RMD ↔ Social Security ↔ FIRE)
- All 6 retirement calculators should appear in each other's `relatedTools`
- All 6 retirement calculators' variants should cross-reference each other

**Home buying cluster** (Mortgage ↔ HELOC ↔ Refinance Breakeven ↔ House Affordability ↔ Buy vs Rent ↔ Reverse Mortgage)
- All 6 home calculators should link to each other

**Loan/EMI cluster** (EMI ↔ Auto Loan ↔ Student Loan ↔ Credit Card Payoff ↔ Personal Loan variants)
- All 5 loan calculators should link to each other

**Investment cluster** (SIP ↔ Compound Interest ↔ Investment ↔ Net Worth ↔ Inflation)
- All 5 investment calculators should link to each other

**Tax cluster** (Income Tax ↔ US Paycheck ↔ Capital Gains Tax ↔ Sales Tax/VAT/GST)
- All 4 tax calculators should link to each other

#### Specific variant file changes

In `src/content/finance-variants/`, each variant JSON can specify `relatedTools`. Add cross-family links:

**EMI variants** (`home-loan-emi`, `personal-loan-emi`, `car-loan-emi`, etc.):
- Add: `{ name: 'Credit Card Payoff', href: '/finance/credit-card-payoff-calculator', icon: '💳' }`

**Mortgage variants** (`15-vs-30-year`, `mortgage-payoff`, `biweekly-mortgage-payment`, etc.):
- Add: `{ name: 'House Affordability', href: '/finance/house-affordability-calculator', icon: '🏡' }`
- Add: `{ name: 'Buy vs Rent', href: '/finance/buy-vs-rent-calculator', icon: '🏘️' }`

**FIRE variants** (`financial-independence-retire-early`, `fire-number`, `coast-fire`, etc.):
- Add: `{ name: 'Social Security', href: '/finance/social-security-calculator', icon: '🏦' }`
- Add: `{ name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🇺🇸' }`

**Annuity variants** (`immediate`, `deferred`, `payout`, etc.):
- Add: `{ name: 'RMD Calculator', href: '/finance/rmd-calculator', icon: '📋' }`

### Priority 4: Blog-to-Tool Reciprocal Links

Every blog article already has `relatedTools` pointing to calculators. The missing piece is calculators pointing back to blog articles. This is solved by P1 and P2 above (adding `relatedArticles` to every finance calculator page).

### Priority 5: Add Cross-Section Links on Section Hub Pages

The `/finance` hub page has excellent "Popular calculator shortcuts" section. The `/tools` and `/utilities` hub pages are missing equivalent editorial content linking to their high-value tools. However, this is lower priority since these sections have minimal GSC impressions.

---

## Implementation Notes

### Component: `ToolSEOContent`

Location: `src/components/Tools/ToolSEOContent.tsx`

Props:
```tsx
interface ToolSEOContentProps {
  description: string;
  features: string[];
  steps: HowToStep[];       // { title: string; desc: string }
  faqs: FaqItem[];          // { q: string; a: string }
  body?: React.ReactNode;
  relatedTools?: Array<{ name: string; href: string; icon: string }>;
  relatedArticles?: Array<{ title: string; href: string }>;
}
```

### Migration Pattern (Pattern B → Pattern A)

For pages currently using inline "Related Finance Tools" sections:

1. Import `ToolSEOContent` from `../../components/Tools/ToolSEOContent`
2. Move the page's existing SEO content (about text, features, how-to steps, FAQs) into `ToolSEOContent` props
3. Replace the inline `<section>` with `<ToolSEOContent ... />`
4. Add `relatedArticles` with links to relevant blog articles
5. Keep existing `relatedTools` but add any missing cross-family links

**Example:** SIP calculator currently has:
```tsx
<section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <h2 className="...">Related Finance Tools</h2>
  <div className="grid sm:grid-cols-2 gap-4">
    {[
      { href: '/finance/compound-interest-calculator', title: 'Compound Interest Calculator', desc: '...' },
      { href: '/finance/fire-calculator', ... },
      { href: '/finance/income-tax-calculator', ... },
      { href: '/finance/amortization-calculator', ... },
    ].map(...)}
  </div>
</section>
```

Should become:
```tsx
<ToolSEOContent
  description="..."
  features={[...]}
  steps={[...]}
  faqs={[...]}
  relatedTools={[
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator', icon: '📈' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
    { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '🧾' },
    { name: 'Amortization Calculator', href: '/finance/amortization-calculator', icon: '📋' },
  ]}
  relatedArticles={[
    { title: 'Step-Up SIP vs Flat SIP', href: '/finance/learn/step-up-sip-vs-flat-sip' },
    { title: 'Understanding EMI Calculations', href: '/finance/learn/understanding-emi-calculations' },
  ]}
/>
```

### Existing Blog Articles for Reference

These are the 59 finance blog articles in `src/content/blog/inance/` that should be linked from calculator pages:

| Topic Cluster | Blog Articles |
|---|---|
| **EMI/Loans** | `understanding-emi-calculations`, `reduce-emi-vs-reduce-tenure`, `how-much-emi-is-safe`, `home-loan-prepayment-strategy`, `prepayment-strategies-guide`, `personal-loan-vs-alternatives` |
| **SIP/Investing** | `step-up-sip-vs-flat-sip`, `dollar-cost-averaging-vs-lump-sum`, `dividend-investing-guide`, `index-funds-vs-mutual-funds-vs-etfs` |
| **Compound Interest** | `understanding-compound-interest`, `apr-vs-apy-explained` |
| **FIRE/Retirement** | `fire-movement-explained`, `how-to-calculate-fire-number`, `coast-fire-strategy`, `four-percent-rule-explained`, `fire-number-by-age`, `sequence-of-returns-risk`, `retirement-savings-age-milestones` |
| **401k/IRA** | `401k-employer-match-strategy`, `roth-vs-traditional-ira`, `backdoor-roth-strategy`, `mega-backdoor-roth`, `sep-ira-vs-solo-401k` |
| **Mortgage/Home** | `mortgage-basics-finding-the-best-deal`, `extra-mortgage-payments-vs-investing`, `mortgage-refinance-break-even`, `when-mortgage-refinance-is-worth-it`, `buy-vs-rent-decision-framework` |
| **Tax** | `capital-gains-tax-strategies`, `tax-loss-harvesting-explained`, `us-tax-brackets-deductions-take-home-pay`, `vat-gst-sales-tax-explained` |
| **HSA** | `hsa-triple-tax-advantage`, `hdhp-vs-ppo-comparison` |
| **Social Security** | `social-security-62-vs-67-vs-70`, `social-security-optimization` |
| **Net Worth/Budget** | `net-worth-by-age-benchmarks`, `budget-frameworks-50-30-20`, `credit-score-fundamentals` |
| **Inflation** | `inflation-protect-savings`, `inflation-proof-investing-guide` |
| **Credit Cards/Debt** | `credit-card-snowball-vs-avalanche`, `debt-snowball-vs-avalanche` |
| **Other** | `bond-basics-fixed-income`, `cd-ladders-vs-treasury-bills`, `high-yield-savings-vs-money-market`, `real-estate-investment-vs-stock-market`, `rental-property-cap-rate-guide`, `estate-planning-basics`, `emergency-fund-essentials`, `asset-allocation-by-age`, `gross-pay-vs-net-pay`, `recession-investing-strategy`, `student-loan-refinance-decision`, `auto-loan-vs-cash-decision` |

---

## Checklist

### P1: Add missing relatedTools/relatedArticles (12 pages)

- [ ] `src/pages/finance/annuity-calculator.tsx` — add relatedTools + relatedArticles
- [ ] `src/pages/finance/capital-gains-tax-calculator.tsx` — add relatedTools + relatedArticles
- [ ] `src/pages/finance/529-college-savings-calculator.tsx` — add relatedTools + relatedArticles
- [ ] `src/pages/finance/heloc-calculator.tsx` — add relatedTools + relatedArticles
- [ ] `src/pages/finance/reverse-mortgage-calculator.tsx` — add relatedTools + relatedArticles
- [ ] `src/pages/finance/mortgage-refinance-breakeven-calculator.tsx` — add relatedTools + relatedArticles
- [ ] `src/pages/finance/roth-conversion-calculator.tsx` — add relatedTools + relatedArticles
- [ ] `src/pages/finance/credit-card-payoff-calculator.tsx` — add relatedTools + relatedArticles
- [ ] `src/pages/finance/amortization-calculator.tsx` — migrate to ToolSEOContent, add relatedArticles
- [ ] `src/pages/finance/hsa-calculator.tsx` — migrate to ToolSEOContent, add relatedTools + relatedArticles
- [ ] `src/pages/finance/rmd-calculator.tsx` — migrate to ToolSEOContent, add relatedTools + relatedArticles
- [ ] `src/pages/finance/us-paycheck-calculator.tsx` — migrate to ToolSEOContent, add relatedTools + relatedArticles

### P2: Migrate 8 older pages to ToolSEOContent + add relatedArticles

- [ ] `src/pages/finance/emi-calculator.tsx` — migrate, add article links
- [ ] `src/pages/finance/sip-calculator.tsx` — migrate, add article links (HIGHEST PRIORITY: 1,299 impressions)
- [ ] `src/pages/finance/compound-interest-calculator.tsx` — migrate, add article links (410 impressions)
- [ ] `src/pages/finance/fire-calculator.tsx` — migrate, add article links (830 impressions)
- [ ] `src/pages/finance/mortgage-calculator.tsx` — migrate, add article links
- [ ] `src/pages/finance/buy-vs-rent-calculator.tsx` — migrate, add article links
- [ ] `src/pages/finance/income-tax-calculator.tsx` — migrate, add article links
- [ ] (amortization covered in P1)

### P3: Cross-link variant families

- [ ] Add cross-family `relatedTools` to retirement cluster variants (401k, Roth IRA, Roth Conversion, RMD, Social Security, FIRE)
- [ ] Add cross-family `relatedTools` to home buying cluster variants (Mortgage, HELOC, Refinance, Buy vs Rent, House Affordability, Reverse Mortgage)
- [ ] Add cross-family `relatedTools` to loan/EMI cluster variants
- [ ] Add cross-family `relatedTools` to investment cluster variants (SIP, Compound Interest, Investment, Net Worth, Inflation)
- [ ] Add cross-family `relatedTools` to tax cluster variants (Income Tax, US Paycheck, Capital Gains, Sales Tax)

### P4: Build gate

- [ ] Run `tsc --noEmit && npm run build` after all changes
- [ ] Verify no broken links by checking all `href` values resolve to valid pages