import { 
  IncomeTaxInputs, 
  IncomeTaxResult, 
  TaxBreakdown, 
  TaxRegime,
  SlabDetail
} from './IncomeTaxCalculator.types';

interface Slab {
  limit: number;
  rate: number;
  label: string;
}

const calculateTaxForSlabs = (taxableIncome: number, slabs: Slab[]): { tax: number; slabBreakdown: SlabDetail[] } => {
  let tax = 0;
  let remainingIncome = taxableIncome;
  let previousLimit = 0;
  const slabBreakdown: SlabDetail[] = [];

  for (const slab of slabs) {
    if (remainingIncome <= 0) {
      slabBreakdown.push({ range: slab.label, rate: slab.rate, taxableAmount: 0, tax: 0 });
      previousLimit = slab.limit;
      continue;
    }
    const taxableInThisSlab = Math.min(remainingIncome, slab.limit - previousLimit);
    const slabTax = (taxableInThisSlab * slab.rate) / 100;
    tax += slabTax;
    slabBreakdown.push({ range: slab.label, rate: slab.rate, taxableAmount: taxableInThisSlab, tax: slabTax });
    remainingIncome -= taxableInThisSlab;
    previousLimit = slab.limit;
  }

  return { tax, slabBreakdown };
};

const getMarginalRate = (taxableIncome: number, slabs: Slab[]): number => {
  let previousLimit = 0;
  for (const slab of slabs) {
    if (taxableIncome <= slab.limit) return slab.rate;
    previousLimit = slab.limit;
  }
  return slabs[slabs.length - 1].rate;
};

const calculateSurcharge = (taxBeforeSurcharge: number, taxableIncome: number, regime: TaxRegime = 'old'): number => {
  if (taxableIncome <= 5000000) return 0;
  
  let rate = 0;
  if (taxableIncome <= 10000000) rate = 0.10;
  else if (taxableIncome <= 20000000) rate = 0.15;
  else if (taxableIncome <= 50000000) rate = 0.25;
  else rate = (regime === 'new') ? 0.25 : 0.37; // New regime surcharge capped at 25% (Finance Act 2023)

  const surcharge = taxBeforeSurcharge * rate;

  // Marginal Relief on Surcharge
  // Surcharge payable shall not exceed the amount being the difference between (Taxable Income - Threshold) 
  // plus the surcharge that would have been payable if the income was exactly the threshold.
  const thresholds = [
    { limit: 5000000, surchargeRate: 0.10, prevSurchargeRate: 0 },
    { limit: 10000000, surchargeRate: 0.15, prevSurchargeRate: 0.10 },
    { limit: 20000000, surchargeRate: 0.25, prevSurchargeRate: 0.15 },
    { limit: 50000000, surchargeRate: regime === 'new' ? 0.25 : 0.37, prevSurchargeRate: 0.25 }
  ];

  for (const t of thresholds) {
    if (taxableIncome > t.limit) {
      // Calculate tax at threshold to determine marginal relief
      // We need a way to get tax at threshold without recursion if possible,
      // but since tax calculation is linear, we can use a simplified version.
      const slabs = regime === 'new' ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
      const { tax: taxAtThreshold } = calculateTaxForSlabs(t.limit, slabs);
      
      // Rebate at threshold (only for first threshold if relevant, but 50L is way past rebates)
      let rebateAtThreshold = 0;
      if (regime === 'old' && t.limit <= 500000) rebateAtThreshold = Math.min(taxAtThreshold, 12500);
      if (regime === 'new' && t.limit <= 1200000) rebateAtThreshold = Math.min(taxAtThreshold, 60000);
      
      const taxAfterRebateAtThreshold = taxAtThreshold - rebateAtThreshold;
      const surchargeAtThreshold = taxAfterRebateAtThreshold * t.prevSurchargeRate;
      const totalTaxAtThreshold = taxAfterRebateAtThreshold + surchargeAtThreshold;

      const currentTotalTaxWithoutRelief = taxBeforeSurcharge + surcharge;
      const incomeExcess = taxableIncome - t.limit;
      
      const maxAllowedTotalTax = totalTaxAtThreshold + incomeExcess;

      if (currentTotalTaxWithoutRelief > maxAllowedTotalTax) {
        return maxAllowedTotalTax - taxBeforeSurcharge;
      }
    }
  }

  return surcharge;
};

const OLD_REGIME_SLABS: Slab[] = [
  { limit: 250000, rate: 0, label: 'Up to ₹2.5L' },
  { limit: 500000, rate: 5, label: '₹2.5L – ₹5L' },
  { limit: 1000000, rate: 20, label: '₹5L – ₹10L' },
  { limit: Infinity, rate: 30, label: 'Above ₹10L' },
];

const NEW_REGIME_SLABS: Slab[] = [
  { limit: 400000, rate: 0, label: 'Up to ₹4L' },
  { limit: 800000, rate: 5, label: '₹4L – ₹8L' },
  { limit: 1200000, rate: 10, label: '₹8L – ₹12L' },
  { limit: 1600000, rate: 15, label: '₹12L – ₹16L' },
  { limit: 2000000, rate: 20, label: '₹16L – ₹20L' },
  { limit: 2400000, rate: 25, label: '₹20L – ₹24L' },
  { limit: Infinity, rate: 30, label: 'Above ₹24L' },
];

