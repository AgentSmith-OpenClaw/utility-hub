import type {
  PayFrequency,
  FilingStatus,
  USStateCode,
  USPaycheckInputs,
  PaycheckBreakdown,
} from './USPaycheckCalculator.types';

// ---------------------------------------------------------------------------
// 2025 Federal tax brackets
// ---------------------------------------------------------------------------

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const FEDERAL_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  married_jointly: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  married_separately: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 375800, rate: 0.35 },
    { min: 375800, max: Infinity, rate: 0.37 },
  ],
};

// ---------------------------------------------------------------------------
// 2025 Standard deductions
// ---------------------------------------------------------------------------

const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 15000,
  married_jointly: 30000,
  head_of_household: 22500,
  married_separately: 15000,
};

// ---------------------------------------------------------------------------
// 2025 FICA constants
// ---------------------------------------------------------------------------

const SS_RATE = 0.062;
const SS_WAGE_BASE = 176100;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200000,
  married_jointly: 250000,
  head_of_household: 200000,
  married_separately: 200000,
};

// ---------------------------------------------------------------------------
// State tax configurations – all 50 states + DC
// ---------------------------------------------------------------------------

interface StateTaxConfig {
  name: string;
  brackets: TaxBracket[];
  standardDeduction?: number;
  personalExemption?: number;
  hasLocalTax?: boolean;
  // Some flat-tax states apply to all income with no deduction
  flatRate?: number;
  usesFederalAGI?: boolean;
}

