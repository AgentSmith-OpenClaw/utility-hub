// Central registry of all finance SEO variants.
//
// To add a new variant:
//   1. Create a new file in this directory, e.g. `home-loan-prepayment-calculator.ts`.
//   2. Default-export a FinanceVariant config.
//   3. Import it here and add it to ALL_VARIANTS.
// The dynamic page /finance/[variant].tsx and the sitemap pick it up automatically.

import type { FinanceVariant, CalculatorId } from './_types';
import { CANONICAL_PATHS } from './_calculators';

// Existing concrete finance pages — variants with these slugs would shadow a real
// file in /pages/finance and produce ambiguous routing. Used by the collision
// guard below.
const CONCRETE_FINANCE_PAGES = new Set<string>([
  '401k-calculator',
  'amortization-calculator',
  'auto-loan-calculator',
  'buy-vs-rent-calculator',
  'compound-interest-calculator',
  'credit-card-payoff-calculator',
  'emi-calculator',
  'fire-calculator',
  'income-tax-calculator',
  'inflation-calculator',
  'investment-calculator',
  'mortgage-calculator',
  'net-worth-calculator',
  'rental-roi-calculator',
  'roth-vs-traditional-ira',
  'sales-tax-vat-gst-calculator',
  'sip-calculator',
  'student-loan-calculator',
  'tip-calculator',
  'us-paycheck-calculator',
]);

// ---- variant imports (alphabetical by slug) ----
import carLoanEmi from './car-loan-emi-calculator';
import emiPrepayment from './emi-prepayment-calculator';
import homeLoanEmi from './home-loan-emi-calculator';
import mortgagePrepayment from './mortgage-prepayment-calculator';
import mortgageRefinance from './mortgage-refinance-calculator';
import personalLoanEmi from './personal-loan-emi-calculator';
import sipStepUp from './sip-step-up-calculator';

export const ALL_VARIANTS: FinanceVariant[] = [
  carLoanEmi,
  emiPrepayment,
  homeLoanEmi,
  mortgagePrepayment,
  mortgageRefinance,
  personalLoanEmi,
  sipStepUp,
];

// ---- integrity checks (run at import/build time) ----
{
  const seenSlugs = new Set<string>();
  for (const v of ALL_VARIANTS) {
    if (seenSlugs.has(v.slug)) {
      throw new Error(`[finance-variants] Duplicate slug: ${v.slug}`);
    }
    seenSlugs.add(v.slug);

    if (CONCRETE_FINANCE_PAGES.has(v.slug)) {
      throw new Error(
        `[finance-variants] Variant slug "${v.slug}" collides with an existing concrete page in /pages/finance.`,
      );
    }

    if (!CANONICAL_PATHS[v.calculatorId]) {
      throw new Error(
        `[finance-variants] Unknown calculatorId "${v.calculatorId}" on variant "${v.slug}".`,
      );
    }
  }
}

export const VARIANT_BY_SLUG: Record<string, FinanceVariant> = Object.fromEntries(
  ALL_VARIANTS.map((v) => [v.slug, v]),
);

export const ALL_VARIANT_SLUGS: string[] = ALL_VARIANTS.map((v) => v.slug);

/**
 * Peer variants for a given variant — other variants that share the same
 * calculatorId. Used to auto-build a "More views of this calculator" section.
 */
export function getPeerVariants(slug: string): FinanceVariant[] {
  const me = VARIANT_BY_SLUG[slug];
  if (!me) return [];
  return ALL_VARIANTS.filter((v) => v.calculatorId === me.calculatorId && v.slug !== slug);
}

/**
 * Returns the canonical primary page for the same calculator (e.g. /finance/emi-calculator
 * for any EMI variant). Used to add a "main calculator" link from each variant.
 */
export function getCanonicalPathForCalculator(calculatorId: CalculatorId): string {
  return CANONICAL_PATHS[calculatorId];
}