const calculateOldRegimeTax = (inputs: IncomeTaxInputs): TaxBreakdown => {
  const grossIncome = inputs.annualSalary + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
  
  let totalDeductions = 0;
  if (inputs.isSalaried) {
    totalDeductions += 50000; // Standard Deduction
  }
  totalDeductions += Math.min(inputs.section80C, 150000);
  totalDeductions += Math.min(inputs.section80D, 100000);
  totalDeductions += inputs.hraExemption;
  totalDeductions += Math.min(inputs.homeLoanInterest24b, 200000);
  totalDeductions += Math.min(inputs.nps80CCD1B, 50000);
  totalDeductions += inputs.otherDeductions;

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  const { tax: rawTax, slabBreakdown } = calculateTaxForSlabs(taxableIncome, OLD_REGIME_SLABS);
  const marginalRate = getMarginalRate(taxableIncome, OLD_REGIME_SLABS);
  
  // Rebate 87A (Old Regime: Up to 12.5k for income <= 5L)
  let rebate87A = 0;
  if (taxableIncome <= 500000) {
    rebate87A = Math.min(rawTax, 12500);
  }

  let taxAfterRebate = rawTax - rebate87A;
  const surcharge = calculateSurcharge(taxAfterRebate, taxableIncome, 'old');
  const taxBeforeCess = taxAfterRebate + surcharge;
  const cess = (taxBeforeCess * 4) / 100;
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    regime: 'old',
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
    rebate87A,
    surcharge,
    cess,
    totalTax,
    takeHomeIncome: grossIncome - totalTax,
    effectiveRate,
    marginalRate,
    monthlyTax: Math.round(totalTax / 12),
    monthlyTakeHome: Math.round((grossIncome - totalTax) / 12),
    slabBreakdown,
  };
};

const calculateNewRegimeTax = (inputs: IncomeTaxInputs): TaxBreakdown => {
  const grossIncome = inputs.annualSalary + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
  
  let totalDeductions = 0;
  if (inputs.isSalaried) {
    totalDeductions += 75000; // Standard Deduction FY 25-26
  }

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  const { tax: rawTax, slabBreakdown } = calculateTaxForSlabs(taxableIncome, NEW_REGIME_SLABS);
  const marginalRate = getMarginalRate(taxableIncome, NEW_REGIME_SLABS);

  // Rebate 87A (New Regime: Up to 60k for income <= 12L)
  let rebate87A = 0;
  if (taxableIncome <= 1200000) {
    rebate87A = Math.min(rawTax, 60000);
  } else if (taxableIncome > 1200000 && taxableIncome <= 1275000) {
    // Marginal Relief for 87A in New Regime (Budget 2025)
    // The tax payable cannot exceed the income exceeding 12,00,000 (after standard deduction)
    // Effectively: tax = taxableIncome - 12,00,000
    const taxAtThreshold = 0; // Tax is 0 at 12L due to 60k rebate
    const excessIncome = taxableIncome - 1200000;
    if (rawTax > excessIncome) {
      rebate87A = rawTax - excessIncome;
    }
  }

  let taxAfterRebate = rawTax - rebate87A;
  const surcharge = calculateSurcharge(taxAfterRebate, taxableIncome, 'new');
  const taxBeforeCess = taxAfterRebate + surcharge;
  const cess = (taxBeforeCess * 4) / 100;
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    regime: 'new',
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
    rebate87A,
    surcharge,
    cess,
    totalTax,
    takeHomeIncome: grossIncome - totalTax,
    effectiveRate,
    marginalRate,
    monthlyTax: Math.round(totalTax / 12),
    monthlyTakeHome: Math.round((grossIncome - totalTax) / 12),
    slabBreakdown,
  };
};

// Generate tax comparison across income levels
const generateIncomeWiseTax = (inputs: IncomeTaxInputs): { income: number; oldTax: number; newTax: number }[] => {
  const points = [];
  const maxIncome = Math.max(inputs.annualSalary * 2, 5000000);
  const step = maxIncome <= 2000000 ? 100000 : maxIncome <= 5000000 ? 250000 : 500000;
  
  for (let income = 0; income <= maxIncome; income += step) {
    const testInputs = { ...inputs, annualSalary: income, interestIncome: 0, rentalIncome: 0, otherIncome: 0 };
    const oldResult = calculateOldRegimeTax(testInputs);
    const newResult = calculateNewRegimeTax(testInputs);
    points.push({ income, oldTax: oldResult.totalTax, newTax: newResult.totalTax });
  }
  
  return points;
};

export const calculateIncomeTax = (inputs: IncomeTaxInputs): IncomeTaxResult => {
  const oldRegime = calculateOldRegimeTax(inputs);
  const newRegime = calculateNewRegimeTax(inputs);

  const recommendedRegime = newRegime.totalTax <= oldRegime.totalTax ? 'new' : 'old';
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);
  const incomeWiseTax = generateIncomeWiseTax(inputs);

  return {
    oldRegime,
    newRegime,
    recommendedRegime,
    savings,
    incomeWiseTax,
  };
};

export const formatCurrency = (value: number, compact = false): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: compact ? 'compact' : 'standard',
  }).format(value);
};
