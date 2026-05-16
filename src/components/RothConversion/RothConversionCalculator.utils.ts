import type { RothConversionInputs, RothConversionResult, BracketBreakdown } from './RothConversionCalculator.types';
import type { FilingStatus } from './RothConversionCalculator.types';

export function fmtUSD(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

// 2026 federal ordinary-income brackets (IRS-projected; verify before launch).
// Update these annually when IRS publishes new figures.
export const TAX_YEAR = 2026 as const;
export const FEDERAL_BRACKETS_2026: Record<FilingStatus, [number, number][]> = {
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
};

function federalTax(income: number, brackets: [number, number][]): { total: number; breakdown: BracketBreakdown[] } {
  let tax = 0;
  let lower = 0;
  const breakdown: BracketBreakdown[] = [];
  for (const [ceiling, rate] of brackets) {
    if (income <= lower) break;
    const taxableInBracket = Math.min(income, ceiling) - lower;
    const bracketTax = taxableInBracket * rate;
    tax += bracketTax;
    if (taxableInBracket > 0) breakdown.push({ rate: rate * 100, amountInBracket: taxableInBracket, tax: bracketTax });
    lower = ceiling;
    if (ceiling === Infinity) break;
  }
  return { total: tax, breakdown };
}

export function calculateRothConversion(inputs: RothConversionInputs): RothConversionResult {
  const { conversionAmount, taxSource, filingStatus, otherIncome, stateRate, yearsUntilWithdrawal, expectedReturn, retirementTaxRate } = inputs;
  const brackets = FEDERAL_BRACKETS_2026[filingStatus];
  const r = expectedReturn / 100;
  const n = yearsUntilWithdrawal;

  const baseTax = federalTax(otherIncome, brackets);
  const withConvTax = federalTax(otherIncome + conversionAmount, brackets);
  const federalConversionTax = withConvTax.total - baseTax.total;
  const stateConversionTax = conversionAmount * (stateRate / 100);
  const totalConversionTax = federalConversionTax + stateConversionTax;
  const effectiveConversionRate = conversionAmount > 0 ? totalConversionTax / conversionAmount : 0;

  const conversionOnlyBrackets: BracketBreakdown[] = withConvTax.breakdown.map((b, i) => {
    const baseBracket = baseTax.breakdown[i];
    const base = baseBracket ? baseBracket.amountInBracket : 0;
    const inc = b.amountInBracket - base;
    return { rate: b.rate, amountInBracket: Math.max(0, inc), tax: Math.max(0, b.tax - (baseBracket ? baseBracket.tax : 0)) };
  }).filter(b => b.amountInBracket > 0);

  let rothToday: number;
  if (taxSource === 'outside') {
    rothToday = conversionAmount;
  } else {
    rothToday = conversionAmount - totalConversionTax;
  }

  const rothFinal = Math.max(0, rothToday) * Math.pow(1 + r, n);
  const rothFinalAfterTax = rothFinal; // tax-free at retirement

  const tradAtRetirement = conversionAmount * Math.pow(1 + r, n);
  const tradFinalAfterTax = tradAtRetirement * (1 - retirementTaxRate / 100);

  const netBenefitOfConverting = rothFinalAfterTax - tradFinalAfterTax;

  const growthData: RothConversionResult['growthData'] = [];
  for (let y = 1; y <= n; y++) {
    const roth = Math.round(Math.max(0, rothToday) * Math.pow(1 + r, y) );
    const trad = Math.round(conversionAmount * Math.pow(1 + r, y) * (1 - retirementTaxRate / 100));
    if (y % Math.max(1, Math.floor(n / 20)) === 0 || y === n) growthData.push({ year: y, roth, traditional: trad });
  }

  return {
    federalConversionTax, stateConversionTax, totalConversionTax, effectiveConversionRate,
    rothFinalAfterTax, tradFinalAfterTax, netBenefitOfConverting,
    worthConverting: netBenefitOfConverting > 0,
    bracketsBefore: baseTax.breakdown, bracketsUsed: conversionOnlyBrackets, growthData,
  };
}
