import { BuyVsRentInputs, BuyVsRentResult, MonthlyBreakdown } from './BuyVsRent.types';

/**
 * Calculate monthly mortgage payment using standard mortgage formula
 */
export const calculateMonthlyMortgage = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / (years * 12);
  
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  const payment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return payment;
};

/**
 * Calculate remaining loan balance after N payments
 */
export const calculateRemainingBalance = (
  principal: number,
  monthlyPayment: number,
  annualRate: number,
  monthsPaid: number
): number => {
  if (principal <= 0 || monthsPaid <= 0) return principal;
  if (annualRate === 0) {
    return Math.max(0, principal - (monthlyPayment * monthsPaid));
  }
  
  const monthlyRate = annualRate / 100 / 12;
  
  const remaining =
    principal * Math.pow(1 + monthlyRate, monthsPaid) -
    monthlyPayment * ((Math.pow(1 + monthlyRate, monthsPaid) - 1) / monthlyRate);
  
  return Math.max(0, remaining);
};

/**
 * Calculate Buy vs Rent analysis
 */
export const calculateBuyVsRent = (inputs: BuyVsRentInputs): BuyVsRentResult => {
  // Basic validations
  if (inputs.homePrice <= 0 || inputs.yearsToAnalyze <= 0) {
    return createEmptyResult();
  }
  
  // Calculate upfront costs
  const downPayment = (inputs.homePrice * inputs.downPaymentPercent) / 100;
  const loanAmount = inputs.homePrice - downPayment;
  const closingCosts = (inputs.homePrice * inputs.closingCostPercent) / 100;
  const totalUpfrontCost = downPayment + closingCosts;
  
  // Calculate monthly mortgage payment
  const monthlyMortgage = calculateMonthlyMortgage(
    loanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );
  
  const totalMonths = inputs.yearsToAnalyze * 12;
  const monthlyData: MonthlyBreakdown[] = [];
  
  // Initialize tracking variables
  let cumulativeMortgagePayments = 0;
  let cumulativePropertyTax = 0;
  let cumulativeInsurance = 0;
  let cumulativeMaintenance = 0;
  let cumulativeHOA = 0;
  let cumulativeRent = 0;
  let cumulativeRentersInsurance = 0;
  
  let rentingSavingsTotal = totalUpfrontCost; // Start with down payment + closing costs
  let buyingSavingsTotal = 0;
  
  let breakEvenMonth: number | null = null;
  
  for (let month = 1; month <= totalMonths; month++) {
    const year = Math.floor((month - 1) / 12) + 1;
    const yearProgress = (month - 1) / 12;
    
    // HOME VALUE (appreciates annually)
    const homeValue = inputs.homePrice * Math.pow(1 + inputs.homeAppreciationRate / 100, yearProgress);
    
    // BUYING COSTS
    const remainingBalance = calculateRemainingBalance(
      loanAmount,
      monthlyMortgage,
      inputs.interestRate,
      month - 1
    );
    
    const monthlyRate = inputs.interestRate / 100 / 12;
    const monthlyInterest = remainingBalance * monthlyRate;
    const monthlyPrincipal = monthlyMortgage - monthlyInterest;
    
    const monthlyPropertyTax = (homeValue * inputs.propertyTaxRate / 100) / 12;
    const monthlyHomeInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaMaintenance;
    const monthlyMaintenance = (homeValue * inputs.maintenanceRate / 100) / 12;
    
    cumulativeMortgagePayments += monthlyMortgage;
    cumulativePropertyTax += monthlyPropertyTax;
    cumulativeInsurance += monthlyHomeInsurance;
    cumulativeHOA += monthlyHOA;
    cumulativeMaintenance += monthlyMaintenance;
    
    const totalBuyingCost = 
      totalUpfrontCost +
      cumulativeMortgagePayments +
      cumulativePropertyTax +
      cumulativeInsurance +
      cumulativeHOA +
      cumulativeMaintenance;
    
    const homeEquity = homeValue - remainingBalance;
    
    // RENTING COSTS (rent increases annually)
    const currentMonthlyRent = inputs.monthlyRent * Math.pow(1 + inputs.rentIncreaseRate / 100, yearProgress);
    const monthlyRentersInsurance = inputs.rentersInsurance;
    
    cumulativeRent += currentMonthlyRent;
    cumulativeRentersInsurance += monthlyRentersInsurance;
    
    const totalRentingCost = cumulativeRent + cumulativeRentersInsurance;
    
    // INVESTMENT GROWTH
    const monthlyInvestmentReturn = inputs.investmentReturnRate / 100 / 12;
    
    // For buying: could have invested the down payment + monthly difference
    const totalMonthlyBuyingCost = 
      monthlyMortgage + 
      monthlyPropertyTax + 
      monthlyHomeInsurance + 
      monthlyHOA + 
      monthlyMaintenance;
    
    const totalMonthlyRentingCost = currentMonthlyRent + monthlyRentersInsurance;
    
    // For renting: investing down payment + monthly savings
    const monthlySavings = totalMonthlyBuyingCost - totalMonthlyRentingCost;
    rentingSavingsTotal = rentingSavingsTotal * (1 + monthlyInvestmentReturn) + monthlySavings;
    
    // NET WORTH CALCULATION
    const buyingNetWorth = homeEquity + buyingSavingsTotal;
    const rentingNetWorth = rentingSavingsTotal;
    const netWorthDifference = buyingNetWorth - rentingNetWorth;
    
    // Check for break-even point
    if (breakEvenMonth === null && netWorthDifference > 0) {
      breakEvenMonth = month;
    }
    
    monthlyData.push({
      month,
      year,
      mortgagePayment: monthlyMortgage,
      mortgagePrincipal: monthlyPrincipal,
      mortgageInterest: monthlyInterest,
      propertyTax: monthlyPropertyTax,
      homeInsurance: monthlyHomeInsurance,
      hoaMaintenance: monthlyHOA,
      maintenance: monthlyMaintenance,
      homeValue,
      remainingLoanBalance: remainingBalance,
      homeEquity,
      cumulativeMortgagePayments,
      cumulativePropertyTax,
      cumulativeInsurance,
      cumulativeMaintenance,
      cumulativeHOA,
      totalBuyingCost,
      rent: currentMonthlyRent,
      rentersInsurance: monthlyRentersInsurance,
      cumulativeRent,
      cumulativeRentersInsurance,
      totalRentingCost,
      buyingSavings: buyingSavingsTotal,
      rentingSavings: rentingSavingsTotal,
      buyingSavingsGrowth: 0,
      rentingSavingsGrowth: 0,
      buyingNetWorth,
      rentingNetWorth,
      netWorthDifference,
    });
  }
  
  const finalData = monthlyData[monthlyData.length - 1];
  const finalBuyingNetWorth = finalData.buyingNetWorth;
  const finalRentingNetWorth = finalData.rentingNetWorth;
  const netWorthDifference = finalBuyingNetWorth - finalRentingNetWorth;
  
  // Determine recommendation
  let recommendation: 'buy' | 'rent' | 'neutral' = 'neutral';
  let recommendationReason = '';
  
  const percentageDifference = (Math.abs(netWorthDifference) / Math.max(finalBuyingNetWorth, finalRentingNetWorth)) * 100;
  
  if (netWorthDifference > 0 && percentageDifference > 5) {
    recommendation = 'buy';
    recommendationReason = `After ${inputs.yearsToAnalyze} years, buying results in ${formatCurrency(Math.abs(netWorthDifference))} higher net worth compared to renting.`;
  } else if (netWorthDifference < 0 && percentageDifference > 5) {
    recommendation = 'rent';
    recommendationReason = `After ${inputs.yearsToAnalyze} years, renting results in ${formatCurrency(Math.abs(netWorthDifference))} higher net worth compared to buying.`;
  } else {
    recommendation = 'neutral';
    recommendationReason = `The financial outcomes are similar (within 5%). Consider non-financial factors like lifestyle, mobility, and personal preferences.`;
  }
  
  return {
    downPayment,
    loanAmount,
    monthlyMortgage,
    closingCosts,
    totalBuyingCost: finalData.totalBuyingCost,
    totalRentingCost: finalData.totalRentingCost,
    finalBuyingNetWorth,
    finalRentingNetWorth,
    netWorthDifference,
    breakEvenMonth,
    breakEvenYears: breakEvenMonth ? breakEvenMonth / 12 : null,
    monthlyData,
    recommendation,
    recommendationReason,
  };
};

const createEmptyResult = (): BuyVsRentResult => ({
  downPayment: 0,
  loanAmount: 0,
  monthlyMortgage: 0,
  closingCosts: 0,
  totalBuyingCost: 0,
  totalRentingCost: 0,
  finalBuyingNetWorth: 0,
  finalRentingNetWorth: 0,
  netWorthDifference: 0,
  breakEvenMonth: null,
  breakEvenYears: null,
  monthlyData: [],
  recommendation: 'neutral',
  recommendationReason: 'Please enter valid inputs to see results.',
});

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};
