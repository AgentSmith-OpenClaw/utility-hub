# SIP & Wealth Planner — Calculation Logic

This document explains every formula and algorithm used in the Advanced SIP & Wealth Planner tool.

---

## 1. Core SIP Projection (Month-by-Month Iteration)

We use a **begin-of-period** convention: each month's SIP is invested at the
start of the month, so it earns interest for the full month. This matches
the convention used by most Indian mutual-fund SIP calculators.

### Monthly loop (pseudo-code)

```
monthlyRate = annualReturn / 100 / 12
corpus = lumpsumAmount          // initial one-time investment
totalInvested = lumpsumAmount
currentSIP = monthlyInvestment

FOR month = 1 TO (tenureYears × 12):

  // Step-up at the start of each new year (month 13, 25, 37, …)
  IF month > 1 AND (month − 1) MOD 12 = 0:
    IF stepUpMode = 'percent':
      currentSIP = currentSIP × (1 + stepUpValue / 100)
    ELSE:
      currentSIP = currentSIP + stepUpValue

  // Invest SIP
  corpus        += currentSIP
  totalInvested += currentSIP

  // Accrue monthly interest
  interest = corpus × monthlyRate
  corpus  += interest

  // Snapshot at year-end
  IF month MOD 12 = 0 OR month = totalMonths:
    record { year, totalInvested, corpus, interest, realCorpus, … }
```

### Why begin-of-period?

In a real SIP, money is debited on the 1st (or a fixed date) and units are
allotted immediately. This means the money works for essentially the whole
month. The begin-of-period model captures this accurately. The difference
versus end-of-period is small (≈1 month of extra compounding) but aligns
with industry practice.

---

## 2. Step-Up SIP

Two modes are supported:

| Mode       | Formula                                  | Example                     |
| ---------- | ---------------------------------------- | --------------------------- |
| **Percent** | `SIP_new = SIP_old × (1 + pct / 100)` | ₹5 000 + 10 % → ₹5 500    |
| **Fixed**   | `SIP_new = SIP_old + fixedAmount`      | ₹5 000 + ₹1 000 → ₹6 000  |

Step-ups are applied **annually** at the start of year 2, 3, 4, etc.

---

## 3. Inflation-Adjusted (Real) Corpus

For every year `y`, the **real corpus** is:

```
realCorpus = nominalCorpus / (1 + inflationRate / 100) ^ y
```

This gives the present-value purchasing power of the future corpus. When
inflation is disabled, `realCorpus = nominalCorpus`.

---

## 4. XIRR (Internal Rate of Return)

### Why not simple CAGR?

A naive CAGR formula `(FV / totalInvested)^(1/n) − 1` treats the entire
invested amount as a lump sum at time 0. For a SIP, money enters monthly
over many years, so each tranche has a different compounding runway. The
naive approach **dramatically under-reports** actual returns.

### Proper XIRR via Newton-Raphson

We model the investment as a series of monthly cashflows:

```
CF[0]   = −lumpsumAmount          (outflow at t = 0)
CF[1]   = −SIP_1                  (outflow at t = 1 month)
CF[2]   = −SIP_2                  (outflow at t = 2 months)
  …
CF[N]   = −SIP_N + finalCorpus    (net of last outflow + terminal value)
```

We find the monthly rate `r` such that NPV = 0:

```
NPV(r) = Σ CF[i] / (1 + r)^i = 0       for i = 0 … N
```

Solved iteratively using Newton-Raphson:

```
r_new = r_old − NPV(r) / NPV'(r)

where NPV'(r) = Σ −i × CF[i] / (1 + r)^(i+1)
```

The annualised XIRR is then:

```
XIRR = (1 + r_monthly)^12 − 1
```

### Convergence

- Initial guess: `r₀ = 0.008` (≈ 10 % p.a.)
- Clamped updates to `[−0.5, 2.0]` to prevent divergence
- Converges in < 30 iterations for typical inputs
- Tolerance: `|Δr| < 10⁻¹⁰`

---

## 5. Goal-Based Planning (Reverse Solve)

Given a target corpus, we find the required starting monthly SIP via
**binary search** on the projection engine:

```
low  = 0
high = max(currentSIP, 1 000)

// Phase 1: expand upper bound
WHILE projection(high).corpus < targetCorpus AND high < 50 000 000:
  high = high × 2

// Phase 2: bisect 50 times for precision
FOR i = 1 TO 50:
  mid = (low + high) / 2
  IF projection(mid).corpus ≥ targetCorpus:
    high = mid
  ELSE:
    low = mid

requiredSIP = ceil(high)
```

This converges to within ₹1 of the exact answer.

---

## 6. Flat-SIP Comparison

The "What-If" comparison re-runs the same projection with `stepUpValue = 0`
(everything else unchanged). The difference in final corpus is the
**step-up advantage** — the extra wealth generated purely by annual SIP
increases.

---

## 7. Delay Cost Analysis

For each delay scenario (1, 2, 3, 5, 10 years), we re-run the projection
with `tenure = originalTenure − delayYears`. All other parameters stay the
same. The **cost of delay** is:

```
loss = corpus(0-delay) − corpus(d-delay)
```

This vividly shows how even a 1-year delay compounds into a significant
shortfall.

---

## 8. Per-Year Interest

Each year-end snapshot records:

| Field                 | Meaning                                        |
| --------------------- | ---------------------------------------------- |
| `interestEarned`      | Cumulative interest from month 1 to this year  |
| `yearlyInterestEarned`| Interest earned **only** in this year           |

The per-year figure reveals the **acceleration of compounding**: later years
earn multiples of early years' interest on the same base return.

---

## 9. Absolute Return & Return Multiple

```
absoluteReturn = (wealthGained / totalInvested) × 100

returnMultiple = estimatedCorpus / totalInvested
```

These give a quick sense of total efficiency irrespective of time.

---

## 10. Currency Formatting

| Currency | Short format                                            |
| -------- | ------------------------------------------------------- |
| INR      | ₹1.23Cr (≥ 1 Cr), ₹12.34L (≥ 1 L), ₹5.0K (≥ 1 K)    |
| USD      | $1.23B (≥ 1 B), $12.34M (≥ 1 M), $5.0K (≥ 1 K)        |

Full format uses `toLocaleString('en-IN')` / `toLocaleString('en-US')`.

---

## 11. Assumptions & Limitations

1. **Returns are constant**: The model assumes a fixed annual return.
   Real markets fluctuate; use this as a planning estimate, not a guarantee.
2. **Monthly compounding**: Interest compounds once per month (not daily).
3. **No taxes or exit loads**: Returns are pre-tax.
4. **No partial years in step-up**: Step-ups always happen on full-year
   boundaries.
5. **Inflation is constant**: The inflation rate is fixed for the entire
   tenure.
6. **Binary search precision**: Goal-mode SIP is accurate to within ₹1
   but may overshoot slightly due to rounding.
