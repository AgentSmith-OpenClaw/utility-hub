import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'cost-of-living-inflation-calculator',
  calculatorId: 'inflation',
  seo: {
    title: 'Cost of Living Inflation Calculator | Toolisk',
    metaDescription: 'Estimate how inflation changes cost of living over time. Convert past expenses into today’s dollars using US CPI data.',
    keywords: 'cost of living inflation calculator, inflation cost of living calculator, CPI cost calculator, expenses adjusted for inflation',
  },
  hero: {
    icon: '🛒',
    h1: 'Cost of Living Inflation Calculator',
    tagline: 'Convert historical expenses into today’s dollars and see how much inflation changed everyday costs.',
    gradient: 'from-lime-600 via-emerald-600 to-teal-700',
    breadcrumbLabel: 'Cost of Living Inflation Calculator',
  },
  content: {
    aboutDescription: 'Use CPI inflation data to translate rent, groceries, salary, tuition, or any recurring expense into comparable dollars across years.',
    features: [
      '🛒 Cost-of-living adjustment',
      '💵 Inflation-adjusted expenses',
      '📊 CPI-based calculation',
      '📅 Year-to-year comparison',
      '📉 Real purchasing power view',
      '⚡ Instant browser results',
    ],
    steps: [
      { title: 'Enter the original cost', desc: 'Use rent, tuition, salary, or another expense.' },
      { title: 'Select original year', desc: 'Choose the year that cost occurred.' },
      { title: 'Select comparison year', desc: 'Convert into today’s dollars or another target year.' },
      { title: 'Interpret the result', desc: 'Use the adjusted value for budgeting, history, or salary comparison.' },
    ],
    faqs: [
      { q: 'How do I adjust cost of living for inflation?', a: 'Multiply the original cost by the ratio of target-year CPI to original-year CPI.' },
      { q: 'Can this compare salary across years?', a: 'Yes. Enter salary as the amount to see its inflation-adjusted value in another year.' },
      { q: 'Does CPI match my personal inflation?', a: 'Not exactly. CPI is a broad average; your personal inflation depends on rent, healthcare, location, and spending mix.' },
    ],
  },
  schema: {
    softwareName: 'Cost of Living Inflation Calculator',
    softwareFeatures: 'Cost of living adjustment, CPI inflation, Expense comparison, Purchasing power',
  },
  relatedTools: [
    { name: 'Purchasing Power Calculator', href: '/finance/purchasing-power-calculator', icon: '💵' },
    { name: 'US Inflation Calculator', href: '/finance/inflation-calculator', icon: '📉' },
    { name: 'Salary Hike Calculator', href: '/finance/salary-hike-calculator', icon: '📈' },
  ],
};

export default variant;