const STATE_TAX_CONFIGS: Record<string, StateTaxConfig> = {
  // --- No income tax states ---
  AK: { name: 'Alaska', brackets: [] },
  FL: { name: 'Florida', brackets: [] },
  NV: { name: 'Nevada', brackets: [] },
  NH: { name: 'New Hampshire', brackets: [] },
  SD: { name: 'South Dakota', brackets: [] },
  TN: { name: 'Tennessee', brackets: [] },
  TX: { name: 'Texas', brackets: [] },
  WA: { name: 'Washington', brackets: [] },
  WY: { name: 'Wyoming', brackets: [] },

  // --- Flat tax states ---
  CO: { name: 'Colorado', brackets: [], flatRate: 0.044, standardDeduction: 15000 },
  IL: { name: 'Illinois', brackets: [], flatRate: 0.0495, personalExemption: 2775 },
  IN: { name: 'Indiana', brackets: [], flatRate: 0.0305, hasLocalTax: true },
  KY: { name: 'Kentucky', brackets: [], flatRate: 0.04, standardDeduction: 3160 },
  MA: { name: 'Massachusetts', brackets: [], flatRate: 0.05, personalExemption: 4400 },
  MI: { name: 'Michigan', brackets: [], flatRate: 0.0425, personalExemption: 5600 },
  NC: { name: 'North Carolina', brackets: [], flatRate: 0.045, standardDeduction: 12750 },
  PA: { name: 'Pennsylvania', brackets: [], flatRate: 0.0307, hasLocalTax: true },
  UT: { name: 'Utah', brackets: [], flatRate: 0.0465 },

  // --- Progressive states ---
  AL: {
    name: 'Alabama',
    standardDeduction: 2500,
    personalExemption: 1500,
    brackets: [
      { min: 0, max: 500, rate: 0.02 },
      { min: 500, max: 3000, rate: 0.04 },
      { min: 3000, max: Infinity, rate: 0.05 },
    ],
  },
  AZ: {
    name: 'Arizona',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: Infinity, rate: 0.025 },
    ],
  },
  AR: {
    name: 'Arkansas',
    standardDeduction: 2340,
    brackets: [
      { min: 0, max: 4400, rate: 0.02 },
      { min: 4400, max: 8800, rate: 0.04 },
      { min: 8800, max: 24300, rate: 0.039 },
      { min: 24300, max: Infinity, rate: 0.044 },
    ],
  },
  CA: {
    name: 'California',
    standardDeduction: 5540,
    personalExemption: 144,
    brackets: [
      { min: 0, max: 10412, rate: 0.01 },
      { min: 10412, max: 24684, rate: 0.02 },
      { min: 24684, max: 38959, rate: 0.04 },
      { min: 38959, max: 54081, rate: 0.06 },
      { min: 54081, max: 68350, rate: 0.08 },
      { min: 68350, max: 349137, rate: 0.093 },
      { min: 349137, max: 418961, rate: 0.103 },
      { min: 418961, max: 698271, rate: 0.113 },
      { min: 698271, max: 1000000, rate: 0.123 },
      { min: 1000000, max: Infinity, rate: 0.133 },
    ],
  },
  CT: {
    name: 'Connecticut',
    personalExemption: 15000,
    brackets: [
      { min: 0, max: 10000, rate: 0.02 },
      { min: 10000, max: 50000, rate: 0.045 },
      { min: 50000, max: 100000, rate: 0.055 },
      { min: 100000, max: 200000, rate: 0.06 },
      { min: 200000, max: 250000, rate: 0.065 },
      { min: 250000, max: 500000, rate: 0.069 },
      { min: 500000, max: Infinity, rate: 0.0699 },
    ],
  },
  DE: {
    name: 'Delaware',
    standardDeduction: 3250,
    personalExemption: 110,
    brackets: [
      { min: 0, max: 2000, rate: 0.0 },
      { min: 2000, max: 5000, rate: 0.022 },
      { min: 5000, max: 10000, rate: 0.039 },
      { min: 10000, max: 20000, rate: 0.048 },
      { min: 20000, max: 25000, rate: 0.052 },
      { min: 25000, max: 60000, rate: 0.0555 },
      { min: 60000, max: Infinity, rate: 0.066 },
    ],
  },
  DC: {
    name: 'District of Columbia',
    standardDeduction: 15000,
    brackets: [
      { min: 0, max: 10000, rate: 0.04 },
      { min: 10000, max: 40000, rate: 0.06 },
      { min: 40000, max: 60000, rate: 0.065 },
      { min: 60000, max: 250000, rate: 0.085 },
      { min: 250000, max: 500000, rate: 0.0925 },
      { min: 500000, max: 1000000, rate: 0.0975 },
      { min: 1000000, max: Infinity, rate: 0.1075 },
    ],
  },
  GA: {
    name: 'Georgia',
    standardDeduction: 12000,
    brackets: [
      { min: 0, max: Infinity, rate: 0.0549 },
    ],
  },
  HI: {
    name: 'Hawaii',
    standardDeduction: 2200,
    personalExemption: 1144,
    brackets: [
      { min: 0, max: 2400, rate: 0.014 },
      { min: 2400, max: 4800, rate: 0.032 },
      { min: 4800, max: 9600, rate: 0.055 },
      { min: 9600, max: 14400, rate: 0.064 },
      { min: 14400, max: 19200, rate: 0.068 },
      { min: 19200, max: 24000, rate: 0.072 },
      { min: 24000, max: 36000, rate: 0.076 },
      { min: 36000, max: 48000, rate: 0.079 },
      { min: 48000, max: 150000, rate: 0.0825 },
      { min: 150000, max: 175000, rate: 0.09 },
      { min: 175000, max: 200000, rate: 0.10 },
      { min: 200000, max: Infinity, rate: 0.11 },
    ],
  },
  ID: {
    name: 'Idaho',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: Infinity, rate: 0.058 },
    ],
  },
  IA: {
    name: 'Iowa',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: 6210, rate: 0.044 },
      { min: 6210, max: 31050, rate: 0.0482 },
      { min: 31050, max: Infinity, rate: 0.057 },
    ],
  },
  KS: {
    name: 'Kansas',
    standardDeduction: 3500,
    personalExemption: 2250,
    brackets: [
      { min: 0, max: 15000, rate: 0.031 },
      { min: 15000, max: 30000, rate: 0.0525 },
      { min: 30000, max: Infinity, rate: 0.057 },
    ],
  },
  LA: {
    name: 'Louisiana',
    standardDeduction: 12500,
    brackets: [
      { min: 0, max: 12500, rate: 0.0185 },
      { min: 12500, max: 50000, rate: 0.035 },
      { min: 50000, max: Infinity, rate: 0.0425 },
    ],
  },
  ME: {
    name: 'Maine',
    standardDeduction: 14600,
    personalExemption: 4700,
    brackets: [
      { min: 0, max: 26050, rate: 0.058 },
      { min: 26050, max: 61600, rate: 0.0675 },
      { min: 61600, max: Infinity, rate: 0.0715 },
    ],
  },
  MD: {
    name: 'Maryland',
    standardDeduction: 2550,
    personalExemption: 3200,
    hasLocalTax: true,
    brackets: [
      { min: 0, max: 1000, rate: 0.02 },
      { min: 1000, max: 2000, rate: 0.03 },
      { min: 2000, max: 3000, rate: 0.04 },
      { min: 3000, max: 100000, rate: 0.0475 },
      { min: 100000, max: 125000, rate: 0.05 },
      { min: 125000, max: 150000, rate: 0.0525 },
      { min: 150000, max: 250000, rate: 0.055 },
      { min: 250000, max: Infinity, rate: 0.0575 },
    ],
  },
  MN: {
    name: 'Minnesota',
    standardDeduction: 14575,
    brackets: [
      { min: 0, max: 31690, rate: 0.0535 },
      { min: 31690, max: 104090, rate: 0.068 },
      { min: 104090, max: 183340, rate: 0.0785 },
      { min: 183340, max: Infinity, rate: 0.0985 },
    ],
  },
  MS: {
    name: 'Mississippi',
    standardDeduction: 2300,
    personalExemption: 6000,
    brackets: [
      { min: 0, max: 10000, rate: 0.0 },
      { min: 10000, max: Infinity, rate: 0.047 },
    ],
  },
  MO: {
    name: 'Missouri',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: 1207, rate: 0.0 },
      { min: 1207, max: 2414, rate: 0.02 },
      { min: 2414, max: 3621, rate: 0.025 },
      { min: 3621, max: 4828, rate: 0.03 },
      { min: 4828, max: 6035, rate: 0.035 },
      { min: 6035, max: 7242, rate: 0.04 },
      { min: 7242, max: 8449, rate: 0.045 },
      { min: 8449, max: Infinity, rate: 0.048 },
    ],
  },
  MT: {
    name: 'Montana',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: 20500, rate: 0.047 },
      { min: 20500, max: Infinity, rate: 0.059 },
    ],
  },
  NE: {
    name: 'Nebraska',
    standardDeduction: 8000,
    brackets: [
      { min: 0, max: 3700, rate: 0.0246 },
      { min: 3700, max: 22170, rate: 0.0351 },
      { min: 22170, max: 35730, rate: 0.0501 },
      { min: 35730, max: Infinity, rate: 0.0584 },
    ],
  },
  NJ: {
    name: 'New Jersey',
    personalExemption: 1000,
    brackets: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20000, max: 35000, rate: 0.0175 },
      { min: 35000, max: 40000, rate: 0.035 },
      { min: 40000, max: 75000, rate: 0.05525 },
      { min: 75000, max: 500000, rate: 0.0637 },
      { min: 500000, max: 1000000, rate: 0.0897 },
      { min: 1000000, max: Infinity, rate: 0.1075 },
    ],
  },
  NM: {
    name: 'New Mexico',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: 5500, rate: 0.017 },
      { min: 5500, max: 11000, rate: 0.032 },
      { min: 11000, max: 16000, rate: 0.047 },
      { min: 16000, max: 210000, rate: 0.049 },
      { min: 210000, max: Infinity, rate: 0.059 },
    ],
  },
  NY: {
    name: 'New York',
    standardDeduction: 8000,
    hasLocalTax: true,
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 80650, rate: 0.0585 },
      { min: 80650, max: 215400, rate: 0.0625 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: 5000000, rate: 0.0965 },
      { min: 5000000, max: 25000000, rate: 0.103 },
      { min: 25000000, max: Infinity, rate: 0.109 },
    ],
  },
  ND: {
    name: 'North Dakota',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: 44725, rate: 0.0 },
      { min: 44725, max: Infinity, rate: 0.0195 },
    ],
  },
  OH: {
    name: 'Ohio',
    brackets: [
      { min: 0, max: 26050, rate: 0.0 },
      { min: 26050, max: 100000, rate: 0.0275 },
      { min: 100000, max: Infinity, rate: 0.035 },
    ],
    hasLocalTax: true,
  },
  OK: {
    name: 'Oklahoma',
    standardDeduction: 6350,
    personalExemption: 1000,
    brackets: [
      { min: 0, max: 1000, rate: 0.0025 },
      { min: 1000, max: 2500, rate: 0.0075 },
      { min: 2500, max: 3750, rate: 0.0175 },
      { min: 3750, max: 4900, rate: 0.0275 },
      { min: 4900, max: 7200, rate: 0.0375 },
      { min: 7200, max: Infinity, rate: 0.0475 },
    ],
  },
  OR: {
    name: 'Oregon',
    standardDeduction: 2745,
    brackets: [
      { min: 0, max: 4300, rate: 0.0475 },
      { min: 4300, max: 10750, rate: 0.0675 },
      { min: 10750, max: 125000, rate: 0.0875 },
      { min: 125000, max: Infinity, rate: 0.099 },
    ],
  },
  RI: {
    name: 'Rhode Island',
    standardDeduction: 10550,
    brackets: [
      { min: 0, max: 77450, rate: 0.0375 },
      { min: 77450, max: 176050, rate: 0.0475 },
      { min: 176050, max: Infinity, rate: 0.0599 },
    ],
  },
  SC: {
    name: 'South Carolina',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: 3460, rate: 0.0 },
      { min: 3460, max: 17330, rate: 0.03 },
      { min: 17330, max: Infinity, rate: 0.064 },
    ],
  },
  VT: {
    name: 'Vermont',
    standardDeduction: 14600,
    brackets: [
      { min: 0, max: 45400, rate: 0.0335 },
      { min: 45400, max: 110050, rate: 0.066 },
      { min: 110050, max: 229550, rate: 0.076 },
      { min: 229550, max: Infinity, rate: 0.0875 },
    ],
  },
  VA: {
    name: 'Virginia',
    standardDeduction: 8000,
    personalExemption: 930,
    brackets: [
      { min: 0, max: 3000, rate: 0.02 },
      { min: 3000, max: 5000, rate: 0.03 },
      { min: 5000, max: 17000, rate: 0.05 },
      { min: 17000, max: Infinity, rate: 0.0575 },
    ],
  },
  WV: {
    name: 'West Virginia',
    standardDeduction: 2000,
    personalExemption: 2000,
    brackets: [
      { min: 0, max: 10000, rate: 0.0236 },
      { min: 10000, max: 25000, rate: 0.0315 },
      { min: 25000, max: 40000, rate: 0.0354 },
      { min: 40000, max: 60000, rate: 0.0472 },
      { min: 60000, max: Infinity, rate: 0.0512 },
    ],
  },
  WI: {
    name: 'Wisconsin',
    standardDeduction: 13230,
    brackets: [
      { min: 0, max: 14320, rate: 0.035 },
      { min: 14320, max: 28640, rate: 0.044 },
      { min: 28640, max: 315310, rate: 0.053 },
      { min: 315310, max: Infinity, rate: 0.0765 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helper: compute progressive tax from brackets
// ---------------------------------------------------------------------------

function computeProgressiveTax(income: number, brackets: TaxBracket[]): number {
  if (income <= 0) return 0;
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }
  return tax;
}

function getTopBracketRate(income: number, brackets: TaxBracket[]): number {
  if (income <= 0 || brackets.length === 0) return 0;
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income > brackets[i].min) return brackets[i].rate;
  }
  return brackets[0].rate;
}

