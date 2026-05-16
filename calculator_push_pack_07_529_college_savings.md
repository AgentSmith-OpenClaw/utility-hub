# 07 — 529 College Savings Calculator

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

| Prompt | Answer |
|---|---|
| Tool name | `529 College Savings Calculator` |
| Slug | `529-college-savings-calculator` |
| Pattern | **Heavy** |
| calculatorId | `college-savings-529` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

Projects 529 plan balance to college start, inflates current college costs to that future year, computes the funding gap or surplus over a 4-year college horizon, and recommends a monthly contribution to fully fund the goal.

## Background a developer must understand before coding

- A 529 is a tax-advantaged savings plan: contributions are after-tax federally (no federal deduction) but **growth is tax-free** and **withdrawals for qualified education expenses are tax-free**. Many states offer a deduction or credit for contributions to that state's plan.
- College cost inflation historically runs **5–6% annually** — well above general CPI. Default this calculator's cost inflation to **5%**.
- "Cost of college today" depends heavily on public-in-state vs public-out-of-state vs private. Default to a sensible mid-range and let the user adjust.
- Years to college = max(0, 18 − child age) if user enters child age, else user enters years directly.

---

## Inputs

Group into three cards: **"Your Child"**, **"Savings Plan"**, **"College Costs"**.

### Your Child
- Child's age today (default `5`, min `0`, max `17`)
  - Internally: `yearsUntilCollege = max(0, 18 - childAge)`
- Years of college (default `4`, min `1`, max `8` for grad-school overshoot)

### Savings Plan
- Current 529 balance (`USD`, default `$8,000`)
- Monthly contribution (`USD`, default `$300`)
- Expected annual investment return (%, default `6.0`) — note in tooltip that age-based 529 portfolios derisk as the child approaches college; a flat 6% is a simplification.
- State tax deduction rate (%, default `0`) — user can input 0–10%; tooltip explains state plans.
- Annual state-tax-deductible contribution cap (`USD`, default `0` = no cap)

### College Costs
- Current annual cost of college (`USD`, default `$30,000`) — single value covering tuition + room/board.
- College cost inflation rate (%, default `5.0`)

---

## Pristine calculations

### 1. Future value of savings at college start
Convert annual return to monthly: `i = (1 + r/100)^(1/12) - 1`. Use future value of present sum + future value of monthly annuity (end-of-month contributions).
```
n_months   = yearsUntilCollege × 12
fvLump     = currentBalance × (1 + i)^n_months
fvContrib  = monthlyContribution × ((1 + i)^n_months - 1) / i
fvAtStart  = fvLump + fvContrib
```
**If `i === 0`:** `fvContrib = monthlyContribution × n_months`.

### 2. Total college cost (inflated)
Compute the cost for **each** year of college, then sum. Because the child enters college in year `yearsUntilCollege`, year-1 cost is inflated by that many years; year-2 by one more; and so on.
```
totalCost = 0
yearlyCosts = []
for (k = 0; k < yearsOfCollege; k++) {
  costYearK = currentAnnualCost × (1 + costInflation/100)^(yearsUntilCollege + k)
  yearlyCosts.push(costYearK)
  totalCost += costYearK
}
```

### 3. Withdrawal phase (while still in college, balance keeps earning)
Simulate paying each year's cost at the start of that year and letting the rest grow:
```
balance = fvAtStart
remainingByYear = []
for (k = 0; k < yearsOfCollege; k++) {
  balance -= yearlyCosts[k]                 // withdrawal at start of year
  balance *= (1 + r/100)                    // grow for a year
  remainingByYear.push(balance)
}
fundingShortfall = balance < 0 ? -balance : 0   // positive shortfall vs negative leftover
```
Track if balance goes negative mid-college — surface a warning with the year it runs out.

### 4. Recommended monthly contribution to fully fund
Solve for `PMT` such that `fvAtStart` exactly equals the present value of the inflated tuition schedule. The simplest approach is **binary search** over PMT (0 → some high cap) because of the multi-year withdrawal compounding — analytic closed form gets ugly when withdrawals occur during a still-earning balance. Use binary search with 1e-2 tolerance.

Document this in code with a comment:
```ts
// Closed-form-of-PMT for staggered withdrawals during continued accrual is messy.
// Binary search over [0, 10000] $/month is fast (<30 iterations to penny tolerance) and
// keeps the formula readable for future maintainers.
```

