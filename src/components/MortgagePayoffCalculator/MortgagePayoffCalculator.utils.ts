import {
  MortgagePayoffInputs,
  MortgagePayoffResult,
  MonthlySnapshot,
  ScenarioAPrepay,
  ScenarioBInvest,
} from './MortgagePayoffCalculator.types';

/**
 * Calculate total interest paid on the original schedule (no prepayment).
 */
const calculateOriginalSchedule = (
  balance: number,
  annualRate: number,
  tenureMonths: number,
  monthlyEMI: number
) => {
  let remaining = balance;
  let totalInterest = 0;
  const monthlyRate = annualRate / 100 / 12;

  for (let m = 0; m < tenureMonths && remaining > 0; m++) {
    const interest = remaining * monthlyRate;
    const principal = Math.min(monthlyEMI - interest, remaining);
    totalInterest += interest;
    remaining -= principal;
  }

  return {
    totalInterest,
    totalPayment: totalInterest + balance,
  };
};

/**
 * Simulate Scenario A: Prepay the mortgage aggressively, then invest freed cash.
 */
const simulateScenarioA = (
  inputs: MortgagePayoffInputs,
  horizon: number
): { scenario: ScenarioAPrepay; snapshots: Omit<MonthlySnapshot, 'investBalance' | 'investEquity' | 'investPortfolio' | 'investNetWorth'>[] } => {
  const monthlyRate = inputs.interestRate / 100 / 12;
  const monthlyMarketReturn = inputs.expectedMarketReturn / 100 / 12;
  // For net worth comparison, equity = principal paid down (balance reduction).
  // We use currentBalance as the baseline so equity = currentBalance - remaining.
  const homeValue = inputs.currentBalance;

  let remaining = inputs.currentBalance;
  let totalInterestPaid = 0;
  let portfolio = 0;
  let paidOff = false;
  let payoffMonth = horizon;
  const snapshots: Omit<MonthlySnapshot, 'investBalance' | 'investEquity' | 'investPortfolio' | 'investNetWorth'>[] = [];

  // Apply lump sum immediately
  remaining = Math.max(0, remaining - inputs.lumpSumAmount);
  if (remaining === 0) {
    paidOff = true;
    payoffMonth = 0;
  }

  // Calculate original schedule interest for comparison
  const original = calculateOriginalSchedule(
    inputs.currentBalance,
    inputs.interestRate,
    inputs.remainingTenure,
    inputs.monthlyEMI
  );

  for (let m = 1; m <= horizon; m++) {
    if (!paidOff) {
      // Mortgage is still active
      const interest = remaining * monthlyRate;
      const totalPayment = inputs.monthlyEMI + inputs.extraMonthlyPayment;
      const principal = Math.min(totalPayment - interest, remaining);
      totalInterestPaid += interest;
      remaining -= principal;

      if (remaining <= 0.01) {
        remaining = 0;
        paidOff = true;
        payoffMonth = m;
      }

      // No investment during repayment phase (all extra goes to mortgage)
      portfolio = portfolio * (1 + monthlyMarketReturn);
    } else {
      // Mortgage paid off — invest the full EMI + extra monthly
      const monthlyInvestment = inputs.monthlyEMI + inputs.extraMonthlyPayment;
      portfolio = portfolio * (1 + monthlyMarketReturn) + monthlyInvestment;
    }

    snapshots.push({
      month: m,
      year: Math.ceil(m / 12),
      prepayBalance: remaining,
      prepayEquity: homeValue - remaining,
      prepayPortfolio: portfolio,
      prepayNetWorth: (homeValue - remaining) + portfolio,
    });
  }

  const interestSaved = original.totalInterest - totalInterestPaid;
  const monthsSaved = inputs.remainingTenure - payoffMonth;

  return {
    scenario: {
      newTenureMonths: payoffMonth,
      interestSaved: Math.max(0, interestSaved),
      monthsSaved: Math.max(0, monthsSaved),
      totalInterestPaid,
      finalPortfolioValue: portfolio,
      finalNetWorth: homeValue + portfolio,
    },
    snapshots,
  };
};

/**
 * Simulate Scenario B: Keep mortgage on schedule, invest the extra in the market.
 */
