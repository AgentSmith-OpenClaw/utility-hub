# 02 — HELOC Calculator

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

| Prompt | Answer |
|---|---|
| Tool name | `HELOC Calculator` |
| Slug | `heloc-calculator` |
| Pattern | **Heavy** |
| calculatorId | `heloc` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

For a Home Equity Line of Credit, computes the maximum credit available given the home's value and existing mortgage, then projects payments through both the **interest-only draw phase** and the **principal+interest repayment phase**.

## Background a developer must understand before coding

A HELOC has **two distinct phases**:

1. **Draw period** (typically 10 years) — the borrower can take money out up to the credit limit. Payments are usually **interest-only** on the outstanding balance. The balance can fluctuate as the borrower draws and repays.
2. **Repayment period** (typically 10–20 years) — the line is closed to new draws. Outstanding balance amortizes with full **principal + interest** payments to zero by end of term.

HELOC rates are variable (tied to Prime), but for projection purposes we treat the input rate as fixed and clearly disclose this in the SEO copy.

## Inputs

Group into three cards: **"Your Home"**, **"HELOC Terms"**, **"Draw Plan"**.

### Your Home
- Current home value (`USD`, default `$525,000`)
- Existing mortgage balance (`USD`, default `$220,000`)
- Maximum combined loan-to-value (CLTV %) the lender allows (default `85`, range 70–90)

### HELOC Terms
- Interest rate during draw period (annual %, default `8.5`)
- Interest rate during repayment period (annual %, default `8.5`)
- Draw period length (years, default `10`)
- Repayment period length (years, default `20`)

### Draw Plan
- Amount you plan to draw (`USD`, default `$50,000`)
- Draw timing radio: **"Take it all at once at start"** | **"Spread evenly over draw period"** (default first option; gate the second behind a tooltip explaining its effect)

---

## Pristine calculations

```
monthlyRate(annualPct) = annualPct / 100 / 12
```

### 1. Maximum HELOC limit
```
maxLoanAmount   = homeValue × (maxCLTV / 100)
maxHELOC        = max(0, maxLoanAmount - existingMortgageBalance)
availableCredit = max(0, maxHELOC - amountDrawn)
```
If `amountDrawn > maxHELOC`: cap drawn amount at `maxHELOC` and surface a warning.

### 2. Draw-phase monthly payment (interest-only)
```
r_draw      = monthlyRate(drawRate)
drawPayment = amountDrawn × r_draw
```
If draw is spread evenly: the balance ramps up linearly, so payment ramps up too. Compute payment for each month `m` (0..drawMonths-1):
```
balance_m   = amountDrawn × (m + 1) / drawMonths
payment_m   = balance_m × r_draw
```

