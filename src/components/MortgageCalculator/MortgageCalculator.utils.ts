/**
 * Mortgage Calculator Utility Functions
 * Focused on Global (US/UK) standards including PMI, Property Tax, and Insurance.
 */

export interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  loanTerm: number; // in years
  interestRate: number; // annual percentage
  propertyTaxRate: number; // annual percentage
  homeInsurance: number; // monthly
  pmiRate: number; // annual percentage
  hoaFees: number; // monthly
}

export interface MortgageResult {
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  loanAmount: number;
  downPaymentPercentage: number;
  totalPayment: number;
  totalInterest: number;
}

export interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export const calculateMortgage = (inputs: MortgageInputs): MortgageResult => {
  const {
    homePrice,
    downPayment,
    loanTerm,
    interestRate,
    propertyTaxRate,
    homeInsurance,
    pmiRate,
    hoaFees
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const downPaymentPercentage = (downPayment / homePrice) * 100;
  
  // Monthly Interest Rate
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Monthly Principal & Interest (Standard Amortization Formula)
  let monthlyPrincipalAndInterest = 0;
  if (monthlyRate === 0) {
    monthlyPrincipalAndInterest = loanAmount / numberOfPayments;
  } else {
    monthlyPrincipalAndInterest = 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  // Monthly Property Tax
  const monthlyPropertyTax = (homePrice * (propertyTaxRate / 100)) / 12;

  // Monthly PMI (Private Mortgage Insurance)
  // Usually applies if down payment < 20%
  let monthlyPMI = 0;
  if (downPaymentPercentage < 20) {
    monthlyPMI = (loanAmount * (pmiRate / 100)) / 12;
  }

  const totalMonthlyPayment = 
    monthlyPrincipalAndInterest + 
    monthlyPropertyTax + 
    homeInsurance + 
    monthlyPMI + 
    hoaFees;

  const totalPayment = (monthlyPrincipalAndInterest * numberOfPayments);
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyPrincipalAndInterest,
    monthlyPropertyTax,
    monthlyHomeInsurance: homeInsurance,
    monthlyPMI,
    monthlyHOA: hoaFees,
    totalMonthlyPayment,
    loanAmount,
    downPaymentPercentage,
    totalPayment,
    totalInterest
  };
};

export const generateAmortizationSchedule = (inputs: MortgageInputs): AmortizationRow[] => {
  const { homePrice, downPayment, loanTerm, interestRate } = inputs;
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Calculate fixed monthly payment
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numberOfPayments;
  } else {
    monthlyPayment = 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const schedule: AmortizationRow[] = [];
  let remainingBalance = loanAmount;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    remainingBalance -= principalPayment;
    cumulativePrincipal += principalPayment;
    cumulativeInterest += interestPayment;

    // Handle rounding errors on final payment
    if (month === numberOfPayments) {
      remainingBalance = 0;
    }

    schedule.push({
      month,
      principal: principalPayment,
      interest: interestPayment,
      totalPayment: monthlyPayment,
      remainingBalance: Math.max(0, remainingBalance),
      cumulativePrincipal,
      cumulativeInterest,
    });
  }

  return schedule;
};
