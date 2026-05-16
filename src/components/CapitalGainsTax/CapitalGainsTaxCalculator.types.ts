export type AssetType = 'stocks' | 'crypto' | 'real-estate' | 'primary-residence' | 'collectibles';
export type FilingStatus = 'single' | 'marriedFilingJointly' | 'marriedFilingSeparately' | 'headOfHousehold';
export type HoldingType = 'short' | 'long';

export interface CapitalGainsTaxInputs {
  assetType: AssetType;
  purchasePrice: number;
  salePrice: number;
  sellingFees: number;
  improvements: number;
  purchaseDate: string;
  saleDate: string;
  section121Eligible: boolean;
  filingStatus: FilingStatus;
  otherOrdinaryIncome: number;
  otherInvestmentIncome: number;
  stateRate: number;
}

export interface LtcgBracketFill {
  gainIn0: number;
  gainIn15: number;
  gainIn20: number;
}

export interface CapitalGainsTaxResult {
  holdingDays: number;
  holdingType: HoldingType;
  basis: number;
  proceeds: number;
  grossGain: number;
  section121Excluded: number;
  taxableGain: number;
  federalShortTax: number;
  federalLongTax: number;
  niit: number;
  stateTax: number;
  totalTax: number;
  netProceeds: number;
  effectiveRate: number;
  isLoss: boolean;
  ltcgBracketFill: LtcgBracketFill;
  shortVsLongComparison: { label: string; tax: number }[];
}
