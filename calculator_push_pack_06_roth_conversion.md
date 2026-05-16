# 06 — Roth Conversion Calculator

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

| Prompt | Answer |
|---|---|
| Tool name | `Roth Conversion Calculator` |
| Slug | `roth-conversion-calculator` |
| Pattern | **Heavy** |
| calculatorId | `roth-conversion` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

Calculates the federal + state tax cost of converting a Traditional IRA / 401(k) amount to a Roth IRA, then compares the after-tax future value of converting now vs. leaving the funds in the Traditional account and paying tax at withdrawal.

## Background a developer must understand before coding

- A Roth conversion is **fully taxed as ordinary income** in the year you convert.
- The decision turns on: **today's marginal rate vs. expected retirement marginal rate**, plus where the tax money comes from (paying from the Traditional balance itself is much worse than paying from outside cash).
- Provide a clean "Convert from outside cash" toggle. When ON, the full converted amount lands in Roth. When OFF, the tax bill is paid by withholding from the conversion itself, reducing the Roth balance proportionally.
- This is **decision support only**, not tax advice. Make this disclaimer prominent.

---

## Inputs

Group into three cards: **"What You're Converting"**, **"Today's Tax Picture"**, **"Future Assumptions"**.

### What You're Converting
- Amount to convert (`USD`, default `$100,000`)
- Pay conversion tax from: `Outside cash (recommended)` | `Withhold from conversion`

### Today's Tax Picture
- Filing status: `Single` | `Married filing jointly` | `Head of household` (default Single)
- Other taxable income this year (`USD`, default `$95,000`)
- State income tax rate (%, default `5`) — flat-rate approximation; tooltip notes some states (FL, TX, etc.) are zero, NY/CA are progressive.
- Year of conversion (default current year)

### Future Assumptions
- Current age (default `50`, min `18`, max `90`)
- Years until withdrawal (default `15`)
- Expected annual investment return (%, default `7`)
- Expected marginal tax rate at withdrawal (%, default `22`) — provide a tooltip: "Use the bracket you expect to be in during retirement withdrawals."

---

## Pristine calculations

### 1. Constants — 2026 federal brackets

```ts
// 2026 federal ordinary-income brackets (IRS-projected; verify before launch).
// Each tuple is [bracketCeiling, marginalRate]. Above the last ceiling, rate is 37%.
export const FEDERAL_BRACKETS_2026 = {
  single: [
    [11_925, 0.10], [48_475, 0.12], [103_350, 0.22], [197_300, 0.24],
    [250_525, 0.32], [626_350, 0.35], [Infinity, 0.37],
  ],
  marriedFilingJointly: [
    [23_850, 0.10], [96_950, 0.12], [206_700, 0.22], [394_600, 0.24],
    [501_050, 0.32], [751_600, 0.35], [Infinity, 0.37],
  ],
  headOfHousehold: [
    [17_000, 0.10], [64_850, 0.12], [103_350, 0.22], [197_300, 0.24],
    [250_500, 0.32], [626_350, 0.35], [Infinity, 0.37],
  ],
} as const;
```

> **Source-of-truth note:** Verify against the IRS Rev. Proc. for tax year 2026 before launch. If figures differ, **update this constant only** — every calculation will refresh automatically. Do not hand-edit numbers in the UI or copy.

### 2. Federal tax on the conversion (stacked-bracket method)

```
function federalTax(income, brackets) {
  let tax = 0;
  let lower = 0;
  for (const [ceiling, rate] of brackets) {
    if (income <= lower) break;
    const taxableInBracket = Math.min(income, ceiling) - lower;
    tax += taxableInBracket * rate;
    lower = ceiling;
  }
  return tax;
}

baselineTax  = federalTax(otherIncome, brackets[filingStatus])
withConversionTax = federalTax(otherIncome + conversionAmount, brackets[filingStatus])
federalConversionTax = withConversionTax - baselineTax     // incremental
```

### 3. State tax (flat-rate approximation)
```
stateConversionTax = conversionAmount × (stateRate / 100)
totalConversionTax = federalConversionTax + stateConversionTax
effectiveConversionRate = totalConversionTax / conversionAmount
```

### 4. Two scenarios
**Scenario A — Convert now (Roth):**
```
if (taxSource === 'outside') {
  rothBalanceToday = conversionAmount
} else {
  rothBalanceToday = conversionAmount - totalConversionTax    // withheld
}
rothBalanceAtRetirement = rothBalanceToday × (1 + return/100)^years
afterTaxRothFinal       = rothBalanceAtRetirement              // tax-free at retirement
```

**Scenario B — Don't convert (Traditional):**
```
traditionalAtRetirement = conversionAmount × (1 + return/100)^years
afterTaxTradFinal       = traditionalAtRetirement × (1 - retirementTaxRate/100)
```
If `taxSource === 'outside'`, add the side-by-side: in Scenario B that same outside cash, invested in a taxable account with a simplified tax drag, would also grow. Show this as a footnote — don't bury the headline number under it.
```
sideCashAfterDrag = totalConversionTax × (1 + return × (1 - retirementTaxRate/100) / 100)^years
```

