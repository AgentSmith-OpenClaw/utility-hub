export type PayoutChoice = 'lump-sum' | 'line-of-credit' | 'term' | 'tenure';

export interface ReverseMortgageInputs {
  homeValue: number;
  existingMortgageBalance: number;
  otherClosingCosts: number;
  borrowerAge: number;
  coBorrowerAge: number | null;
  expectedRate: number;
  payoutChoice: PayoutChoice;
  termYears: number;
  homeAppreciation: number;
}

export interface ReverseMortgageResult {
  isEligible: boolean;
  youngestAge: number;
  maxClaim: number;
  plf: number;
  initialPrincipalLimit: number;
  imip: number;
  origination: number;
  totalFees: number;
  availableAfterFees: number;
  lumpSum: number;
  lineOfCredit: number;
  termMonthlyPayment: number;
  tenureMonthlyPayment: number;
  equityProjection: Array<{ year: number; loanBalance: number; homeValue: number; equity: number }>;
}
