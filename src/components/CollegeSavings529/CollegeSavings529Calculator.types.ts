export interface CollegeSavings529Inputs {
  childAge: number;
  yearsOfCollege: number;
  currentBalance: number;
  monthlyContribution: number;
  expectedReturn: number;
  stateDeductionRate: number;
  stateDeductibleCap: number;
  currentAnnualCost: number;
  costInflationRate: number;
}

export interface CollegeYearData {
  year: number;
  projectedCost: number;
  startingBalance: number;
  withdrawal: number;
  endingBalance: number;
}

export interface CollegeSavings529Result {
  yearsUntilCollege: number;
  fvAtStart: number;
  totalCollegeCost: number;
  yearlyCosts: number[];
  fundingGap: number;
  fundingSurplus: number;
  isFullyFunded: boolean;
  runsOutYear: number | null;
  recommendedMonthlyContribution: number;
  annualStateSavings: number;
  lifetimeStateSavings: number;
  collegeYearData: CollegeYearData[];
  growthData: Array<{ label: string; balance: number }>;
  costInflationData: Array<{ label: string; cost: number }>;
  contributionVsGrowthData: { contributed: number; growth: number };
}
