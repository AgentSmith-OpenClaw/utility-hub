import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'crore-sip-calculator',
  calculatorId: 'sip',

  seo: {
    title: 'How Much SIP to Make 1 Crore? — Crore SIP Calculator | Toolisk',
    metaDescription:
      'Find out exactly how much monthly SIP you need to build ₹1 crore, ₹2 crore, or ₹5 crore — across 10, 15, 20, and 25 year horizons at realistic return assumptions.',
    keywords:
      'crore sip calculator, how much sip for 1 crore, sip to make 1 crore, 1 crore sip calculator, 2 crore sip calculator, sip goal calculator, mutual fund crore plan',
    ogTitle: 'How Much SIP to Make 1 Crore? — Crore SIP Calculator',
    ogDescription:
      'See the monthly SIP needed to reach ₹1 crore, ₹2 crore, or ₹5 crore across 10–25 year horizons.',
  },

  hero: {
    icon: '💎',
    h1: 'Crore SIP Calculator',
    tagline:
      'How much monthly SIP do you actually need to build ₹1 crore? Or ₹2 crore? Plug in your horizon and expected return — the answer takes one second.',
    gradient: 'from-fuchsia-600 via-purple-600 to-violet-600',
    breadcrumbLabel: 'Crore SIP Calculator',
  },

  content: {
    aboutDescription:
      'A goal-first SIP calculator that solves the question every investor actually asks: "What monthly SIP gets me to ₹1 crore?" Enter your target corpus, horizon, and expected return — and see the SIP needed, the total amount you invest, and the compounding gain. Built on the same engine as our SIP Calculator, framed for crore-level goals.',
    features: [
      '💎 Solve backwards from a ₹1 / 2 / 5 crore target',
      '📊 Compare 10, 15, 20, 25 year horizons',
      '📈 Step-up SIP option to lower starting amount',
      '🎯 Total invested vs total corpus breakdown',
      '📅 Year-by-year wealth growth schedule',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Set your target', desc: 'Most users start with ₹1 crore. Add zeroes for ₹2 crore, ₹5 crore, ₹10 crore goals — the math scales.' },
      { title: 'Pick your horizon', desc: 'The single biggest lever. ₹1 crore in 25 years needs ~₹6k/month. The same goal in 10 years needs ~₹45k/month.' },
      { title: 'Choose expected return', desc: 'Equity-heavy SIPs: 11–13% long-run. Hybrid: 9–11%. Debt: 6–8%. Use a realistic rate — 15%+ rarely compounds in real portfolios.' },
      { title: 'Toggle step-up', desc: 'A 10% annual step-up roughly halves the starting SIP needed. Always check this option.' },
      { title: 'Export your plan', desc: 'Download the year-by-year corpus table to share with your spouse or advisor.' },
    ],
    faqs: [
      {
        q: 'How much SIP do I need to build ₹1 crore in 20 years?',
        a: 'At a realistic 12% long-run equity return, roughly ₹10,000/month. At 10%, about ₹13,000. With a 10% annual step-up starting from ₹6,000/month, you reach the same goal — the step-up version actually costs less in total invested rupees because more compounding is doing the work. Use the calculator to compare scenarios with your exact assumptions.',
      },
      {
        q: 'Is ₹1 crore enough for retirement in India?',
        a: 'Today, ₹1 crore in a 70% debt / 30% equity portfolio yields ~₹4–5 lakh/year in withdrawals (4% safe withdrawal rate) — barely covering urban middle-class expenses. By the time most readers retire, ₹1 crore in 2045 rupees will buy what ₹35–40 lakh buys today. Aim higher: ₹3–5 crore is the more honest target for a middle-class retirement in a tier-1 city.',
      },
      {
        q: 'What is the safest path to ₹1 crore?',
        a: 'Time, not returns. A ₹6,000/month SIP for 25 years at 12% reaches ₹1.1 crore — and you only invest ₹18 lakh of your own money. A ₹35,000/month SIP for 10 years at the same return reaches ₹81 lakh and requires ₹42 lakh of your money. Longer horizon does almost all the work. Start as early as you can; the compounding tail is where the real money sits.',
      },
      {
        q: 'What returns should I expect from an equity SIP over 20 years?',
        a: 'Indian equity indices have delivered roughly 12–14% CAGR over rolling 20-year windows historically. A diversified equity SIP — large-cap heavy, with some mid and flexicap — has typically returned 11–13% post-expense. Aggressive small-cap focused SIPs can return more but with substantially higher volatility. Plan with 11–12% to leave a margin of safety in your projections.',
      },
      {
        q: 'What if I cannot afford the SIP to reach ₹1 crore in my horizon?',
        a: 'Three honest options: (1) extend the horizon by 5 years — the SIP drops dramatically because of compounding asymmetry, (2) take a step-up SIP starting small and growing 10–12% yearly with your salary, (3) lower the target to ₹70 lakh now and revisit at year 10 as income rises. The worst option is starting nothing because the "right" SIP feels unreachable — start something today.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The crore math, simplified' },
      {
        type: 'p',
        text: 'A ₹1 crore corpus from a SIP is a function of three numbers: monthly amount, years invested, and average annual return. The non-obvious part is how unequally these three lever the outcome. Doubling the monthly SIP roughly doubles the final corpus. Doubling the horizon, holding everything else constant, more than triples it. That asymmetry is why time-in-market beats timing-the-market every single time.',
      },
      { type: 'h3', text: 'Realistic crore plans at a glance' },
      {
        type: 'ul',
        items: [
          '₹1 crore in 25 years: ~₹6,000/month at 12% — total invested ₹18L',
          '₹1 crore in 20 years: ~₹10,000/month at 12% — total invested ₹24L',
          '₹1 crore in 15 years: ~₹20,000/month at 12% — total invested ₹36L',
          '₹1 crore in 10 years: ~₹45,000/month at 12% — total invested ₹54L',
          '₹2 crore in 25 years: ~₹12,000/month at 12% — total invested ₹36L',
          '₹5 crore in 30 years: ~₹17,000/month at 12% — total invested ₹61L',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If a 25-year SIP looks suspiciously small, that is compounding doing its job. The first 10 years build the engine; years 15–25 are where the corpus actually accelerates.',
      },
      { type: 'h2', text: 'The "Crore in 25" starter playbook' },
      {
        type: 'ol',
        items: [
          'Set up a ₹6,000/month SIP today into a low-cost diversified equity fund (large-cap or flexicap index).',
          'Add a 10% annual step-up — every January, raise the SIP automatically.',
          'Park 50% of every bonus into the same fund as a lump sum top-up.',
          'Never stop the SIP in a market crash — that is when each rupee buys the most units.',
          'Check the corpus once a year. Ignore daily NAV moves for 24 of those 12 months.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Crore SIP Calculator',
    softwareFeatures:
      'Goal-based SIP calculation, Multiple crore targets, Step-up scenarios, Year-by-year corpus table, PDF & Excel export',
  },

  relatedTools: [
    { name: 'SIP Calculator', href: '/finance/sip-calculator', icon: '💼' },
    { name: 'Step-Up SIP Calculator', href: '/finance/sip-step-up-calculator', icon: '📈' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
  ],
};

export default variant;
