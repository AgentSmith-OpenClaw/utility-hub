export type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'semi-annually' | 'annually';

export interface CompoundInterestInputs {
  initialPrincipal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  compoundingFrequency: CompoundingFrequency;
  inflationRate: number;
}

export interface YearData {
  year: number;
  balance: number;
  totalPrincipal: number;
  totalInterest: number;
  annualInterest: number;
  realValue: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalPrincipal: number;
  totalInterest: number;
  realValue: number;
  yearlyData: YearData[];
}

export const COMPOUNDING_FREQUENCIES: Record<CompoundingFrequency, number> = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  'semi-annually': 2,
  annually: 1,
};

export const DEFAULT_INPUTS: CompoundInterestInputs = {
  initialPrincipal: 100000,
  monthlyContribution: 10000,
  annualRate: 10,
  years: 20,
  compoundingFrequency: 'monthly',
  inflationRate: 6,
};
