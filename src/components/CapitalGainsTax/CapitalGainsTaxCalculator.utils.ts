import type { CapitalGainsTaxInputs, CapitalGainsTaxResult, FilingStatus } from './CapitalGainsTaxCalculator.types';

export function fmtUSD(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

// 2026 federal ordinary-income brackets (IRS-projected; verify before launch).
const FEDERAL_BRACKETS_2026: Record<FilingStatus, [number, number][]> = {
  single: [
    [11_925, 0.10], [48_475, 0.12], [103_350, 0.22], [197_300, 0.24],
    [250_525, 0.32], [626_350, 0.35], [Infinity, 0.37],
  ],
  marriedFilingJointly: [
    [23_850, 0.10], [96_950, 0.12], [206_700, 0.22], [394_600, 0.24],
    [501_050, 0.32], [751_600, 0.35], [Infinity, 0.37],
  ],
  marriedFilingSeparately: [
    [11_925, 0.10], [48_475, 0.12], [103_350, 0.22], [197_300, 0.24],
    [250_525, 0.32], [626_350, 0.35], [Infinity, 0.37],
  ],
  headOfHousehold: [
    [17_000, 0.10], [64_850, 0.12], [103_350, 0.22], [197_300, 0.24],
    [250_500, 0.32], [626_350, 0.35], [Infinity, 0.37],
  ],
};

// 2026 long-term capital gains brackets (IRS-projected; verify before launch).
export const LTCG_BRACKETS_2026: Record<FilingStatus, { rate0Up: number; rate15Up: number }> = {
  single:                  { rate0Up: 48_350, rate15Up: 533_400 },
  marriedFilingJointly:    { rate0Up: 96_700, rate15Up: 600_050 },
  marriedFilingSeparately: { rate0Up: 48_350, rate15Up: 300_000 },
  headOfHousehold:         { rate0Up: 64_750, rate15Up: 566_700 },
};

export const NIIT_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200_000,
  marriedFilingJointly: 250_000,
  marriedFilingSeparately: 125_000,
  headOfHousehold: 200_000,
};

export const NIIT_RATE = 0.038;

function federalOrdinaryTax(income: number, brackets: [number, number][]): number {
  let tax = 0;
  let lower = 0;
  for (const [ceiling, rate] of brackets) {
    if (income <= lower) break;
    const taxable = Math.min(income, ceiling) - lower;
    tax += taxable * rate;
    lower = ceiling;
    if (ceiling === Infinity) break;
  }
  return tax;
}

// US state income tax rates (flat approximation for capital gains)
export const STATE_RATES: Record<string, number> = {
  AL: 5.0, AK: 0, AZ: 2.5, AR: 4.4, CA: 13.3, CO: 4.4, CT: 6.99,
  DE: 6.6, FL: 0, GA: 5.49, HI: 7.25, ID: 5.8, IL: 4.95, IN: 3.05,
  IA: 6.0, KS: 5.7, KY: 4.0, LA: 4.25, ME: 7.15, MD: 5.75, MA: 5.0,
  MI: 4.25, MN: 9.85, MS: 5.0, MO: 4.8, MT: 6.75, NE: 6.64, NV: 0,
  NH: 0, NJ: 10.75, NM: 5.9, NY: 10.9, NC: 4.5, ND: 2.5, OH: 3.99,
  OK: 4.75, OR: 9.9, PA: 3.07, RI: 5.99, SC: 6.5, SD: 0, TN: 0,
  TX: 0, UT: 4.65, VT: 8.75, VA: 5.75, WA: 7.0, WV: 6.5, WI: 7.65,
  WY: 0, DC: 10.75,
};