// ---------------------------------------------------------------------------
// Public: pay frequency helpers
// ---------------------------------------------------------------------------

export function getPeriodsPerYear(frequency: PayFrequency): number {
  switch (frequency) {
    case 'annual': return 1;
    case 'monthly': return 12;
    case 'biweekly': return 26;
    case 'weekly': return 52;
    case 'hourly': return 2080; // default hours per year
  }
}

export function annualizeIncome(
  grossIncome: number,
  payFrequency: PayFrequency,
  hoursPerYear = 2080,
): number {
  if (payFrequency === 'hourly') return grossIncome * hoursPerYear;
  return grossIncome * getPeriodsPerYear(payFrequency);
}

// ---------------------------------------------------------------------------
// Public: standard deduction
// ---------------------------------------------------------------------------

export function getStandardDeduction(filingStatus: FilingStatus): number {
  return STANDARD_DEDUCTIONS[filingStatus];
}

// ---------------------------------------------------------------------------
// Public: federal income tax
// ---------------------------------------------------------------------------

export function calculateFederalTax(
  taxableIncome: number,
  filingStatus: FilingStatus,
): number {
  return computeProgressiveTax(Math.max(0, taxableIncome), FEDERAL_BRACKETS[filingStatus]);
}

export function getMarginalFederalRate(
  taxableIncome: number,
  filingStatus: FilingStatus,
): number {
  return getTopBracketRate(Math.max(0, taxableIncome), FEDERAL_BRACKETS[filingStatus]);
}

