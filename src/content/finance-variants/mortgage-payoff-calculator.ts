import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'mortgage-payoff-calculator',
  calculatorId: 'mortgage',
  seo: {
    title: 'Mortgage Payoff Calculator — Pay Off Your Home Early | Toolisk',
    metaDescription: 'Calculate your mortgage payoff timeline. See how extra payments, shorter terms, and prepayment plans change your payoff date and interest.',
    keywords: 'mortgage payoff calculator, pay off mortgage early calculator, mortgage early payoff, mortgage payoff timeline, home loan payoff calculator',
  },
  hero: {
    icon: '📅',
    h1: 'Mortgage Payoff Calculator',
    tagline: 'Estimate your payoff date and test what it takes to own your home free and clear sooner.',
    gradient: 'from-indigo-700 via-blue-700 to-cyan-600',
    breadcrumbLabel: 'Mortgage Payoff Calculator',
  },
  content: {
    aboutDescription: 'A mortgage payoff calculator for homeowners who want a clear date: when will the loan be gone, and how much interest can be avoided with a faster plan?',
    features: [
      '📅 Mortgage payoff date',
      '⚡ Early payoff scenarios',
      '💰 Interest avoided',
      '🏠 Taxes, insurance, and PMI context',
      '📊 Principal balance chart',
      '🧾 Exportable schedule',
    ],
    steps: [
      { title: 'Enter loan details', desc: 'Use current mortgage balance, rate, and remaining term.' },
      { title: 'Set extra payment goal', desc: 'Try a monthly extra or target payoff age.' },
      { title: 'Review payoff date', desc: 'Compare current schedule against accelerated payoff.' },
      { title: 'Balance liquidity', desc: 'Avoid draining emergency funds just to accelerate payoff.' },
    ],
    faqs: [
      { q: 'How do I calculate mortgage payoff?', a: 'Use remaining balance, interest rate, payment amount, and any extra principal payments to project when the balance reaches zero.' },
      { q: 'Can I pay off a 30-year mortgage in 15 years?', a: 'Often yes, but it requires a materially higher monthly payment. Compare the required payment with your emergency fund and investing goals.' },
      { q: 'What happens if I pay an extra $100 per month?', a: 'The impact depends on balance, rate, and remaining term. Early extra payments usually save the most interest.' },
    ],
  },
  schema: {
    softwareName: 'Mortgage Payoff Calculator',
    softwareFeatures: 'Mortgage payoff date, Early payoff, Extra payment scenarios, Interest saved',
  },
  relatedTools: [
    { name: 'Extra Mortgage Payment Calculator', href: '/finance/extra-mortgage-payment-calculator', icon: '➕' },
    { name: '15 vs 30 Year Mortgage', href: '/finance/15-year-vs-30-year-mortgage-calculator', icon: '⚖️' },
    { name: 'Mortgage Refinance Calculator', href: '/finance/mortgage-refinance-calculator', icon: '🔁' },
  ],
};

export default variant;
