import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'home-loan-interest-comparison',
  calculatorId: 'loan-comparison',
  seo: {
    title: 'Home Loan Interest Comparison Calculator | Toolisk',
    metaDescription: 'Compare home loan interest rates from different banks side by side. See EMI, total interest, and savings for each offer.',
    keywords: 'home loan comparison, compare mortgage rates, home loan interest comparison, which home loan is cheaper, mortgage rate comparison',
  },
  hero: {
    icon: '🏠',
    h1: 'Home Loan Interest Comparison Calculator',
    tagline: 'Enter rates from multiple banks and see the true cost difference — monthly EMI and total interest side by side.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    breadcrumbLabel: 'Home Loan Comparison',
  },
  content: {
    aboutDescription: 'Home loans last 20-30 years, so even a 0.25% rate difference compounds into tens of thousands in extra interest. This calculator shows the exact dollar savings between bank offers, making it easy to negotiate or pick the best deal.',
    features: [
      '⚖️ Compare 2-3 home loan offers',
      '💰 Monthly EMI, total interest, and total payment',
      '★ Best-value markers on cheapest EMI & interest',
      '📊 Visual principal vs interest bar chart',
      '💱 Multi-currency (USD, EUR, GBP, AUD, CAD, INR)',
    ],
    steps: [
      { title: 'Enter your loan amount', desc: 'The home price minus your down payment.' },
      { title: 'Add each bank\'s rate and term', desc: 'Up to 3 offers with different rates and loan durations.' },
      { title: 'See the comparison table', desc: 'EMI, total interest, and interest ratio for each offer.' },
      { title: 'Negotiate or choose', desc: 'Use the star-marked best values to negotiate or decide.' },
    ],
    faqs: [
      { q: 'How much does a 0.5% rate difference save on a home loan?', a: 'On a $400,000 mortgage over 30 years at 7.0% vs 7.5%, the lower rate saves approximately $44,000 in total interest and reduces the monthly payment by about $125. That is a car payment\'s worth of savings every month for 30 years.' },
      { q: 'Should I choose the bank with the lowest EMI?', a: 'Not necessarily. The lowest EMI often comes from the longest term, which increases total interest. Look at the interest-to-principal ratio column — a lower ratio always means a cheaper loan relative to what you borrowed, regardless of EMI differences.' },
      { q: 'What about closing costs and points?', a: 'Closing costs and discount points add to your total cost but are not included in the interest rate. If Bank A offers 7.0% with $8,000 in closing costs and Bank B offers 7.25% with $2,000 in closing costs, the net cost over, say, 7 years of ownership might favor Bank B. Add closing costs to the total interest to get a true comparison.' },
      { q: 'How do I use this to negotiate?', a: 'Get quotes from 3 lenders, enter them in this calculator, and share the comparison table with your preferred lender. Showing a concrete $40,000 interest difference gives you leverage to ask for a rate match or discount on closing costs.' },
    ],
    longform: [
      { type: 'h2', text: 'The compounding cost of a small rate difference' },
      { type: 'p', text: 'Home loans are the largest financial commitment most people make. Over 30 years, you pay roughly 1.4-2.5x the original loan amount when you include interest. A rate difference that looks small — 6.75% vs 7.0% — translates to over $15,000 in extra interest on a $300,000 loan. This calculator shows the exact numbers.' },
      { type: 'h3', text: 'How to get competing quotes' },
      { type: 'p', text: 'Apply for pre-approval from at least 3 lenders within a 14-day window (credit bureaus count multiple mortgage inquiries within a short period as a single hard pull). Once you have 3 rate quotes, enter them here to see the real total cost difference — not just the monthly payment.' },
      { type: 'callout', tone: 'tip', text: 'Some lenders offer a "rate lock" for 30-60 days. Lock the lowest rate you find while you finalize the home purchase. A rate lock protects you from market increases during closing.' },
      { type: 'h3', text: 'Points vs rate: when paying upfront saves money' },
      { type: 'p', text: 'A "point" costs 1% of the loan amount and reduces the rate by about 0.25%. On a $400,000 loan, one point costs $4,000 and saves roughly $44,000 in interest over 30 years at 7.0%. If you plan to stay in the home more than 5 years, paying points is usually worth it. This calculator does not model points directly, but you can adjust the loan amount and rate to simulate the net effect.' },
      { type: 'h2', text: 'When the lowest rate is not the best deal' },
      { type: 'p', text: 'A lender offering 6.75% with $12,000 in closing costs may cost more over 7 years than one offering 7.0% with $3,000 in closing costs. The rule of thumb: if you plan to move or refinance within 7 years, low closing costs matter more than a tiny rate advantage. If you plan to stay 15+ years, the lowest rate wins.' },
],
  },
  relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
    { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '🏦' },
    { name: 'Mortgage Refinance Break-Even', href: '/finance/mortgage-refinance-breakeven-calculator', icon: '📊' },
  ],
};

export default variant;