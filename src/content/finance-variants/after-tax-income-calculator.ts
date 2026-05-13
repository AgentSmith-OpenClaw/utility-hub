import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'after-tax-income-calculator',
  calculatorId: 'us-paycheck',
  seo: {
    title: 'After-Tax Income Calculator — Net Income Estimate | Toolisk',
    metaDescription: 'Estimate after-tax income from salary or wages after federal tax, state tax, FICA, and deductions. Free US paycheck calculator.',
    keywords: 'after tax income calculator, net income calculator, take home income calculator, salary after taxes, paycheck after tax',
  },
  hero: {
    icon: '🧾',
    h1: 'After-Tax Income Calculator',
    tagline: 'Estimate how much income remains after federal tax, state tax, FICA, and payroll deductions.',
    gradient: 'from-blue-700 via-sky-700 to-cyan-600',
    breadcrumbLabel: 'After-Tax Income Calculator',
  },
  content: {
    aboutDescription: 'Use this after-tax income calculator to estimate real take-home income from salary, wages, or a job offer after the major US tax and payroll deductions.',
    features: [
      '🧾 After-tax income estimate',
      '🇺🇸 Federal and state tax support',
      '💵 Annual and paycheck views',
      '🏥 Benefit deduction inputs',
      '📊 Tax and deduction breakdown',
      '⚡ Fast scenario comparison',
    ],
    steps: [
      { title: 'Enter income', desc: 'Use annual salary or per-pay-period earnings.' },
      { title: 'Set filing details', desc: 'Choose filing status, state, and pay frequency.' },
      { title: 'Add deductions', desc: 'Include 401(k), health insurance, HSA, and other payroll deductions.' },
      { title: 'Read after-tax income', desc: 'Use the final amount for budgeting and offer comparison.' },
    ],
    faqs: [
      { q: 'What is after-tax income?', a: 'After-tax income is income left after tax withholding and payroll deductions. It is the money available for spending, saving, and investing.' },
      { q: 'Is after-tax income the same as net pay?', a: 'Usually yes in paycheck planning, though net pay can also include deductions that are not taxes, such as health insurance or retirement contributions.' },
      { q: 'Can I compare job offers with this?', a: 'Yes. Run each salary with the correct state, benefits, and deductions to compare realistic take-home pay.' },
    ],
  },
  schema: {
    softwareName: 'After-Tax Income Calculator',
    softwareFeatures: 'After-tax income, Net pay, Federal tax, State tax, Payroll deductions',
  },
  relatedTools: [
    { name: 'Gross to Net Salary Calculator', href: '/finance/gross-to-net-salary-calculator', icon: '💵' },
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator', icon: '🇺🇸' },
    { name: 'Salary Hike Calculator', href: '/finance/salary-hike-calculator', icon: '📈' },
  ],
};

export default variant;
