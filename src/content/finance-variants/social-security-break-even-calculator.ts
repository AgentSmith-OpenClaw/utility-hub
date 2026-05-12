import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'social-security-break-even-calculator',
  calculatorId: 'social-security',
  seo: {
    title: 'Social Security Break-Even Calculator — Find Your Crossover Age',
    metaDescription:
      'Calculate the break-even age between claiming Social Security early vs late. Cumulative benefit chart shows exactly when delaying surpasses early claiming — for any FRA benefit amount.',
    keywords: 'social security break even calculator, social security break even age, when does delaying social security pay off, ss benefit crossover age',
    ogTitle: 'Social Security Break-Even Calculator',
    ogDescription: 'Find the exact age where delaying Social Security beats early claiming — cumulative chart included.',
  },
  hero: {
    icon: '⚖️',
    h1: 'Social Security Break-Even Calculator',
    tagline: 'Find the exact age when delaying Social Security beats early claiming — cumulative benefit chart with crossover points for all four claiming ages.',
    gradient: 'from-slate-700 via-blue-700 to-indigo-700',
    breadcrumbLabel: 'SS Break-Even Calculator',
  },
  content: {
    aboutDescription:
      'Enter your FRA monthly benefit and birth year, then watch the cumulative chart show you exactly where the benefit lines cross — the break-even age between each claiming strategy pair (62 vs 65, 65 vs 67, 67 vs 70).',
    features: [
      '⚖️ Break-even ages for all four claiming strategy pairs',
      '📈 Cumulative lifetime benefit chart with crossover lines',
      '🏛️ Exact SSA Full Retirement Age by birth year (66 to 67)',
      '📊 Monthly benefit comparison at each claiming age',
      '🎯 Optimal claiming recommendation based on your lifespan',
    ],
    steps: [
      { title: 'Enter birth year', desc: 'Determines your FRA — the reference point for all benefit adjustments.' },
      { title: 'Enter FRA monthly benefit', desc: 'From your SSA statement at ssa.gov/myaccount. The benefit you receive at exactly FRA.' },
      { title: 'Set lifespan assumption', desc: 'The break-even ages are fixed; your lifespan determines which strategy wins for you.' },
      { title: 'Read break-even ages', desc: 'Each strategy pair shows the age where cumulative benefits equalize.' },
      { title: 'Compare on the chart', desc: 'The cumulative line chart shows where lines cross — visual confirmation of the break-even ages.' },
    ],
    faqs: [
      {
        q: 'What is the typical Social Security break-even age between claiming at 62 vs 67?',
        a: 'For someone born 1960+ (FRA = 67), claiming at 62 vs 67 has a break-even around age 78–79. If you live to 80+, waiting to 67 wins on cumulative dollars. If you live to 75 or less, claiming at 62 wins. The exact age depends on your FRA benefit amount — use this calculator to see the precise crossover for your situation.',
      },
      {
        q: 'What is the break-even between claiming at 67 vs 70?',
        a: 'Delaying from FRA (67) to 70 earns 8%/year in delayed retirement credits — a 24% increase in monthly benefit. The break-even is typically around age 82–83. Given that average life expectancy for a 65-year-old American is about 84–85, the 67 vs 70 decision is close for the average person. With longevity in your family, 70 wins clearly.',
      },
      {
        q: 'Does the break-even change if I account for investment returns on early benefits?',
        a: 'Yes. If you invest early SS payments at a real return of 4–5%, the investment-adjusted break-even for claiming at 62 vs 67 shifts to roughly age 82–84 — a few years later than the simple crossover. This argument slightly favors early claiming if you can reliably invest the difference, but Social Security is a guaranteed, inflation-adjusted income stream that is hard to replicate with portfolio returns.',
      },
      {
        q: 'Should I use average life expectancy or my own estimate?',
        a: 'Your own health status and family history are more predictive than population averages. A 65-year-old in good health with parents who lived to 90 should weight lifespan assumptions toward 88–92. A 65-year-old with serious chronic conditions might weight toward 75–80. The break-even analysis is only useful if you ground it in your personal longevity outlook.',
      },
    ],
    longform: [
      {
        type: 'h2',
        text: 'Why the break-even age matters — and when it does not',
      },
      {
        type: 'p',
        text: "The break-even framework assumes you are neutral between receiving fewer larger payments vs more smaller payments. But Social Security isn't just longevity insurance — it's sequence-of-returns insurance. Delaying to 70 while drawing down your portfolio in early retirement may actually hurt your long-term wealth if markets perform well. Conversely, delaying locks in a larger guaranteed income floor, which can allow more equity risk in the portfolio.",
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If you are married, the survivor benefit strategy matters more than the individual break-even: the higher earner should almost always delay to 70 to maximize the survivor benefit for the lower-earning spouse.',
      },
    ],
  },
  relatedTools: [
    { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏛️' },
    { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
  ],
};

export default variant;
