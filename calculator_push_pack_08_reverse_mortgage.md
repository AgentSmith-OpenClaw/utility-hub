# 08 — Reverse Mortgage Calculator (HECM)

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

| Prompt | Answer |
|---|---|
| Tool name | `Reverse Mortgage Calculator` |
| Slug | `reverse-mortgage-calculator` |
| Pattern | **Heavy** |
| calculatorId | `reverse-mortgage` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

Estimates the **Home Equity Conversion Mortgage (HECM)** principal limit available to a senior borrower (62+), subtracts upfront mortgage insurance, origination, and the existing mortgage payoff, and shows the net funds available across the four HECM payout options: lump sum, line of credit, term payments, and tenure (lifetime) payments.

## Background a developer must understand before coding

- HECM is the FHA-insured reverse mortgage product administered by HUD. **This calculator only models HECM**, not proprietary "jumbo" reverse mortgages.
- **Eligibility:** youngest borrower must be **62 or older**, the home must be the primary residence, the borrower must occupy the home, and any existing mortgage must be paid off (using HECM proceeds, typically).
- **Core formula:** `Initial Principal Limit = MaxClaimAmount × Principal Limit Factor (PLF)`.
- **MaxClaimAmount = min(homeValue, FHA HECM lending limit)**. The 2026 HECM limit is **$1,209,750**.
- **PLF** is determined by HUD tables, indexed by (age of youngest borrower, expected interest rate). The PLF rises with age and falls with rate. At 62 and a 6% expected rate, PLF is roughly **0.41**. At 75, around **0.50**. At 85, around **0.62**. **These are real numbers, not exact** — see implementation note below.
- **Upfront costs subtracted from the principal limit:**
  - Initial Mortgage Insurance Premium (IMIP) = **2.00% of MaxClaimAmount**
  - Origination fee: greater of $2,500 or (2% of first $200k + 1% of next $200k of home value), capped at $6,000
  - Other closing costs (appraisal, title, etc.): user input, default $2,500
- **Existing mortgage** must be paid off at closing, reducing what's left for the borrower.

> **Implementation note on PLF.** A faithful HECM calculator uses HUD's published PLF table (a 2D matrix: age × expected rate, with rate rounding rules). Embedding the full table in TypeScript is a 200+ row dataset. For a launch-quality MVP, **use the published HUD PLF table; do not interpolate or approximate**. If the table cannot be sourced in this build, ship the calculator with an explicit `expected rate = 6.0%` cap (constant) and a **single age-indexed PLF lookup** for that one rate; surface a banner: "Estimate at current published 6.0% expected rate; your actual lender quote will use a rate that may differ."

---

## Inputs

Group into three cards: **"Your Home & Existing Mortgage"**, **"Borrower"**, **"Payout Choice"**.

### Your Home & Existing Mortgage
- Home value (`USD`, default `$525,000`)
- Existing mortgage balance to be paid off (`USD`, default `$60,000`)
- Other closing costs (`USD`, default `$2,500`)

### Borrower
- Age of youngest borrower (default `70`, min `62`, max `99`)
- Co-borrower spouse age (optional, must also be 62+) — youngest of the two drives PLF
- Expected interest rate (%, default `6.00`) — explained in tooltip

### Payout Choice
Radio: `Lump sum` | `Line of credit` | `Term (specify years)` | `Tenure (lifetime monthly)` (default `Tenure`)
- If `Term`: input "Number of years" (default `10`, min `1`, max `30`)

---

## Pristine calculations

