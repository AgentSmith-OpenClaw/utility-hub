import type { RMDInputs, RMDResult, RMDYearData } from './RMDCalculator.types';

export function fmtUSD(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

// IRS Uniform Lifetime Table — effective 2022 (SECURE Act 2.0)
// Source: IRS Publication 590-B, Appendix B, Table III.
export const UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
  79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
  86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
  93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8,
  100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3,
  107: 4.1, 108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1,
  114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3, 120: 2.0,
};

export function calculateRMD(inputs: RMDInputs): RMDResult {
  const { priorYearBalance, currentAge, marginalTaxRate, expectedReturn, projectUntilAge } = inputs;

  if (currentAge < 73) {
    return {
      currentRMD: 0, estimatedFedTax: 0, netAfterTax: 0, divisorUsed: 0,
      projection: [], cumulativeRMDs: 0, cumulativeTaxes: 0,
      finalBalance: priorYearBalance, notYetRequired: true,
    };
  }

  const clampedAge = Math.min(Math.max(currentAge, 73), 120);
  const divisorUsed = UNIFORM_LIFETIME_TABLE[clampedAge] ?? 2.0;
  const currentRMD = priorYearBalance / divisorUsed;
  const taxRate = marginalTaxRate / 100;
  const estimatedFedTax = currentRMD * taxRate;
  const netAfterTax = currentRMD - estimatedFedTax;

  const projection: RMDYearData[] = [];
  let balance = priorYearBalance;
  let cumulativeRMD = 0;
  let cumulativeTax = 0;
  const returnRate = expectedReturn / 100;

  for (let age = clampedAge; age <= Math.min(projectUntilAge, 120); age++) {
    const divisor = UNIFORM_LIFETIME_TABLE[age] ?? 2.0;
    const rmd = balance / divisor;
    const fedTax = rmd * taxRate;
    const net = rmd - fedTax;
    cumulativeRMD += rmd;
    cumulativeTax += fedTax;
    const remaining = balance - rmd;
    balance = remaining * (1 + returnRate);
    projection.push({
      age, balance: Math.round(balance), divisor, rmd: Math.round(rmd),
      federalTax: Math.round(fedTax), netAfterTax: Math.round(net),
      cumulativeRMD: Math.round(cumulativeRMD), cumulativeTax: Math.round(cumulativeTax),
    });
  }

  return {
    currentRMD, estimatedFedTax, netAfterTax, divisorUsed,
    projection, cumulativeRMDs: cumulativeRMD, cumulativeTaxes: cumulativeTax,
    finalBalance: balance, notYetRequired: false,
  };
}