### 5. State tax savings (if applicable)
```
annualContribution = monthlyContribution × 12
deductibleAmount   = stateCap > 0 ? min(annualContribution, stateCap) : annualContribution
annualStateSavings = deductibleAmount × (stateRate / 100)
lifetimeStateSavings = annualStateSavings × yearsUntilCollege
```

---

## Outputs

1. **Headline:** Projected balance at college start vs Total college cost — and the gap (or surplus).
2. **Recommended monthly contribution** to fully fund the goal.
3. **State tax savings card** (year-1 and lifetime).
4. **Yearly schedule table:** for each college year, show projected cost, withdrawal, ending balance.

## Charts

1. **Growth-then-drawdown line chart** — single series: balance from today through end of college. Shows the saving rise, then the college drawdown.
2. **Cost-inflation bar chart** — current cost vs each future-year cost.
3. **Contribution vs growth stacked bar** at college start: $ contributed by you vs growth.

---

## Page wrapper SEO

```
<title>            529 College Savings Calculator | Toolisk                     (~46 chars)
<meta description> Project 529 plan growth, inflate future college costs, and see the monthly savings needed to fully fund tuition. Free. (≤155)
<meta keywords>    529 calculator, college savings calculator, 529 plan growth, college cost calculator, tuition savings, 529 contribution calculator
<link canonical>   https://toolisk.com/finance/529-college-savings-calculator
<og:title>         529 College Savings Calculator
<og:description>   Plan your 529 contributions against inflated future college costs.
<og:type>          website
<twitter:card>     summary_large_image
JSON-LD            BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words)

**Section 1 — What a 529 plan is and how it differs from other college savings vehicles (≈ 250 words).** Define 529, the federal tax-free-growth benefit, state tax deductions, the 2024 SECURE 2.0 rollover-to-Roth-IRA option ($35,000 lifetime cap, 15-year-old account, subject to annual IRA limits — mention only briefly).

**Section 2 — How this calculator models savings, withdrawals, and inflation (≈ 250 words).** Explain monthly compounding during accumulation, the front-loaded withdrawal during college, and why a 5% inflation assumption is realistic (historical College Board data). Note the simplification of a flat return rate vs age-based glide paths.

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).**

> **Example.** A child is 5 years old; college begins in 13 years and lasts 4. Current balance $8,000, monthly contribution $300, expected return 6%. Future value at college start ≈ **$95,400** (FV of $8,000 lump + FV of $300/month annuity at monthly rate 0.487%). If today's college costs $30,000/year, inflating at 5%, year-1 of college costs ≈ **$56,400**, year-4 costs ≈ **$65,300**. Four-year total ≈ **$236,000**. The $95,400 balance is exhausted partway through year-2, leaving a funding shortfall of roughly **$140,000**. To fully fund, the binary-search routine recommends a monthly contribution of about **$840** instead of $300.

**Section 4 — FAQs (≈ 200 words).**
- Q: Which state's 529 plan should I pick?
- Q: What if my child doesn't go to college?
- Q: Are K-12 tuition payments qualified 529 expenses?
- Q: How does the 529-to-Roth IRA rollover work?

---

## Variants to create

| Variant slug | Target keyword | Hook |
|---|---|---|
| `college-savings-calculator` | "college savings calculator" | Generic, broadest funnel |
| `how-much-to-save-for-college` | "how much to save for college" | Question-keyword variant |
| `529-vs-utma-calculator` | "529 vs utma" | Tax-treatment comparator |
| `college-tuition-inflation-calculator` | "college tuition inflation calculator" | Inflation-focused mini-tool |

---

## Wiring

- Register `'college-savings-529'` in `_types.ts`.
- Add to `_calculators.ts`.
- Add slug to `CONCRETE_FINANCE_PAGES`.
- Add tile to `/finance` hub.
- Add to footer.
- **Inbound links (≥ 2):** Compound Interest Calculator and Savings Goal Calculator (or closest equivalents).
- **Outbound links (4–6):** Compound Interest Calculator, Savings Goal Calculator, Student Loan Calculator (if exists), HSA Calculator (built in 05), Roth IRA Calculator.
- Import all 4 variants into `ALL_VARIANTS`.

---

## Final checklist

- [ ] Binary-search PMT solver converges (terminate after 60 iterations max as a safety net).
- [ ] College-year cost inflation indexes correctly off `yearsUntilCollege + k`.
- [ ] Balance-runs-out-mid-college warning fires when it should.
- [ ] State tax savings hidden if state rate is 0; visible otherwise.
- [ ] No `CurrencySelector` (USD only).
- [ ] All 4 variants registered.
- [ ] `tsc --noEmit && npm run build` passes.
