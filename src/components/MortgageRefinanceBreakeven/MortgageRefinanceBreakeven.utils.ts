import type { MortgageRefinanceInputs, MortgageRefinanceResult } from './MortgageRefinanceBreakeven.types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function monthlyRate(annualPct: number): number {
  return annualPct / 100 / 12;
}

function pmt(principal: number, rate: number, periods: number): number {
  if (rate === 0) return principal / periods;
  const r = rate;
  const n = periods;
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

export function calculateRefinance(inputs: MortgageRefinanceInputs): MortgageRefinanceResult {
  const {
    currentBalance,
    currentRate,
    yearsRemaining,
    newRate,
    newTermYears,
    closingCosts,
    closingCostHandling,
    stayYears,
    cashOut,
  } = inputs;

  const r_current = monthlyRate(currentRate);
  const n_current = yearsRemaining * 12;
  const currentMonthlyPI = pmt(currentBalance, r_current, n_current);

  const newPrincipal = currentBalance + cashOut + (closingCostHandling === 'roll' ? closingCosts : 0);
  const r_new = monthlyRate(newRate);
  const n_new = newTermYears * 12;
  const newMonthlyPI = pmt(newPrincipal, r_new, n_new);

  const monthlySavings = currentMonthlyPI - newMonthlyPI;
  const upfrontCost = closingCostHandling === 'upfront' ? closingCosts : 0;

  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(upfrontCost / monthlySavings) : Infinity;
  const breakEvenYears = breakEvenMonths === Infinity ? Infinity : breakEvenMonths / 12;

  const currentTotalInterest = Math.max(0, currentMonthlyPI * n_current - currentBalance);
  const newTotalInterest = Math.max(0, newMonthlyPI * n_new - newPrincipal);
  const lifetimeInterestSavings = currentTotalInterest - newTotalInterest;

  const monthsInHorizon = stayYears * 12;
  const totalPaymentsCurrent = currentMonthlyPI * Math.min(monthsInHorizon, n_current);
  const totalPaymentsNew = newMonthlyPI * Math.min(monthsInHorizon, n_new) + upfrontCost;
  const stayHorizonNetSavings = totalPaymentsCurrent - totalPaymentsNew;

  // Build cumulative cost data for chart (up to 360 months, sample every 6)
  const maxMonths = Math.max(n_current, n_new, 360);
  const cumulativeData: MortgageRefinanceResult['cumulativeData'] = [];
  let cumCurrent = 0;
  let cumNew = upfrontCost;
  for (let m = 0; m <= maxMonths; m += 6) {
    cumCurrent += currentMonthlyPI * Math.min(6, Math.max(0, n_current - (m - 6)));
    cumNew += newMonthlyPI * Math.min(6, Math.max(0, n_new - (m - 6)));
    cumulativeData.push({
      month: m,
      currentCumulative: Math.round(cumCurrent),
      newCumulative: Math.round(cumNew),
    });
  }

  return {
    currentMonthlyPI,
    newMonthlyPI,
    monthlySavings,
    breakEvenMonths,
    breakEvenYears,
    currentTotalInterest,
    newTotalInterest,
    lifetimeInterestSavings,
    stayHorizonNetSavings,
    isWorthIt: stayHorizonNetSavings > 0,
    cumulativeData,
  };
}
