export interface MortgageRefinanceInputs {
  currentBalance: number;
  currentRate: number;
  yearsRemaining: number;
  newRate: number;
  newTermYears: number;
  closingCosts: number;
  closingCostHandling: 'upfront' | 'roll';
  stayYears: number;
  cashOut: number;
}

export interface MortgageRefinanceResult {
  currentMonthlyPI: number;
  newMonthlyPI: number;
  monthlySavings: number;
  breakEvenMonths: number;
  breakEvenYears: number;
  currentTotalInterest: number;
  newTotalInterest: number;
  lifetimeInterestSavings: number;
  stayHorizonNetSavings: number;
  isWorthIt: boolean;
  cumulativeData: Array<{
    month: number;
    currentCumulative: number;
    newCumulative: number;
  }>;
}
