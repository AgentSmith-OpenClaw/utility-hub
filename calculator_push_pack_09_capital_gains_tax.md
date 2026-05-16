# 09 — Capital Gains Tax Calculator (US)

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

| Prompt | Answer |
|---|---|
| Tool name | `Capital Gains Tax Calculator` |
| Slug | `capital-gains-tax-calculator` |
| Pattern | **Heavy** |
| calculatorId | `capital-gains-tax-us` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

For a single US asset sale (stocks, real estate, crypto, collectibles), computes federal short-term or long-term capital gains tax, the Net Investment Income Tax (NIIT), and a flat-rate state tax estimate — producing the net proceeds and the effective tax rate on the gain.

## Background a developer must understand before coding

- **Short-term gain** = held ≤ 365 days. Taxed at ordinary federal income rates (stacked onto other income).
- **Long-term gain** = held > 365 days. Taxed at 0% / 15% / 20% based on income thresholds.
- **NIIT** = 3.8% on the lesser of (net investment income) or (MAGI above the threshold). Thresholds: **$200,000 single, $250,000 MFJ, $125,000 MFS**.
- **State tax** varies enormously: states like FL/TX/WA/NV/NH/TN/SD/AK/WY have no income tax; CA taxes at ordinary rates up to 13.3%. Use a single user-supplied flat rate; provide a quick state-preset dropdown if time permits.
- **Special asset categories:**
  - **Collectibles** (gold, art, coins): long-term taxed up to 28%, not 0/15/20.
  - **Section 1250 real estate depreciation recapture**: up to 25%.
  - **Qualified Small Business Stock (QSBS)**: potentially excludable.
  - For MVP: handle vanilla stocks/ETFs/crypto/real estate. Add a notice when "asset type" = collectibles or QSBS to inform the user the calculator's not modeling those edge cases.

---

## Inputs

Group into three cards: **"The Sale"**, **"Your Tax Picture"**, **"State"**.

### The Sale
- Asset type: `Stocks / ETFs / mutual funds` | `Cryptocurrency` | `Real estate (non-primary)` | `Primary residence` | `Collectibles (limited model)` (default Stocks)
- Purchase price / cost basis (`USD`, default `$10,000`)
- Sale price (`USD`, default `$25,000`)
- Selling fees / commissions (`USD`, default `$50`)
- Improvements (real estate only — adds to basis, default `$0`)
- Purchase date (date picker, default 2 years ago)
- Sale date (date picker, default today)
- Auto-compute holding period; display "Short-term" or "Long-term" badge.
- If `Primary residence`: show Section 121 exclusion toggle ("Lived in 2 of last 5 years?") and filing-status-dependent exclusion ($250k single / $500k MFJ).

### Your Tax Picture
- Filing status: `Single` | `Married filing jointly` | `Married filing separately` | `Head of household` (default Single)
- Other ordinary taxable income (`USD`, default `$95,000`)
- Other investment income excluding this sale (`USD`, default `$0`) — used for NIIT.

### State
- State preset dropdown (50 states + DC) — sets default rate; user can override.
- State tax rate (%, default depends on state) — flat-rate approximation.

---

## Pristine calculations

### 1. Constants (2026 tax year — verify before launch)
```ts
// 2026 long-term capital gains brackets (IRS-projected; verify before launch).
export const LTCG_BRACKETS_2026 = {
  single:                  { rate0Up: 48_350, rate15Up: 533_400 },   // 20% above 533,400
  marriedFilingJointly:    { rate0Up: 96_700, rate15Up: 600_050 },
  marriedFilingSeparately: { rate0Up: 48_350, rate15Up: 300_000 },
  headOfHousehold:         { rate0Up: 64_750, rate15Up: 566_700 },
} as const;

export const NIIT_THRESHOLDS = {
  single: 200_000,
  marriedFilingJointly: 250_000,
  marriedFilingSeparately: 125_000,
  headOfHousehold: 200_000,
} as const;

export const NIIT_RATE = 0.038;

// Use the same FEDERAL_BRACKETS_2026 from the Roth Conversion calculator (06) for short-term gains.
// If both calculators ship, extract to src/utils/usTax.ts.
```

