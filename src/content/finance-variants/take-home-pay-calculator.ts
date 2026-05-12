import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'take-home-pay-calculator',
  calculatorId: 'us-paycheck',

  seo: {
    title: 'Take-Home Pay Calculator — Net Salary After Tax & Deductions | Toolisk',
    metaDescription:
      'Free take-home pay calculator. See your net paycheck after federal tax, state tax, FICA, 401k, and benefits — for any salary, any state, any pay frequency.',
    keywords:
      'take home pay calculator, net pay calculator, paycheck calculator after tax, salary take home calculator, after tax salary calculator, net income calculator',
    ogTitle: 'Take-Home Pay Calculator — Net Salary After Tax',
    ogDescription:
      'See your net paycheck after federal tax, state tax, FICA, 401k, and benefits.',
  },

  hero: {
    icon: '💵',
    h1: 'Take-Home Pay Calculator',
    tagline:
      'The gross salary on your offer letter is not what hits your account. See exactly what lands after federal tax, state tax, FICA, 401k, and benefits — for any salary or state.',
    gradient: 'from-emerald-600 via-green-600 to-lime-600',
    breadcrumbLabel: 'Take-Home Pay Calculator',
  },

  content: {
    aboutDescription:
      'A take-home pay calculator built for clarity. Drop in your gross salary, state, pay frequency, and pre-tax deductions — and see your actual net pay per paycheck. Useful for budgeting, comparing job offers across states, and understanding exactly how a raise translates to take-home dollars.',
    features: [
      '💵 Net pay per paycheck, weekly / biweekly / monthly',
      '🗺️ State-specific tax modeling (all 50 states)',
      '📊 Federal tax + FICA + state breakdown',
      '🏦 Pre-tax deductions (401k, HSA, health insurance)',
      '📈 Effective tax rate vs marginal rate',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter gross annual salary', desc: 'Use the base salary on your offer letter, before bonuses. Add typical bonus separately as it taxes differently.' },
      { title: 'Pick your state', desc: 'State tax can swing take-home by $5–15k/year for the same gross. No-income-tax states (TX, FL, WA, NV) versus high-tax states (CA, NY, NJ) is a dramatic gap.' },
      { title: 'Set pay frequency', desc: 'Biweekly is most common in the US (26 paychecks). Monthly (12), semi-monthly (24), and weekly (52) are also supported.' },
      { title: 'Add deductions', desc: '401k contribution, HSA, health / dental / vision premiums, FSA. These are pre-tax — they lower both your tax and your take-home in different ways.' },
      { title: 'Read your net', desc: 'Per-paycheck take-home plus an annual breakdown of every withholding line.' },
    ],
    faqs: [
      {
        q: 'How much of my gross salary do I actually take home?',
        a: 'In the US, most salaried workers keep 65–80% of gross as take-home, depending on income, state, and benefit elections. A $100k earner in a no-tax state with no 401k might take home $77k. The same earner in California with a 10% 401k contribution might take home $63k. Use the calculator to see your exact numbers — generic rules of thumb miss too many variables.',
      },
      {
        q: 'Why is my take-home lower than I expected?',
        a: 'Three common surprises. (1) FICA — 7.65% of gross goes to Social Security and Medicare, regardless of state. (2) Marginal vs effective tax rate — your top dollar is taxed at your marginal rate (22%, 24%, 32%) which feels brutal, but your effective rate (total tax / total income) is much lower. (3) State tax — varies from 0% to 13.3%. Most "expected" take-home guesses underestimate state tax and FICA combined.',
      },
      {
        q: 'How does 401k contribution change take-home?',
        a: 'Pre-tax 401k contributions reduce your taxable income, which lowers your federal and state tax. For each $100 contributed to a traditional 401k, your take-home only drops by ~$70–80 (depending on your marginal rate). It is one of the most efficient wealth-building moves — you avoid tax on the way in and only pay it on withdrawal in retirement (usually at a lower rate).',
      },
      {
        q: 'What is the FICA tax I keep seeing on my paystub?',
        a: 'FICA is Social Security (6.2% on wages up to ~$168k as of 2024) and Medicare (1.45% on all wages, plus 0.9% surtax on wages above $200k). It funds federal retirement and healthcare programs. Your employer matches the 7.65% on your behalf — meaning the true cost of employing you is roughly 7.65% above your stated salary. FICA is mandatory and cannot be reduced.',
      },
      {
        q: 'Should I compare job offers based on gross or take-home?',
        a: 'Always take-home, especially across states. A $150k offer in Austin, TX is roughly equivalent to a $170k offer in San Francisco after state tax — they produce the same monthly cash in your account. Job offers can be misleading in headline numbers; running both through this calculator with your actual deductions and locations gives you the right comparison.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why "gross" is a misleading number' },
      {
        type: 'p',
        text: 'When companies post salaries, they post gross — the headline figure before any deductions. Federal tax (10–37% marginal), state tax (0–13.3%), FICA (7.65%), and benefits (typically 5–15% of gross) all come out before your paycheck lands. The gap between gross and net is rarely under 20% and often over 35%. Budgeting on gross is one of the most common money mistakes new earners make.',
      },
      { type: 'h3', text: 'A worked example: $150k in two states' },
      {
        type: 'p',
        text: 'Same person, same job, $150k gross, 10% 401k contribution, single filer, no other deductions:',
      },
      {
        type: 'ul',
        items: [
          'Austin, TX (no state tax): Federal $22.5k + FICA $11.5k + 401k $15k = take-home ~$101k/year.',
          'San Francisco, CA: Federal $22.5k + State $11k + FICA $11.5k + 401k $15k = take-home ~$90k/year.',
          'Same gross, $11k/year less take-home in CA — and SF housing costs significantly more on top of it.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'When negotiating a relocation or remote-work offer, always run both gross figures through this calculator. The "fair" cross-state equivalent number is rarely what the recruiter assumes.',
      },
      { type: 'h2', text: 'How to use take-home for budgeting' },
      {
        type: 'ol',
        items: [
          'Calculate your monthly net (annual take-home / 12).',
          'Build your budget on this number — never on gross.',
          'Maintain at least 20% slack for savings and unexpected expenses.',
          'Rerun the calculator anytime you change 401k contribution, state, or marital status.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Take-Home Pay Calculator',
    softwareFeatures:
      'Net pay calculation, State tax modeling, FICA & federal withholding, Pre-tax deductions, Pay frequency support, PDF & Excel export',
  },

  relatedTools: [
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator', icon: '🇺🇸' },
    { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '🧾' },
    { name: '401k Calculator', href: '/finance/401k-calculator', icon: '🏦' },
  ],
};

export default variant;
