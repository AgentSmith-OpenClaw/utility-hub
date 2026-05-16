import type { CollegeSavings529Inputs, CollegeSavings529Result, CollegeYearData } from './CollegeSavings529Calculator.types';

export function fmtUSD(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

function computeFvAtStart(currentBalance: number, monthlyContribution: number, annualReturn: number, nMonths: number): number {
  const i = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  const fvLump = currentBalance * Math.pow(1 + i, nMonths);
  const fvContrib = i === 0
    ? monthlyContribution * nMonths
    : monthlyContribution * (Math.pow(1 + i, nMonths) - 1) / i;
  return fvLump + fvContrib;
}

function simulateWithdrawals(fvAtStart: number, yearlyCosts: number[], annualReturn: number): {
  finalBalance: number;
  runsOutYear: number | null;
  collegeYearData: CollegeYearData[];
} {
  let balance = fvAtStart;
  let runsOutYear: number | null = null;
  const collegeYearData: CollegeYearData[] = [];

  for (let k = 0; k < yearlyCosts.length; k++) {
    const startingBalance = balance;
    const withdrawal = yearlyCosts[k];
    balance -= withdrawal;
    if (balance < 0 && runsOutYear === null) runsOutYear = k + 1;
    balance *= (1 + annualReturn / 100);
    collegeYearData.push({ year: k + 1, projectedCost: withdrawal, startingBalance, withdrawal, endingBalance: balance });
  }

  return { finalBalance: balance, runsOutYear, collegeYearData };
}

// Closed-form-of-PMT for staggered withdrawals during continued accrual is messy.
// Binary search over [0, 10000] $/month is fast (<30 iterations to penny tolerance) and
// keeps the formula readable for future maintainers.
function solveRecommendedPMT(
  currentBalance: number,
  annualReturn: number,
  nMonths: number,
  yearlyCosts: number[]
): number {
  let lo = 0;
  let hi = 30000;
  for (let iter = 0; iter < 60; iter++) {
    const mid = (lo + hi) / 2;
    const fv = computeFvAtStart(currentBalance, mid, annualReturn, nMonths);
    const { finalBalance } = simulateWithdrawals(fv, yearlyCosts, annualReturn);
    if (finalBalance >= 0) {
      hi = mid;
    } else {
      lo = mid;
    }
    if (hi - lo < 0.01) break;
  }
  return hi;
}

export function calculateCollegeSavings529(inputs: CollegeSavings529Inputs): CollegeSavings529Result {
  const {
    childAge, yearsOfCollege, currentBalance, monthlyContribution,
    expectedReturn, stateDeductionRate, stateDeductibleCap,
    currentAnnualCost, costInflationRate,
  } = inputs;

  const yearsUntilCollege = Math.max(0, 18 - childAge);
  const nMonths = yearsUntilCollege * 12;

  const fvAtStart = computeFvAtStart(currentBalance, monthlyContribution, expectedReturn, nMonths);

  const yearlyCosts: number[] = [];
  let totalCollegeCost = 0;
  for (let k = 0; k < yearsOfCollege; k++) {
    const cost = currentAnnualCost * Math.pow(1 + costInflationRate / 100, yearsUntilCollege + k);
    yearlyCosts.push(cost);
    totalCollegeCost += cost;
  }

  const { finalBalance, runsOutYear, collegeYearData } = simulateWithdrawals(fvAtStart, yearlyCosts, expectedReturn);

  const isFullyFunded = finalBalance >= 0;
  const fundingGap = isFullyFunded ? 0 : -finalBalance;
  const fundingSurplus = isFullyFunded ? finalBalance : 0;

  const recommendedMonthlyContribution = isFullyFunded
    ? monthlyContribution
    : solveRecommendedPMT(currentBalance, expectedReturn, nMonths, yearlyCosts);

  const annualContribution = monthlyContribution * 12;
  const deductibleAmount = stateDeductibleCap > 0 ? Math.min(annualContribution, stateDeductibleCap) : annualContribution;
  const annualStateSavings = deductibleAmount * (stateDeductionRate / 100);
  const lifetimeStateSavings = annualStateSavings * yearsUntilCollege;

  // Growth-then-drawdown chart: balance from today to end of college
  const growthData: Array<{ label: string; balance: number }> = [];
  const i = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
  // Accumulation phase — sample monthly
  const sampleStep = Math.max(1, Math.floor(nMonths / 20));
  for (let m = 0; m <= nMonths; m += sampleStep) {
    const fvLump = currentBalance * Math.pow(1 + i, m);
    const fvContrib = i === 0 ? monthlyContribution * m : monthlyContribution * (Math.pow(1 + i, m) - 1) / i;
    if (m % sampleStep === 0 || m === nMonths) {
      growthData.push({ label: `Yr ${Math.round(m / 12)}`, balance: Math.round(fvLump + fvContrib) });
    }
  }
  // Drawdown phase
  let drawBalance = fvAtStart;
  for (let k = 0; k < yearsOfCollege; k++) {
    drawBalance -= yearlyCosts[k];
    drawBalance *= (1 + expectedReturn / 100);
    growthData.push({ label: `Col ${k + 1}`, balance: Math.round(Math.max(0, drawBalance)) });
  }

  // Cost inflation bar data
  const costInflationData = yearlyCosts.map((cost, k) => ({
    label: `Year ${k + 1}`,
    cost: Math.round(cost),
  }));

  // Contribution vs growth at college start
  const totalContributed = currentBalance + monthlyContribution * nMonths;
  const growth = Math.max(0, fvAtStart - totalContributed);
  const contributionVsGrowthData = { contributed: Math.round(totalContributed), growth: Math.round(growth) };

  return {
    yearsUntilCollege,
    fvAtStart: Math.round(fvAtStart),
    totalCollegeCost: Math.round(totalCollegeCost),
    yearlyCosts,
    fundingGap: Math.round(fundingGap),
    fundingSurplus: Math.round(fundingSurplus),
    isFullyFunded,
    runsOutYear,
    recommendedMonthlyContribution: Math.round(recommendedMonthlyContribution),
    annualStateSavings: Math.round(annualStateSavings),
    lifetimeStateSavings: Math.round(lifetimeStateSavings),
    collegeYearData,
    growthData,
    costInflationData,
    contributionVsGrowthData,
  };
}
