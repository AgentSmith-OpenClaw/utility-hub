import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'should-i-refinance-my-mortgage',
  calculatorId: 'mortgage-refinance-breakeven',
  seo: {
    title: 'Should I Refinance My Mortgage? Calculator | Toolisk',
    metaDescription: 'Not sure if refinancing is worth it? Enter your loan details and stay plan — get a clear yes or no with the exact dollar savings for your horizon.',
    keywords: 'should i refinance my mortgage, refinance decision calculator, is refinancing worth it, refi break-even, mortgage refinance decision',
    ogTitle: 'Should I Refinance My Mortgage?',
    ogDescription: 'Get a definitive answer — see stay-horizon savings, break-even months, and lifetime interest in one view.',
  },
  hero: {
    icon: '🤔',
    h1: 'Should I Refinance My Mortgage?',
    tagline: 'Enter your current loan and the offer on the table — get a data-driven yes or no based on how long you plan to stay.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    breadcrumbLabel: 'Should I Refinance Calculator',
  },
  content: {
    aboutDescription: 'A refinance makes financial sense when the accumulated monthly savings exceed closing costs before you sell or move. This calculator answers the question with your specific numbers — not a rule of thumb.',
    features: [
      '✅ Stay-horizon net savings (the real decision number)',
      '📅 Exact break-even month',
      '💰 Monthly payment before vs after',
      '📊 Lifetime interest comparison',
      '💾 Export results to PDF or Excel',
    ],
    steps: [
      { title: 'Enter current loan', desc: 'Balance, interest rate, and years remaining on your existing mortgage.' },
      { title: 'Enter the refi offer', desc: 'New rate, term, and closing costs. Choose pay-upfront or roll-in.' },
      { title: 'Set your stay years', desc: 'How long do you realistically plan to stay in this home?' },
      { title: 'Read the answer', desc: 'See net savings for your horizon — green means yes, red means wait.' },
    ],
    faqs: [
      { q: 'What if I plan to sell in 3 years?', a: 'If break-even is 4+ years, you leave money on the table. This calculator will show a negative stay-horizon number — your answer is no.' },
      { q: 'What is a good rate drop to refinance?', a: 'There is no universal threshold. A 0.5% drop on a $400k loan saves ~$100/month. If break-even < your stay years, it is worth it regardless of the rate-drop magnitude.' },
    ],
    longform: [
      { type: 'h2', text: 'The Real Question Is Not the Rate — It Is the Horizon' },
      { type: 'p', text: 'Lenders and ads focus on the rate. But the rate only tells you how much you save per month. The decision requires one more number: how long will you keep the loan? Break-even months divided by 12 gives your break-even in years. If that number is less than your stay horizon, refinancing makes you money. If it exceeds your horizon, you leave before recovering the closing costs.' },
      { type: 'h2', text: 'Common Mistakes in the Refinance Decision' },
      { type: 'ul', items: [
        'Focusing on lifetime interest savings while ignoring term reset — a 30-year refi can cost more lifetime interest than the remaining 20 years on your current loan, even at a lower rate.',
        'Forgetting that rolling closing costs into the loan accrues interest on those fees for decades.',
        'Assuming you will stay for 30 years when job mobility, family changes, or health issues often mean selling sooner.',
      ]},
    ],
  },
};

export default variant;
