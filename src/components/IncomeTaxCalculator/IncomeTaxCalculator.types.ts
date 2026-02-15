export type TaxRegime = 'old' | 'new';

export interface IncomeTaxInputs {
  annualSalary: number;
  interestIncome: number;
  rentalIncome: number;
  otherIncome: number;
  
  // Deductions (Old Regime)
  section80C: number;
  section80D: number;
  hraExemption: number;
  homeLoanInterest24b: number;
  nps80CCD1B: number;
  otherDeductions: number;
  
  isSalaried: boolean;
}

export interface SlabDetail {
  range: string;
  rate: number;
  taxableAmount: number;
  tax: number;
}

export interface TaxBreakdown {
  regime: TaxRegime;
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  rebate87A: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  takeHomeIncome: number;
  effectiveRate: number;
  marginalRate: number;
  monthlyTax: number;
  monthlyTakeHome: number;
  slabBreakdown: SlabDetail[];
}

export interface IncomeTaxResult {
  oldRegime: TaxBreakdown;
  newRegime: TaxBreakdown;
  recommendedRegime: TaxRegime;
  savings: number;
  incomeWiseTax: { income: number; oldTax: number; newTax: number }[];
}

export const DEFAULT_INPUTS: IncomeTaxInputs = {
  annualSalary: 1500000,
  interestIncome: 0,
  rentalIncome: 0,
  otherIncome: 0,
  section80C: 150000,
  section80D: 25000,
  hraExemption: 0,
  homeLoanInterest24b: 0,
  nps80CCD1B: 0,
  otherDeductions: 0,
  isSalaried: true,
};
