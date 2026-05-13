import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'reduce-emi-vs-reduce-tenure-calculator',
  calculatorId: 'emi',
  seo: {
    title: 'Reduce EMI vs Reduce Tenure Calculator | Toolisk',
    metaDescription: 'Compare reduce EMI vs reduce tenure after loan prepayment. See which option saves more interest and which improves monthly cash flow.',
    keywords: 'reduce emi vs reduce tenure calculator, reduce tenure or emi, loan prepayment strategy, emi reduction calculator',
  },
  hero: {
    icon: '⚖️',
    h1: 'Reduce EMI vs Reduce Tenure Calculator',
    tagline: 'After a prepayment, compare the two lender options: lower monthly EMI or shorter loan tenure.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    breadcrumbLabel: 'Reduce EMI vs Reduce Tenure Calculator',
  },
  content: {
    aboutDescription: 'A decision-focused version of the EMI calculator for borrowers choosing what to do after a part-payment: reduce EMI for cashflow relief or reduce tenure for maximum interest savings.',
    features: [
      '⚖️ Side-by-side strategy comparison',
      '💰 Total interest saved',
      '📅 Months reduced from tenure',
      '📉 New EMI estimate',
      '📊 Revised amortization chart',
      '💾 Export comparison',
    ],
    steps: [
      { title: 'Enter loan details', desc: 'Use current outstanding amount, rate, and remaining tenure.' },
      { title: 'Add prepayment amount', desc: 'Enter the lump sum or recurring extra payment you plan to make.' },
      { title: 'Compare both options', desc: 'Review reduce-EMI and reduce-tenure outcomes together.' },
      { title: 'Pick based on goal', desc: 'Choose tenure reduction for savings or EMI reduction for cashflow.' },
    ],
    faqs: [
      { q: 'Which is better: reduce EMI or reduce tenure?', a: 'Reduce tenure usually saves more total interest. Reduce EMI is better only when monthly cashflow relief is the main goal.' },
      { q: 'Why does reducing tenure save more?', a: 'You keep the same EMI and eliminate future interest-heavy months from the schedule.' },
      { q: 'Can I switch later?', a: 'Policies vary by lender. It is easier to default to tenure reduction and later ask for EMI relief if cashflow changes.' },
    ],
  },
  schema: {
    softwareName: 'Reduce EMI vs Reduce Tenure Calculator',
    softwareFeatures: 'Prepayment comparison, EMI reduction, Tenure reduction, Interest saved, Revised amortization',
  },
  relatedTools: [
    { name: 'EMI Prepayment Calculator', href: '/finance/emi-prepayment-calculator', icon: '⚡' },
    { name: 'Home Loan Prepayment Calculator', href: '/finance/home-loan-prepayment-calculator', icon: '🏠' },
    { name: 'Amortization Calculator', href: '/finance/amortization-calculator', icon: '📊' },
  ],
};

export default variant;
