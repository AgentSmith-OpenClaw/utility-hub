export type AnnuityMode = 'immediate' | 'deferred' | 'fixedPeriod';
export type PaymentFrequency = 'monthly' | 'quarterly' | 'annually';
export type TvmSolveFor = 'payment' | 'futureValue' | 'presentValue';
export type PaymentTiming = 'ordinary' | 'due';

export interface ImmediateInputs {
  principal: number;
  annualRate: number;
  years: number;
  frequency: PaymentFrequency;
  cola: number;
}

export interface DeferredInputs {
  startingBalance: number;
  periodicContribution: number;
  contribFrequency: PaymentFrequency;
  yearsAccumulation: number;
  expectedReturn: number;
  showIncome: boolean;
  incomeYears: number;
}

export interface FixedPeriodInputs {
  solveFor: TvmSolveFor;
  presentValue: number;
  payment: number;
  futureValue: number;
  annualRate: number;
  years: number;
  frequency: PaymentFrequency;
  timing: PaymentTiming;
}

export interface AnnuityInputs {
  mode: AnnuityMode;
  immediate: ImmediateInputs;
  deferred: DeferredInputs;
  fixedPeriod: FixedPeriodInputs;
}

export interface ImmediateResult {
  periodicPayment: number;
  totalPayout: number;
  totalInterest: number;
  firstPayment?: number;
  lastPayment?: number;
  balanceData: Array<{ period: number; balance: number }>;
}

export interface DeferredResult {
  projectedBalance: number;
  totalContributions: number;
  totalGrowth: number;
  monthlyIncome?: number;
  growthData: Array<{ year: number; contributions: number; growth: number; total: number }>;
}

export interface FixedPeriodResult {
  solved: number;
  solvedLabel: string;
}

export interface AnnuityResult {
  immediate?: ImmediateResult;
  deferred?: DeferredResult;
  fixedPeriod?: FixedPeriodResult;
}
