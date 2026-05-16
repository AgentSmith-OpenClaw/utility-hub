import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'reverse-mortgage-line-of-credit-calculator',
  calculatorId: 'reverse-mortgage',
  seo: {
    title: 'Reverse Mortgage Line of Credit Calculator | HECM LOC | Toolisk',
    metaDescription: 'Calculate the HECM reverse mortgage line of credit and see how it grows over time. Understand the LOC growth feature vs a HELOC. Free.',
    keywords: 'reverse mortgage line of credit calculator, hecm loc, hecm line of credit, reverse mortgage loc growth, reverse mortgage credit line',
    ogTitle: 'Reverse Mortgage Line of Credit Calculator',
    ogDescription: 'Calculate your HECM line of credit and see how the unused portion grows over time.',
  },
  hero: {
    icon: '📈',
    h1: 'Reverse Mortgage Line of Credit Calculator',
    tagline: "The HECM line of credit has a unique feature: the unused portion grows over time at the accrual rate — a benefit no HELOC can match.",
    gradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    breadcrumbLabel: 'HECM LOC Calculator',
  },
  content: {
    aboutDescription: 'A HECM line of credit starts at the net available proceeds and grows at the accrual rate (expected interest rate + 0.5% MIP) as long as it remains undrawn. This calculator shows the LOC balance at any future point — demonstrating why many advisors prefer the LOC strategy over immediate draws.',
    features: [
      '📈 LOC growth projection over time',
      '💰 Starting LOC balance calculation',
      '⏱️ LOC at 5, 10, 15, 20 year marks',
      '📊 Comparison: draw now vs let it grow',
      '⚠️ LOC freeze risk context',
    ],
    steps: [
      { title: 'Calculate net HECM proceeds', desc: 'Enter home value, age, and existing mortgage.' },
      { title: 'Select line of credit payout', desc: 'The full net proceeds become your initial LOC.' },
      { title: 'See LOC growth projection', desc: "How the available credit grows each year if left unused." },
      { title: 'Plan your draw strategy', desc: 'When and how much to draw to optimize your retirement income.' },
    ],
    faqs: [
      { q: 'Does the HECM LOC growth rate change over time?', a: "Yes — the LOC grows at the accrual rate, which equals the expected interest rate plus 0.5% ongoing MIP. If interest rates rise, the LOC grows faster. If rates fall, it grows more slowly. But the LOC can never be frozen or reduced by the lender as long as you remain in the home and meet loan obligations — unlike a HELOC, which lenders can freeze." },
      { q: "Can I use the HECM LOC as an emergency fund?", a: "Yes — many financial planners recommend establishing a HECM LOC early in retirement (even before you need the money) and letting it grow. It becomes a tax-free emergency fund that grows over time. If you never need it, the unused portion is just not drawn. This 'stand-by HECM LOC' strategy is increasingly recommended in academic retirement research." },
    ],
    longform: [
      { type: 'h2', text: "The HECM LOC Growth Feature: Why It Matters" },
      { type: 'p', text: "The unused HECM line of credit grows at the loan's accrual rate — the same rate at which the loan balance grows when drawn. At 6.5% accrual, a $170,000 LOC grows to about $235,000 in 5 years and $325,000 in 10 years. This growth occurs regardless of home value changes. It is not taxable income — it is simply increased borrowing capacity. This feature has no equivalent in the conventional HELOC market." },
    ],
  },
};

export default variant;
