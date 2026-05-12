import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'credit-card-debt-snowball-calculator',
  calculatorId: 'credit-card-payoff',

  seo: {
    title: 'Credit Card Debt Snowball Calculator — Payoff Plan in Minutes | Toolisk',
    metaDescription:
      'Free debt snowball calculator. Enter all your credit cards, see the smallest-balance-first payoff plan, and track months to debt-free with motivating wins along the way.',
    keywords:
      'debt snowball calculator, credit card debt snowball, debt payoff calculator, snowball vs avalanche, dave ramsey snowball calculator, credit card debt free calculator',
    ogTitle: 'Credit Card Debt Snowball Calculator — Payoff Plan',
    ogDescription:
      'Smallest-balance-first credit card payoff plan with months-to-debt-free projection.',
  },

  hero: {
    icon: '⛄',
    h1: 'Credit Card Debt Snowball Calculator',
    tagline:
      'Pay off the smallest balance first, then roll that payment into the next card. Watch small wins compound into a debt-free finish line — visible from month one.',
    gradient: 'from-sky-700 via-blue-700 to-indigo-700',
    breadcrumbLabel: 'Debt Snowball Calculator',
  },

  content: {
    aboutDescription:
      'A debt snowball calculator that builds a smallest-balance-first payoff plan across all your credit card debt. The snowball method is mathematically less optimal than the avalanche method (highest-rate first), but psychologically far more effective — most people who try snowball actually finish, while avalanche programs frequently fall apart. See your exact months-to-debt-free, total interest paid, and the rolling payment that "snowballs" through each card.',
    features: [
      '⛄ Smallest-balance-first debt snowball plan',
      '📊 Compare snowball vs avalanche method',
      '📅 Month-by-month payoff schedule',
      '💰 Total interest paid + months saved',
      '🎯 Visible wins along the way (cards paid off)',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'List all credit card debts', desc: 'Add every card: balance, minimum payment, and APR. Include store cards and BNPL plans — anything with revolving high-rate debt.' },
      { title: 'Set total monthly debt payment', desc: 'The total amount you can dedicate to debt across all cards monthly. Must exceed the sum of all minimums.' },
      { title: 'Pick snowball order', desc: 'The calculator sorts your cards smallest-balance-first by default. You can switch to highest-rate (avalanche) to compare.' },
      { title: 'Read the schedule', desc: 'See exactly which card you attack first, when each one is paid off, and the total months to debt-free.' },
      { title: 'Export & start', desc: 'Download the schedule. The plan only works if you actually execute — print it and tape it to your fridge.' },
    ],
    faqs: [
      {
        q: 'What is the debt snowball method?',
        a: 'The debt snowball method pays off your smallest credit card balance first, while making minimum payments on the rest. When the smallest is gone, you "snowball" that payment into the next-smallest card. Popularized by Dave Ramsey, the method prioritizes psychology over math — you get the dopamine hit of paying off a card every few months, which keeps motivation high. Most people who finish credit card payoff plans used snowball.',
      },
      {
        q: 'Snowball vs avalanche — which is actually better?',
        a: 'Avalanche (highest rate first) saves more total interest — typically 5–15% less interest paid over the full payoff period. Snowball (smallest balance first) costs slightly more but has higher completion rates. Studies have shown snowball users are 15–25% more likely to actually finish the plan because the early wins are visible and emotional. If you have started and abandoned debt payoff before, choose snowball. If you are a numbers-driven person who finishes things, choose avalanche.',
      },
      {
        q: 'How long does the snowball method actually take?',
        a: 'Depends entirely on total debt vs total monthly payment. For typical US households with $15–25k in credit card debt and $700–1000/month in debt payments, the snowball usually completes in 18–36 months. The calculator gives you the exact number for your situation — and the most useful output is often "if I add an extra $200/month, how many months does that save?" Answer: usually 6–12 months.',
      },
      {
        q: 'Should I pay minimums on cards I am not "snowballing"?',
        a: 'Yes, always. Missing the minimum on any card triggers late fees ($25–40), penalty APRs (often 29.99%+), and credit score damage that can last 7 years. The snowball method assumes you pay minimums on every card and put all extra money toward the smallest balance. The "extra" is what produces the snowball — minimums alone barely cover interest on high-rate cards.',
      },
      {
        q: 'What if I have BNPL or store card debt mixed in?',
        a: 'Treat them as credit card debt. BNPL plans (Affirm, Klarna, Afterpay) often charge 25%+ if you miss a payment; store cards typically run 25–30% APR. Add them to your snowball list with their balances and APRs. Sometimes BNPL plans are the smallest balance and ideal first-snowball targets — knock them out fast to simplify your monthly obligations.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why snowball beats avalanche in real life' },
      {
        type: 'p',
        text: 'The avalanche method is mathematically optimal — pay highest-rate first to minimize total interest. On paper it saves money. In practice, it often leaves people grinding for 18 months on a $12,000 high-rate card before they see a single card paid off. That stretch of zero visible progress is where most payoff plans collapse. The snowball trades a few hundred dollars in extra interest for a series of small wins every 2–6 months — and those wins are what keep people in the plan.',
      },
      { type: 'h3', text: 'The snowball, in one example' },
      {
        type: 'p',
        text: 'Three cards: Card A $2,800 @ 22%, Card B $4,500 @ 18%, Card C $8,000 @ 26%. Total minimums $250/month. You can pay $900/month total.',
      },
      {
        type: 'ul',
        items: [
          'Snowball order: A ($2,800), B ($4,500), C ($8,000). Pay $650 on A + minimums on B and C.',
          'Card A paid off in month 5. Now you roll that $650 plus A\'s minimum into Card B.',
          'Card B paid off in month 14. Roll all of that — now ~$830/month — into Card C.',
          'Card C paid off in month 24. Total interest paid: roughly $2,950.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'For comparison, the avalanche method on the same debts saves roughly $300–400 in interest but does not produce a single paid-off card until month 11. That gap is where most people quit.',
      },
      { type: 'h2', text: 'How to make the plan actually stick' },
      {
        type: 'ol',
        items: [
          'Cut up or freeze your credit cards. Continuing to use them during a snowball is the #1 cause of plan failure.',
          'Set up auto-pay for every minimum so you never miss one. Pay the snowball amount manually so it feels like a deliberate act.',
          'Tell one accountability partner (spouse, friend). Public commitment dramatically increases completion rate.',
          'Celebrate each paid-off card with a small, free reward (a night out is fine, a vacation is not).',
          'Build a $1000 emergency fund first so an unexpected expense does not force you back onto a card.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Credit Card Debt Snowball Calculator',
    softwareFeatures:
      'Debt snowball plan, Avalanche comparison, Month-by-month schedule, Total interest paid, Rolling payment modeling, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Credit Card Payoff Calculator', href: '/finance/credit-card-payoff-calculator', icon: '💳' },
    { name: 'Personal Loan EMI', href: '/finance/personal-loan-emi-calculator', icon: '👤' },
    { name: 'Net Worth Calculator', href: '/finance/net-worth-calculator', icon: '📊' },
  ],
};

export default variant;
