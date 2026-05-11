import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'mortgage-refinance-calculator',
  calculatorId: 'mortgage',

  seo: {
    title: 'Mortgage Refinance Calculator — Break-even & Lifetime Savings | Toolisk',
    metaDescription:
      'Free mortgage refinance calculator. Compare your existing mortgage with a new rate, see your monthly payment drop, closing-cost break-even month, and lifetime interest saved.',
    keywords:
      'mortgage refinance calculator, refinance break even, refinance savings calculator, rate and term refinance, lower mortgage rate calculator',
  },

  hero: {
    icon: '🔁',
    h1: 'Mortgage Refinance Calculator',
    tagline:
      'Compare your current mortgage with a new rate. See the monthly savings, the closing-cost break-even point, and the lifetime interest impact before you commit.',
    gradient: 'from-cyan-700 via-sky-700 to-blue-700',
    breadcrumbLabel: 'Mortgage Refinance Calculator',
  },

  content: {
    aboutDescription:
      'A mortgage refinance calculator that focuses on the only number that matters: when does the new loan pay for itself? Enter your current balance, your current rate, and the new offer. The calculator shows the break-even month, the monthly delta, and the lifetime interest comparison.',
    features: [
      '🔁 Side-by-side current vs new mortgage',
      '🎯 Break-even month including closing costs',
      '💰 Monthly cashflow change',
      '📊 Lifetime interest comparison',
      '🏠 Handles cash-out refinance scenarios',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter current mortgage', desc: 'Outstanding balance, current rate, remaining term — straight off your most recent statement.' },
      { title: 'Enter the new offer', desc: 'New rate, new term, and estimated closing costs (typically 2–5% of loan amount).' },
      { title: 'Read the break-even', desc: 'The calculator shows how many months of new EMI savings it takes to recover closing costs.' },
      { title: 'Check lifetime numbers', desc: 'Verify total interest paid drops materially — not just monthly EMI.' },
      { title: 'Decide & document', desc: 'Export the comparison and bring it to your loan officer as a sanity check.' },
    ],
    faqs: [
      {
        q: 'When is refinancing worth it?',
        a: 'Three things have to be true: the new rate is meaningfully lower (typically 0.75% or more), you plan to stay in the home past the break-even month, and closing costs are competitive (2–4% of loan amount). If any of those fails, refinancing usually loses to staying put.',
      },
      {
        q: 'How is the break-even month calculated?',
        a: 'Break-even = closing costs ÷ monthly EMI savings. If refinancing costs $8,000 and saves you $300/month, you break even at month 27. After that point, the refinance is pure savings. The calculator factors this in automatically and shows the exact month.',
      },
      {
        q: 'Does extending the term during refinance cost more?',
        a: 'Yes, even with a lower rate. Resetting a 22-year remaining mortgage back to a fresh 30-year term means you pay interest for 8 extra years. The honest comparison is total lifetime interest, not monthly EMI. The calculator highlights both — many "savings" come with hidden term resets.',
      },
      {
        q: 'What is a "no-cost" refinance?',
        a: 'There is no such thing as a truly free refinance — the lender either rolls closing costs into the loan balance or hikes the rate slightly. "No-cost" usually means "no out-of-pocket cost," not zero cost. Compare lifetime interest under both versions; sometimes paying closing costs upfront wins by ~15–25% over the loan life.',
      },
      {
        q: 'Should I refinance or just make extra principal payments?',
        a: 'Different goals. Refinancing reduces the rate going forward. Extra payments accelerate payoff regardless of rate. If the new rate is 0.75%+ lower, refinance first, then layer prepayments on the new loan — you get the best of both. Use this calculator for refinance and our Mortgage Prepayment Calculator for prepayment.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The honest refinance test' },
      {
        type: 'p',
        text: 'Loan officers will pitch refinancing on monthly EMI savings. That number is easy to make look big — just extend the term. The honest refinance test compares three things: monthly payment, lifetime interest, and break-even month. A refinance that wins on all three is a yes. One that only wins on monthly payment is often a no.',
      },
      { type: 'h3', text: 'Closing costs to verify' },
      {
        type: 'ul',
        items: [
          'Lender origination fee (often negotiable, sometimes waived for relationship customers).',
          'Title insurance & escrow (shop these — they vary 30–50% between providers).',
          'Appraisal fee ($400–$800 typical).',
          'Recording, taxes, prepaid interest, escrow setup.',
          'Discount points — only worth it if you stay long enough to amortize the upfront cost.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'A 30-year refinance feels like "starting over" because it is. If you are 8 years into a 30-year loan, a fresh 30-year refinance adds 8 years of interest at the back. Consider a 20- or 22-year refinance instead — the rate is usually identical and the math is honest.',
      },
    ],
  },

  schema: {
    softwareName: 'Mortgage Refinance Calculator',
    softwareFeatures: 'Current vs new comparison, Break-even month, Lifetime interest, Cash-out scenarios, Excel export',
  },

  relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
    { name: 'Mortgage Prepayment Calculator', href: '/finance/mortgage-prepayment-calculator', icon: '⚡' },
    { name: 'Amortization Schedule', href: '/finance/amortization-calculator', icon: '📅' },
  ],
};

export default variant;
