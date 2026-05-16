import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { CalculatorId } from './_types';

// Code-split each calculator into its own chunk. The variant page renders
// exactly one of these, so only the matched chunk loads on the client —
// keeping per-variant bundle sizes comparable to the concrete pages.
//
// SSR is disabled because calculators read browser-only APIs (localStorage,
// URLSearchParams, window) during their lifecycle, which causes hydration
// mismatches when pre-rendered. The SEO content (ToolSEOContent, schema,
// longform) is rendered outside the calculator and remains SSR'd.
const dyn = <P,>(loader: () => Promise<{ default: ComponentType<P> }>) =>
  dynamic(loader, { ssr: false });

export const CALCULATORS: Record<CalculatorId, ComponentType<any>> = {
  emi: dyn(() => import('../../components/EMICalculator/EMICalculator')),
  mortgage: dyn(() => import('../../components/MortgageCalculator/MortgageCalculator')),
  amortization: dyn(() => import('../../components/AmortizationCalculator/AmortizationCalculator')),
  sip: dyn(() => import('../../components/SIPWealthPlanner/SIPWealthPlanner')),
  'compound-interest': dyn(() => import('../../components/CompoundInterestCalculator/CompoundInterestCalculator')),
  fire: dyn(() => import('../../components/FIRECalculator/FIRECalculator')),
  'buy-vs-rent': dyn(() => import('../../components/BuyVsRent/BuyVsRentRedesigned')),
  'income-tax': dyn(() => import('../../components/IncomeTaxCalculator/IncomeTaxCalculator')),
  'us-paycheck': dyn(() => import('../../components/USPaycheckCalculator/USPaycheckCalculator')),
  'credit-card-payoff': dyn(() => import('../../components/CreditCardPayoffCalculator/CreditCardPayoffCalculator')),
  '401k': dyn(() => import('../../components/Finance/Retirement401kCalculator')),
  'roth-vs-traditional-ira': dyn(() => import('../../components/Finance/RothVsTraditionalIra')),
  'auto-loan': dyn(() => import('../../components/Finance/AutoLoanCalculator')),
  'student-loan': dyn(() => import('../../components/Finance/StudentLoanCalculator')),
  investment: dyn(() => import('../../components/Finance/InvestmentCalculator')),
  'rental-roi': dyn(() => import('../../components/Finance/RentalROICalculator')),
  'net-worth': dyn(() => import('../../components/Finance/NetWorthCalculator')),
  inflation: dyn(() => import('../../components/InflationCalculator/InflationCalculator')),
  'sales-tax-vat-gst': dyn(() => import('../../components/Finance/SalesTaxVatGstCalculator')),
  tip: dyn(() => import('../../components/Finance/TipCalculator')),
  'house-affordability': dyn(() => import('../../components/Finance/HouseAffordabilityCalculator')),
  'social-security': dyn(() => import('../../components/Finance/SocialSecurityCalculator')),
  'mortgage-refinance-breakeven': dyn(() => import('../../components/MortgageRefinanceBreakeven/MortgageRefinanceBreakeven')),
  'heloc': dyn(() => import('../../components/HELOC/HELOCCalculator')),
  'rmd': dyn(() => import('../../components/RMDCalculator/RMDCalculator')),
  'hsa': dyn(() => import('../../components/HSACalculator/HSACalculator')),
  'annuity': dyn(() => import('../../components/AnnuityCalculator/AnnuityCalculator')),
  'roth-conversion': dyn(() => import('../../components/RothConversion/RothConversionCalculator')),
  'college-savings-529': dyn(() => import('../../components/CollegeSavings529/CollegeSavings529Calculator')),
  'capital-gains-tax-us': dyn(() => import('../../components/CapitalGainsTax/CapitalGainsTaxCalculator')),
  'reverse-mortgage': dyn(() => import('../../components/ReverseMortgage/ReverseMortgageCalculator')),
};

/** Canonical (primary) finance page path for each calculatorId. Used for
 *  cross-linking from variants back to the "main" page, and for collision
 *  detection in _registry.ts. */
export const CANONICAL_PATHS: Record<CalculatorId, string> = {
  emi: '/finance/emi-calculator',
  mortgage: '/finance/mortgage-calculator',
  amortization: '/finance/amortization-calculator',
  sip: '/finance/sip-calculator',
  'compound-interest': '/finance/compound-interest-calculator',
  fire: '/finance/fire-calculator',
  'buy-vs-rent': '/finance/buy-vs-rent-calculator',
  'income-tax': '/finance/income-tax-calculator',
  'us-paycheck': '/finance/us-paycheck-calculator',
  'credit-card-payoff': '/finance/credit-card-payoff-calculator',
  '401k': '/finance/401k-calculator',
  'roth-vs-traditional-ira': '/finance/roth-vs-traditional-ira',
  'auto-loan': '/finance/auto-loan-calculator',
  'student-loan': '/finance/student-loan-calculator',
  investment: '/finance/investment-calculator',
  'rental-roi': '/finance/rental-roi-calculator',
  'net-worth': '/finance/net-worth-calculator',
  inflation: '/finance/inflation-calculator',
  'sales-tax-vat-gst': '/finance/sales-tax-vat-gst-calculator',
  tip: '/finance/tip-calculator',
  'house-affordability': '/finance/house-affordability-calculator',
  'social-security': '/finance/social-security-calculator',
  'mortgage-refinance-breakeven': '/finance/mortgage-refinance-breakeven-calculator',
  'heloc': '/finance/heloc-calculator',
  'rmd': '/finance/rmd-calculator',
  'hsa': '/finance/hsa-calculator',
  'annuity': '/finance/annuity-calculator',
  'roth-conversion': '/finance/roth-conversion-calculator',
  'college-savings-529': '/finance/529-college-savings-calculator',
  'capital-gains-tax-us': '/finance/capital-gains-tax-calculator',
  'reverse-mortgage': '/finance/reverse-mortgage-calculator',
};
