export interface AmortizationPayment {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
}

export interface AmortizationSummary {
  totalInterest: number;
  totalAmount: number;
  monthlyEMI: number;
}
