import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'home-loan-prepayment-calculator',
  calculatorId: 'emi',
  seo: {
    title: 'Home Loan Prepayment Calculator — Interest Saved | Toolisk',
    metaDescription: 'Calculate home loan prepayment savings. See interest saved, tenure cut, and whether reducing EMI or reducing tenure works better.',
    keywords: 'home loan prepayment calculator, housing loan prepayment, home loan part payment, reduce emi vs tenure, loan prepayment savings',
  },
  hero: {
    icon: '🏠',
    h1: 'Home Loan Prepayment Calculator',
    tagline: 'Model yearly bonuses, lump sums, or recurring extras and see how fast they cut your home loan interest.',
    gradient: 'from-emerald-700 via-teal-700 to-cyan-700',
    breadcrumbLabel: 'Home Loan Prepayment Calculator',
  },
  content: {
    aboutDescription: 'Home loans are long enough that prepayment timing matters enormously. This calculator shows how much interest a part-payment saves and whether your lender should reduce EMI or tenure.',
    features: [
      '🏠 Home-loan focused prepayment math',
      '⚡ Lump-sum and recurring extras',
      '📅 Tenure cut estimate',
      '💰 Lifetime interest saved',
      '⚖️ EMI vs tenure reduction comparison',
      '📊 Updated schedule',
    ],
    steps: [
      { title: 'Enter outstanding balance', desc: 'Use remaining principal for an existing home loan.' },
      { title: 'Add rate and remaining tenure', desc: 'Use the current rate after any reset.' },
      { title: 'Model prepayments', desc: 'Add annual bonus, monthly extra, or one-time part payment.' },
      { title: 'Compare lender options', desc: 'Choose whether to reduce EMI or tenure and compare impact.' },
    ],
    faqs: [
      { q: 'When is the best time to prepay a home loan?', a: 'Earlier in the tenure, because more of each EMI is interest. A payment in year 2 usually saves far more than the same payment in year 15.' },
      { q: 'Should I reduce EMI or tenure after home loan prepayment?', a: 'Reduce tenure if you can afford the current EMI. Reduce EMI only when monthly cashflow relief is more important than total savings.' },
      { q: 'How often should I prepay?', a: 'A common strategy is one extra EMI per year plus a fixed share of bonuses, especially during the first half of the loan.' },
    ],
  },
  schema: {
    softwareName: 'Home Loan Prepayment Calculator',
    softwareFeatures: 'Home loan prepayment, Interest saved, Tenure reduction, EMI reduction, Amortization schedule',
  },
  relatedTools: [
    { name: 'Home Loan EMI Calculator', href: '/finance/home-loan-emi-calculator', icon: '🏠' },
    { name: 'Reduce EMI vs Reduce Tenure', href: '/finance/reduce-emi-vs-reduce-tenure-calculator', icon: '⚖️' },
    { name: 'Mortgage Prepayment Calculator', href: '/finance/mortgage-prepayment-calculator', icon: '🏡' },
  ],
};

export default variant;