### 2. Compute the gain
```
holdingDays  = floor((saleDate - purchaseDate) / 86_400_000)
holdingType  = holdingDays > 365 ? 'long' : 'short'

basis        = purchasePrice + improvements
proceeds     = salePrice - sellingFees
gross_gain   = proceeds - basis
```

### 3. Section 121 exclusion (primary residence only)
```
if (assetType === 'primary-residence' && section121Eligible) {
  exclusion = filingStatus === 'marriedFilingJointly' ? 500_000 : 250_000
  excluded  = min(gross_gain, exclusion)
  taxable_gain = max(0, gross_gain - excluded)
} else {
  taxable_gain = gross_gain
}
```

### 4. Federal tax
**Short-term:**
```
baselineTax     = federalTax(otherOrdinaryIncome, FEDERAL_BRACKETS_2026[filingStatus])
withGainTax     = federalTax(otherOrdinaryIncome + taxable_gain, FEDERAL_BRACKETS_2026[filingStatus])
federalShortTax = withGainTax - baselineTax
federalLongTax  = 0
```

**Long-term:**
```
{ rate0Up, rate15Up } = LTCG_BRACKETS_2026[filingStatus]
ordinaryIncome        = otherOrdinaryIncome

// LTCG stacks on top of ordinary income for the threshold check.
zeroRoom    = max(0, rate0Up  - ordinaryIncome)
fifteenRoom = max(0, rate15Up - ordinaryIncome - zeroRoom)

gainInZeroBracket    = min(taxable_gain, zeroRoom)
remaining            = taxable_gain - gainInZeroBracket
gainIn15Bracket      = min(remaining, fifteenRoom)
gainIn20Bracket      = remaining - gainIn15Bracket

federalLongTax  = gainIn15Bracket * 0.15 + gainIn20Bracket * 0.20
federalShortTax = 0
```

**Collectibles override:** if asset = collectibles, treat as long-term but cap rate at 28% on the gain (`gainAbove15Bracket * 0.28` instead of 15/20 split). Mark this as a simplified model in the UI.

### 5. NIIT
```
magi              = otherOrdinaryIncome + otherInvestmentIncome + taxable_gain
threshold         = NIIT_THRESHOLDS[filingStatus]
investmentIncome  = otherInvestmentIncome + taxable_gain     // net of investment expenses (simplified)
niit              = max(0, min(investmentIncome, magi - threshold)) * NIIT_RATE
```
NIIT applies regardless of short vs long term.

### 6. State tax
```
stateTax = taxable_gain * (stateRate / 100)
```
Flat-rate approximation. Tooltip the simplification.

### 7. Totals
```
totalTax        = federalShortTax + federalLongTax + niit + stateTax
netProceeds     = proceeds - totalTax                        // proceeds already net of fees
effectiveRate   = gross_gain > 0 ? totalTax / gross_gain : 0
```

---

## Outputs

1. **Headline:** Net proceeds, with total tax as the subheadline.
2. **Holding-period badge** (Short-term / Long-term) with the calculated number of days.
3. **Tax breakdown table:** federal short, federal long, NIIT, state — each as a row.
4. **Effective tax rate** on the gain.
5. **For primary residence:** show the exclusion used and the taxable gain after exclusion.

## Charts

1. **Tax-breakdown pie:** Federal short or long, NIIT, state, Net proceeds.
2. **Bracket-fill bar (long-term only):** how much gain falls in 0% / 15% / 20% brackets.
3. **Short-vs-long sensitivity bar chart:** total tax if held a few days longer to cross the 1-year mark. Visualizes the "wait one more day" decision.

---

## Page wrapper SEO

