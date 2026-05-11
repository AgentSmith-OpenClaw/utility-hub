// Slug → human-readable breadcrumb label, derived from variant data only.
// This file deliberately imports only pure-data variant configs — no React
// components — so siteConfig (used by every page) can include it cheaply.

import carLoanEmi from './car-loan-emi-calculator';
import emiPrepayment from './emi-prepayment-calculator';
import homeLoanEmi from './home-loan-emi-calculator';
import mortgagePrepayment from './mortgage-prepayment-calculator';
import mortgageRefinance from './mortgage-refinance-calculator';
import personalLoanEmi from './personal-loan-emi-calculator';
import sipStepUp from './sip-step-up-calculator';

const ALL = [
  carLoanEmi,
  emiPrepayment,
  homeLoanEmi,
  mortgagePrepayment,
  mortgageRefinance,
  personalLoanEmi,
  sipStepUp,
];

export const VARIANT_BREADCRUMB_LABELS: Record<string, string> = Object.fromEntries(
  ALL.map((v) => [v.slug, v.hero.breadcrumbLabel]),
);
