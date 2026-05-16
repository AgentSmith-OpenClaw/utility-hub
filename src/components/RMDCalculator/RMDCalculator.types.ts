export type FilingStatus = 'single' | 'marriedFilingJointly' | 'headOfHousehold';

export interface RMDInputs {
  priorYearBalance: number;
  currentAge: number;
  useJointLife: boolean;
  marginalTaxRate: number;
  filingStatus: FilingStatus;
  expectedReturn: number;
  projectUntilAge: number;
}

export interface RMDYearData {
  age: number;
  balance: number;
  divisor: number;
  rmd: number;
  federalTax: number;
  netAfterTax: number;
  cumulativeRMD: number;
  cumulativeTax: number;
}

export interface RMDResult {
  currentRMD: number;
  estimatedFedTax: number;
  netAfterTax: number;
  divisorUsed: number;
  projection: RMDYearData[];
  cumulativeRMDs: number;
  cumulativeTaxes: number;
  finalBalance: number;
  notYetRequired: boolean;
}