### 5. Net benefit
```
netBenefitOfConverting = afterTaxRothFinal - afterTaxTradFinal
```
- Positive → convert now is better.
- Negative → leave it in Traditional.

---

## Outputs

1. **Headline:** "Converting saves you `$X` over Y years" (or "costs you $X"), color-coded.
2. **Conversion-tax breakdown:** Federal incremental tax, state tax, total, effective rate.
3. **Side-by-side scenario card:** Roth at retirement (after tax) vs Traditional at retirement (after tax).
4. **Today's bracket info:** "This conversion pushes you from the X% bracket into the Y% bracket." Show the marginal-bracket transition.

## Charts

1. **Future-value comparison line chart** — two series: After-tax Roth growth, After-tax Traditional growth.
2. **Bracket fill bar** — visualize how much of the conversion falls into each bracket (most informative chart for tax-aware users).
3. **Conversion-tax pie** — federal vs state.

---

## Page wrapper SEO

```
<title>            Roth Conversion Calculator: Tax Cost & Net Benefit | Toolisk  (~60 chars)
<meta description> Should you convert your Traditional IRA to a Roth? See exact tax cost and after-tax future value side-by-side. 2026 brackets. (≤155)
<meta keywords>    roth conversion calculator, traditional to roth ira, roth conversion tax, roth ladder, roth conversion break-even, ira conversion calculator
<link canonical>   https://toolisk.com/finance/roth-conversion-calculator
<og:title>         Roth Conversion Calculator
<og:description>   Calculate Roth conversion tax cost and net lifetime benefit using 2026 federal brackets.
<og:type>          website
<twitter:card>     summary_large_image
JSON-LD            BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words)

**Section 1 — What a Roth conversion is and when it makes sense (≈ 250 words).** Define Roth conversion, the no-income-limit rule (anyone can convert), the 5-year rule on conversions, and the core trade-off (today's marginal rate vs future marginal rate).

**Section 2 — How this calculator models the decision (≈ 250 words).** Explain (a) the incremental federal tax using bracket stacking, (b) the flat-rate state approximation, (c) why paying tax from outside cash dramatically improves the Roth outcome, (d) the simplified retirement tax-rate input (it's a single number representing what bracket you expect at withdrawal).

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).**

> **Example.** A single filer earns $95,000 and converts $100,000 from a Traditional IRA. Under 2026 single-filer brackets, baseline federal tax on $95,000 is roughly $14,300. Adding $100,000 pushes total income to $195,000 — pulling income through the 22% bracket (up to $103,350) and the 24% bracket. Incremental federal tax on the conversion: about **$23,700**. State tax at 5%: **$5,000**. Total conversion tax: **$28,700** (effective rate 28.7%). Pay from outside cash, leave $100,000 in Roth, grow at 7% for 15 years → **$275,900 tax-free**. Don't convert, $100,000 grows to $275,900 inside Traditional, withdraw at a 22% retirement bracket → **$215,200 after tax**. Net benefit of converting now: **+$60,700** — even though it cost $28,700 upfront.

**Section 4 — FAQs (≈ 200 words).**
- Q: Is there an income limit for Roth conversions?
- Q: What is the Roth 5-year rule for conversions?
- Q: Why does paying conversion tax from the IRA itself hurt so much?
- Q: What's a Roth conversion ladder?

---

## Variants to create

| Variant slug | Target keyword | Hook |
|---|---|---|
| `traditional-to-roth-ira-calculator` | "traditional to roth ira calculator" | Full keyword |
| `roth-conversion-tax-calculator` | "roth conversion tax" | Tax-cost focused, simpler UI |
| `roth-conversion-ladder-calculator` | "roth conversion ladder" | Multi-year converter, FIRE-community framing |
| `backdoor-roth-ira-calculator` | "backdoor roth" | Brief explainer; the calculator still computes conversion tax (the relevant step) |

---

## Wiring

- Register `'roth-conversion'` in `_types.ts`.
- Add to `_calculators.ts`.
- Add slug to `CONCRETE_FINANCE_PAGES`.
- Add tile to `/finance` hub.
- Add to footer.
- **Inbound links (≥ 2):** Roth IRA Calculator and 401(k) Calculator pages.
- **Outbound links (4–6):** Roth IRA Calculator, 401(k) Calculator, RMD Calculator (built in 04), HSA Calculator (built in 05), Capital Gains Tax Calculator (built in 09).
- Import all 4 variants into `ALL_VARIANTS`.

---

## Final checklist

- [ ] 2026 federal brackets in one constant; bracket-stacking math returns correct incremental tax.
- [ ] "Pay from outside cash" vs "Withhold" produces visibly different Roth balances.
- [ ] Net-benefit headline flips color and sign correctly when retirement-rate input changes.
- [ ] Bracket-fill chart correctly shows the layered tax on the conversion.
- [ ] Disclaimer at top of long-form content: "Decision support; not tax advice."
- [ ] No `CurrencySelector` (USD only).
- [ ] All 4 variants registered.
- [ ] `tsc --noEmit && npm run build` passes.
