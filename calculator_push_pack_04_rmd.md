# 04 — RMD Calculator (Required Minimum Distribution)

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

| Prompt | Answer |
|---|---|
| Tool name | `RMD Calculator` |
| Slug | `rmd-calculator` |
| Pattern | **Heavy** |
| calculatorId | `rmd` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

Computes the current-year **Required Minimum Distribution** (RMD) from a Traditional IRA, 401(k), 403(b), or similar tax-deferred retirement account, and projects future-year RMDs to age 100.

## Background a developer must understand before coding

- **SECURE 2.0 Act (2022):** RMD age is now **73** (rising to 75 starting 2033 for those born in 1960 or later). Roth IRAs are **not** subject to RMDs during the original owner's lifetime; this calculator targets *Traditional* accounts.
- **The formula** is fixed by the IRS:
  ```
  RMD_year = balance_on_Dec_31_of_prior_year / distribution_period_from_IRS_table
  ```
- **Three tables** the IRS publishes (Pub 590-B):
  1. **Uniform Lifetime Table** — used by *most* account owners. Use this as the default.
  2. **Joint Life and Last Survivor Expectancy Table** — used only if the sole beneficiary is the spouse and the spouse is **more than 10 years younger** than the account owner.
  3. **Single Life Expectancy Table** — used by inherited-IRA beneficiaries (out of scope here unless added explicitly).
- **Penalty:** missing an RMD historically meant a 50% excise tax. Under SECURE 2.0 it's **25%** (reducible to 10% if corrected within two years). The calculator should mention this in the SEO copy but does not need to compute it.

---

## Inputs

Group into two cards: **"Your Account"** and **"Projection Assumptions"**.

### Your Account
- Account balance as of **December 31 of last year** (`USD`, default `$425,000`)
- Your current age (default `73`, min `73`, max `120`)
- Marital / beneficiary status — radio:
  - "Spouse is sole beneficiary and is >10 years younger" → use Joint Life table; show a spouse-age input.
  - "Anything else" (default) → use Uniform Lifetime table.
- (Conditional) Spouse age (only if above radio is selected; min 10, max owner_age − 11)
- Filing status (for tax estimate): `Single` | `Married filing jointly` | `Head of household`
- Marginal federal tax rate (%) — pre-populated based on filing status with a soft suggestion, user-editable

### Projection Assumptions
- Expected annual account return after RMD withdrawals (%, default `5.5`)
- Project until age (default `100`, max `120`)

---

## Pristine calculations

### 1. Constants — paste these tables verbatim into `RMD.utils.ts`

```ts
// IRS Uniform Lifetime Table — effective 2022 and later (SECURE Act 2.0)
// Source: IRS Publication 590-B, Appendix B, Table III.
// Keys are the account owner's age at year-end.
export const UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
  79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
  86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
  93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8,
  100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3,
  107: 4.1, 108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1,
  114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3, 120: 2.0,
};

// Stub for Joint Life table — implement with full IRS table if shipping spouse-10+ branch.
// For MVP, allow the radio but fall back to Uniform Lifetime + show a note that joint-life
// figures will be larger (because the joint life expectancy is longer, the divisor is bigger,
// so the RMD is smaller). Add the full table in a follow-up commit.
```

> **Important.** Do not invent or interpolate values. If you cannot get the official Joint Life table in this build, **disable** the radio option and label it "Coming soon — currently uses Uniform Lifetime." Wrong tax numbers are worse than a missing feature.

### 2. Current-year RMD
```
distributionPeriod = UNIFORM_LIFETIME_TABLE[currentAge]
currentRMD         = priorYearEndBalance / distributionPeriod
estimatedFedTax    = currentRMD × (marginalTaxRate / 100)
netAfterTax        = currentRMD - estimatedFedTax
```
If `currentAge < 73`: show a banner: "You're not yet subject to RMDs. Your first RMD year will be age 73." Don't compute.
If `currentAge > 120`: clamp to 120.

### 3. Future-year projection (year-by-year to "Project until age")
For each year starting at the current year:
```
divisor       = UNIFORM_LIFETIME_TABLE[ageAtYearStart]
yearlyRMD     = balance / divisor
balance       = (balance - yearlyRMD) × (1 + expectedReturn / 100)
afterTax      = yearlyRMD × (1 - marginalTaxRate / 100)
cumulativeRMDs += yearlyRMD
ageAtYearStart += 1
```
Stop at `projectUntilAge`.

