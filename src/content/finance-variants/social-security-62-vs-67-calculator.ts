import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'social-security-62-vs-67-calculator',
  calculatorId: 'social-security',
  seo: {
    title: 'Social Security 62 vs 67 Calculator — Early vs Full Retirement',
    metaDescription:
      'Compare Social Security benefits at 62 vs 67. See the monthly reduction for claiming early, cumulative lifetime totals, and the break-even age — for your exact FRA benefit.',
    keywords: 'social security 62 vs 67, claim social security at 62 vs 67, social security early vs full retirement age, ss 62 or 67 which is better',
    ogTitle: 'Social Security 62 vs 67 Calculator',
    ogDescription: 'Monthly benefit, lifetime totals, and break-even age for claiming at 62 vs FRA.',
  },
  hero: {
    icon: '🔢',
    h1: 'Social Security 62 vs 67: Which Is Better?',
    tagline: 'Monthly benefit reduction at 62, lifetime cumulative comparison, and the break-even age — so you can decide which claiming strategy fits your situation.',
    gradient: 'from-rose-600 via-red-600 to-orange-600',
    breadcrumbLabel: 'SS 62 vs 67 Calculator',
  },
  content: {
    aboutDescription:
      'Claiming at 62 gives you more years of income but permanently reduces your monthly benefit by about 25–30%. Claiming at 67 (FRA) gives you the full benefit but 5 fewer years of payments. This calculator shows both strategies side by side — monthly amounts, cumulative totals, and the break-even age where delaying to FRA finally wins.',
    features: [
      '🔢 Exact monthly benefit at 62 vs 67 (and 65 and 70)',
      '📈 Cumulative lifetime chart showing when FRA claiming overtakes early',
      '⚖️ Break-even age calculation for your exact benefit amount',
      '📊 Clear monthly reduction percentage for claiming at 62',
      '🎯 Recommendation based on your lifespan assumption',
    ],
    steps: [
      { title: 'Enter birth year', desc: '1960+ means FRA is 67. Earlier years have FRA between 66 and 66+10 months.' },
      { title: 'Enter FRA monthly benefit', desc: 'Look up your estimate at ssa.gov/myaccount — this is the 100% baseline.' },
      { title: 'Toggle to age 62', desc: 'See the reduced monthly amount and the total reduction percentage.' },
      { title: 'Set your lifespan', desc: 'Drag the slider to your honest longevity estimate. This determines which strategy wins for you.' },
      { title: 'Check the break-even age', desc: 'The exact age when cumulative FRA benefits surpass cumulative early benefits.' },
    ],
    faqs: [
      {
        q: 'How much is Social Security reduced if I claim at 62?',
        a: 'For those born 1960+ (FRA = 67), claiming at 62 reduces benefits by 30%. The reduction is 5/9% per month for the first 36 months before FRA, and 5/12% per month for additional months. For a $2,500 FRA benefit, claiming at 62 yields approximately $1,750/month — permanently, for life (with COLA adjustments).',
      },
      {
        q: 'If I claim at 62 and invest the money, does that beat waiting to 67?',
        a: 'At a 5% real annual return on invested SS proceeds, the investment-adjusted break-even for 62 vs 67 shifts from ~79 to roughly ~83–84. The argument for early claiming + investing is strongest when you have a short time horizon, high confidence in investment returns, or very low Social Security benefit (where the absolute dollars are less impactful). For most people in good health, waiting wins.',
      },
      {
        q: 'Can I claim at 62 and switch to a higher benefit later?',
        a: 'Not easily. You can withdraw your application within 12 months of claiming and repay all benefits received (no interest), effectively un-claiming. After 12 months, your benefit amount is locked. You can suspend payments from FRA to 70 to earn delayed credits, but the 62 reduction is already baked in — suspension credits apply to your already-reduced amount.',
      },
      {
        q: 'What if I am still working at 62?',
        a: 'If you claim before FRA and are still working, the retirement earnings test applies: benefits are reduced by $1 for every $2 you earn above $22,320/yr (2024 limit). In the year you reach FRA, the limit is $59,520 with a $1-for-$3 reduction. After FRA, there is no earnings test. For working recipients, claiming at 62 often makes little sense unless income is very low.',
      },
    ],
    longform: [
      {
        type: 'h2',
        text: 'The 30% reduction at 62: is it really permanent?',
      },
      {
        type: 'p',
        text: 'Yes. Once you claim at 62, your base benefit is permanently reduced by approximately 30% (for FRA = 67). Cost-of-living adjustments (COLA) apply to this lower base — so inflation protection is preserved, but you are always 30% below what you would have received at FRA. The only escape is the one-time withdrawal option within 12 months of claiming (with full repayment).',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Surviving spouses who claim their own reduced benefit early may be permanently locking in a lower base before switching to the survivor benefit. Talk to an SSA representative or financial planner before claiming if you are the lower-earning spouse in a marriage.',
      },
    ],
  },
  relatedTools: [
    { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏛️' },
    { name: 'SS Break-Even Calculator', href: '/finance/social-security-break-even-calculator', icon: '⚖️' },
  ],
};

export default variant;
