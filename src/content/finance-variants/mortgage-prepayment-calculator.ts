import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'mortgage-prepayment-calculator',
  calculatorId: 'mortgage',

  seo: {
    title: 'Mortgage Prepayment Calculator — Interest Saved & Payoff Date | Toolisk',
    metaDescription:
      'Free mortgage prepayment calculator. Add extra principal payments and see how many years you cut off your mortgage and how much interest you save over the life of the loan.',
    keywords:
      'mortgage prepayment calculator, extra mortgage payment calculator, mortgage payoff calculator, principal prepayment, mortgage payoff date',
  },

  hero: {
    icon: '🏠',
    h1: 'Mortgage Prepayment Calculator',
    tagline:
      'Add an extra payment to your mortgage and instantly see how many years you cut, how much interest you save, and how the payoff date moves.',
    gradient: 'from-emerald-700 via-teal-700 to-cyan-700',
    breadcrumbLabel: 'Mortgage Prepayment Calculator',
  },

  content: {
    aboutDescription:
      'A focused mortgage prepayment calculator. Layer extra monthly principal, an annual lump sum, or a one-time windfall onto any 15- or 30-year mortgage and watch the payoff date jump back years.',
    features: [
      '🏠 Built for 15- and 30-year mortgages',
      '💸 Extra monthly, annual, or one-time payments',
      '📅 Sees payoff date move in real time',
      '💰 Total interest saved over loan life',
      '📊 Updated amortization schedule',
      '💾 PDF & Excel export',
    ],
    steps: [
      { title: 'Enter mortgage details', desc: 'Loan amount, interest rate, term. Use the original loan info to model the full lifetime impact.' },
      { title: 'Add extra principal', desc: 'A common pattern: an extra $100–$300 per month, or one extra payment per year.' },
      { title: 'See the new payoff date', desc: 'The calculator shows your revised end-of-loan month and total interest saved.' },
      { title: 'Compare strategies', desc: 'Try "biweekly payments" (26 half-payments = 13 monthly payments per year) vs a yearly lump sum.' },
      { title: 'Export & schedule', desc: 'Download the schedule and set the extra payment as an automatic transfer.' },
    ],
    faqs: [
      {
        q: 'Does paying extra principal really save that much?',
        a: 'On a 30-year, $400,000 mortgage at 7%, paying an extra $300/month cuts the loan by roughly 9 years and saves over $180,000 in interest. The reason it works is structural: front-loaded interest. Most of your early payments are interest — extra principal in years 1–10 has dramatically more impact than the same payment in years 20–30.',
      },
      {
        q: 'Should I prepay my mortgage or invest the difference?',
        a: 'Compare your mortgage rate to your expected after-tax investment return. With current 7% mortgage rates, prepayment is a guaranteed 7% "return" that beats most fixed income. At 3% mortgage rates (the 2020 vintage), investing the difference makes more sense for long horizons. The honest answer also depends on whether you would actually invest the surplus or spend it.',
      },
      {
        q: 'What is biweekly payment and does it work?',
        a: 'Instead of 12 monthly payments per year, you pay half your mortgage every two weeks — which produces 26 half-payments = 13 full payments per year. That one extra payment, applied to principal, shaves roughly 4–6 years off a 30-year mortgage. Many lenders will set this up free; avoid paid biweekly services that charge to do the same thing.',
      },
      {
        q: 'Are there prepayment penalties on US mortgages?',
        a: 'On standard conforming mortgages (Fannie/Freddie), no — federal rules largely banned prepayment penalties on qualified mortgages. Some non-QM, jumbo, or older subprime loans may have penalties for the first 1–3 years. Check the truth-in-lending disclosure and the note before prepaying large amounts.',
      },
      {
        q: 'How do I make sure my extra payment goes to principal?',
        a: 'Most lenders default extra payments toward the next month\'s interest unless you specifically request "principal only." Use your lender\'s online portal or write "PRINCIPAL ONLY" on a paper check. After the first extra payment, verify on the next statement that the principal balance dropped by the full extra amount.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The math of "one extra payment a year"' },
      {
        type: 'p',
        text: 'A single extra principal payment per year is the highest leverage prepayment habit in personal finance. On a 30-year mortgage, you finish 4–6 years early and save 15–25% of total interest, all from one extra payment annually. The reason is compounding in reverse — each rupee of principal removed today permanently removes the interest it would have accrued for the remaining tenure.',
      },
      { type: 'h3', text: 'Three sustainable prepayment patterns' },
      {
        type: 'ul',
        items: [
          'Round up: pay $1,750 on a $1,683 mortgage. Almost painless monthly, ~3 years saved.',
          'Tax refund route: apply your IRS refund to principal every spring.',
          'Bonus split: 50% of every year-end bonus goes to mortgage, 50% to taxable investments.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Automate the prepayment. Habits decay faster than intentions — what is not auto-debited is what does not happen.',
      },
    ],
  },

  schema: {
    softwareName: 'Mortgage Prepayment Calculator',
    softwareFeatures:
      'Extra principal payments, Biweekly comparison, Interest saved, New payoff date, Revised amortization, Excel export',
  },

  relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
    { name: 'Mortgage Refinance Calculator', href: '/finance/mortgage-refinance-calculator', icon: '🔁' },
    { name: 'Amortization Schedule', href: '/finance/amortization-calculator', icon: '📅' },
  ],
};

export default variant;
