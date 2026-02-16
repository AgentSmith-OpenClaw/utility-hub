export interface MortgagePayoffInputs {
  // Current Loan Details
  currentBalance: number;
  interestRate: number;
  remainingTenure: number; // months
  monthlyEMI: number;

  // Extra Capital
  lumpSumAmount: number;
  extraMonthlyPayment: number;

  // Investment Parameters
  expectedMarketReturn: number; // annual %
  capitalGainsTax: number; // %
  mortgageTaxDeduction: number; // % (optional, user's tax bracket)
}

export interface MonthlySnapshot {
  month: number;
  year: number;

  // Scenario A - Prepay
  prepayBalance: number;
  prepayEquity: number;
  prepayPortfolio: number;
  prepayNetWorth: number;

  // Scenario B - Invest
  investBalance: number;
  investEquity: number;
  investPortfolio: number;
  investNetWorth: number;
}

export interface ScenarioAPrepay {
  newTenureMonths: number;
  interestSaved: number;
  monthsSaved: number;
  totalInterestPaid: number;
  finalPortfolioValue: number;
  finalNetWorth: number;
}

export interface ScenarioBInvest {
  totalInvestmentContributed: number;
  grossProfit: number;
  taxPaid: number;
  finalPortfolioValue: number;
  finalNetWorth: number;
}

export interface MortgagePayoffResult {
  // Comparison
  winner: 'prepay' | 'invest' | 'neutral';
  netWorthDiff: number;
  breakevenROI: number;

  // Scenario details
  scenarioA: ScenarioAPrepay;
  scenarioB: ScenarioBInvest;

  // Original loan info
  originalTotalInterest: number;
  originalTotalPayment: number;

  // Monthly data for charts
  monthlyData: MonthlySnapshot[];

  // Flags
  cheapDebtFlag: boolean;
  cheapDebtMessage: string;
}

export const DEFAULT_MORTGAGE_PAYOFF_INPUTS: MortgagePayoffInputs = {
  currentBalance: 300000,
  interestRate: 6.5,
  remainingTenure: 300, // 25 years
  monthlyEMI: 2028,
  lumpSumAmount: 20000,
  extraMonthlyPayment: 500,
  expectedMarketReturn: 10,
  capitalGainsTax: 15,
  mortgageTaxDeduction: 0,
};
