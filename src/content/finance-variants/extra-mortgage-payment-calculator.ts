import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'extra-mortgage-payment-calculator',
  calculatorId: 'mortgage',
  seo: {
    title: 'Extra Mortgage Payment Calculator | Toolisk',
    metaDescription: 'Calculate how extra mortgage payments reduce interest and payoff time. Compare monthly extras, yearly lump sums, and one-time payments.',
    keywords: 'extra mortgage payment calculator, extra payment mortgage calculator, mortgage prepayment, pay extra on mortgage, mortgage interest savings',
  },
  hero: {
    icon: '➕',
    h1: 'Extra Mortgage Payment Calculator',
    tagline: 'See how one extra payment, monthly extras, or annual lump sums change your mortgage payoff date.',
    gradient: 'from-sky-600 via-blue-600 to-indigo-700',
    breadcrumbLabel: 'Extra Mortgage Payment Calculator',
  },
  content: {
    aboutDescription: 'A mortgage calculator page focused on extra payments. Test recurring additional principal payments and see the interest saved over the life of the loan.',
    features: [
      '➕ Monthly extra payment scenarios',
      '💰 Interest saved over life of loan',
      '📅 Earlier payoff estimate',
      '🏠 Full mortgage payment context',
      '📊 Amortization visualization',
      '⚖️ Compare standard vs accelerated payoff',
    ],
    steps: [
      { title: 'Enter mortgage basics', desc: 'Loan amount, rate, term, taxes, insurance, and PMI if applicable.' },
      { title: 'Add extra payment', desc: 'Use a fixed monthly extra, one-time payment, or annual extra.' },
      { title: 'Compare payoff dates', desc: 'Review standard payoff versus accelerated payoff.' },
      { title: 'Check cashflow', desc: 'Make sure the extra payment does not crowd out emergency savings.' },
    ],
    faqs: [
      { q: 'Do extra mortgage payments go to principal?', a: 'They should, but you may need to specify principal-only payment with your servicer.' },
      { q: 'Is one extra mortgage payment a year worth it?', a: 'It can cut years from a 30-year mortgage because each extra principal dollar avoids decades of interest.' },
      { q: 'Should I pay extra on mortgage or invest?', a: 'Compare your mortgage rate after tax to expected after-tax investment return, and account for liquidity needs.' },
    ],
  },
  schema: {
    softwareName: 'Extra Mortgage Payment Calculator',
    softwareFeatures: 'Extra mortgage payment, Principal prepayment, Interest saved, Payoff date comparison',
  },
  relatedTools: [
    { name: 'Mortgage Prepayment Calculator', href: '/finance/mortgage-prepayment-calculator', icon: '🏠' },
    { name: 'Mortgage Payoff Calculator', href: '/finance/mortgage-payoff-calculator', icon: '📅' },
    { name: 'Amortization Calculator', href: '/finance/amortization-calculator', icon: '📊' },
  ],
};

export default variant;