// ---------------------------------------------------------------------------
// Public: state income tax
// ---------------------------------------------------------------------------

export function calculateStateTax(
  taxableIncome: number,
  stateCode: USStateCode,
  filingStatus: FilingStatus,
): number {
  const config = STATE_TAX_CONFIGS[stateCode];
  if (!config) return 0;

  // No income tax states
  if (config.brackets.length === 0 && config.flatRate === undefined) return 0;

  let stateTaxableIncome = Math.max(0, taxableIncome);

  // Apply state standard deduction if any
  if (config.standardDeduction) {
    // For MFJ, some states double the deduction – use a simple multiplier
    const deductionMultiplier = filingStatus === 'married_jointly' ? 2 : 1;
    // Cap it: some states cap their deduction, but for simplicity use as-is
    const deduction = config.standardDeduction *
      (stateCode === 'CA' || stateCode === 'OR' || stateCode === 'DE' || stateCode === 'MD'
        ? deductionMultiplier : 1);
    stateTaxableIncome = Math.max(0, stateTaxableIncome - deduction);
  }

  // Apply personal exemption if any
  if (config.personalExemption) {
    stateTaxableIncome = Math.max(0, stateTaxableIncome - config.personalExemption);
  }

  // Flat rate states
  if (config.flatRate !== undefined) {
    return Math.max(0, stateTaxableIncome) * config.flatRate;
  }

  return computeProgressiveTax(stateTaxableIncome, config.brackets);
}

