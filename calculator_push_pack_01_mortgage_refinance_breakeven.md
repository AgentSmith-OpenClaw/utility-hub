# 01 — Mortgage Refinance Break-Even Calculator

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in the calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

When the skill prompts:

| Prompt | Answer |
|---|---|
| Tool name | `Mortgage Refinance Break-Even Calculator` |
| Slug | `mortgage-refinance-breakeven-calculator` |
| Pattern | **Heavy** |
| calculatorId | `mortgage-refinance-breakeven` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

Given an existing mortgage and a proposed refinance offer, computes the monthly savings, the number of months required to recover closing costs, and the total lifetime interest savings.

## Inputs (UI fields)

Group into **two cards**: "Current Mortgage" and "New (Refinanced) Mortgage".

### Current Mortgage card
- Current loan balance (`USD`, default `$280,000`)
- Current interest rate (annual %, default `6.75`)
- Years remaining on current mortgage (default `27`)

### New Mortgage card
- New interest rate (annual %, default `5.50`)
- New loan term (years, default `30`)
- Closing costs (`USD`, default `$5,500`)
- Closing-cost handling: radio — **"Pay upfront"** | **"Roll into new loan"** (default upfront)
- Years you plan to stay in the home (default `10`) — used for the "Stay-horizon savings" output
- Cash-out amount (`USD`, optional, default `$0`)

All numeric inputs: `min=0`, no `NaN` allowed, recompute on change.

---

## Pristine calculations

Let `monthlyRate(annualPct) = annualPct / 100 / 12`.

### 1. Monthly P&I formula (standard amortization)
```
P  = principal
r  = monthly interest rate
n  = total number of monthly payments
PMT = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
```
**Edge case:** if `r === 0`, `PMT = P / n` (zero-interest loan).

### 2. Current monthly P&I
```
P_current = currentBalance
r_current = monthlyRate(currentRate)
n_current = yearsRemaining × 12
currentMonthlyPI = PMT(P_current, r_current, n_current)
```

### 3. New monthly P&I
```
newPrincipal = currentBalance + cashOut + (closingCosts if "Roll into new loan" else 0)
r_new        = monthlyRate(newRate)
n_new        = newTermYears × 12
newMonthlyPI = PMT(newPrincipal, r_new, n_new)
```

### 4. Monthly savings
```
monthlySavings = currentMonthlyPI - newMonthlyPI
```
If `monthlySavings <= 0`, set break-even = `Infinity` and surface a callout: "This refinance does not lower your monthly payment."

### 5. Break-even (months)
```
upfrontCost = (closingCostHandling === "Pay upfront") ? closingCosts : 0
breakEvenMonths = ceil(upfrontCost / monthlySavings)
breakEvenYears  = breakEvenMonths / 12
```

### 6. Total interest comparison
```
currentTotalInterestRemaining = currentMonthlyPI × n_current - currentBalance
newTotalInterest              = newMonthlyPI     × n_new     - newPrincipal
lifetimeInterestSavings       = currentTotalInterestRemaining - newTotalInterest
```
**Note:** lifetime savings can be *negative* if the new term is longer than the remaining term, even at a lower rate. Display the sign honestly.

### 7. Stay-horizon savings (this is the most important number)
```
monthsInHorizon       = stayYears × 12
totalPaymentsCurrent  = currentMonthlyPI × min(monthsInHorizon, n_current)
totalPaymentsNew      = newMonthlyPI     × min(monthsInHorizon, n_new) + upfrontCost
stayHorizonNetSavings = totalPaymentsCurrent - totalPaymentsNew
```
If `stayHorizonNetSavings > 0`: refinance is worth it given the user's horizon.
If `stayHorizonNetSavings <= 0`: not worth it.

Display this as the **headline result**, not lifetime savings.

---

## Outputs (results card — top of right column)

1. **Headline KPI:** "Net savings if you stay X years" — large $ number, green if positive, rose if negative.
2. **Break-even point:** `X months (Y years)`.
3. **Monthly payment comparison:** current vs new, with the delta.
4. **Lifetime interest:** current remaining vs new total, with delta.

## Charts (Recharts, use `CHART_COLORS`)

1. **Cumulative cost over time** — line chart. X: months 0–360. Two series: cumulative payments under current loan vs cumulative payments under refi (including upfront closing costs at month 0). Crossover point = break-even, mark with a vertical reference line.
2. **Monthly payment side-by-side** — bar chart, two bars (Current, New).
3. **Interest paid breakdown** — stacked bar: Principal vs Interest, one stack per scenario.

Each chart needs a custom tooltip that uses `formatCurrency(value, 'USD')`.

---

## Page wrapper SEO (paste into `src/pages/finance/mortgage-refinance-breakeven-calculator.tsx`)

