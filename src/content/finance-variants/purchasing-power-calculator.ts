import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'purchasing-power-calculator',
  calculatorId: 'inflation',
  seo: {
    title: 'Purchasing Power Calculator — Inflation Adjusted Value | Toolisk',
    metaDescription: 'Compare purchasing power across years using US CPI data. See what a dollar amount from one year is worth in another year.',
    keywords: 'purchasing power calculator, inflation adjusted value calculator, dollar purchasing power, CPI calculator, value of money over time',
  },
  hero: {
    icon: '💵',
    h1: 'Purchasing Power Calculator',
    tagline: 'Translate dollars across time and see how inflation changes what money can actually buy.',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    breadcrumbLabel: 'Purchasing Power Calculator',
  },
  content: {
    aboutDescription: 'A purchasing power calculator powered by historical US CPI data. Compare any dollar amount across years and understand the real value after inflation.',
    features: [
      '💵 Inflation-adjusted dollar values',
      '📊 US CPI history from 1913 onward',
      '↔️ Compare any two years',
      '📉 Purchasing power loss',
      '🧮 Fast browser-based calculation',
      '📚 Plain-English explanation',
    ],
    steps: [
      { title: 'Enter dollar amount', desc: 'Use the historical or current amount you want to compare.' },
      { title: 'Choose start year', desc: 'Pick the year the original amount belongs to.' },
      { title: 'Choose target year', desc: 'See what that amount equals in the comparison year.' },
      { title: 'Read purchasing power', desc: 'Use the result to understand real value rather than nominal dollars.' },
    ],
    faqs: [
      { q: 'What is purchasing power?', a: 'Purchasing power is how much goods and services a unit of money can buy. Inflation reduces purchasing power over time.' },
      { q: 'Is this the same as an inflation calculator?', a: 'Yes, but framed around real-world buying power rather than just CPI percentage change.' },
      { q: 'What CPI data does this use?', a: 'The underlying inflation calculator uses historical US Consumer Price Index data.' },
    ],
  },
  schema: {
    softwareName: 'Purchasing Power Calculator',
    softwareFeatures: 'Purchasing power comparison, CPI inflation adjustment, Dollar value over time',
  },
  relatedTools: [
    { name: 'US Inflation Calculator', href: '/finance/inflation-calculator', icon: '💵' },
    { name: 'Cost of Living Inflation Calculator', href: '/finance/cost-of-living-inflation-calculator', icon: '🛒' },
    { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
  ],
};

export default variant;