export function getMarginalStateRate(
  taxableIncome: number,
  stateCode: USStateCode,
  filingStatus: FilingStatus,
): number {
  const config = STATE_TAX_CONFIGS[stateCode];
  if (!config) return 0;
  if (config.brackets.length === 0 && config.flatRate === undefined) return 0;
  if (config.flatRate !== undefined) return config.flatRate;

  let stateTaxableIncome = Math.max(0, taxableIncome);
  if (config.standardDeduction) {
    const deductionMultiplier = filingStatus === 'married_jointly' ? 2 : 1;
    const deduction = config.standardDeduction *
      (stateCode === 'CA' || stateCode === 'OR' || stateCode === 'DE' || stateCode === 'MD'
        ? deductionMultiplier : 1);
    stateTaxableIncome = Math.max(0, stateTaxableIncome - deduction);
  }
  if (config.personalExemption) {
    stateTaxableIncome = Math.max(0, stateTaxableIncome - config.personalExemption);
  }
  return getTopBracketRate(stateTaxableIncome, config.brackets);
}

// ---------------------------------------------------------------------------
// Public: FICA
// ---------------------------------------------------------------------------

export function calculateFICA(
  grossAnnual: number,
  filingStatus: FilingStatus,
): { socialSecurity: number; medicare: number; total: number } {
  const ssWages = Math.min(grossAnnual, SS_WAGE_BASE);
  const socialSecurity = ssWages * SS_RATE;

  let medicare = grossAnnual * MEDICARE_RATE;
  const additionalThreshold = ADDITIONAL_MEDICARE_THRESHOLDS[filingStatus];
  if (grossAnnual > additionalThreshold) {
    medicare += (grossAnnual - additionalThreshold) * ADDITIONAL_MEDICARE_RATE;
  }

  return { socialSecurity, medicare, total: socialSecurity + medicare };
}

// ---------------------------------------------------------------------------
// Public: main calculation
// ---------------------------------------------------------------------------

