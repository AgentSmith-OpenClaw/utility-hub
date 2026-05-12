import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'lumpsum-vs-sip-calculator',
  calculatorId: 'sip',

  seo: {
    title: 'Lumpsum vs SIP Calculator — Which Wins for Your Money? | Toolisk',
    metaDescription:
      'Compare investing a lumpsum vs SIP over the same horizon. See the final corpus, risk-adjusted return, and exactly when each approach beats the other.',
    keywords:
      'lumpsum vs sip calculator, sip vs lumpsum, lumpsum investment calculator, sip vs one time investment, bulk investment vs sip, sip lumpsum comparison',
    ogTitle: 'Lumpsum vs SIP Calculator — Which Wins for Your Money?',
    ogDescription:
      'Compare lumpsum and SIP for the same horizon. See which wins, and by how much.',
  },

  hero: {
    icon: '🔀',
    h1: 'Lumpsum vs SIP Calculator',
    tagline:
      'You have ₹10 lakh. Invest it all now, or stagger it as ₹83k/month over 12 months? The answer depends on the market — but the math is clear.',
    gradient: 'from-cyan-600 via-teal-600 to-emerald-600',
    breadcrumbLabel: 'Lumpsum vs SIP',
  },

  content: {
    aboutDescription:
      'A direct comparison calculator for the most-asked investing question in India: should I invest this lumpsum now, or stagger it via STP / SIP? Run both scenarios on the same money, the same horizon, the same fund — and see the corpus gap, the rupee-cost-averaging benefit, and the cost of being wrong in either direction.',
    features: [
      '🔀 Lumpsum vs SIP side-by-side',
      '📊 Same money, same horizon, different deployment',
      '📉 Rupee-cost-averaging benefit in down markets',
      '📈 Time-in-market premium in up markets',
      '📅 Year-by-year corpus comparison',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter the total amount', desc: 'The money you have to invest — bonus, inheritance, FD maturity, business windfall.' },
      { title: 'Set the comparison horizon', desc: 'Use the same end-date for both. The lumpsum compounds for the full period; the SIP deploys over months 1–N and compounds the rest.' },
      { title: 'Choose expected return', desc: 'Use a realistic long-run rate (10–12% for equity). The relative gap between lumpsum and SIP barely changes with the return rate.' },
      { title: 'Pick SIP duration', desc: '6–12 months is the common staggering window. Longer reduces volatility risk but also reduces lumpsum advantage.' },
      { title: 'Read the verdict', desc: 'See both final corpuses and the percentage gap. Decide whether the risk reduction is worth the expected return giveup.' },
    ],
    faqs: [
      {
        q: 'Does lumpsum or SIP give a higher return?',
        a: 'On average, lumpsum wins. Roughly 65–70% of historical rolling windows show lumpsum beating staggered SIP because more money is in the market for longer. But the wins-and-losses are not symmetric — when SIP wins, it wins big (during market falls), and when lumpsum wins, the margin is usually small. The right framing is risk-adjusted: lumpsum has higher expected return and higher variance.',
      },
      {
        q: 'When should I prefer SIP over lumpsum?',
        a: 'Three situations make staggered deployment clearly better: (1) markets at all-time highs with stretched valuations, (2) you would emotionally regret a 20% drawdown in month 1, (3) the lumpsum is large enough that a single bad entry could permanently impact retirement plans. In any of these, give up 1–2% of expected return for the peace of mind of a 6–12 month STP.',
      },
      {
        q: 'Is STP the same as SIP for this comparison?',
        a: 'Functionally yes. STP (Systematic Transfer Plan) parks the lumpsum in a liquid fund and transfers a fixed amount to an equity fund monthly. SIP just invests fresh money monthly. For comparing "lumpsum now" vs "staggered deployment", both behave identically — the only difference is that STP earns liquid-fund returns (~6%) on the uninvested portion, while SIP money sits in your bank earning savings rate (~3%).',
      },
      {
        q: 'How long should I stagger a lumpsum?',
        a: 'A working rule: stagger over 6 months if markets are near average valuations, 12 months if valuations are elevated, immediate lumpsum if markets have fallen 15%+ from recent peaks. The point is to balance two opposing risks — being wrong about a near-term crash, and being out of the market while it rallies. 6–12 months covers most reasonable timelines.',
      },
      {
        q: 'What about dollar-cost averaging in retirement accounts?',
        a: 'Same math. If you receive a one-time bonus and want to put it in your 401k / NPS / EPF voluntary contribution, lumpsum-vs-staggered is the same question. Most retirement accounts allow only periodic contributions anyway, which effectively forces a SIP-like deployment — but if you have flexibility, the long-horizon argument for lumpsum applies even more strongly because the compounding window is 20–30 years.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The math behind the lumpsum advantage' },
      {
        type: 'p',
        text: 'Imagine you have ₹12 lakh. Option A: invest the whole thing on day 1 in an equity fund averaging 12% / year. Option B: invest ₹1 lakh per month for 12 months, then leave it. After year 1, both portfolios have invested the same ₹12 lakh — but Option A has earned 12% on the full amount while Option B has earned only ~6.5% on the average balance. From year 2 onwards both compound at the same rate on different base capital. That gap, set at year 1, compounds for the entire horizon.',
      },
      { type: 'h3', text: 'When the math reverses' },
      {
        type: 'p',
        text: 'The lumpsum advantage assumes a generally rising market. In a falling market — say, a 25% drawdown over 12 months — the SIP buys progressively cheaper units while the lumpsum sits at peak entry. When markets recover, the SIP\'s lower average cost beats the lumpsum\'s timing disadvantage, sometimes by 15–20%. This is exactly why staggering wins in crash years and loses in rally years.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'The right question is not "which wins on average" but "which would you regret less if you are wrong?" If a 20% paper loss on day 30 would make you sell, stagger. If it would not, lumpsum.',
      },
      { type: 'h2', text: 'A simple decision framework' },
      {
        type: 'ol',
        items: [
          'Is the lumpsum more than 30% of your total investable assets? If yes, stagger.',
          'Are major indices within 5% of all-time highs? If yes, stagger 6–12 months.',
          'Is your horizon under 5 years? If yes, the SIP/lumpsum gap matters less than asset allocation — be more conservative overall.',
          'Are you emotionally tested in markets? If no, stagger — the math is worth a tiny giveup for the chance to actually stay invested.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Lumpsum vs SIP Calculator',
    softwareFeatures:
      'Lumpsum vs SIP comparison, Final corpus gap, Rupee-cost-averaging modeling, Year-by-year schedule, PDF & Excel export',
  },

  relatedTools: [
    { name: 'SIP Calculator', href: '/finance/sip-calculator', icon: '💼' },
    { name: 'Crore SIP Calculator', href: '/finance/crore-sip-calculator', icon: '💎' },
    { name: 'Compound Interest', href: '/finance/compound-interest-calculator', icon: '📊' },
  ],
};

export default variant;