### 1. Constants
```ts
export const HECM_LENDING_LIMIT_2026 = 1_209_750;
export const HECM_MIN_AGE = 62;
export const IMIP_RATE = 0.02;          // 2.0% of max claim
export const ORIGINATION_CAP = 6_000;
export const ORIGINATION_FLOOR = 2_500;

// Single-rate PLF lookup at expected rate ≈ 6.0%, by age of youngest borrower.
// These are illustrative-but-realistic values for an MVP. REPLACE with HUD-published
// PLF table values before launch. Update PLF_RATE_NOTE in the SEO copy if you change them.
export const PLF_AT_6_PERCENT: Record<number, number> = {
  62: 0.410, 63: 0.418, 64: 0.426, 65: 0.434, 66: 0.442, 67: 0.450, 68: 0.458,
  69: 0.466, 70: 0.474, 71: 0.482, 72: 0.490, 73: 0.498, 74: 0.506, 75: 0.514,
  76: 0.522, 77: 0.530, 78: 0.538, 79: 0.546, 80: 0.554, 81: 0.562, 82: 0.570,
  83: 0.578, 84: 0.586, 85: 0.594, 86: 0.602, 87: 0.610, 88: 0.618, 89: 0.626,
  90: 0.634, 91: 0.642, 92: 0.650, 93: 0.658, 94: 0.666, 95: 0.674, 96: 0.682,
  97: 0.690, 98: 0.698, 99: 0.706,
};
```
> **Hard rule:** until the full HUD 2D table is loaded, **gate the "Expected interest rate" input visually** ("Currently estimated at 6%; lender will quote your live rate") and ignore non-6% input for PLF — apply it elsewhere only as documentation.

### 2. Max claim and PLF
```
youngestAge = min(borrowerAge, coBorrowerAge ?? borrowerAge)
if (youngestAge < 62) -> show eligibility error and stop computing
maxClaim    = min(homeValue, HECM_LENDING_LIMIT_2026)
plf         = PLF_AT_6_PERCENT[clamp(youngestAge, 62, 99)]
initialPL   = maxClaim × plf
```

### 3. Upfront costs and net principal
```
imip            = maxClaim × IMIP_RATE
origination     = clamp(
                    0.02 × min(homeValue, 200_000) + 0.01 × max(0, min(homeValue, 400_000) - 200_000),
                    ORIGINATION_FLOOR,
                    ORIGINATION_CAP
                  )
totalFees       = imip + origination + otherClosingCosts
availableAfterFees = max(0, initialPL - totalFees - existingMortgageBalance)
```

### 4. Payout option calculations

**Lump sum:** `lumpSum = availableAfterFees`.

**Line of credit:** `lineOfCredit = availableAfterFees`. Note the LOC grows over time at (expectedRate + IMIP_renewal 0.5%) compounded monthly — surface as a callout but don't simulate growth in the headline.

**Term (years T):**
```
n           = T × 12
monthlyRate = (expectedRate + 0.005) / 12      // accrual rate including ongoing MIP
PMT_term    = availableAfterFees × monthlyRate / (1 - (1 + monthlyRate)^-n)
```
**If `monthlyRate === 0`:** `PMT_term = availableAfterFees / n`.

**Tenure (lifetime):** HUD uses age 100 as the actuarial horizon.
```
nTenure     = (100 - youngestAge) × 12
PMT_tenure  = availableAfterFees × monthlyRate / (1 - (1 + monthlyRate)^-nTenure)
```
Same `r === 0` fallback.

### 5. Loan-balance growth projection (informational)
The loan balance grows each year at `expectedRate + 0.5% ongoing MIP` (compounded monthly). For a 25-year horizon, show how the balance grows and overlay home value at a configurable annual appreciation (default `3.5%`) to visualize remaining equity.

```
balance_y       = initialDraw × (1 + monthlyAccrualRate)^(12y)        // for lump-sum
homeValue_y     = homeValue × (1 + appreciation/100)^y
remainingEquity = max(0, homeValue_y - balance_y)
```

---

## Outputs

1. **Headline:** Net funds available to you, with the payout you selected highlighted.
2. **Principal-limit breakdown card:** Max claim → PLF → Initial PL → minus IMIP → minus origination → minus existing mortgage → minus other closing → Available.
3. **All four payout options shown together** so users can compare at a glance.
4. **25-year projection:** loan balance vs home value, with the equity gap.

## Charts

1. **Principal-limit waterfall:** start at max claim, subtract each fee, end at available funds.
2. **Payout comparison bar chart:** lump-sum, LOC, 10-year term monthly, tenure monthly — all dollar values normalized to monthly for term/tenure and total for lump-sum/LOC (label clearly).
3. **Long-term equity line chart:** home value vs loan balance over 25 years; remaining equity shaded.

---

## Page wrapper SEO