export function calculatePaycheck(inputs: USPaycheckInputs): PaycheckBreakdown {
  const periodsPerYear = getPeriodsPerYear(inputs.payFrequency);
  const grossAnnual = annualizeIncome(
    inputs.grossIncome,
    inputs.payFrequency,
    inputs.payPeriodsWorked,
  );

  const { retirement401k, hsaContribution, traditionalIRA } = inputs.preTaxDeductions;
  const totalPreTaxDeductions = retirement401k + hsaContribution + traditionalIRA;

  // Federal taxable income: gross - pre-tax deductions - standard deduction
  const standardDeduction = getStandardDeduction(inputs.filingStatus);
  const federalAGI = grossAnnual - totalPreTaxDeductions;
  const taxableIncome = Math.max(0, federalAGI - standardDeduction);

  // Federal income tax (including extra withholding from W-4 allowances)
  const federalIncomeTax = calculateFederalTax(taxableIncome, inputs.filingStatus)
    + inputs.allowances * periodsPerYear;

  // State income tax – uses AGI (gross minus pre-tax deductions) as starting point
  const stateIncomeTax = calculateStateTax(federalAGI, inputs.state, inputs.filingStatus);

  // FICA – 401k and IRA do NOT reduce FICA wages; HSA does (cafeteria plan)
  const ficaWages = grossAnnual - hsaContribution;
  const fica = calculateFICA(ficaWages, inputs.filingStatus);

  const totalTax = federalIncomeTax + stateIncomeTax + fica.total;
  const netAnnual = grossAnnual - totalPreTaxDeductions - federalIncomeTax - stateIncomeTax - fica.total;

  // Marginal rates
  const marginalFederalRate = getMarginalFederalRate(taxableIncome, inputs.filingStatus);
  const marginalStateRate = getMarginalStateRate(federalAGI, inputs.state, inputs.filingStatus);

  // Tax savings calculations – difference in tax if deduction were $0
  const taxSavingsFrom401k = retirement401k > 0
    ? calculateFederalTax(Math.max(0, grossAnnual - hsaContribution - traditionalIRA - standardDeduction), inputs.filingStatus)
      + calculateStateTax(grossAnnual - hsaContribution - traditionalIRA, inputs.state, inputs.filingStatus)
      - calculateFederalTax(taxableIncome, inputs.filingStatus)
      - calculateStateTax(federalAGI, inputs.state, inputs.filingStatus)
    : 0;

  const taxSavingsFromHSA = hsaContribution > 0
    ? calculateFederalTax(Math.max(0, grossAnnual - retirement401k - traditionalIRA - standardDeduction), inputs.filingStatus)
      + calculateStateTax(grossAnnual - retirement401k - traditionalIRA, inputs.state, inputs.filingStatus)
      + calculateFICA(grossAnnual - retirement401k - traditionalIRA, inputs.filingStatus).total  // HSA also reduces FICA
      - calculateFederalTax(taxableIncome, inputs.filingStatus)
      - calculateStateTax(federalAGI, inputs.state, inputs.filingStatus)
      - fica.total
    : 0;

  const taxSavingsFromIRA = traditionalIRA > 0
    ? calculateFederalTax(Math.max(0, grossAnnual - retirement401k - hsaContribution - standardDeduction), inputs.filingStatus)
      + calculateStateTax(grossAnnual - retirement401k - hsaContribution, inputs.state, inputs.filingStatus)
      - calculateFederalTax(taxableIncome, inputs.filingStatus)
      - calculateStateTax(federalAGI, inputs.state, inputs.filingStatus)
    : 0;

  // Per-period breakdown
  const grossPerPeriod = grossAnnual / periodsPerYear;
  const netPerPeriod = netAnnual / periodsPerYear;

  const perPeriod = {
    gross: grossPerPeriod,
    federal: federalIncomeTax / periodsPerYear,
    state: stateIncomeTax / periodsPerYear,
    socialSecurity: fica.socialSecurity / periodsPerYear,
    medicare: fica.medicare / periodsPerYear,
    retirement401k: retirement401k / periodsPerYear,
    hsa: hsaContribution / periodsPerYear,
    ira: traditionalIRA / periodsPerYear,
    net: netPerPeriod,
  };

  // Monthly breakdown (12 entries for chart display)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyBreakdown = months.map((month) => ({
    month,
    gross: grossAnnual / 12,
    federal: federalIncomeTax / 12,
    state: stateIncomeTax / 12,
    fica: fica.total / 12,
    deductions: totalPreTaxDeductions / 12,
    net: netAnnual / 12,
  }));

  const effectiveTaxRate = grossAnnual > 0 ? totalTax / grossAnnual : 0;

  return {
    grossAnnual,
    grossPerPeriod,
    totalPreTaxDeductions,
    taxableIncome,
    standardDeduction,
    taxes: {
      federalIncomeTax,
      stateIncomeTax,
      socialSecurity: fica.socialSecurity,
      medicare: fica.medicare,
      totalFICA: fica.total,
      totalTax,
    },
    netAnnual,
    netPerPeriod,
    effectiveTaxRate,
    marginalFederalRate,
    marginalStateRate,
    periodsPerYear,
    perPeriod,
    monthlyBreakdown,
    taxSavingsFrom401k,
    taxSavingsFromHSA,
    taxSavingsFromIRA,
  };
}

// ---------------------------------------------------------------------------
// Public: state list for UI dropdowns
// ---------------------------------------------------------------------------

export function getStateList(): Array<{ code: string; name: string }> {
  return Object.entries(STATE_TAX_CONFIGS)
    .map(([code, config]) => ({ code, name: config.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------------------
// Public: formatting
// ---------------------------------------------------------------------------

export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
