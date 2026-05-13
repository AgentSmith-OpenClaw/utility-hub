import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'gross-to-net-salary-calculator',
  calculatorId: 'us-paycheck',
  seo: {
    title: 'Gross to Net Salary Calculator — Take-Home Pay | Toolisk',
    metaDescription: 'Convert gross salary to net pay after federal tax, state tax, FICA, and pre-tax deductions with this free paycheck calculator.',
    keywords: 'gross to net salary calculator, gross to net pay, salary to take home pay, net salary calculator, paycheck calculator',
  },
  hero: {
    icon: '💵',
    h1: 'Gross to Net Salary Calculator',
    tagline: 'Convert annual gross salary into estimated net pay after taxes, FICA, benefits, and deductions.',
    gradient: 'from-emerald-600 via-green-600 to-lime-600',
    breadcrumbLabel: 'Gross to Net Salary Calculator',
  },
  content: {
    aboutDescription: 'A salary-focused paycheck calculator for turning an offer letter or annual salary into realistic net pay after taxes and payroll deductions.',
    features: [
      '💵 Gross salary to net pay',
      '🧾 Federal and state tax estimate',
      '🏥 Pre-tax deduction support',
      '📅 Annual, monthly, and paycheck views',
      '🇺🇸 FICA calculation',
      '📊 Take-home breakdown',
    ],
    steps: [
      { title: 'Enter gross salary', desc: 'Use annual salary or pay-period income.' },
      { title: 'Choose state and filing status', desc: 'Taxes vary materially by state and household.' },
      { title: 'Add deductions', desc: 'Include retirement, healthcare, HSA, and other pre-tax deductions.' },
      { title: 'Review net pay', desc: 'Compare monthly and per-paycheck take-home numbers.' },
    ],
    faqs: [
      { q: 'What is gross to net salary?', a: 'Gross salary is pay before taxes and deductions. Net salary is what remains after tax withholding, FICA, benefits, and other deductions.' },
      { q: 'Why is my net pay lower than expected?', a: 'Federal tax, state tax, Social Security, Medicare, retirement contributions, insurance, and local taxes can all reduce take-home pay.' },
      { q: 'Does this replace payroll advice?', a: 'No. It estimates take-home pay from common tax and payroll inputs; your employer withholding setup can differ.' },
    ],
  },
  schema: {
    softwareName: 'Gross to Net Salary Calculator',
    softwareFeatures: 'Gross salary to net pay, Federal tax, State tax, FICA, Payroll deductions',
  },
  relatedTools: [
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator', icon: '🇺🇸' },
    { name: 'After-Tax Income Calculator', href: '/finance/after-tax-income-calculator', icon: '🧾' },
    { name: 'Take-Home Pay Calculator', href: '/finance/take-home-pay-calculator', icon: '💵' },
  ],
};

export default variant;