```
<title>            Reverse Mortgage Calculator (HECM) | Toolisk                  (~50 chars)
<meta description> Estimate HECM reverse mortgage proceeds across lump sum, line of credit, term, and lifetime tenure. 2026 limits. Free. (≤155)
<meta keywords>    reverse mortgage calculator, hecm calculator, reverse mortgage proceeds, principal limit factor, hecm tenure payment, hecm line of credit
<link canonical>   https://toolisk.com/finance/reverse-mortgage-calculator
<og:title>         Reverse Mortgage Calculator
<og:description>   Estimate HECM proceeds and compare all four payout options side-by-side.
<og:type>          website
<twitter:card>     summary_large_image
JSON-LD            BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words)

**Section 1 — What a HECM reverse mortgage is and who qualifies (≈ 280 words).** Define HECM. List eligibility (62+, primary residence, ability to maintain taxes/insurance/HOA). Distinguish from a home-equity loan and proprietary jumbo reverse mortgages.

**Section 2 — How proceeds are calculated (≈ 280 words).** Walk through max claim, PLF (with an honest disclosure that the calculator uses an illustrative PLF table at 6% expected rate), upfront fees (2% IMIP, origination cap $6,000), and the four payout options including a brief comparison.

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).**

> **Example.** A 70-year-old single borrower owns a $525,000 home with a $60,000 existing mortgage. Max claim = min($525,000, $1,209,750) = $525,000. PLF at age 70, 6% expected rate ≈ 0.474. **Initial principal limit = $525,000 × 0.474 = $248,850.** Upfront costs: IMIP $10,500 (2%), origination $6,000 (capped), other closing $2,500. Existing mortgage payoff $60,000. **Net funds available = $248,850 − $10,500 − $6,000 − $2,500 − $60,000 = $169,850.** If taken as **tenure**, lifetime monthly payments to age 100 (30 × 12 = 360 months) at an accrual rate including 0.5% MIP work out to roughly **$1,090/month for life**. As a **10-year term**: about **$1,890/month for 120 months**. As a **lump sum** or **line of credit**: the full $169,850 today.

**Section 4 — FAQs (≈ 200 words).**
- Q: Will I lose my home with a reverse mortgage?
- Q: What happens to the loan when I die or move?
- Q: How does the line-of-credit growth feature work?
- Q: Can a non-borrowing spouse stay in the home?

---

## Variants to create

| Variant slug | Target keyword | Hook |
|---|---|---|
| `hecm-calculator` | "hecm calculator" | HECM-specific framing |
| `reverse-mortgage-payment-calculator` | "reverse mortgage payment calculator" | Tenure-payment focus |
| `reverse-mortgage-line-of-credit-calculator` | "reverse mortgage line of credit" | LOC growth explainer |
| `reverse-mortgage-vs-heloc` | "reverse mortgage vs heloc" | Comparator vs the HELOC calculator built in 02 |

---

## Wiring

- Register `'reverse-mortgage'` in `_types.ts`.
- Add to `_calculators.ts`.
- Add slug to `CONCRETE_FINANCE_PAGES`.
- Add tile to `/finance` hub.
- Add to footer.
- **Inbound links (≥ 2):** HELOC Calculator (built in 02) and Mortgage Calculator pages.
- **Outbound links (4–6):** HELOC Calculator, Mortgage Calculator, Social Security Calculator, RMD Calculator (built in 04), Annuity Calculator (built in 03).
- Import all 4 variants into `ALL_VARIANTS`.

---

## Final checklist

- [ ] Age-under-62 case shows an eligibility block, not a $0 result.
- [ ] PLF table is in a single constant; tooltip explains the 6% rate assumption.
- [ ] HECM lending limit constant has the year stated (`2026`) and matches the FHA-published value.
- [ ] Origination fee correctly capped at $6,000 and floored at $2,500.
- [ ] All four payout options computed simultaneously and shown side-by-side.
- [ ] Long-term equity chart uses a separate home-appreciation input (don't reuse expected interest rate).
- [ ] No `CurrencySelector` (USD only).
- [ ] All 4 variants registered.
- [ ] `tsc --noEmit && npm run build` passes.
- [ ] Disclaimer prominent: "Estimates only; consult a HUD-approved HECM counselor."
