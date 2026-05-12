import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'social-security-spousal-benefits-calculator',
  calculatorId: 'social-security',
  seo: {
    title: 'Social Security Spousal Benefits Calculator',
    metaDescription:
      'Calculate Social Security spousal benefits — up to 50% of the higher earner\'s FRA benefit. See how claiming age affects the spousal amount, and model combined household Social Security income.',
    keywords: 'social security spousal benefits calculator, social security spouse benefit, how much is spousal social security, ss spousal benefit 50 percent, married social security calculator',
    ogTitle: 'Social Security Spousal Benefits Calculator',
    ogDescription: 'Model household Social Security — primary + 50% spousal benefit, with break-even and cumulative chart.',
  },
  hero: {
    icon: '👫',
    h1: 'Social Security Spousal Benefits Calculator',
    tagline: 'Model combined household Social Security income — primary benefit plus spousal benefit (up to 50% of the higher earner\'s FRA amount). Cumulative chart, break-even ages, and claiming strategy.',
    gradient: 'from-pink-600 via-rose-600 to-red-600',
    breadcrumbLabel: 'SS Spousal Benefits Calculator',
  },
  content: {
    aboutDescription:
      'Spouses can claim up to 50% of the higher earner\'s FRA monthly benefit — even with no work record of their own. This calculator models the primary benefit plus the spousal top-up, shows how early claiming reduces the spousal amount, and compares strategies across both earners.',
    features: [
      '👫 Combined household SS income (primary + spousal 50%)',
      '📈 Cumulative lifetime chart for combined benefits',
      '⚖️ Break-even analysis for both claiming strategies',
      '🏛️ FRA schedule applied to both spouses separately',
      '📊 Monthly benefit table at each claiming age',
    ],
    steps: [
      { title: 'Toggle "Include spousal +50%"', desc: 'Activates the spousal benefit — adds 50% of the FRA base to monthly and lifetime totals.' },
      { title: 'Enter primary earner FRA benefit', desc: 'The higher earner\'s FRA amount from ssa.gov/myaccount.' },
      { title: 'Compare claiming ages', desc: 'Toggle between 62, 65, 67, and 70 to see how the combined amount changes.' },
      { title: 'Set lifespan', desc: 'For household planning, use the higher-earning spouse\'s lifespan (survivor benefits matter).' },
      { title: 'Read household totals', desc: 'Monthly combined income and lifetime cumulative totals at each claiming age.' },
    ],
    faqs: [
      {
        q: 'How much is the Social Security spousal benefit?',
        a: 'Up to 50% of the primary earner\'s FRA (Full Retirement Age) monthly benefit — not the actual benefit they are receiving, but their FRA baseline. If the primary earner\'s FRA benefit is $2,500/month and delays to 70 to receive $3,100/month, the spouse\'s maximum is still $1,250 (50% of $2,500 FRA). Delayed credits do not increase the spousal benefit.',
      },
      {
        q: 'Is the spousal benefit reduced for early claiming?',
        a: 'Yes. If the spouse claims their spousal benefit before their own FRA, it is reduced. The maximum spousal benefit (50% of primary FRA) is only received at the spouse\'s FRA. Claiming spousal benefits at 62 reduces the amount by about 30–35%, similar to the reduction on one\'s own benefit.',
      },
      {
        q: 'What is the optimal couples\' Social Security strategy?',
        a: 'The most common optimal strategy: the lower earner claims at 62 to provide household income, while the higher earner delays to 70 to maximize the monthly benefit and the survivor benefit. The survivor receives up to 100% of the deceased\'s actual benefit — so the higher earner delaying to 70 directly lifts the surviving spouse\'s lifetime income.',
      },
      {
        q: 'Can both spouses receive Social Security benefits?',
        a: 'Yes, but with coordination. Each spouse receives their own benefit or the spousal benefit — whichever is higher. If both spouses have their own earnings records, they each receive their own benefit and there is no additional spousal benefit (unless one\'s own benefit is less than 50% of the other\'s FRA amount, in which case they receive a top-up to 50%).',
      },
    ],
    longform: [
      {
        type: 'h2',
        text: 'Survivor benefits: the most underrated factor in SS planning',
      },
      {
        type: 'p',
        text: 'When one spouse dies, the survivor receives the higher of the two benefit amounts — effectively replacing the lower benefit. This means the higher earner\'s claiming age determines the survivor\'s lifetime income after the first death. A $600/month increase from delaying from FRA to 70 is not just for the primary earner — it is a $600/month lifetime increase for the surviving spouse, potentially for 10–15 years.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'For married couples, the Social Security break-even analysis should use a "joint life expectancy" — the probability that at least one spouse lives to a given age. Joint life expectancy at 65 for a couple is significantly higher than for an individual (85–90% chance one spouse lives to 85 vs about 50% for an individual).',
      },
    ],
  },
  relatedTools: [
    { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏛️' },
    { name: 'Delayed Retirement Credit', href: '/finance/delayed-retirement-credit-calculator', icon: '⏳' },
    { name: 'SS Break-Even', href: '/finance/social-security-break-even-calculator', icon: '⚖️' },
  ],
};

export default variant;
