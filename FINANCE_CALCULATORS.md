# Finance Calculators — Inventory

Live calculators under `/finance`. All run client-side, no sign-up.

## Loans & EMI
- **EMI Calculator** — Home/car/personal loan EMI with reduce-EMI vs reduce-tenure prepayment comparison, charts, Excel export.
- **Amortization Calculator** — Month-by-month principal vs interest schedule with prepayment impact.
- **Auto Loan Calculator** — Car loan payments incl. sales tax, trade-in, dealer fees; side-by-side term comparison (36–84 mo).
- **Student Loan Calculator** — Standard payoff vs extra-payment vs refinance, multi-currency.
- **Credit Card Payoff Calculator** — Avalanche, snowball, and minimum-only strategies with interest saved.

## Mortgage & Real Estate
- **Mortgage Calculator** — Monthly PITI incl. taxes, insurance, PMI.
- **House Affordability Calculator** — Affordable price from income, debts, down payment, front/back DTI.
- **Buy vs Rent Calculator** — Net-worth, opportunity cost, ownership expenses, recommendation.
- **Rental Property ROI** — Cap rate, cash flow, cash-on-cash, DSCR, 1% rule, GRM.

## Retirement
- **FIRE Calculator** — FI/RE number with Lean, Fat, Coast, Barista FIRE comparisons + projections.
- **401(k) Calculator** — Balance projection with employer match, salary growth, contribution limits, withdrawal assumptions.
- **Roth vs Traditional IRA** — After-tax comparison incl. side-fund analysis and contribution limits.
- **Social Security Calculator** — Claiming-age comparison: monthly benefit, lifetime totals, break-even, spousal benefits.

## Tax
- **Income Tax Calculator (India)** — Old vs New regime, FY 2025-26 / Budget 2025, rebates, standard deduction.
- **US Paycheck Calculator** — Federal + 50-state tax, FICA, pre-tax deductions, 2025 brackets.
- **Sales Tax / VAT / GST** — Add or back out tax with presets for US, EU/UK VAT, AU/CA GST/HST.

## Investing & Savings
- **SIP Calculator** — Mutual-fund SIP returns with step-up and goal planning.
- **Compound Interest Calculator** — Flexible compounding, recurring contributions, inflation-adjusted projections.
- **Investment Calculator** — Lump-sum + monthly with inflation, annual step-up, DCA vs lump-sum.
- **FD Calculator (India)** — Quarterly compounding, senior-citizen rates, TDS, post-tax maturity.
- **RD Calculator (India)** — Monthly RD growth with quarterly compounding and senior rates.

## Salary & Everyday
- **Salary Hike Calculator** — New salary from hike % or hike % from new offer; multi-currency.
- **Discount Calculator** — Sale price after percentage or flat discount, with optional tax.
- **Tip Calculator** — Tip, bill split, rounding, regional tipping notes.
- **Net Worth Calculator** — Assets vs liabilities with allocation charts and age benchmarks.
- **US Inflation Calculator** — 1913–2026 CPI purchasing-power conversion.

## Long-tail SEO landing pages (variants)
The directory `src/content/finance-variants/` defines ~50 SEO-targeted landing pages (e.g. *Home Loan EMI*, *15 vs 30 Year Mortgage*, *Coast FIRE*, *FHA Affordability*, *Mortgage Refinance*, *Take-Home Pay*, *Crore SIP*, *Daily Compound Interest*, *GST India*). Each renders the same engine as a canonical calculator above with intent-tuned copy, schema, and FAQs. Driven by `_registry.ts` → `/finance/[variant].tsx`.

**Total live pages: 26 canonical + ~50 variants ≈ 75+ indexable calculator pages.**
