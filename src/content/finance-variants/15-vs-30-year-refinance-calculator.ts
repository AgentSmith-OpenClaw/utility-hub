import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: '15-vs-30-year-refinance-calculator',
  calculatorId: 'mortgage-refinance-breakeven',
  seo: {
    title: '15 vs 30 Year Refinance Calculator | Toolisk',
    metaDescription: 'Compare refinancing to a 15-year vs 30-year mortgage. See monthly payment difference, total interest saved, and which term wins at your stay horizon.',
    keywords: '15 vs 30 year refinance, refinance 15 year calculator, 30 year refi vs 15, short term refi, refinance term comparison',
    ogTitle: '15 vs 30 Year Refinance Calculator',
    ogDescription: 'Compare the lifetime interest trade-off of a 15-year versus 30-year refinance side by side.',
  },
  hero: {
    icon: '⚖️',
    h1: '15-Year vs 30-Year Refinance Calculator',
    tagline: 'Shorter term = lower rate and far less interest, but higher monthly payment. Find out which term actually costs you less given your stay horizon.',
    gradient: 'from-slate-700 via-slate-600 to-blue-700',
    breadcrumbLabel: '15 vs 30 Year Refi Calculator',
  },
  content: {
    aboutDescription: 'Choosing between a 15-year and 30-year refinance is not just about the rate — it is about cash flow vs total interest. This calculator helps you compare both terms against your current loan so you can make the right call.',
    features: [
      '📊 Monthly payment comparison (15-yr vs 30-yr)',
      '💰 Total interest for each term',
      '📅 Break-even for each scenario',
      '🏠 Stay-horizon net savings side by side',
      '💾 Export results to PDF or Excel',
    ],
    steps: [
      { title: 'Enter current mortgage', desc: 'Existing balance, rate, and years remaining.' },
      { title: 'Model the 15-year scenario', desc: 'Enter 15-year term with the lower available rate and closing costs.' },
      { title: 'Note the monthly payment jump', desc: '15-year payments are typically 30–45% higher than 30-year. Confirm your budget can handle it.' },
      { title: 'Compare to 30-year', desc: 'Model the 30-year scenario and compare total interest and stay-horizon savings.' },
    ],
    faqs: [
      { q: 'How much lower is the 15-year rate vs 30-year?', a: 'Typically 0.5–0.75% lower. On $280,000, that saves about $160/month in interest cost — but the higher required payment on a 15-year often swamps that savings for cash-flow-constrained borrowers.' },
      { q: 'Who should choose a 15-year refi?', a: 'Borrowers who can comfortably afford the higher payment, have stable income, are within 10–15 years of retirement, and prioritize debt-free homeownership over liquidity. If the higher payment creates financial stress, a 30-year with voluntary extra payments gives more flexibility.' },
    ],
    longform: [
      { type: 'h2', text: 'The Lifetime Interest Gap Between 15 and 30 Years' },
      { type: 'p', text: 'On a $280,000 balance at 5.5%, a 30-year term costs about $293,000 in total interest. The same balance at 5.0% on a 15-year term costs about $119,000 — a $174,000 lifetime difference. That enormous gap is why financial planners almost universally recommend 15-year mortgages for borrowers who can afford the payment.' },
      { type: 'p', text: 'The catch: the 15-year P&I payment is about $2,215/month vs $1,590/month for 30-year — a $625/month difference. If that gap represents money that would otherwise go into investments earning more than 5%, a 30-year with investing the difference can sometimes produce a better net outcome. This is a close call that depends on your investment discipline and actual returns.' },
      { type: 'callout', tone: 'tip', text: 'A pragmatic middle path: take the 30-year, pay extra principal each month to simulate the 15-year payoff, but retain the option to drop to minimum payments if income drops. Use an amortization calculator to see the payoff date with extra payments.' },
    ],
  },
};

export default variant;
