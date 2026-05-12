import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'delayed-retirement-credit-calculator',
  calculatorId: 'social-security',
  seo: {
    title: 'Delayed Retirement Credit Calculator — 8%/yr Past FRA',
    metaDescription:
      'Calculate how much your Social Security benefit increases for each year you delay past Full Retirement Age. 8%/yr delayed retirement credits from FRA to 70 — see exact monthly and lifetime totals.',
    keywords: 'delayed retirement credit calculator, social security delay bonus, 8 percent per year social security, social security delay to 70 calculator, drc social security',
    ogTitle: 'Delayed Retirement Credit Calculator',
    ogDescription: 'How much does delaying Social Security past FRA increase your monthly benefit? 8%/yr up to age 70.',
  },
  hero: {
    icon: '⏳',
    h1: 'Delayed Retirement Credit Calculator',
    tagline: 'Delaying Social Security past FRA earns 8%/year in guaranteed credits. See exact monthly benefit increases and lifetime totals for delaying to 68, 69, or 70.',
    gradient: 'from-emerald-700 via-teal-700 to-cyan-700',
    breadcrumbLabel: 'Delayed Retirement Credit',
  },
  content: {
    aboutDescription:
      'Delayed Retirement Credits (DRC) are the 8%/year increase in Social Security benefits for each year you postpone claiming past your Full Retirement Age, up to age 70. This calculator shows exactly how much each year of delay is worth in monthly and lifetime dollars.',
    features: [
      '⏳ Exact monthly benefit at each delay year (FRA, +1, +2, +3 = age 70)',
      '📈 Cumulative lifetime comparison across all claiming ages',
      '💰 Dollar value of each year of delay in annual benefit increase',
      '🏛️ Exact FRA by birth year (SSA official schedule)',
      '⚖️ Break-even ages to confirm when delay pays off',
    ],
    steps: [
      { title: 'Enter birth year', desc: 'Establishes your FRA — the baseline from which delayed credits are measured.' },
      { title: 'Enter FRA monthly benefit', desc: 'The 100% benefit at your FRA. Credits are calculated on this base.' },
      { title: 'Toggle between claiming ages', desc: 'See 67 (FRA), 68, 69, and 70 — each year adds 8% to the FRA base.' },
      { title: 'Set lifespan', desc: 'Determines which delay strategy maximizes lifetime total for your longevity assumption.' },
      { title: 'Read monthly and lifetime amounts', desc: 'Exact monthly benefit and lifetime total at each claiming age update instantly.' },
    ],
    faqs: [
      {
        q: 'What are Delayed Retirement Credits (DRC) for Social Security?',
        a: 'DRCs are the 8% per year increase in Social Security benefits for each year you delay claiming past your Full Retirement Age, up to age 70. If your FRA benefit is $2,500/month and you delay 3 years to 70, your benefit is $2,500 × 1.24 = $3,100/month — a $600/month increase for life.',
      },
      {
        q: 'Is the 8%/year Social Security delayed credit truly risk-free?',
        a: 'Yes, with one caveat: it requires you to live long enough to collect it. The delayed credit is guaranteed by the federal government, inflation-indexed via COLA, and does not depend on market performance. In comparison, a risk-free Treasury bond yields 4–5%. The delayed credit is effectively a longevity-contingent annuity that beats treasuries if you live past the break-even age.',
      },
      {
        q: 'Can I earn delayed credits after FRA even if I was already claiming?',
        a: 'Yes — you can voluntarily suspend your benefit from FRA to 70, even if you already started claiming at FRA. During suspension, no benefits are paid, but you earn 8%/year in delayed credits. This is a useful strategy for those who claimed at FRA but later realize they have other income sources and want to boost their age-70 benefit.',
      },
      {
        q: 'Do delayed retirement credits apply to spousal or survivor benefits?',
        a: 'Delayed credits increase the primary worker\'s benefit, which in turn increases the survivor benefit for a spouse (up to 100% of the deceased\'s benefit). However, DRCs do NOT increase the spousal benefit while both spouses are alive — spousal benefit is capped at 50% of the primary earner\'s FRA amount, regardless of how long the primary earner delayed.',
      },
    ],
    longform: [
      {
        type: 'h2',
        text: 'The math behind 8%/year delayed credits',
      },
      {
        type: 'p',
        text: 'The credit is 2/3% per month (8% per year) for months between FRA and 70. It is applied multiplicatively: if FRA benefit is $2,500 and you delay 36 months (3 years to age 70 for FRA=67), the factor is 1 + 36 × (2/3%) = 1 + 0.24 = 1.24. Monthly benefit = $3,100. The increase is on the nominal FRA benefit, and future COLA adjustments apply to this higher base.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'The break-even for delaying from FRA (67) to 70 is around age 82–83. Average life expectancy for a healthy 65-year-old American is 84–86. If your health is average or better, the delay math usually favors waiting to 70.',
      },
    ],
  },
  relatedTools: [
    { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏛️' },
    { name: 'SS Break-Even', href: '/finance/social-security-break-even-calculator', icon: '⚖️' },
    { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
  ],
};

export default variant;
