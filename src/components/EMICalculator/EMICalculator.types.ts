export interface Payment {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
  prepaymentAmount?: number;
  emi?: number;
}

export interface Prepayment {
  id: string;
  amount: number;
  month: number;
  description?: string;
  strategy: 'reduce-tenure' | 'reduce-emi';
}

export interface PrepaymentImpact {
  prepaymentId: string;
  prepaymentAmount: number;
  prepaymentMonth: number;
  strategy: 'reduce-tenure' | 'reduce-emi';
  description?: string;
  // EMI comparison
  oldEMI: number;
  newEMI: number;
  // Tenure comparison
  oldRemainingMonths: number;
  newRemainingMonths: number;
  // Interest savings (normalized to match actual total)
  interestSaved: number;
  cumulativeInterestSaved: number;
}

export interface LoanInputs {
  loanAmount: number;
  annualRate: number;
  tenureYears: number;
  prepayments: Prepayment[];
}

export interface LoanSummary {
  totalInterest: number;
  totalAmount: number;
  actualTenure: number;
  interestSaved: number;
  prepaymentImpacts: PrepaymentImpact[];
}
