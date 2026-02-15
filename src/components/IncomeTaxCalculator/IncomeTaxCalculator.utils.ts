import { 
  IncomeTaxInputs, 
  IncomeTaxResult, 
  TaxBreakdown, 
  TaxRegime 
} from './IncomeTaxCalculator.types';

const calculateTaxForSlabs = (taxableIncome: number, slabs: { limit: number; rate: number }[]): number => {
  let tax = 0;
  let remainingIncome = taxableIncome;
  let previousLimit = 0;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;
    const taxableInThisSlab = Math.min(remainingIncome, slab.limit - previousLimit);
    tax += (taxableInThisSlab * slab.rate) / 100;
    remainingIncome -= taxableInThisSlab;
    previousLimit = slab.limit;
  }

  if (remainingIncome > 0) {
    tax += (remainingIncome * slabs[slabs.length - 1].rate) / 100; // This shouldn't really happen if slabs are defined correctly
  }

  return tax;
};

const calculateOldRegimeTax = (inputs: IncomeTaxInputs): TaxBreakdown => {
  const grossIncome = inputs.annualSalary + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
  
  let totalDeductions = 0;
  if (inputs.isSalaried) {
    totalDeductions += 50000; // Standard Deduction
  }
  totalDeductions += Math.min(inputs.section80C, 150000);
  totalDeductions += Math.min(inputs.section80D, 100000); // Max limit varies but 1L is safe for calculation
  totalDeductions += inputs.hraExemption;
  totalDeductions += Math.min(inputs.homeLoanInterest24b, 200000);
  totalDeductions += Math.min(inputs.nps80CCD1B, 50000);
  totalDeductions += inputs.otherDeductions;

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  const slabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 5 },
    { limit: 1000000, rate: 20 },
    { limit: Infinity, rate: 30 },
  ];

  let taxBeforeCess = calculateTaxForSlabs(taxableIncome, slabs);
  
  // Rebate 87A (Old Regime: Up to 12.5k for income <= 5L)
  let rebate87A = 0;
  if (taxableIncome <= 500000) {
    rebate87A = Math.min(taxBeforeCess, 12500);
  }

  taxBeforeCess -= rebate87A;
  const cess = (taxBeforeCess * 4) / 100;
  const totalTax = taxBeforeCess + cess;

  return {
    regime: 'old',
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
    rebate87A,
    cess,
    totalTax,
    takeHomeIncome: grossIncome - totalTax,
  };
};

const calculateNewRegimeTax = (inputs: IncomeTaxInputs): TaxBreakdown => {
  const grossIncome = inputs.annualSalary + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
  
  let totalDeductions = 0;
  if (inputs.isSalaried) {
    totalDeductions += 75000; // Standard Deduction FY 25-26
  }

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // New slabs for FY 2025-26
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 5 },
    { limit: 1200000, rate: 10 },
    { limit: 1600000, rate: 15 },
    { limit: 2000000, rate: 20 },
    { limit: 2400000, rate: 25 },
    { limit: Infinity, rate: 30 },
  ];

  let taxBeforeCess = calculateTaxForSlabs(taxableIncome, slabs);

  // Rebate 87A (New Regime: Up to 60k for income <= 12L)
  let rebate87A = 0;
  if (taxableIncome <= 1200000) {
    rebate87A = Math.min(taxBeforeCess, 60000);
  }

  taxBeforeCess -= rebate87A;
  const cess = (taxBeforeCess * 4) / 100;
  const totalTax = taxBeforeCess + cess;

  return {
    regime: 'new',
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
    rebate87A,
    cess,
    totalTax,
    takeHomeIncome: grossIncome - totalTax,
  };
};

export const calculateIncomeTax = (inputs: IncomeTaxInputs): IncomeTaxResult => {
  const oldRegime = calculateOldRegimeTax(inputs);
  const newRegime = calculateNewRegimeTax(inputs);

  const recommendedRegime = newRegime.totalTax <= oldRegime.totalTax ? 'new' : 'old';
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return {
    oldRegime,
    newRegime,
    recommendedRegime,
    savings,
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
