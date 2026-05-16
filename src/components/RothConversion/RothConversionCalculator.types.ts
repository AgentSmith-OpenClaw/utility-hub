export type FilingStatus = 'single' | 'marriedFilingJointly' | 'headOfHousehold';
export type TaxSource = 'outside' | 'withhold';

export interface RothConversionInputs {
  conversionAmount: number;
  taxSource: TaxSource;
  filingStatus: FilingStatus;
  otherIncome: number;
  stateRate: number;
  currentAge: number;
  yearsUntilWithdrawal: number;
  expectedReturn: number;
  retirementTaxRate: number;
}

export interface BracketBreakdown {
  rate: number;
  amountInBracket: number;
  tax: number;
}

export interface RothConversionResult {
  federalConversionTax: number;
  stateConversionTax: number;
  totalConversionTax: number;
  effectiveConversionRate: number;
  rothFinalAfterTax: number;
  tradFinalAfterTax: number;
  netBenefitOfConverting: number;
  worthConverting: boolean;
  bracketsBefore: BracketBreakdown[];
  bracketsUsed: BracketBreakdown[];
  growthData: Array<{ year: number; roth: number; traditional: number }>;
}
