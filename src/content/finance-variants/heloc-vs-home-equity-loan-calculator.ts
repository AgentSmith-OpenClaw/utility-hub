import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'heloc-vs-home-equity-loan-calculator',
  calculatorId: 'heloc',
  seo: {
    title: 'HELOC vs Home Equity Loan Calculator | Toolisk',
    metaDescription: 'Compare a HELOC (variable, interest-only draw) vs a home equity loan (fixed, lump sum). See total interest cost and payment differences. Free.',
    keywords: 'heloc vs home equity loan, heloc vs home equity loan calculator, home equity line vs loan, which is better heloc or home equity loan',
    ogTitle: 'HELOC vs Home Equity Loan',
    ogDescription: 'Compare a flexible HELOC against a fixed home equity loan — see total cost, payment structure, and which fits your needs.',
  },
  hero: {
    icon: '⚖️',
    h1: 'HELOC vs Home Equity Loan Calculator',
    tagline: 'HELOC gives flexibility. Home equity loan gives certainty. This calculator shows the cost trade-off for your specific borrowing scenario.',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    breadcrumbLabel: 'HELOC vs HE Loan',
  },
  content: {
    aboutDescription: 'A HELOC charges interest only on what you draw; a home equity loan charges on the full amount from day one. If you need flexibility, HELOC often wins on cost. If you need certainty, HE loan wins on predictability.',
    features: [
      '🔄 HELOC: revolving credit with draw/repay phases',
      '📌 HE Loan: fixed lump-sum with fixed P&I from day one',
      '💰 Total interest comparison (assuming full draw)',
      '📊 Monthly payment side-by-side',
      '✅ Recommendation based on use case',
    ],
    steps: [
      { title: 'Enter borrow amount and rate', desc: 'Same amount for both options to compare apples-to-apples.' },
      { title: 'Set your loan term', desc: 'Total repayment period (HE loan) vs draw + repay period (HELOC).' },
      { title: 'Specify your draw plan', desc: 'Do you need all the money now, or gradually over time?' },
      { title: 'Compare total cost', desc: 'See which option costs more and why.' },
    ],
    faqs: [
      { q: 'When is a HELOC better than a home equity loan?', a: "When you don't need all the money at once — home renovations phased over time, tuition paid semester-by-semester, or an emergency fund you hope to never use. You only pay interest on what you draw." },
      { q: 'When is a home equity loan better?', a: "When you need a fixed amount for a one-time expense (paying off credit cards, a single large purchase) and want a fixed payment and fixed rate with no payment shock risk." },
    ],
    longform: [
      { type: 'h2', text: 'The Core Trade-Off: Flexibility vs. Certainty' },
      { type: 'p', text: "A HELOC's variable rate and draw structure mean your payment can change. A home equity loan's fixed rate and payment mean certainty — but you pay interest on the full amount from day one even if you don't use it all immediately. For most home improvement projects that roll out over months, HELOCs are usually cheaper. For debt consolidation and large one-time purchases, the HE loan's predictability often wins." },
    ],
  },
};

export default variant;
