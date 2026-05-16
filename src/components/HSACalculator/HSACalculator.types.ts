export type CoverageType = 'selfOnly' | 'family';
export type ContributionMethod = 'payroll' | 'outside';

export interface HSAInputs {
  coverageType: CoverageType;
  currentAge: number;
  yearsUntilUse: number;
  currentBalance: number;
  annualContribution: number;
  contributionMethod: ContributionMethod;
  employerContribution: number;
  expectedReturn: number;
  fedRate: number;
  stateRate: number;
  annualMedicalWithdrawals: number;
}

export interface HSAYearData {
  year: number;
  hsaBalance: number;
  taxableBalance: number;
  contribution: number;
  growth: number;
}

export interface HSAResult {
  employeeMax: number;
  effectiveAnnualContribution: number;
  fedSavings: number;
  stateSavings: number;
  ficaSavings: number;
  totalYear1Tax: number;
  effectiveCost: number;
  hsaFinal: number;
  taxableFinal: number;
  hsaAdvantage: number;
  totalTaxSaved: number;
  projection: HSAYearData[];
  overContribution: boolean;
}