export function calculateCapitalGainsTax(inputs: CapitalGainsTaxInputs): CapitalGainsTaxResult {
  const {
    assetType, purchasePrice, salePrice, sellingFees, improvements,
    purchaseDate, saleDate, section121Eligible, filingStatus,
    otherOrdinaryIncome, otherInvestmentIncome, stateRate,
  } = inputs;

  const purchaseMs = new Date(purchaseDate).getTime();
  const saleMs = new Date(saleDate).getTime();
  const holdingDays = Math.max(0, Math.floor((saleMs - purchaseMs) / 86_400_000));
  const holdingType = holdingDays > 365 ? 'long' : 'short';

  const basis = purchasePrice + (assetType === 'real-estate' || assetType === 'primary-residence' ? improvements : 0);
  const proceeds = salePrice - sellingFees;
  const grossGain = proceeds - basis;

  // Section 121 exclusion (primary residence)
  let section121Excluded = 0;
  let taxableGain = grossGain;
  if (assetType === 'primary-residence' && section121Eligible && grossGain > 0) {
    const exclusion = filingStatus === 'marriedFilingJointly' ? 500_000 : 250_000;
    section121Excluded = Math.min(grossGain, exclusion);
    taxableGain = Math.max(0, grossGain - section121Excluded);
  }

  if (grossGain <= 0) {
    return {
      holdingDays, holdingType, basis, proceeds, grossGain,
      section121Excluded: 0, taxableGain: 0,
      federalShortTax: 0, federalLongTax: 0, niit: 0, stateTax: 0,
      totalTax: 0, netProceeds: proceeds, effectiveRate: 0, isLoss: true,
      ltcgBracketFill: { gainIn0: 0, gainIn15: 0, gainIn20: 0 },
      shortVsLongComparison: [],
    };
  }

  const brackets = FEDERAL_BRACKETS_2026[filingStatus];
  let federalShortTax = 0;
  let federalLongTax = 0;
  let ltcgBracketFill = { gainIn0: 0, gainIn15: 0, gainIn20: 0 };

  if (holdingType === 'short') {
    const baseline = federalOrdinaryTax(otherOrdinaryIncome, brackets);
    const withGain = federalOrdinaryTax(otherOrdinaryIncome + taxableGain, brackets);
    federalShortTax = withGain - baseline;
  } else {
    const { rate0Up, rate15Up } = LTCG_BRACKETS_2026[filingStatus];

    if (assetType === 'collectibles') {
      // Simplified: cap at 28% for collectibles
      federalLongTax = taxableGain * 0.28;
    } else {
      const zeroRoom = Math.max(0, rate0Up - otherOrdinaryIncome);
      const fifteenRoom = Math.max(0, rate15Up - otherOrdinaryIncome - zeroRoom);

      const gainIn0 = Math.min(taxableGain, zeroRoom);
      const remaining = taxableGain - gainIn0;
      const gainIn15 = Math.min(remaining, fifteenRoom);
      const gainIn20 = remaining - gainIn15;

      federalLongTax = gainIn15 * 0.15 + gainIn20 * 0.20;
      ltcgBracketFill = { gainIn0, gainIn15, gainIn20 };
    }
  }

  // NIIT
  const magi = otherOrdinaryIncome + otherInvestmentIncome + taxableGain;
  const niitThreshold = NIIT_THRESHOLDS[filingStatus];
  const investmentIncome = otherInvestmentIncome + taxableGain;
  const niit = Math.max(0, Math.min(investmentIncome, magi - niitThreshold)) * NIIT_RATE;

  const stateTax = taxableGain * (stateRate / 100);
  const totalTax = federalShortTax + federalLongTax + niit + stateTax;
  const netProceeds = proceeds - totalTax;
  const effectiveRate = grossGain > 0 ? totalTax / grossGain : 0;

  // Short vs long comparison for sensitivity chart
  let shortVsLongComparison: { label: string; tax: number }[] = [];
  if (holdingType === 'short') {
    shortVsLongComparison = [{ label: 'Short-term (now)', tax: Math.round(totalTax) }];
    // Simulate long-term scenario
    const { rate0Up: r0, rate15Up: r15 } = LTCG_BRACKETS_2026[filingStatus];
    const zr = Math.max(0, r0 - otherOrdinaryIncome);
    const fr = Math.max(0, r15 - otherOrdinaryIncome - zr);
    const g0 = Math.min(taxableGain, zr);
    const rem = taxableGain - g0;
    const g15 = Math.min(rem, fr);
    const g20 = rem - g15;
    const ltFed = g15 * 0.15 + g20 * 0.20;
    const ltTotal = ltFed + niit + stateTax;
    shortVsLongComparison.push({ label: 'Long-term (if waited)', tax: Math.round(ltTotal) });
  }

  return {
    holdingDays, holdingType, basis, proceeds, grossGain,
    section121Excluded, taxableGain,
    federalShortTax, federalLongTax, niit, stateTax,
    totalTax, netProceeds, effectiveRate, isLoss: false,
    ltcgBracketFill,
    shortVsLongComparison,
  };
}
