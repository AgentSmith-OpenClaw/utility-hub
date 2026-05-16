# 03 — Annuity Calculator

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

| Prompt | Answer |
|---|---|
| Tool name | `Annuity Calculator` |
| Slug | `annuity-calculator` |
| Pattern | **Heavy** |
| calculatorId | `annuity` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

For three annuity scenarios — **(a) immediate income annuity from a lump sum**, **(b) deferred annuity accumulation**, and **(c) period-certain payouts** — computes the periodic payment, total payout, and total interest earned.

## The annuity types this tool covers

Use a **mode selector** (tab or radio) at the top with three options. The rest of the inputs change based on the mode.

1. **Immediate Annuity (SPIA)** — convert a lump sum into a stream of payments today.
2. **Deferred Annuity (Accumulation)** — contribute over time, lump sum grows tax-deferred.
3. **Fixed-Period Annuity** — generic time-value-of-money: solve for either payment, balance, or required principal given the other two.

Treat each mode as a self-contained mini-calculator within one page. State persists per mode in localStorage.

---

## Inputs (per mode)

### Mode A: Immediate Annuity (SPIA)
- Principal / premium (`USD`, default `$250,000`)
- Guaranteed annual interest rate (%, default `4.5`)
- Payout period (years, default `20`) — i.e. period-certain annuity, not life-only
- Payment frequency: `Monthly` | `Quarterly` | `Annually` (default Monthly)
- (Optional toggle) Inflation adjustment (annual COLA %, default `0`, range 0–5)

### Mode B: Deferred Annuity (Accumulation)
- Starting balance (`USD`, default `$25,000`)
- Periodic contribution (`USD`, default `$500`)
- Contribution frequency: `Monthly` | `Annually` (default Monthly)
- Years until annuitization (default `25`)
- Expected annual return (%, default `5.5`)
- (Optional) Show post-annuitization income (toggle): if on, also compute Mode-A payout from the projected lump sum using same rate and a "Years of income" input (default `25`).

### Mode C: Fixed-Period
- Solve for: `Payment` | `Future value` | `Required principal` (radio)
- Two of three: present value, payment, future value (the third is the output)
- Annual rate (%)
- Number of years
- Frequency: `Monthly` | `Annually`
- Payment timing: `End of period (ordinary)` | `Start of period (annuity-due)` (default ordinary)

---

## Pristine calculations

Define helpers once at the top of `Annuity.utils.ts`:

```ts
// Convert annual rate to per-period rate by compounding frequency.
function periodicRate(annualPct: number, periodsPerYear: number) {
  return Math.pow(1 + annualPct / 100, 1 / periodsPerYear) - 1;
  // Alternative (nominal/simple): annualPct / 100 / periodsPerYear
}
```

**Pick one rate convention and document it.** Use **simple periodic rate** (`annualPct / 100 / periodsPerYear`) — that's what insurers and TVM textbooks use and what every competing calculator uses. State this in the SEO copy. Do not mix conventions across modes.

```ts
function r(annualPct: number, freq: number) {
  return annualPct / 100 / freq;
}
```

### Mode A — Immediate Annuity payment (PMT given PV)
Standard present-value-of-annuity formula, solved for PMT:
```
PV = PMT × (1 - (1 + r)^-n) / r
=>
PMT = PV × r / (1 - (1 + r)^-n)
```
Where:
- `PV` = principal
- `r`  = periodic rate = annualRate / freq
- `n`  = total periods = years × freq

**If `r === 0`:** `PMT = PV / n`.

**With COLA (inflation adjustment):** the payment grows by `(1 + cola/100)^(yearsElapsed)`. The base payment is computed using a "growing annuity" PV formula:
```
PV = PMT₀ × (1 - ((1 + g) / (1 + r))^n) / (r - g)              (r ≠ g)
=>
PMT₀ = PV × (r - g) / (1 - ((1 + g) / (1 + r))^n)
```
Where `g = cola / 100 / freq` is the per-period growth rate. **If `r === g`:** `PMT₀ = PV × r / n`.

Total payout = sum of all periodic payments.
Total interest earned = total payout − PV.

### Mode B — Deferred Annuity (Future Value with contributions)
Future value of a lump sum + annuity of contributions:
```
FV_lump = PV × (1 + r)^n
FV_pmt  = PMT × ((1 + r)^n - 1) / r            (ordinary annuity)
FV      = FV_lump + FV_pmt
```
Where `r` = periodic return rate, `n` = total periods, `PMT` = per-period contribution.

**If `r === 0`:** `FV = PV + PMT × n`.

Total contributions = `PV + PMT × n`.
Total growth = `FV - totalContributions`.

If "Show post-annuitization income" is on, use `FV` as the `PV` input to Mode A formula.

### Mode C — Fixed-Period (TVM solver)
Standard TVM identities, all using the same `r` and `n`:

| Solve for | Formula |
|---|---|
| `PMT` given PV, FV | `PMT = (PV × r × (1 + r)^n + FV × r) / ((1 + r)^n - 1)` (ordinary) |
| `FV` given PV, PMT | `FV = PV × (1 + r)^n + PMT × ((1 + r)^n - 1) / r` |
| `PV` given PMT, FV | `PV = (FV - PMT × ((1 + r)^n - 1) / r) / (1 + r)^n` |

