# 05 — HSA Calculator (Health Savings Account)

> **Read `calculator_push_pack_00_README.md` first.** This brief assumes you have invoked `/new-calculator` and are filling in calculator-specific content.

## Step 0 — Inputs for the `/new-calculator` skill

| Prompt | Answer |
|---|---|
| Tool name | `HSA Calculator` |
| Slug | `hsa-calculator` |
| Pattern | **Heavy** |
| calculatorId | `hsa` |
| Currency | **USD, hardcoded.** No `CurrencySelector`. |

---

## What this calculator does (one sentence)

For an individual covered by an HSA-eligible high-deductible health plan, projects HSA balance over time, quantifies the **triple-tax advantage** (federal income, state income, and FICA savings on payroll contributions), and compares the HSA outcome against an after-tax taxable account.

## Background a developer must understand before coding

- An HSA gives three tax breaks: contributions are tax-deductible (and avoid FICA if made via payroll), growth is tax-free, withdrawals for qualified medical are tax-free.
- After age 65, non-medical withdrawals are taxed as ordinary income (like a Traditional IRA). Before 65, non-medical withdrawals are taxed plus a 20% penalty. The MVP assumes withdrawals are for qualified medical.
- **Contribution limits (must be a config constant — update annually):**
  - 2026 self-only: **$4,400**
  - 2026 family: **$8,750**
  - Catch-up (age 55+): **$1,000** additional
  > If these numbers change before launch, update the constant in `HSA.utils.ts` and the SEO copy in lockstep.

---

## Inputs

Group into three cards: **"Coverage"**, **"Contributions"**, **"Growth & Tax Assumptions"**.

### Coverage
- Coverage type: `Self-only` | `Family` (default `Self-only`)
- Current age (default `35`, min `18`, max `64`)
- Years until you tap the HSA (default `30`)

### Contributions
- Current HSA balance (`USD`, default `$2,500`)
- Annual contribution (`USD`, default `$4,400`) — auto-cap to the IRS limit + catch-up, surface a warning if user tries to exceed.
- Contribution method: `Through payroll (saves FICA too)` | `Outside payroll (no FICA savings)` (default payroll)
- Annual employer contribution (`USD`, default `$500`) — counts toward the IRS limit; subtract from user's allowed contribution behind the scenes.

### Growth & Tax Assumptions
- Expected annual investment return (%, default `7`)
- Marginal federal tax rate (%, default `22`)
- State income tax rate (%, default `5`) — note in tooltip that **CA and NJ do not exempt HSA contributions from state tax**; user should set 0 if they live there for the state-tax line.
- FICA rate is hardcoded at **7.65%** (6.2% Social Security + 1.45% Medicare).
- Annual qualified medical spending withdrawn each year (`USD`, default `$0`) — if non-zero, simulate concurrent withdrawals.

---

## Pristine calculations

### 1. Constants
```ts
export const HSA_LIMITS_2026 = {
  selfOnly: 4400,
  family:   8750,
  catchUp:  1000,   // age 55+
} as const;
export const FICA_RATE = 0.0765;
```

### 2. Effective annual employee contribution
```
ircLimit       = coverage === 'family' ? HSA_LIMITS_2026.family : HSA_LIMITS_2026.selfOnly
catchUp        = age >= 55 ? HSA_LIMITS_2026.catchUp : 0
totalAllowed   = ircLimit + catchUp
employeeMax    = max(0, totalAllowed - employerContribution)
employeeAnnual = min(employeeInput, employeeMax)
```
Surface a clear warning when `employeeInput > employeeMax`.

### 3. Year-1 tax savings
```
fedSavings      = employeeAnnual × (fedRate / 100)
stateSavings    = employeeAnnual × (stateRate / 100)
ficaSavings     = (contributionMethod === 'payroll') ? employeeAnnual × FICA_RATE : 0
totalYear1Tax   = fedSavings + stateSavings + ficaSavings
effectiveCost   = employeeAnnual - totalYear1Tax
```

### 4. Year-by-year balance projection
For each year `i` from 1 to `yearsUntilUse`:
```
contribution_i  = employeeAnnual + employerContribution      // assume constant
balance        += contribution_i
balance        -= annualMedicalWithdrawals_i                 // simulate concurrent use
balance        *= (1 + return / 100)                          // grow at end of year
```
Track separately: total contributed, total employer, total tax saved (sum of yearly), total medical withdrawn.

### 5. Comparison vs taxable account
Run the same yearly loop but treat the contribution as **after-tax** (no upfront tax break) and apply tax drag on growth:
```
taxableContribution = employeeAnnual × (1 - effectiveTaxRate)   // proxy: fed + state
taxableReturn       = return × (1 - effectiveTaxRate)            // simplified annual drag
```
This is a **simplification** — disclose in copy. The point is to make the HSA's advantage visible, not to model every tax-drag nuance.

