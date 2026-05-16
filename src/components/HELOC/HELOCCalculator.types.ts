export type DrawTiming = 'lump' | 'spread';

export interface HELOCInputs {
  homeValue: number;
  existingMortgage: number;
  maxCLTV: number;
  drawRate: number;
  repayRate: number;
  drawYears: number;
  repayYears: number;
  amountDrawn: number;
  drawTiming: DrawTiming;
}

export interface HELOCResult {
  maxHELOC: number;
  availableCredit: number;
  drawPaymentMonthly: number;
  repayPaymentMonthly: number;
  totalInterestDraw: number;
  totalInterestRepay: number;
  totalInterestPaid: number;
  totalCostOfHELOC: number;
  balanceAtRepayStart: number;
  paymentData: Array<{ month: number; payment: number; phase: 'draw' | 'repay' }>;
  repayAmortization: Array<{ month: number; principal: number; interest: number; balance: number }>;
  equityData: Array<{ label: string; value: number }>;
}
