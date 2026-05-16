import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'ira-rmd-calculator',
  calculatorId: 'rmd',
  seo: {
    title: 'IRA RMD Calculator: Required Minimum Distribution | Toolisk',
    metaDescription: 'Calculate your Traditional IRA Required Minimum Distribution using IRS Uniform Lifetime Table. Project future RMDs to age 100. Free.',
    keywords: 'ira rmd calculator, traditional ira rmd, ira required minimum distribution, ira rmd table, ira rmd age 73',
    ogTitle: 'IRA RMD Calculator',
    ogDescription: 'Compute your Traditional IRA Required Minimum Distribution and project future withdrawals.',
  },
  hero: {
    icon: '📋',
    h1: 'IRA Required Minimum Distribution Calculator',
    tagline: 'Enter your Traditional IRA balance and age — see this year\'s RMD, the federal tax owed, and a projection through retirement.',
    gradient: 'from-amber-600 via-orange-600 to-rose-600',
    breadcrumbLabel: 'IRA RMD Calculator',
  },
  content: {
    aboutDescription: 'Traditional IRA owners must start withdrawing a minimum amount each year at age 73. This calculator uses the official IRS Uniform Lifetime Table to compute your exact RMD and projects future distributions.',
    features: [
      '📋 IRS Uniform Lifetime Table (SECURE 2.0)',
      '💰 This year\'s RMD dollar amount',
      '🏛️ Estimated federal tax on the distribution',
      '📈 Year-by-year projection to age 100',
      '📊 Balance trajectory chart',
    ],
    steps: [
      { title: 'Enter your balance', desc: 'The account value as of December 31 of last year.' },
      { title: 'Set your age', desc: 'Your age at the end of the current tax year.' },
      { title: 'Set your tax rate', desc: 'Marginal federal rate for the distribution year.' },
      { title: 'View projection', desc: 'See annual RMDs, estimated taxes, and balance trend.' },
    ],
    faqs: [
      { q: 'Does a Roth IRA have RMDs?', a: 'No — Roth IRAs are exempt from RMDs during the original owner\'s lifetime. This is one of the key advantages of a Roth IRA vs. a Traditional IRA for retirement planning.' },
      { q: 'What if I have multiple IRAs?', a: 'You must calculate the RMD separately for each Traditional IRA but can take the total amount from any one IRA or a combination. The total across all accounts must meet the combined RMD requirement.' },
    ],
    longform: [
      { type: 'h2', text: 'IRA RMDs Under SECURE 2.0' },
      { type: 'p', text: 'The SECURE Act 2.0 (2022) raised the RMD starting age to 73 (up from 72). For those born in 1960 or later, it rises further to 75 starting in 2033. The penalty for missing an RMD dropped from 50% to 25% of the missed amount (further reduced to 10% if corrected within two years). These changes give more flexibility in IRA withdrawal planning.' },
    ],
  },
};

export default variant;
