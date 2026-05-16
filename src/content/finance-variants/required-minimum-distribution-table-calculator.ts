import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'required-minimum-distribution-table-calculator',
  calculatorId: 'rmd',
  seo: {
    title: 'RMD Table Calculator: IRS Uniform Lifetime Table | Toolisk',
    metaDescription: 'Use the IRS Uniform Lifetime Table to calculate Required Minimum Distributions. Interactive RMD table with year-by-year projection. Free.',
    keywords: 'rmd table calculator, uniform lifetime table, irs rmd table, required minimum distribution table, rmd table 2026',
    ogTitle: 'RMD Table Calculator',
    ogDescription: 'Interactive IRS Uniform Lifetime Table calculator with year-by-year RMD projection.',
  },
  hero: {
    icon: '📊',
    h1: 'RMD Table Calculator (IRS Uniform Lifetime Table)',
    tagline: 'The IRS Uniform Lifetime Table determines your distribution period. Enter your balance and age — see the exact calculation and a multi-year projection.',
    gradient: 'from-orange-600 via-amber-600 to-yellow-600',
    breadcrumbLabel: 'RMD Table Calculator',
  },
  content: {
    aboutDescription: 'The IRS Uniform Lifetime Table (Publication 590-B, Table III) lists a distribution period for each age from 72 to 120. Divide your prior year-end balance by the factor for your age — that is your RMD. This calculator does the division and projects every future year.',
    features: [
      '📊 Full IRS Uniform Lifetime Table (SECURE 2.0 updated)',
      '🔢 Distribution period for your current age',
      '💰 Current-year RMD amount',
      '📈 Year-by-year projection with balance tracking',
      '🏛️ Federal tax estimate on distributions',
    ],
    steps: [
      { title: 'Find your balance', desc: 'Use the December 31 prior-year statement.' },
      { title: 'Enter your age', desc: 'Your age at the end of this tax year (the year the RMD is due).' },
      { title: 'Set return assumptions', desc: 'How you expect the account to grow between withdrawals.' },
      { title: 'See the full table', desc: 'Distribution period, RMD amount, and every future year through your target age.' },
    ],
    faqs: [
      { q: 'Where does the Uniform Lifetime Table come from?', a: 'The IRS publishes it in Publication 590-B (Distributions from Individual Retirement Arrangements). The table was updated effective 2022 to reflect longer life expectancies — resulting in slightly lower RMDs than the prior table for most ages.' },
      { q: 'Is there a different table for surviving spouses?', a: 'Yes — if your sole beneficiary is your spouse and they are more than 10 years younger, you may use the Joint Life and Last Survivor Expectancy Table, which results in lower annual RMDs. This calculator uses the Uniform Lifetime Table, which applies to the vast majority of account owners.' },
    ],
    longform: [
      { type: 'h2', text: 'How the IRS Uniform Lifetime Table Works' },
      { type: 'p', text: 'The Uniform Lifetime Table gives a "distribution period" — a life-expectancy factor — for each age. At 73, the factor is 26.5; at 80, it\'s 20.2; at 90, it\'s 12.2. You divide your December 31 prior-year account balance by the factor for your age on December 31 of the current year. The table assumes a hypothetical spouse 10 years younger, which slightly increases the divisor (and reduces the RMD) compared to a pure single-life table.' },
    ],
  },
};

export default variant;
