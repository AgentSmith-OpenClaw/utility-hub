import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: '401k-employer-match-calculator',
  calculatorId: '401k',

  seo: {
    title: '401k Employer Match Calculator — Don\'t Leave Free Money | Toolisk',
    metaDescription:
      'Free 401k employer match calculator. See exactly how much free retirement money you collect from your employer match — and the lifetime cost of contributing below the match.',
    keywords:
      '401k employer match calculator, 401k match calculator, employer matching contribution, 401k full match, how much to contribute to 401k for full match, 401k match lifetime value',
    ogTitle: '401k Employer Match Calculator — Don\'t Leave Free Money',
    ogDescription:
      'See how much free retirement money you collect with full employer match — and lifetime cost of falling short.',
  },

  hero: {
    icon: '🤝',
    h1: '401k Employer Match Calculator',
    tagline:
      'The employer match is the closest thing to free money in personal finance. See exactly what your match is worth — and what it costs to leave any of it on the table.',
    gradient: 'from-teal-700 via-emerald-700 to-green-700',
    breadcrumbLabel: '401k Match Calculator',
  },

  content: {
    aboutDescription:
      'A 401k employer match calculator focused on the most important early-career money decision: capturing the full match. Plug in your salary, your contribution percentage, and your employer\'s match formula — see the annual match dollars, the long-term compounded value, and exactly how much you give up by contributing below the match threshold.',
    features: [
      '🤝 Annual employer match in dollars',
      '📊 Lifetime value at retirement (with compounding)',
      '⚠️ "Money left on the table" if under-contributing',
      '📈 Multiple match formulas (dollar-for-dollar, 50¢, tiered)',
      '🎯 Optimal contribution % to capture full match',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter salary & current contribution %', desc: 'Use base salary (matching usually does not apply to bonuses) and your current 401k contribution percentage.' },
      { title: 'Add employer match formula', desc: 'Common formulas: "100% of first 3%", "50% of first 6%", "100% of first 4% + 50% of next 2%". Use your plan document to be exact.' },
      { title: 'Set vesting schedule (optional)', desc: 'Many employers vest the match over 3–5 years. Money becomes truly yours after vesting — leaving before forfeits unvested match.' },
      { title: 'Choose horizon to retirement', desc: 'Years until you stop contributing. Longer horizons amplify the compounded value of even small annual matches.' },
      { title: 'Read your match dollars + lifetime value', desc: 'See annual match amount, plus what those dollars grow into by retirement at a realistic 8% return.' },
    ],
    faqs: [
      {
        q: 'What is a typical 401k employer match?',
        a: 'The most common match is "50% on the first 6% of salary" — meaning if you contribute 6%, your employer adds 3%. The second most common is "100% on the first 3%" — dollar-for-dollar up to 3%. Some generous employers offer 100% on 4–5%, and a few top-tier companies offer 100% on 6%. The average effective match across US employers is roughly 4.7% of salary annually.',
      },
      {
        q: 'How much should I contribute to capture the full match?',
        a: 'Always contribute at least the percentage needed for the full match. On a "50% of first 6%" plan, you contribute 6% to capture the full 3% match. On a "100% of first 4%" plan, contribute 4%. Anything less is leaving free money. The single most damaging early-career financial mistake is contributing below the match threshold — usually because the paycheck feels too tight.',
      },
      {
        q: 'What is "vesting" and why does it matter?',
        a: 'Vesting is when employer match money legally becomes yours. Most companies use "cliff" vesting (0% for 2–3 years, then 100%) or "graded" vesting (20% per year over 5 years). If you leave before fully vested, you forfeit the unvested portion. This matters most when planning a job change — staying an extra 6 months sometimes captures $10–30k of additional vested match. Always check your vesting status before resigning.',
      },
      {
        q: 'Is 401k match really "free money"?',
        a: 'Effectively yes. The match is part of your total compensation — employers offer it as a tax-advantaged way to attract and retain talent. The reason it gets called "free" is that the match arrives on top of your salary; not capturing it is the same as accepting a lower salary for no reason. Over a 30-year career, a 3% annual match compounded at 8% turns into roughly 10–12× your current annual salary in retirement money. That is enormous.',
      },
      {
        q: 'Should I contribute more than the match?',
        a: 'After capturing the full match, prioritize: (1) high-interest debt payoff (>7% APR), (2) HSA if eligible, (3) Roth IRA up to the limit, then back to 401k up to the annual contribution limit. The match is "easy first money" — your priority changes once you have captured it. Use the 401k Calculator for full retirement planning beyond just the match piece.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The most expensive mistake new workers make' },
      {
        type: 'p',
        text: 'A 25-year-old earning $70k who contributes 3% instead of the matchable 6% on a "50% of 6%" plan misses ~$1,050/year of employer match. Over a 40-year career (with salary growth) that missed match compounds into roughly $300,000 of lost retirement wealth. The "tight budget" reason for under-contributing in your 20s costs three hundred thousand dollars in your 60s. It is the single most expensive mistake hidden inside a small monthly paycheck difference.',
      },
      { type: 'h3', text: 'Common match formulas, decoded' },
      {
        type: 'ul',
        items: [
          '"Dollar-for-dollar up to 3%": contribute 3%, employer adds 3%. Total going to 401k = 6% of salary.',
          '"50% on first 6%": contribute 6%, employer adds 3%. Total = 9% of salary.',
          '"100% on 4% + 50% on next 2%": contribute 6%, employer adds 5%. Total = 11% of salary — very generous.',
          '"Discretionary match": no formal formula; employer decides annually. Plan as if it is zero.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Check your plan document, not the recruiter\'s pitch. Match formulas, vesting schedules, and contribution caps are written in the Summary Plan Description (SPD) — and only the SPD is binding.',
      },
      { type: 'h2', text: 'A simple priority order for retirement contributions' },
      {
        type: 'ol',
        items: [
          'Contribute enough to your 401k to capture the full employer match. Always. First priority.',
          'Pay off any debt above 7% APR before investing further.',
          'Fully fund an HSA if you have a high-deductible health plan (triple tax-advantaged).',
          'Fund a Roth IRA up to the annual limit ($7,000 in 2024 for under-50s).',
          'Return to 401k and contribute up to the federal limit ($23,000 in 2024 for under-50s).',
          'Taxable brokerage account after all tax-advantaged space is full.',
        ],
      },
    ],
  },

  schema: {
    softwareName: '401k Employer Match Calculator',
    softwareFeatures:
      'Annual employer match, Lifetime compounded value, Multiple match formulas, Vesting modeling, Under-contribution gap, PDF & Excel export',
  },

  relatedTools: [
    { name: '401k Calculator', href: '/finance/401k-calculator', icon: '🏦' },
    { name: 'Roth vs Traditional IRA', href: '/finance/roth-vs-traditional-ira', icon: '⚖️' },
    { name: 'Take-Home Pay Calculator', href: '/finance/take-home-pay-calculator', icon: '💵' },
  ],
};

export default variant;
