import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'refinance-savings-calculator',
  calculatorId: 'mortgage-refinance-breakeven',
  seo: {
    title: 'Refinance Savings Calculator: How Much Will I Save? | Toolisk',
    metaDescription: 'Calculate total savings from refinancing — monthly payment reduction, closing-cost payback period, and net savings over any time horizon you choose.',
    keywords: 'refinance savings calculator, how much will i save refinancing, refi savings, monthly savings refinance, mortgage savings calculator',
    ogTitle: 'Refinance Savings Calculator',
    ogDescription: 'See your exact monthly savings, break-even month, and net dollars saved over any horizon.',
  },
  hero: {
    icon: '💰',
    h1: 'Refinance Savings Calculator',
    tagline: 'Find out exactly how much money refinancing puts back in your pocket — by month and by year.',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    breadcrumbLabel: 'Refinance Savings Calculator',
  },
  content: {
    aboutDescription: 'This savings-first view of the refinance decision shows monthly payment reduction, total savings over your stay horizon, and the break-even timeline side by side.',
    features: [
      '💵 Monthly savings (current P&I minus new P&I)',
      '📈 Cumulative savings chart with break-even marker',
      '🏠 Stay-horizon net savings after closing costs',
      '📊 Lifetime interest comparison',
      '📋 PDF and Excel export',
    ],
    steps: [
      { title: 'Enter current mortgage details', desc: 'Balance, rate, and remaining term.' },
      { title: 'Enter refinance terms', desc: 'New rate, new term, and total closing costs.' },
      { title: 'Choose how long you plan to stay', desc: 'The calculator reports net savings for exactly that horizon.' },
      { title: 'Compare scenarios', desc: 'Switch between pay-upfront and roll-in to see which saves more in your window.' },
    ],
    faqs: [
      { q: 'Does a lower rate always mean savings?', a: 'Not if the term resets. Dropping from 6.75% with 27 years left to 5.5% over 30 years may save you $242/month but costs $46,000 in extra lifetime interest from the term extension.' },
      { q: 'How do I maximize refinance savings?', a: 'Pay closing costs upfront if you have cash, keep the same or shorter term, and refinance only when you plan to stay past break-even.' },
    ],
    longform: [
      { type: 'h2', text: 'Two Types of Savings — and Which One Matters' },
      { type: 'p', text: 'Monthly savings = the immediate cash flow relief of a lower payment. Stay-horizon savings = total cumulative relief minus the upfront closing costs you paid. The second number is the one that determines whether refinancing makes you richer. A refinance that saves $150/month but costs $7,500 to close requires 50 months before you come out ahead — if you sell at month 36, you lost $3,000.' },
      { type: 'callout', tone: 'tip', text: 'Set your stay years conservatively. Median US homeownership tenure before selling is about 13 years, but varies widely. If you are in a starter home or a hot job market, 5–7 years is more realistic than 20.' },
    ],
  },
};

export default variant;