const simulateScenarioB = (
  inputs: MortgagePayoffInputs,
  horizon: number
): { scenario: ScenarioBInvest; snapshots: Omit<MonthlySnapshot, 'prepayBalance' | 'prepayEquity' | 'prepayPortfolio' | 'prepayNetWorth'>[] } => {
  const monthlyRate = inputs.interestRate / 100 / 12;
  const monthlyMarketReturn = inputs.expectedMarketReturn / 100 / 12;
  // For net worth comparison, equity = principal paid down (balance reduction).
  // We use currentBalance as the baseline so equity = currentBalance - remaining.
  const homeValue = inputs.currentBalance;

  let remaining = inputs.currentBalance;
  let portfolio = inputs.lumpSumAmount; // lump sum goes to market
  let totalContributed = inputs.lumpSumAmount;
  const snapshots: Omit<MonthlySnapshot, 'prepayBalance' | 'prepayEquity' | 'prepayPortfolio' | 'prepayNetWorth'>[] = [];

  for (let m = 1; m <= horizon; m++) {
    // Pay only the regular EMI
    if (remaining > 0) {
      const interest = remaining * monthlyRate;
      const principal = Math.min(inputs.monthlyEMI - interest, remaining);
      remaining -= principal;
      if (remaining < 0.01) remaining = 0;
    }

    // Invest extra monthly payment
    portfolio = portfolio * (1 + monthlyMarketReturn) + inputs.extraMonthlyPayment;
    totalContributed += inputs.extraMonthlyPayment;

    snapshots.push({
      month: m,
      year: Math.ceil(m / 12),
      investBalance: remaining,
      investEquity: homeValue - remaining,
      investPortfolio: portfolio,
      investNetWorth: (homeValue - remaining) + portfolio,
    });
  }

  const grossProfit = portfolio - totalContributed;
  const taxPaid = Math.max(0, grossProfit * (inputs.capitalGainsTax / 100));
  const afterTaxPortfolio = portfolio - taxPaid;

  return {
    scenario: {
      totalInvestmentContributed: totalContributed,
      grossProfit,
      taxPaid,
      finalPortfolioValue: afterTaxPortfolio,
      finalNetWorth: homeValue + afterTaxPortfolio - remaining,
    },
    snapshots,
  };
};

/**
 * Find the breakeven ROI — the market return at which investing ties with prepaying.
 * Uses binary search on expected market return.
 */
const findBreakevenROI = (inputs: MortgagePayoffInputs, horizon: number): number => {
  let low = 0;
  let high = 50; // 50% annual return cap

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const testInputs = { ...inputs, expectedMarketReturn: mid };
    const a = simulateScenarioA(testInputs, horizon);
    const b = simulateScenarioB(testInputs, horizon);

    const diff = b.scenario.finalNetWorth - a.scenario.finalNetWorth;

    if (Math.abs(diff) < 100) break; // close enough
    if (diff > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.round(((low + high) / 2) * 100) / 100;
};

/**
 * Main calculation function
 */
export const calculateMortgagePayoff = (
  inputs: MortgagePayoffInputs
): MortgagePayoffResult => {
  // Validate inputs
  if (
    inputs.currentBalance <= 0 ||
    inputs.remainingTenure <= 0 ||
    inputs.monthlyEMI <= 0
  ) {
    return createEmptyResult();
  }

  const horizon = inputs.remainingTenure;

  // Original schedule
  const original = calculateOriginalSchedule(
    inputs.currentBalance,
    inputs.interestRate,
    inputs.remainingTenure,
    inputs.monthlyEMI
  );

  // Simulate both scenarios
  const resultA = simulateScenarioA(inputs, horizon);
  const resultB = simulateScenarioB(inputs, horizon);

  // Merge snapshot data
  const monthlyData: MonthlySnapshot[] = resultA.snapshots.map((a, i) => {
    const b = resultB.snapshots[i];
    return {
      ...a,
      investBalance: b.investBalance,
      investEquity: b.investEquity,
      investPortfolio: b.investPortfolio,
      investNetWorth: b.investNetWorth,
    };
  });

  // Determine winner
  const netWorthDiff =
    resultB.scenario.finalNetWorth - resultA.scenario.finalNetWorth;
  let winner: 'prepay' | 'invest' | 'neutral' = 'neutral';
  const threshold = Math.max(inputs.currentBalance * 0.01, 1000);
  if (netWorthDiff > threshold) {
    winner = 'invest';
  } else if (netWorthDiff < -threshold) {
    winner = 'prepay';
  }

  // Find breakeven ROI
  const breakevenROI = findBreakevenROI(inputs, horizon);

  // Cheap debt flag
  const effectiveRate = inputs.mortgageTaxDeduction > 0
    ? inputs.interestRate * (1 - inputs.mortgageTaxDeduction / 100)
    : inputs.interestRate;
  const cheapDebtFlag = effectiveRate < 5;
  const cheapDebtMessage = cheapDebtFlag
    ? `Your effective mortgage rate (${effectiveRate.toFixed(1)}%) is below 5%. Your debt is "cheap money" — investing is likely the superior strategy.`
    : '';

  return {
    winner,
    netWorthDiff: Math.abs(netWorthDiff),
    breakevenROI,
    scenarioA: resultA.scenario,
    scenarioB: resultB.scenario,
    originalTotalInterest: original.totalInterest,
    originalTotalPayment: original.totalPayment,
    monthlyData,
    cheapDebtFlag,
    cheapDebtMessage,
  };
};

const createEmptyResult = (): MortgagePayoffResult => ({
  winner: 'neutral',
  netWorthDiff: 0,
  breakevenROI: 0,
  scenarioA: {
    newTenureMonths: 0,
    interestSaved: 0,
    monthsSaved: 0,
    totalInterestPaid: 0,
    finalPortfolioValue: 0,
    finalNetWorth: 0,
  },
  scenarioB: {
    totalInvestmentContributed: 0,
    grossProfit: 0,
    taxPaid: 0,
    finalPortfolioValue: 0,
    finalNetWorth: 0,
  },
  originalTotalInterest: 0,
  originalTotalPayment: 0,
  monthlyData: [],
  cheapDebtFlag: false,
  cheapDebtMessage: '',
});

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatMonths = (months: number): string => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years}y ${remainingMonths}m`;
};
