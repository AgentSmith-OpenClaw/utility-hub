export interface BuyVsRentInputs {
  // Property Details
  homePrice: number;
  downPaymentPercent: number;
  loanTermYears: number;
  interestRate: number;
  
  // Buying Costs
  propertyTaxRate: number; // Annual percentage of home value
  homeInsurance: number; // Annual cost
  hoaMaintenance: number; // Monthly cost
  maintenanceRate: number; // Annual percentage of home value
  closingCostPercent: number; // Percentage of home price
  homeAppreciationRate: number; // Annual percentage
  
  // Renting Costs
  monthlyRent: number;
  rentersInsurance: number; // Monthly cost
  rentIncreaseRate: number; // Annual percentage
  
  // Investment & Other
  investmentReturnRate: number; // Annual return on invested savings
  marginalTaxRate: number; // For mortgage interest deduction
  yearsToAnalyze: number; // Time horizon
}

export interface MonthlyBreakdown {
  month: number;
  year: number;
  
  // Buying
  mortgagePayment: number;
  mortgagePrincipal: number;
  mortgageInterest: number;
  propertyTax: number;
  homeInsurance: number;
  hoaMaintenance: number;
  maintenance: number;
  homeValue: number;
  remainingLoanBalance: number;
  homeEquity: number;
  
  // Cumulative buying costs
  cumulativeMortgagePayments: number;
  cumulativePropertyTax: number;
  cumulativeInsurance: number;
  cumulativeMaintenance: number;
  cumulativeHOA: number;
  totalBuyingCost: number;
  
  // Renting
  rent: number;
  rentersInsurance: number;
  cumulativeRent: number;
  cumulativeRentersInsurance: number;
  totalRentingCost: number;
  
  // Investment & Net Worth
  buyingSavings: number; // What could have been invested if not buying
  rentingSavings: number; // Down payment + monthly diff invested
  buyingSavingsGrowth: number; // Cumulative investment growth
  rentingSavingsGrowth: number; // Cumulative investment growth
  
  buyingNetWorth: number; // Home equity + savings
  rentingNetWorth: number; // Investment portfolio value
  
  netWorthDifference: number; // Buying net worth - Renting net worth
}

export interface BuyVsRentResult {
  // Summary metrics
  downPayment: number;
  loanAmount: number;
  monthlyMortgage: number;
  closingCosts: number;
  
  // Total costs over analysis period
  totalBuyingCost: number;
  totalRentingCost: number;
  
  // Net worth at end of period
  finalBuyingNetWorth: number;
  finalRentingNetWorth: number;
  netWorthDifference: number;
  
  // Break-even analysis
  breakEvenMonth: number | null; // Month when buying becomes better
  breakEvenYears: number | null;
  
  // Monthly breakdown for charts
  monthlyData: MonthlyBreakdown[];
  
  // Recommendations
  recommendation: 'buy' | 'rent' | 'neutral';
  recommendationReason: string;
}

export const DEFAULT_BUY_VS_RENT_INPUTS: BuyVsRentInputs = {
  // Property Details
  homePrice: 500000,
  downPaymentPercent: 20,
  loanTermYears: 30,
  interestRate: 7.0,
  
  // Buying Costs
  propertyTaxRate: 1.2,
  homeInsurance: 1200,
  hoaMaintenance: 200,
  maintenanceRate: 1.0,
  closingCostPercent: 3.0,
  homeAppreciationRate: 3.0,
  
  // Renting Costs
  monthlyRent: 2500,
  rentersInsurance: 20,
  rentIncreaseRate: 3.0,
  
  // Investment & Other
  investmentReturnRate: 7.0,
  marginalTaxRate: 22.0,
  yearsToAnalyze: 10,
};
