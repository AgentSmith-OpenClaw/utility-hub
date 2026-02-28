// Pay frequency options
export type PayFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly' | 'hourly';

// Filing status
export type FilingStatus = 'single' | 'married_jointly' | 'married_separately' | 'head_of_household';

// US State code (2-letter abbreviation)
export type USStateCode = string;

export interface PreTaxDeductions {
  retirement401k: number;
  hsaContribution: number;
  traditionalIRA: number;
}

export interface USPaycheckInputs {
  grossIncome: number;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  state: USStateCode;
  preTaxDeductions: PreTaxDeductions;
  allowances: number;
  payPeriodsWorked: number;
}

export interface TaxBreakdown {
  federalIncomeTax: number;
  stateIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  totalFICA: number;
  totalTax: number;
}

export interface PaycheckBreakdown {
  grossAnnual: number;
  grossPerPeriod: number;
  totalPreTaxDeductions: number;
  taxableIncome: number;
  standardDeduction: number;
  taxes: TaxBreakdown;
  netAnnual: number;
  netPerPeriod: number;
  effectiveTaxRate: number;
  marginalFederalRate: number;
  marginalStateRate: number;
  periodsPerYear: number;
  perPeriod: {
    gross: number;
    federal: number;
    state: number;
    socialSecurity: number;
    medicare: number;
    retirement401k: number;
    hsa: number;
    ira: number;
    net: number;
  };
  monthlyBreakdown: Array<{
    month: string;
    gross: number;
    federal: number;
    state: number;
    fica: number;
    deductions: number;
    net: number;
  }>;
  taxSavingsFrom401k: number;
  taxSavingsFromHSA: number;
  taxSavingsFromIRA: number;
}

export const DEFAULT_INPUTS: USPaycheckInputs = {
  grossIncome: 75000,
  payFrequency: 'annual',
  filingStatus: 'single',
  state: 'CA',
  preTaxDeductions: {
    retirement401k: 0,
    hsaContribution: 0,
    traditionalIRA: 0,
  },
  allowances: 0,
  payPeriodsWorked: 2080,
};