### 3. Balance at end of draw period
- Lump-sum draw: `balanceAtRepaymentStart = amountDrawn` (interest-only payments don't reduce principal).
- Spread draw: `balanceAtRepaymentStart = amountDrawn` (entire amount is outstanding by end of draw).

### 4. Repayment-phase amortization (standard P&I)
```
r_repay     = monthlyRate(repayRate)
n_repay     = repaymentYears × 12
P           = balanceAtRepaymentStart
repayPayment = P × (r_repay × (1 + r_repay)^n_repay) / ((1 + r_repay)^n_repay - 1)
```
If `r_repay === 0`: `repayPayment = P / n_repay`.

### 5. Totals
```
totalInterestDraw   = sum of monthly interest-only payments
                    = drawPayment × drawMonths          (lump-sum case)
                    OR sum of payment_m for m = 0..drawMonths-1 (spread case)

totalInterestRepay  = repayPayment × n_repay - balanceAtRepaymentStart
totalInterestPaid   = totalInterestDraw + totalInterestRepay
totalCostOfHELOC    = amountDrawn + totalInterestPaid
```

### 6. Amortization schedule for chart (repayment phase)
For each month `i` from 1 to `n_repay`:
```
interest_i  = balance × r_repay
principal_i = repayPayment - interest_i
balance     = balance - principal_i
```
Stop when balance reaches ~$0 (handle floating-point cleanup at last month).

---

## Outputs (results card)

1. **Headline KPIs (3-column row):** Maximum HELOC, Available credit after draw, Total interest paid.
2. **Payment-phase comparison:** Draw-phase monthly payment vs Repayment-phase monthly payment, with the dollar increase (this "payment shock" is the most-searched HELOC fear).
3. **Totals:** Total interest paid, total cost of HELOC (amount drawn + interest).

## Charts

1. **Payment-over-time line chart** — X: month 0–360. Series: monthly payment. Visualize the step-up from draw-phase to repayment-phase as a hard jump; mark with a vertical reference line at draw-period end.
2. **Equity vs. debt stacked bar** — bars for: Home value, Existing mortgage, HELOC drawn, Remaining equity available.
3. **Repayment-phase amortization stacked area** — Principal vs Interest cumulative over repayment months.

---

## Page wrapper SEO

```
<title>            HELOC Calculator: Home Equity Line of Credit | Toolisk      (~59 chars)
<meta description> Calculate HELOC limit, draw-phase interest-only payments and repayment-phase P&I. See your total interest cost instantly. (≤155)
<meta keywords>    heloc calculator, home equity line of credit, heloc payment, draw period, repayment period, heloc interest only, home equity calculator
<link canonical>   https://toolisk.com/finance/heloc-calculator
<og:title>         HELOC Calculator
<og:description>   Project HELOC payments through both draw and repayment phases.
<og:type>          website
<twitter:card>     summary_large_image
JSON-LD            BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words)

**Section 1 — What is a HELOC and how this calculator models it (≈ 280 words).** Define HELOC vs home equity loan vs cash-out refi. Emphasize the **two-phase** structure because most generic mortgage calculators ignore this.

**Section 2 — How the math works (≈ 250 words).** Walk through (a) CLTV-based limit calculation, (b) interest-only formula `balance × monthly rate`, (c) full amortization on the balance at draw-end. Disclose that the calculator treats the rate as fixed even though real HELOC rates are variable (tied to Prime + margin).

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).**

> **Example.** Home worth $525,000, existing mortgage $220,000, lender CLTV cap 85%. Max combined loan = $525,000 × 0.85 = $446,250. **Maximum HELOC = $446,250 - $220,000 = $226,250.** Borrower draws $50,000 at 8.5%. During the 10-year draw period, monthly interest-only payment = $50,000 × (0.085 / 12) = **$354**. When repayment begins (still owing $50,000), amortized over 20 years at 8.5%, P&I = **$434/month** — an 80-cent-on-the-dollar payment shock. Total interest paid: 120 × $354 (draw) + (240 × $434 − $50,000) (repayment) = **$42,480 + $54,160 = $96,640**.

**Section 4 — FAQs (≈ 200 words).**
- Q: What's the difference between a HELOC and a home equity loan?
- Q: What happens when my HELOC enters repayment?
- Q: Can my lender cut my credit line during the draw period?
- Q: Is HELOC interest still tax deductible?

---

## Variants to create

| Variant slug | Target keyword | Hook |
|---|---|---|
| `home-equity-line-of-credit-calculator` | "home equity line of credit calculator" | Full-keyword variant |
| `heloc-payment-calculator` | "heloc payment calculator" | Payment-focused, lead with draw vs repayment |
| `heloc-vs-home-equity-loan-calculator` | "heloc vs home equity loan" | Side-by-side comparator |
| `interest-only-heloc-calculator` | "interest only heloc" | Focuses purely on draw phase |

---

## Wiring

- Register `'heloc'` in `_types.ts` `CalculatorId` union.
- Add to `_calculators.ts`.
- Add slug to `CONCRETE_FINANCE_PAGES`.
- Add tile to `/finance` hub grid.
- Add to footer.
- **Inbound links (≥ 2):** add to `<RelatedCalculators>` on: Mortgage Calculator, Mortgage Refinance Break-Even Calculator (built in 01).
- **Outbound links (4–6):** Mortgage Refinance Break-Even, Mortgage Calculator, Reverse Mortgage Calculator (will exist after 08), Loan Calculator.
- Import all 4 variants into `ALL_VARIANTS`.

---

## Final checklist

- [ ] Two-phase math: draw-phase is interest-only, repayment is full P&I amortization.
- [ ] CLTV cap is applied; drawn amount can't exceed `maxHELOC`.
- [ ] Payment-step chart clearly shows the draw-to-repayment jump.
- [ ] `ExportShareBar` first child; PDF/Excel work.
- [ ] No `CurrencySelector` (USD only).
- [ ] All 4 variants registered.
- [ ] Inbound links added on Mortgage Calculator and Refinance Break-Even pages.
- [ ] `tsc --noEmit && npm run build` passes.
- [ ] Zero/empty inputs don't produce `NaN`.
