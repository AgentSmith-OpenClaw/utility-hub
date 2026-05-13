import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'how-much-money-do-i-need-to-retire-calculator',
  calculatorId: 'fire',
  seo: {
    title: 'How Much Money Do I Need to Retire Calculator | Toolisk',
    metaDescription: 'Estimate how much money you need to retire based on expenses, age, withdrawal rate, current savings, and monthly investments.',
    keywords: 'how much money do i need to retire calculator, retirement money calculator, how much to retire, retirement corpus calculator',
  },
  hero: {
    icon: '🏖️',
    h1: 'How Much Money Do I Need to Retire Calculator',
    tagline: 'Estimate your retirement corpus from spending, current assets, expected returns, and withdrawal-rate assumptions.',
    gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    breadcrumbLabel: 'How Much Money Do I Need to Retire Calculator',
  },
  content: {
    aboutDescription: 'This retirement corpus calculator answers the plain-English question behind FIRE planning: how much money do you need before you can stop relying on salary income?',
    features: [
      '🏖️ Retirement corpus target',
      '💸 Expense-based planning',
      '📈 Growth and savings projection',
      '⚖️ Withdrawal-rate comparison',
      '🧓 Retirement age scenario testing',
      '📊 Milestone chart',
    ],
    steps: [
      { title: 'Estimate retirement spending', desc: 'Include housing, healthcare, taxes, travel, and recurring family costs.' },
      { title: 'Enter current investments', desc: 'Use assets available for retirement income.' },
      { title: 'Set target age', desc: 'Earlier retirement usually requires a lower withdrawal rate and larger buffer.' },
      { title: 'Compare scenarios', desc: 'Run conservative, balanced, and aggressive assumptions side by side.' },
    ],
    faqs: [
      { q: 'How much money do I need to retire?', a: 'A common estimate is 25-33 times annual expenses, depending on withdrawal rate, retirement length, taxes, healthcare, and investment risk.' },
      { q: 'Should I include home equity?', a: 'Usually no, unless you plan to sell, downsize, or rent it out. Your primary home provides shelter, not portfolio income.' },
      { q: 'Does retiring early change the number?', a: 'Yes. Longer retirements need larger buffers because sequence risk, inflation, and healthcare costs have more time to compound.' },
    ],
  },
  schema: {
    softwareName: 'How Much Money Do I Need to Retire Calculator',
    softwareFeatures: 'Retirement corpus estimate, Expense multiplier, Withdrawal rate, Portfolio projection',
  },
  relatedTools: [
    { name: 'FIRE Number Calculator', href: '/finance/fire-number-calculator', icon: '🎯' },
    { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
    { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏛️' },
  ],
};

export default variant;
