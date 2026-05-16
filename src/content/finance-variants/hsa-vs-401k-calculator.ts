import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'hsa-vs-401k-calculator',
  calculatorId: 'hsa',
  seo: {
    title: 'HSA vs 401(k): Which to Fund First? | Toolisk',
    metaDescription: 'Compare HSA and 401(k) tax advantages. See which to fund first and how the triple-tax HSA advantage stacks up against 401(k) matching and deductions. Free.',
    keywords: 'hsa vs 401k, hsa or 401k, hsa vs 401k which is better, hsa 401k comparison, should i fund hsa or 401k first',
    ogTitle: 'HSA vs 401(k) Calculator',
    ogDescription: 'Compare the tax advantages of an HSA and 401(k) and find the optimal funding priority.',
  },
  hero: {
    icon: '⚖️',
    h1: 'HSA vs 401(k): Which Should You Fund First?',
    tagline: 'Both are powerful tax-advantaged accounts — but they\'re not equal. HSA offers triple-tax benefits; 401(k) often includes an employer match. See which wins for your situation.',
    gradient: 'from-teal-600 via-emerald-600 to-green-600',
    breadcrumbLabel: 'HSA vs 401(k)',
  },
  content: {
    aboutDescription: 'The conventional wisdom is "get the 401(k) match first, then max the HSA, then max the 401(k)." But the math is more nuanced — especially when you factor in FICA savings and medical expense tax benefits. This calculator shows the trade-offs.',
    features: [
      '⚖️ HSA vs 401(k) after-tax comparison',
      '💰 Employer match impact analysis',
      '📊 Triple-tax advantage vs deferred-only advantage',
      '📈 Long-term balance comparison',
      '✅ Funding priority recommendation',
    ],
    steps: [
      { title: 'Enter HSA details', desc: 'Contribution, tax rates, and payroll/direct method.' },
      { title: 'Enter 401(k) details', desc: 'Contribution rate and employer match.' },
      { title: 'Set return and tax assumptions', desc: 'Investment return and expected retirement tax rate.' },
      { title: 'Compare outcomes', desc: 'See final balances and tax advantage for each account type.' },
    ],
    faqs: [
      { q: 'Should I always get the 401(k) match before funding an HSA?', a: 'Yes — an employer match is an immediate 50-100% return on your contribution. Even the HSA\'s triple-tax advantage cannot beat free money. Fund the 401(k) to the match, then fund the HSA to the max, then return to the 401(k).' },
      { q: "Can I contribute to both an HSA and a 401(k) in the same year?", a: "Yes — these are independent accounts with separate limits. In 2026 you can contribute $4,400 to an HSA (self-only) and up to $23,500 to a 401(k) (plus catch-ups if 50+). They don't affect each other's limits." },
    ],
    longform: [
      { type: 'h2', text: 'Optimal Funding Order for HSA-Eligible Employees' },
      { type: 'p', text: 'Most financial planners recommend: (1) 401(k) up to the employer match, (2) Max the HSA, (3) Max the 401(k), (4) Taxable brokerage. The HSA beats the post-match 401(k) because the HSA gives three tax breaks vs the 401(k)\'s two. For medical expenses specifically, the HSA is clearly superior — withdrawals are tax-free vs. taxable from a 401(k).' },
    ],
  },
};

export default variant;
