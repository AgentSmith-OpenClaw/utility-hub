export type Currency = 'USD' | 'INR';
export type StepUpMode = 'percent' | 'fixed';
export type PlannerMode = 'wealth' | 'goal';

export interface SIPInputs {
  monthlyInvestment: number;
  tenureYears: number;
  annualReturn: number;
  lumpsumAmount: number;
  stepUpMode: StepUpMode;
  stepUpValue: number;
  inflationEnabled: boolean;
  inflationRate: number;
  mode: PlannerMode;
  targetCorpus: number;
  currency: Currency;
  compareWithFlat: boolean;
}

export interface SIPYearProjection {
  year: number;
  yearlyInvestment: number;
  totalInvested: number;
  interestEarned: number;
  yearlyInterestEarned: number;
  totalCorpus: number;
  realCorpus: number;
  monthlySip: number;
}

export interface DelayCostEntry {
  delayYears: number;
  corpus: number;
  totalInvested: number;
  loss: number;
}

export interface SIPResult {
  estimatedCorpus: number;
  totalInvested: number;
  wealthGained: number;
  purchasingPower: number;
  requiredMonthlyInvestment: number;
  finalMonthlyInvestment: number;
  goalGap: number;
  yearlyBreakdown: SIPYearProjection[];
  flatYearlyBreakdown: SIPYearProjection[];
  flatCorpus: number;
  flatWealthGained: number;
  xirr: number;
  absoluteReturn: number;
  delayCostData: DelayCostEntry[];
}
