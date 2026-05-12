import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'biweekly-mortgage-payment-calculator',
  calculatorId: 'mortgage',

  seo: {
    title: 'Biweekly Mortgage Payment Calculator — Save Interest & Years | Toolisk',
    metaDescription:
      'Free biweekly mortgage payment calculator. Switch from monthly to biweekly and see how making 26 half-payments a year shortens your loan by 4–6 years and saves five-figure interest.',
    keywords:
      'biweekly mortgage calculator, biweekly mortgage payment, biweekly vs monthly mortgage, accelerated mortgage payment, mortgage payment frequency calculator, save mortgage interest',
    ogTitle: 'Biweekly Mortgage Payment Calculator — Save Interest & Years',
    ogDescription:
      'See how switching from monthly to biweekly mortgage payments shortens your loan and saves interest.',
  },

  hero: {
    icon: '📆',
    h1: 'Biweekly Mortgage Payment Calculator',
    tagline:
      'Pay half your mortgage every two weeks instead of the full payment monthly. Twenty-six half-payments = thirteen full payments a year, and your loan ends years early.',
    gradient: 'from-emerald-700 via-teal-700 to-cyan-700',
    breadcrumbLabel: 'Biweekly Mortgage Calculator',
  },

  content: {
    aboutDescription:
      'A biweekly mortgage calculator that shows the real impact of switching payment frequency. Most mortgages bill monthly (12 payments / year). A biweekly schedule produces 26 half-payments — the equivalent of 13 full payments. That single extra payment per year, applied over a 30-year mortgage, knocks 4–6 years off the loan and saves five-figure interest.',
    features: [
      '📆 Monthly vs biweekly side-by-side',
      '💰 Total interest saved, in dollars',
      '⏱️ Years shaved off the loan',
      '📊 Equivalent of "13 monthly payments per year"',
      '📅 Full revised amortization schedule',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter your mortgage details', desc: 'Loan amount, interest rate, and remaining term. Use the current balance if you have already been paying for a while.' },
      { title: 'Compute the biweekly amount', desc: 'Your biweekly payment is exactly half of your monthly. The math handles the rest.' },
      { title: 'Run the comparison', desc: 'See total interest, payoff date, and final-year balance for both monthly and biweekly schedules.' },
      { title: 'Check your lender\'s rules', desc: 'Some lenders apply biweekly halves to principal immediately (best); others hold them until a full monthly equivalent is reached. The savings differ — verify before switching.' },
      { title: 'Export & confirm', desc: 'Download the schedule, then ask your lender to set up a true biweekly plan with no third-party "biweekly service" fees.' },
    ],
    faqs: [
      {
        q: 'How does a biweekly schedule save so much interest?',
        a: 'You make 26 half-payments a year instead of 12 full ones — that is 13 full monthly equivalents, not 12. The extra month per year is applied entirely to principal, which compounds against the remaining balance and shortens the loan dramatically. On a 30-year $400k mortgage at 7%, biweekly typically saves $90k+ in interest and ends the loan ~6 years early.',
      },
      {
        q: 'Is biweekly the same as "paying half twice a month"?',
        a: 'No, and the difference is critical. "Twice a month" = 24 payments a year = same as 12 monthly. "Every two weeks" = 26 payments a year = the equivalent of 13 monthly. Calendars produce two months a year with three biweekly periods, and that is where the extra month of principal reduction comes from. If your lender splits payments "semi-monthly," you get zero benefit.',
      },
      {
        q: 'Should I pay a biweekly service company to set this up?',
        a: 'No. Third-party services typically charge a $300–500 setup fee plus $5–10 per payment. They are not doing anything you cannot do directly with your lender — and many lenders now offer true biweekly setup for free. If your lender refuses, just add 1/12 of your monthly payment to each monthly payment as principal — it produces almost identical savings without the fee or the contract.',
      },
      {
        q: 'Are there any downsides to biweekly payments?',
        a: 'Three to consider. (1) Cashflow — you are committing to one extra month of mortgage per year, so the household budget needs that slack. (2) Opportunity cost — the same extra month invested at 8%+ over 30 years can outperform mortgage interest savings, especially in a tax-advantaged account. (3) Lender lock-in — once set up, some lenders make it hard to revert. Read the agreement first.',
      },
      {
        q: 'Biweekly vs just prepaying $X every month — which is better?',
        a: 'Mathematically nearly identical, with one wrinkle. A formal biweekly schedule applies a half-payment every two weeks, so the principal drops 14 days earlier each cycle than a single monthly extra payment would. Over 30 years that timing advantage adds another ~6 months of savings versus the same dollar amount paid as a monthly extra. The simplicity of "just add $X monthly" usually wins for most households, though.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The calendar trick behind biweekly savings' },
      {
        type: 'p',
        text: 'A year has 52 weeks. Pay every 14 days and you make 52 ÷ 2 = 26 payments. Half of your monthly amount × 26 = 13 monthly equivalents. The 13th payment, every single year, goes entirely to principal. Compounded over 30 years, that single quirk of the calendar is worth tens of thousands of dollars.',
      },
      { type: 'h3', text: 'A worked example' },
      {
        type: 'p',
        text: 'On a $400,000 mortgage at 7% over 30 years:',
      },
      {
        type: 'ul',
        items: [
          'Monthly payment: ~$2,661. Total interest over 30 years: ~$558k.',
          'Biweekly half-payment: ~$1,330 every 14 days. Loan paid off in ~24 years. Total interest: ~$466k.',
          'Net savings: ~$92k in interest and ~6 years of mortgage payments.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If your paycheck is biweekly, this aligns your mortgage with your income rhythm — making the switch feel painless. Most people who try it for 3 months never go back.',
      },
      { type: 'h2', text: 'Three ways to capture the same savings' },
      {
        type: 'ol',
        items: [
          'True biweekly via your lender (free if available, best savings, requires lender support).',
          'Monthly + 1/12 extra principal each month (DIY, near-identical savings, full flexibility).',
          'One extra full monthly payment per year as a year-end lump sum (simplest, slightly less savings, easy to time with a bonus).',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Biweekly Mortgage Payment Calculator',
    softwareFeatures:
      'Biweekly vs monthly comparison, Total interest saved, Years shaved, Revised amortization schedule, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
    { name: 'Mortgage Prepayment', href: '/finance/mortgage-prepayment-calculator', icon: '⚡' },
    { name: 'Mortgage Refinance', href: '/finance/mortgage-refinance-calculator', icon: '🔄' },
  ],
};

export default variant;