```
<title>             Mortgage Refinance Break-Even Calculator | Toolisk          (58 chars)
<meta description>  See exactly when a refinance pays off. Compare monthly savings, closing-cost recovery & lifetime interest. Free, instant. (155 chars max)
<meta keywords>     mortgage refinance calculator, refinance break-even, refi calculator, mortgage savings, closing cost recovery, lifetime interest, refinance worth it
<link canonical>    https://toolisk.com/finance/mortgage-refinance-breakeven-calculator
<og:title>          Mortgage Refinance Break-Even Calculator
<og:description>    Calculate the exact month your refinance pays for itself plus total lifetime savings.
<og:type>           website
<twitter:card>      summary_large_image
JSON-LD             BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words, `<article className="prose prose-slate max-w-none">`)

**Section 1 — What this calculator does (≈ 250 words).** Explain the two questions every refi answers: "How long until I recover my closing costs?" and "Will I save money given how long I'll actually stay in this home?" Distinguish from a plain mortgage calculator.

**Section 2 — How break-even is computed (≈ 250 words).** Walk through the formula. Explain why people who plan to move in 3 years should never refinance with $8k closing costs unless monthly savings exceed ~$222. Stress that lower rate ≠ savings if the term resets.

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).** Use these exact numbers:

> **Example.** A homeowner has a $280,000 balance at 6.75% with 27 years remaining (monthly P&I ≈ $1,832). A refinance offer: 5.50% over 30 years, $5,500 closing costs paid upfront. New monthly P&I ≈ $1,590. **Monthly savings = $242. Break-even = ⌈5,500 / 242⌉ = 23 months.** If the homeowner stays 10 years, they save 120 × $242 = $29,040 in payments minus $5,500 closing costs = **$23,540 net savings**. Lifetime interest, however, *rises* by ≈ $46,000 because the term reset added 3 years of compounding — illustrating why the stay-horizon number, not lifetime interest, drives the decision.

**Section 4 — FAQs (≈ 200 words).**
- Q: Should I roll closing costs into the loan?
- Q: Does a "no-closing-cost" refinance ever beat paying upfront?
- Q: How does a cash-out refinance change break-even?
- Q: What rate drop justifies a refinance?

---

## Variants to create (3–5 files in `src/content/finance-variants/`)

Each targets a distinct long-tail keyword. Use unique long-form content per variant.

| Variant slug | Target keyword | Hook |
|---|---|---|
| `should-i-refinance-my-mortgage` | "should i refinance my mortgage" | Decision tool framing; lead with stay-horizon |
| `refinance-savings-calculator` | "refinance savings calculator" | Savings-first framing for lower-funnel users |
| `no-closing-cost-refinance-calculator` | "no closing cost refinance calculator" | Compare lender-paid vs borrower-paid closing costs |
| `cash-out-refinance-calculator` | "cash out refinance calculator" | Adds cash-out modeling, debt-payoff comparison |
| `15-vs-30-year-refinance-calculator` | "15 vs 30 year refinance" | Forces 15-year term scenario, shows lifetime interest tradeoff |

---

## Wiring (Step 3 of the skill)

- Add `'mortgage-refinance-breakeven'` to the `CalculatorId` union in `_types.ts`.
- Add an entry to `_calculators.ts` mapping the id to `/finance/mortgage-refinance-breakeven-calculator`.
- Add the slug to `CONCRETE_FINANCE_PAGES` in `_registry.ts`.
- Add a tile to the `/finance` hub grid (`src/pages/finance/index.tsx`).
- Add to footer navigation.
- **Inbound links (≥ 2):** add this calculator to `<RelatedCalculators>` on:
  - the existing Mortgage Calculator page
  - the existing Mortgage Affordability page (or the closest equivalent that exists)
- **Outbound links (4–6):** in this page's `<RelatedCalculators>`, link to: Mortgage Calculator, Mortgage Amortization Schedule, HELOC Calculator (built next in this pack), Closing Cost Calculator (if exists, otherwise Loan Comparison).
- Import each of the 5 variant files into `ALL_VARIANTS` in `_registry.ts`.

---

## Final checklist

- [ ] Skill `/new-calculator` was actually invoked — file layout matches Heavy pattern.
- [ ] No `CurrencySelector` (USD only).
- [ ] `ExportShareBar` is the first child; PDF and Excel exports both work.
- [ ] All three charts render with `CHART_COLORS`; tooltips format USD correctly.
- [ ] Break-even returns `Infinity` (not `NaN`) when monthly savings ≤ 0, and the UI shows a clear callout.
- [ ] All 5 variants created and registered.
- [ ] Two inbound links added on existing pages.
- [ ] `tsc --noEmit && npm run build` passes.
- [ ] Tested at 375px, 768px, 1024px widths.
- [ ] Entering 0 in every field never produces `NaN` or `Infinity` on screen.