**First-RMD timing nuance** (mention in copy, don't model in MVP unless asked): the very first RMD can be deferred until April 1 of the year after you turn 73, but then two RMDs hit in the same calendar year. Default to "take in year you turn 73."

---

## Outputs

1. **Headline KPIs:** This year's RMD ($), Estimated federal tax owed, Net after-tax distribution.
2. **Distribution period table:** the divisor used (e.g., 26.5) with a tooltip linking to IRS Pub 590-B.
3. **Lifetime totals:** cumulative RMDs over projection horizon, cumulative taxes.

## Charts

1. **Year-by-year RMD bar chart** — X: age 73 → projectUntilAge. Y: yearly RMD. Stack: net-to-you vs federal tax.
2. **Balance projection line chart** — account balance over time, declining or rising depending on return vs withdrawal rate.
3. **Cumulative pie** — Total RMDs collected vs Total estimated taxes vs Remaining balance.

---

## Page wrapper SEO

```
<title>            RMD Calculator: IRA & 401(k) Required Distribution | Toolisk   (~60 chars)
<meta description> Calculate your IRS Required Minimum Distribution for 2026 and project lifetime RMDs from your IRA or 401(k). Free. (≤155)
<meta keywords>    rmd calculator, required minimum distribution, ira rmd, 401k rmd, secure 2.0 rmd, retirement withdrawal calculator, rmd age 73
<link canonical>   https://toolisk.com/finance/rmd-calculator
<og:title>         RMD Calculator
<og:description>   Find your IRS-compliant Required Minimum Distribution and project decades of future RMDs.
<og:type>          website
<twitter:card>     summary_large_image
JSON-LD            BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words)

**Section 1 — What an RMD is and who must take one (≈ 250 words).** Define RMD. State the SECURE 2.0 ages (73 now, 75 starting 2033). Clarify Roth IRAs are not subject. Mention 25%/10% penalty regime under SECURE 2.0.

**Section 2 — How the IRS calculates your RMD (≈ 250 words).** Explain the divisor approach using the Uniform Lifetime Table. Show that the divisor decreases each year, so the percentage withdrawn rises with age. Briefly mention the Joint Life and Single Life tables and when each applies.

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).**

> **Example.** A 73-year-old retiree had a Traditional IRA balance of **$425,000 on December 31 of last year**. The Uniform Lifetime distribution period at age 73 is **26.5**. RMD = $425,000 / 26.5 = **$16,037.74**. At a 22% marginal federal rate, the estimated federal tax on this distribution is $3,528, leaving a net of $12,510. If the account grows 5.5% annually after withdrawals, the year-10 balance is approximately **$485,400** (because the 5.5% return exceeds the early RMD rate of ~3.77%) and the year-10 RMD has grown to roughly **$23,600**. Cumulative RMDs from 73 to 100 total **about $710,000** on the starting $425,000 balance.

**Section 4 — FAQs (≈ 200 words).**
- Q: What if I miss my RMD?
- Q: Can I take my RMD in monthly installments?
- Q: Do RMDs apply to Roth IRAs?
- Q: Can a QCD (Qualified Charitable Distribution) satisfy my RMD?

---

## Variants to create

| Variant slug | Target keyword | Hook |
|---|---|---|
| `ira-rmd-calculator` | "ira rmd calculator" | IRA-specific copy |
| `401k-rmd-calculator` | "401k rmd calculator" | 401(k)-specific copy |
| `inherited-ira-rmd-calculator` | "inherited ira rmd calculator" | **Different math (Single Life table) — note in copy that MVP uses Uniform Lifetime; mark the variant as "Inherited-IRA edition coming". For now, scope the variant copy to surviving spouse who treats inherited IRA as their own.** |
| `required-minimum-distribution-table-calculator` | "required minimum distribution table" | Table-led design that exposes the divisor for every age |

---

## Wiring

- Register `'rmd'` in `_types.ts`.
- Add to `_calculators.ts`.
- Add slug to `CONCRETE_FINANCE_PAGES`.
- Add tile to `/finance` hub.
- Add to footer.
- **Inbound links (≥ 2):** Social Security Calculator and Retirement Calculator pages.
- **Outbound links (4–6):** Retirement Calculator, Social Security Calculator, Roth Conversion Calculator (built in 06), Annuity Calculator (built in 03), Compound Interest Calculator.
- Import all 4 variants into `ALL_VARIANTS`.

---

## Final checklist

- [ ] Uniform Lifetime table copied verbatim from IRS Pub 590-B; ages 72–120 present.
- [ ] Pre-RMD-age users see a "not yet required" banner; no computation runs.
- [ ] Marginal tax rate input drives the after-tax KPI without breaking when set to 0.
- [ ] Year-by-year projection table is correct: subtract RMD first, then apply return on the remaining balance.
- [ ] No `CurrencySelector` (USD only).
- [ ] `ExportShareBar` first child; PDF/Excel show full projection.
- [ ] All 4 variants registered.
- [ ] `tsc --noEmit && npm run build` passes.