**Annuity-due adjustment:** multiply the `PMT` term by `(1 + r)` (payment shifts to start of period).

**`r === 0` edge case:** simplify each formula to its linear form (`PMT = (FV - PV)/n`, etc.) — never let the code divide by zero.

---

## Outputs

### Mode A (Immediate)
- **Headline:** Periodic payment (large $).
- Total payout over the term.
- Total interest earned (payout − principal).
- If COLA on: first payment and final-year payment.

### Mode B (Deferred)
- **Headline:** Projected balance at end of accumulation.
- Total contributions.
- Total interest earned.
- (If toggle on) Resulting monthly income during payout phase.

### Mode C (Fixed-Period)
- **Headline:** the solved variable.
- The other inputs echoed for clarity.

## Charts

- **Mode A:** Line chart — running balance over time (starts at PV, decreases to 0). Pie chart — Principal vs Interest of total payout.
- **Mode B:** Stacked area — Contributions vs Growth over years. Pie — Final balance composition.
- **Mode C:** Bar chart of the three TVM variables (PV, total payments, FV) to make the relationship visual.

---

## Page wrapper SEO

```
<title>            Annuity Calculator: Income & Growth Projection | Toolisk    (~58 chars)
<meta description> Calculate immediate annuity payouts, deferred annuity growth, and fixed-period payments. Free, accurate, with charts. (≤155)
<meta keywords>    annuity calculator, immediate annuity, deferred annuity, SPIA calculator, annuity payout, retirement income calculator, fixed annuity
<link canonical>   https://toolisk.com/finance/annuity-calculator
<og:title>         Annuity Calculator
<og:description>   Project annuity payments and growth across immediate, deferred, and fixed-period scenarios.
<og:type>          website
<twitter:card>     summary_large_image
JSON-LD            BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words)

**Section 1 — Three flavors of annuity, when each makes sense (≈ 300 words).** Distinguish immediate vs deferred vs fixed-period. Mention that variable annuities and life-only annuities are out of scope (and link to fee-only fiduciary resources for those).

**Section 2 — How payments are computed (≈ 250 words).** Walk through the PV-of-annuity formula. Disclose the rate convention used (simple periodic, `r/n`). Mention that real annuity contracts include mortality credits, fees, and surrender charges that this calculator does not model.

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).**

> **Example (Immediate Annuity).** A 65-year-old buys a 20-year period-certain SPIA with a $250,000 premium at a 4.5% guaranteed rate, paid monthly. Periodic rate r = 0.045/12 = 0.00375. Periods n = 240. Monthly payment = $250,000 × 0.00375 / (1 − (1.00375)^−240) = **$1,581.49**. Over 20 years the annuitant collects 240 × $1,581.49 = **$379,557**, of which **$129,557 is interest**. Toggling a 2% annual COLA drops the first payment to ~$1,322 but lifts the year-20 payment to ~$1,962 — total payout rises slightly to ~$391,800, because the COLA pulls more dollars to later years where they've earned more compounding.

**Section 4 — FAQs (≈ 200 words).**
- Q: Is an annuity a good investment?
- Q: Annuity vs 401(k) — which first?
- Q: What rate should I assume in this calculator?
- Q: Why does my real quote from an insurer differ from this calculator?

---

## Variants to create

| Variant slug | Target keyword | Hook |
|---|---|---|
| `immediate-annuity-calculator` | "immediate annuity calculator" | SPIA-only focus, simpler UI |
| `deferred-annuity-calculator` | "deferred annuity calculator" | Accumulation-focused |
| `annuity-payout-calculator` | "annuity payout calculator" | Lead with the payout formula |
| `fixed-annuity-calculator` | "fixed annuity calculator" | Disambiguates from variable annuities |
| `retirement-annuity-calculator` | "retirement annuity calculator" | Retirement-income framing, links to Social Security calc |

---

## Wiring

- Register `'annuity'` in `_types.ts`.
- Add to `_calculators.ts`.
- Add slug to `CONCRETE_FINANCE_PAGES`.
- Add tile to `/finance` hub.
- Add to footer.
- **Inbound links (≥ 2):** Social Security Calculator (if exists) and Retirement Calculator pages.
- **Outbound links (4–6):** Retirement Calculator, Social Security Calculator, Roth Conversion Calculator (built in 06), RMD Calculator (built in 04), Compound Interest Calculator.
- Import all 5 variants into `ALL_VARIANTS`.

---

## Final checklist

- [ ] Mode switcher (Immediate / Deferred / Fixed-Period) renders, state persists per mode.
- [ ] `r === 0` edge case handled in every formula (no `NaN`).
- [ ] COLA growing-annuity formula correct (`r === g` branch present).
- [ ] No `CurrencySelector` (USD only).
- [ ] `ExportShareBar` first child; PDF/Excel work for each mode.
- [ ] All 5 variants registered.
- [ ] `tsc --noEmit && npm run build` passes.