### 6. Final outputs
- HSA projected balance at year N.
- Taxable-account balance at year N.
- HSA advantage = `hsaFinal - taxableFinal`.
- Total tax saved over the horizon.

---

## Outputs

1. **Headline:** Projected HSA balance after `N` years, with the HSA-vs-taxable delta as a subheadline.
2. **Year-1 tax savings breakdown card:** Fed, State, FICA, total.
3. **Triple-tax-advantage badge:** the three tax breaks, each with a one-line example.

## Charts

1. **Balance growth line chart** — two series: HSA balance, Taxable-account balance. The gap is the "tax-advantage premium."
2. **Stacked bar of contributions vs growth** — annual snapshot: employee + employer + investment growth.
3. **Year-1 tax-savings pie** — federal, state, FICA slices.

---

## Page wrapper SEO

```
<title>            HSA Calculator: Triple Tax Advantage Projection | Toolisk    (~59 chars)
<meta description> Project your HSA balance and triple-tax savings. Compare HSA vs a taxable account over decades. Free, 2026 IRS limits. (≤155)
<meta keywords>    hsa calculator, health savings account calculator, triple tax advantage, hsa contribution limit 2026, hdhp savings, hsa vs 401k
<link canonical>   https://toolisk.com/finance/hsa-calculator
<og:title>         HSA Calculator
<og:description>   Project HSA growth and quantify federal, state, and FICA tax savings.
<og:type>          website
<twitter:card>     summary_large_image
JSON-LD            BreadcrumbList + SoftwareApplication
```

---

## SEO long-form content outline (800+ words)

**Section 1 — What an HSA is and why it's "triple tax-advantaged" (≈ 250 words).** Define HSA, HDHP eligibility, and the three tax breaks. Note the 2026 limits ($4,400 self / $8,750 family / $1,000 catch-up). State the California/New Jersey state-tax caveat.

**Section 2 — How this calculator models HSA growth (≈ 250 words).** Walk through the year-by-year compounding, the tax-savings breakdown, and the simplified taxable-account comparison. Disclose the modeling shortcuts (constant contribution, constant return, simplified tax drag).

**Section 3 — Worked numeric example (≈ 200 words, MANDATORY).**

> **Example.** A 35-year-old with family coverage contributes the 2026 family limit of **$8,750** via payroll for 30 years, starting from a $2,500 balance, with no annual withdrawals. Year-1 tax savings: $8,750 × (22% federal + 5% state + 7.65% FICA) = **$3,031**. Effective cost of the $8,750 contribution: $5,719. Compounding at 7% annually for 30 years, the projected balance is approximately **$905,400**. The same after-tax contribution stream in a taxable account, with tax-drag on returns, lands near **$580,000** — an **HSA advantage of roughly $325,000** before considering tax-free qualified medical withdrawals, which compound the gap further.

**Section 4 — FAQs (≈ 200 words).**
- Q: What is an HSA-eligible HDHP?
- Q: HSA vs FSA — what's the difference?
- Q: Can I invest my HSA?
- Q: What happens to my HSA at 65?

---

## Variants to create

| Variant slug | Target keyword | Hook |
|---|---|---|
| `health-savings-account-calculator` | "health savings account calculator" | Full-keyword variant |
| `hsa-contribution-calculator` | "hsa contribution calculator" | Limit-focused; lead with 2026 caps |
| `hsa-retirement-calculator` | "hsa for retirement" | Long-horizon framing, age-65 transition |
| `hsa-vs-401k-calculator` | "hsa vs 401k" | Side-by-side comparator |

---

## Wiring

- Register `'hsa'` in `_types.ts`.
- Add to `_calculators.ts`.
- Add slug to `CONCRETE_FINANCE_PAGES`.
- Add tile to `/finance` hub.
- Add to footer.
- **Inbound links (≥ 2):** 401(k) Calculator and Roth IRA Calculator pages.
- **Outbound links (4–6):** 401(k) Calculator, Roth IRA Calculator, Roth Conversion Calculator (built in 06), 529 College Savings (built in 07), FSA Calculator (if exists).
- Import all 4 variants into `ALL_VARIANTS`.

---

## Final checklist

- [ ] 2026 contribution limits in a single constant; SEO copy matches.
- [ ] Employer contribution correctly reduces employee max (catches accidental over-contribution).
- [ ] FICA savings only applied for payroll contribution method.
- [ ] California/NJ state-tax caveat surfaced.
- [ ] No `CurrencySelector` (USD only).
- [ ] All 4 variants registered.
- [ ] `tsc --noEmit && npm run build` passes.
