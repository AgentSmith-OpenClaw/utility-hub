export type FIREType = 'lean' | 'regular' | 'fat' | 'coast' | 'barista';
export type Currency = 'USD' | 'INR';

export interface FIRETypeInfo {
  type: FIREType;
  label: string;
  icon: string;
  description: string;
  expenseMultiplier: number;
  color: string;
  gradient: string;
}

export interface FIREInputs {
  currentAge: number;
  lifeExpectancy: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  withdrawalRate: number;
  stockAllocation: number;
  fireType: FIREType;
  monthlyPartTimeIncome: number;
  currency: Currency;
}

export interface YearlyProjection {
  year: number;
  age: number;
  startBalance: number;
  contributions: number;
  growth: number;
  endBalance: number;
  totalContributed: number;
  totalGrowth: number;
  inflationAdjustedExpenses: number;
  fireNumber: number;
  isFIREd: boolean;
  withdrawal: number;
}

export interface FIREMilestone {
  label: string;
  targetAmount: number;
  yearsToReach: number;
  ageAtMilestone: number;
  icon: string;
}

export interface FIREResult {
  fireNumber: number;
  yearsToFIRE: number;
  fireAge: number;
  monthlySavingsNeeded: number;
  annualSavings: number;
  savingsRate: number;
  projections: YearlyProjection[];
  milestones: FIREMilestone[];
  coastFIRENumber: number;
  coastFIREAge: number | null;
  portfolioAtRetirement: number;
  inflationAdjustedExpensesAtFIRE: number;
  safeWithdrawalAmount: number;
  yearsMoneyLasts: number;
  portfolioAtLifeExpectancy: number;
  totalContributions: number;
  totalGrowth: number;
}
