export type FIREType = 'lean' | 'regular' | 'fat' | 'coast' | 'barista';
export type Currency = 'USD' | 'INR';
export type CalculationMode = 'standard' | 'reverse'; // standard = calculate years; reverse = "I want to retire in X years"

export interface FIRETypeInfo {
  type: FIREType;
  label: string;
  icon: string;
  tagline: string;
  description: string;
  expenseMultiplier: number;
  color: string;
  gradient: string;
  bgLight: string;
  borderColor: string;
}

export interface FIREInputs {
  currentAge: number;
  lifeExpectancy: number;
  monthlyIncome: number;

  // Split expenses
  monthlyFixedExpenses: number;   // rent, utilities, insurance, groceries, EMIs
  monthlyLifestyleExpenses: number; // dining, movies, vacations, shopping, hobbies

  currentSavings: number;
  monthlyContribution: number; // amount you invest towards retirement each month
  expectedReturn: number;
  inflationRate: number;
  withdrawalRate: number;
  stockAllocation: number;
  fireType: FIREType;
  monthlyPartTimeIncome: number;
  currency: Currency;

  // Reverse mode
  calculationMode: CalculationMode;
  targetYearsToFIRE: number; // used in reverse mode
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

export interface FIRETypeComparison {
  type: FIREType;
  label: string;
  icon: string;
  tagline: string;
  description: string;
  fireNumber: number;
  fireNumberInflationAdjusted: number;
  yearsToFIRE: number;
  fireAge: number;
  fireYear: number;
  monthlyWithdrawal: number;
  annualWithdrawal: number;
  requiredMonthlyContribution: number;
  portfolioAtRetirement: number;
}

export interface PostFIREProjection {
  year: number;
  age: number;
  startBalance: number;
  withdrawal: number;
  growth: number;
  endBalance: number;
}

export interface FIREResult {
  fireNumber: number;
  fireNumberInflationAdjusted: number;
  yearsToFIRE: number;
  monthsToFIRE: number;
  fireAge: number;
  fireYear: number;
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
  safeMonthlyWithdrawal: number;
  todayWithdrawalAnnual: number;
  todayWithdrawalMonthly: number;
  yearsMoneyLasts: number;
  portfolioAtLifeExpectancy: number;
  totalContributions: number;
  totalGrowth: number;

  // Income breakdown
  monthlyExpenses: number;
  monthlyMisc: number;
  monthlyFixed: number;
  monthlyLifestyle: number;

  // Reverse mode results
  requiredMonthlyContribution: number;
  
  // All FIRE type comparisons
  allFireTypes: FIRETypeComparison[];

  // Post-FIRE life projections (no contributions, only withdrawals)
  postFIREProjections: PostFIREProjection[];
}
