import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'hsa-contribution-calculator',
  calculatorId: 'hsa',
  seo: {
    title: 'HSA Contribution Calculator: 2026 Limits | Toolisk',
    metaDescription: 'Calculate how much you can contribute to your HSA in 2026, your tax savings by contribution method (payroll vs direct), and the long-term impact. Free.',
    keywords: 'hsa contribution calculator, hsa contribution limit 2026, how much can i contribute to hsa, hsa max contribution, hsa payroll deduction',
    ogTitle: 'HSA Contribution Calculator',
    ogDescription: 'Find your 2026 HSA contribution limit and see how much you save in taxes by contributing via payroll vs. direct deposit.',
  },
  hero: {
    icon: '💊',
    h1: 'HSA Contribution Calculator (2026)',
    tagline: "See your exact 2026 HSA contribution limit, the tax savings for every dollar you contribute, and why payroll deductions are better than after-tax contributions.",
    gradient: 'from-sky-600 via-blue-600 to-indigo-600',
    breadcrumbLabel: 'HSA Contribution Calculator',
  },
  content: {
    aboutDescription: 'Your HSA contribution limit depends on your coverage type (self or family) and age (55+ catch-up). How you contribute matters too — payroll contributions save FICA taxes that direct contributions do not.',
    features: [
      '📊 2026 IRS contribution limits by coverage type',
      '👴 Catch-up contribution for age 55+',
      '💰 Tax savings: payroll vs direct contribution',
      '🏦 Employer contribution impact on your limit',
      '📈 Projected balance for contribution scenarios',
    ],
    steps: [
      { title: 'Select coverage and age', desc: 'Determines your base limit and catch-up eligibility.' },
      { title: 'Enter employer contribution', desc: 'Employer contributions count toward the combined IRS limit.' },
      { title: 'Choose contribution method', desc: 'Payroll deductions save FICA (7.65%) — direct contributions don\'t.' },
      { title: 'See contribution strategy', desc: 'How much you can contribute and the tax savings breakdown.' },
    ],
    faqs: [
      { q: 'What if I switch from self-only to family coverage mid-year?', a: "If you have family coverage at any point in December, you can contribute the full family limit for the year. If you switch mid-year and end the year with self-only coverage, you prorate the limit. The 'last-month rule' allows you to contribute the full higher limit if you're eligible on December 1, but you must maintain HDHP coverage for the entire following year." },
      { q: 'Can I contribute to both a spouse\'s HSA and my own?', a: "Each eligible spouse can have their own HSA and contribute to it individually — but the combined contributions for the family cannot exceed the family limit. You can split the limit any way you choose between the two accounts." },
    ],
    longform: [
      { type: 'h2', text: 'Why Payroll HSA Contributions Beat After-Tax Contributions' },
      { type: 'p', text: 'When you contribute to an HSA through payroll, the contribution is taken pre-FICA. This means you avoid 7.65% in Social Security and Medicare taxes (for employees below the Social Security wage base). On a $4,400 self-only contribution, this is $337 in additional tax savings beyond the federal and state income tax deduction. If you contribute directly (not via payroll), you get the income tax deduction but not the FICA exemption. Always contribute via payroll if your employer offers it.' },
    ],
  },
};

export default variant;
