import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'cash-out-refinance-calculator',
  calculatorId: 'mortgage-refinance-breakeven',
  seo: {
    title: 'Cash-Out Refinance Calculator: Equity & Savings | Toolisk',
    metaDescription: 'Calculate cash-out refinance payments, total cost, and break-even. See how tapping home equity affects your monthly payment and lifetime interest.',
    keywords: 'cash out refinance calculator, cash out refi, home equity cash out, cash out refinance break even, cash out refinance payment',
    ogTitle: 'Cash-Out Refinance Calculator',
    ogDescription: 'Model cash-out refinance monthly payments and break-even with your actual equity numbers.',
  },
  hero: {
    icon: '💳',
    h1: 'Cash-Out Refinance Calculator',
    tagline: 'Tap your home equity through a cash-out refinance — and see exactly how it affects your payment, break-even, and total interest cost.',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    breadcrumbLabel: 'Cash-Out Refi Calculator',
  },
  content: {
    aboutDescription: 'A cash-out refinance lets you borrow against home equity by refinancing for more than you owe. The new loan covers your existing balance plus the cash you take. This calculator shows the payment impact and break-even timeline.',
    features: [
      '💵 New monthly P&I with cash-out amount factored in',
      '📅 Break-even accounting for cash-out principal increase',
      '🏠 Stay-horizon net savings after total closing costs',
      '📊 Side-by-side payment comparison',
      '💾 PDF and Excel export',
    ],
    steps: [
      { title: 'Enter current mortgage', desc: 'Existing balance, interest rate, and years remaining.' },
      { title: 'Set cash-out amount', desc: 'How much equity you want to extract. Check home value vs 80% LTV cap.' },
      { title: 'Enter new loan terms', desc: 'Rate, term, and closing costs for the cash-out refi offer.' },
      { title: 'Review the true cost', desc: 'Monthly payment increase, new break-even, and net savings at your horizon.' },
    ],
    faqs: [
      { q: 'How much equity can I cash out?', a: 'Most conventional lenders cap combined LTV at 80% of home value. On a $500,000 home, that is $400,000 maximum loan. If you owe $250,000, you can cash out up to $150,000.' },
      { q: 'Is a cash-out refi better than a HELOC?', a: 'A cash-out refi gives you one fixed loan at potentially a lower rate. A HELOC is a revolving line at a variable rate. Cash-out refi is better for a single large expense; HELOC is better for ongoing draws. Compare them using our HELOC Calculator.' },
    ],
    longform: [
      { type: 'h2', text: 'Cash-Out Refi vs Rate-and-Term Refi: Key Differences' },
      { type: 'p', text: 'A rate-and-term refinance replaces your existing loan at a new rate without changing the principal (much). A cash-out refinance replaces your loan AND increases the principal by the equity you extract. Because you owe more, the break-even timeline extends significantly. A rate-and-term refi might break even at 23 months; the same deal with $50,000 cash out might push break-even to 40+ months.' },
      { type: 'callout', tone: 'warning', text: 'Cash-out refinances are riskier than rate-and-term: you increase your mortgage balance and may extend your repayment horizon. Use the cash for investments that return more than your mortgage rate — not for depreciating assets like cars or vacations.' },
    ],
  },
};

export default variant;
