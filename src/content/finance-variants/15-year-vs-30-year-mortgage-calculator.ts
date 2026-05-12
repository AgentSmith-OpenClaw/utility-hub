import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: '15-year-vs-30-year-mortgage-calculator',
  calculatorId: 'mortgage',

  seo: {
    title: '15-Year vs 30-Year Mortgage Calculator — Compare Interest | Toolisk',
    metaDescription:
      'Compare 15-year and 30-year mortgages side-by-side. See the monthly payment difference, total interest gap, and the true cost of choosing a longer term — instantly.',
    keywords:
      '15 year vs 30 year mortgage calculator, mortgage term comparison, 15 vs 30 year fixed mortgage, mortgage payoff calculator, short vs long mortgage term, mortgage interest savings',
    ogTitle: '15-Year vs 30-Year Mortgage Calculator — Compare Interest',
    ogDescription:
      'See the real monthly and lifetime cost gap between a 15-year and 30-year mortgage.',
  },

  hero: {
    icon: '⚖️',
    h1: '15-Year vs 30-Year Mortgage Calculator',
    tagline:
      'A 30-year mortgage looks $700 cheaper a month. Over the full term, it can cost an extra $200k in interest. See your exact numbers side-by-side.',
    gradient: 'from-indigo-700 via-blue-700 to-sky-700',
    breadcrumbLabel: '15 vs 30 Year Mortgage',
  },

  content: {
    aboutDescription:
      'A side-by-side comparison calculator for the most consequential mortgage decision: term length. A 15-year mortgage carries a 0.5–0.75% lower rate but a 50% higher monthly payment than a 30-year. See the monthly cashflow gap, the lifetime interest gap, and the break-even on a 30-year-with-extra-principal strategy.',
    features: [
      '⚖️ 15-year vs 30-year side-by-side',
      '💰 Total interest gap, in dollars',
      '📊 Monthly payment difference',
      '⚡ "30-year + extra principal" comparison',
      '📅 Both amortization schedules',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter loan amount', desc: 'Use the same principal for both scenarios — that is what makes the comparison fair.' },
      { title: 'Set the two rates', desc: 'Typical spread: 15-year mortgages run 0.5–0.75% below 30-year rates. Use today\'s quotes from your lender for both.' },
      { title: 'Compare the totals', desc: 'Monthly payment, total interest paid, and final payoff date for each term.' },
      { title: 'Run the hybrid', desc: 'Optional: model "30-year mortgage + the 15-year monthly extra as principal payment." Often nearly matches the 15-year math with more flexibility.' },
      { title: 'Export the comparison', desc: 'Download both schedules to share with your spouse or lender.' },
    ],
    faqs: [
      {
        q: 'Is a 15-year or 30-year mortgage better?',
        a: 'Depends on cashflow, discipline, and opportunity cost. The 15-year saves dramatically more interest and builds equity twice as fast, but the monthly payment is 40–50% higher. The 30-year frees cashflow for investment, retirement contributions, and emergencies — useful if you can earn more on those dollars than the mortgage rate costs. Most disciplined investors do better with a 30-year + maxing tax-advantaged accounts; most undisciplined ones do better being forced into a 15-year.',
      },
      {
        q: 'How much extra interest does a 30-year mortgage cost?',
        a: 'On a $400k mortgage at typical 2024–2025 rates (15-yr at 6%, 30-yr at 6.75%), the 30-year costs roughly $935k total versus $608k for the 15-year — about $325k more in interest. That is $11k/year on average. The gap shrinks if you make extra principal payments on the 30-year, and grows if rates rise.',
      },
      {
        q: 'Why is the 15-year rate lower?',
        a: 'Lender risk is lower. With a 15-year, the bank gets its principal back in half the time, so they are exposed to less default risk, less interest-rate risk, and less inflation risk on the locked-in rate. They share that saved risk back as a lower rate — typically 50–75 basis points lower than the 30-year equivalent.',
      },
      {
        q: 'Should I take a 30-year and just pay it off in 15?',
        a: 'A common DIY strategy. Take the 30-year (lower payment, more flexibility) and voluntarily pay the 15-year equivalent monthly. You give up roughly 0.5% in rate but keep the option to drop back to the 30-year payment in any month you need cashflow flexibility. Mathematically, the 15-year still wins on total cost by ~$30–60k on a $400k loan — but the optionality is worth real money to most households.',
      },
      {
        q: 'Are there other mortgage terms besides 15 and 30 years?',
        a: 'Yes. 10-year (rare, very aggressive amortization), 20-year (middle ground, ~25 bp below 30-year), 25-year (uncommon in the US, common in Canada), and 40-year (rare, mostly used in loan modifications). For most buyers, 15 and 30 are the only options worth comparing seriously — the others optimize for niche cases.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The honest framework for choosing' },
      {
        type: 'p',
        text: 'The 15-vs-30 debate is usually framed as math. It is actually a question about behavior, cashflow, and personality. The math is clear: 15-year saves a lot of interest. The behavior is the harder part — can you maintain a higher mandatory payment for 15 years through job changes, kids, or a recession?',
      },
      { type: 'h3', text: 'Pick 15 if...' },
      {
        type: 'ul',
        items: [
          'You can comfortably afford the higher payment with 30%+ slack in your monthly budget.',
          'You are already maxing tax-advantaged retirement accounts (401k, IRA).',
          'You value the psychological certainty of being mortgage-free in 15 years.',
          'You suspect you would not actually invest the difference if you took a 30-year.',
        ],
      },
      { type: 'h3', text: 'Pick 30 if...' },
      {
        type: 'ul',
        items: [
          'The 15-year payment leaves less than 20% slack in your budget.',
          'You have room to invest in tax-advantaged accounts but haven\'t yet.',
          'Your career is volatile (commission, freelance, startup equity).',
          'You will genuinely use the cashflow flexibility — and have evidence of past discipline.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'The hybrid play — 30-year mortgage paid like a 15-year — captures most of the savings with full flexibility. It costs ~0.5% extra in rate, but buys you a permanent emergency escape valve.',
      },
    ],
  },

  schema: {
    softwareName: '15-Year vs 30-Year Mortgage Calculator',
    softwareFeatures:
      'Term comparison, Total interest gap, Monthly payment difference, Hybrid scenario modeling, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
    { name: 'Biweekly Mortgage Payment', href: '/finance/biweekly-mortgage-payment-calculator', icon: '📆' },
    { name: 'Mortgage Refinance', href: '/finance/mortgage-refinance-calculator', icon: '🔄' },
  ],
};

export default variant;