```
<title>            Capital Gains Tax Calculator (US 2026) | Toolisk             (~50 chars)
<meta description> Calculate federal short/long-term capital gains tax, NIIT, and state tax on stock, crypto, or property sales. 2026 brackets. (≤155)
<meta keywords>    capital gains tax calculator, long term capital gains, short term capital gains, niit calculator, crypto tax calculator, stock sale tax
<link canonical>   https://toolisk.com/finance/capital-gains-tax-calculator
<og:title>         Capital Gains Tax Calculator (US)
<og:description>   See federal, NIIT, and state tax on stock, crypto, and real estate sales.
<og:type>          website
<twitter:card>     summary_large_image
JSON-LD            BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words)

**Section 1 — Short-term vs long-term capital gains (≈ 250 words).** Define the 1-year holding-period threshold. Explain the ordinary-income vs preferential-rate distinction. Show 2026 LTCG brackets in a table (0% / 15% / 20% by filing status).

**Section 2 — How NIIT, state tax, and Section 121 affect the bill (≈ 250 words).** Explain NIIT (3.8% on investment income above MAGI thresholds, separate from regular tax). State-tax variability (FL/TX zero, CA up to 13.3%). Section 121 exclusion for primary residences ($250k single / $500k joint).

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).**

> **Example.** A single filer with $95,000 of other ordinary income sells a stock she's held 18 months for $25,000. Cost basis $10,000, $50 commission. Gain = $25,000 − $50 − $10,000 = $14,950. Long-term. Using 2026 single-filer LTCG brackets, the 0% bracket extends to $48,350 of taxable income — but $95,000 of ordinary income already exceeds that, so there's no 0% room. The entire $14,950 falls in the 15% bracket → **federal LTCG tax = $2,242.50**. MAGI ($95,000 + $14,950 = $109,950) is below the $200,000 NIIT threshold, so **NIIT = $0**. At a 5% flat state rate: **state tax = $747.50**. **Total tax = $2,990. Net proceeds = $24,950 − $2,990 = $21,960. Effective rate on the gain = 20.0%.**

**Section 4 — FAQs (≈ 200 words).**
- Q: How is crypto taxed in the US?
- Q: Do I owe tax on a stock I haven't sold?
- Q: How does the wash-sale rule affect my taxes? (note: not modeled here)
- Q: Are capital losses deductible against income?

---

## Variants to create

| Variant slug | Target keyword | Hook |
|---|---|---|
| `long-term-capital-gains-calculator` | "long term capital gains calculator" | LTCG-only UI |
| `short-term-capital-gains-calculator` | "short term capital gains calculator" | STCG-only UI |
| `crypto-capital-gains-calculator` | "crypto capital gains calculator" | Crypto-focused copy, addresses cost basis methods (FIFO/LIFO/HIFO note) |
| `home-sale-capital-gains-calculator` | "home sale capital gains" | Section 121 exclusion front and center |
| `stock-sale-tax-calculator` | "stock sale tax calculator" | Stock-specific copy |

---

## Wiring

- Register `'capital-gains-tax-us'` in `_types.ts`.
- Add to `_calculators.ts`.
- Add slug to `CONCRETE_FINANCE_PAGES`.
- Add tile to `/finance` hub.
- Add to footer.
- **Inbound links (≥ 2):** US Income Tax Calculator and any existing Stock / Crypto Profit calculator.
- **Outbound links (4–6):** US Income Tax Calculator, Roth Conversion Calculator (built in 06), HSA Calculator (built in 05), Stock Profit Calculator (if exists), Crypto Profit Calculator (if exists).
- Import all 5 variants into `ALL_VARIANTS`.

---

## Final checklist

- [ ] Holding-period auto-classified from purchase and sale dates; never let the user override the badge.
- [ ] Long-term tax correctly stacks LTCG on top of ordinary income for the bracket fill.
- [ ] NIIT applies independently of short/long classification.
- [ ] Section 121 exclusion fires only when asset = primary residence AND eligibility toggle is on.
- [ ] State-tax dropdown sets the rate; user can override.
- [ ] Collectibles asset type caps gain at 28% with a clear "simplified model" note.
- [ ] Negative gains (losses): show $0 federal tax, $0 NIIT, $0 state tax, and surface a callout about capital-loss carryforwards (informational only).
- [ ] If `FEDERAL_BRACKETS_2026` is shared with Roth Conversion (06), extract to `src/utils/usTax.ts` after both ship.
- [ ] No `CurrencySelector` (USD only).
- [ ] All 5 variants registered.
- [ ] `tsc --noEmit && npm run build` passes.
- [ ] Disclaimer at the top of long-form content: "Estimates only; consult a CPA for your specific situation."
