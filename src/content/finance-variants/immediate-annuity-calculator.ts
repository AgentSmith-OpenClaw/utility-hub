import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'immediate-annuity-calculator',
  calculatorId: 'annuity',
  seo: {
    title: 'Immediate Annuity Calculator (SPIA) | Toolisk',
    metaDescription: 'Calculate monthly payments from a Single Premium Immediate Annuity (SPIA). See total payout, interest earned, and COLA-adjusted payments. Free.',
    keywords: 'immediate annuity calculator, spia calculator, single premium immediate annuity, annuity payment calculator, immediate income annuity',
    ogTitle: 'Immediate Annuity Calculator',
    ogDescription: 'See how much monthly income a lump sum generates as a SPIA, with optional COLA adjustment.',
  },
  hero: {
    icon: '💵',
    h1: 'Immediate Annuity Calculator (SPIA)',
    tagline: 'Convert a lump sum into a guaranteed income stream. Enter your premium, rate, and period — see exactly what monthly payment you\'ll receive.',
    gradient: 'from-emerald-600 via-green-600 to-teal-600',
    breadcrumbLabel: 'Immediate Annuity Calculator',
  },
  content: {
    aboutDescription: 'A Single Premium Immediate Annuity (SPIA) is the simplest annuity: you give an insurer a lump sum, and they send you regular payments for a specified period. This calculator uses the standard present-value formula to compute what that payment will be.',
    features: [
      '💵 Monthly / quarterly / annual payment calculation',
      '📈 Optional COLA (inflation adjustment) rider',
      '💰 Total payout over the full period',
      '📊 Interest earned on your premium',
      '⚡ Payment comparison: flat vs COLA-adjusted',
    ],
    steps: [
      { title: 'Enter your premium', desc: 'The lump sum you are converting to income.' },
      { title: 'Set rate and period', desc: 'Guaranteed interest rate and how many years you want payments.' },
      { title: 'Choose payment frequency', desc: 'Monthly, quarterly, or annually.' },
      { title: 'See your payment', desc: 'Guaranteed income amount and total payout over the period.' },
    ],
    faqs: [
      { q: 'How is the SPIA payment different from a bond coupon?', a: "A bond pays interest only; at maturity you get your principal back. A SPIA payment includes both interest and return of principal — the insurer amortizes your premium over the payment period. This is why SPIA payments can exceed what a bond portfolio of the same size would yield annually." },
      { q: 'What is the difference between a period-certain and a life annuity?', a: "A period-certain annuity (what this calculator models) pays for a fixed number of years regardless of when you die. A life annuity pays until death — if you live a long time, you receive more than you put in; if you die early, payments stop. Life annuities require actuarial inputs (age, gender) that this calculator doesn't model." },
    ],
    longform: [
      { type: 'h2', text: "How Immediate Annuity Payments Are Calculated" },
      { type: 'p', text: "The PMT formula is the backbone of annuity math: PMT = PV × r / (1 − (1 + r)^−n), where PV is your premium, r is the periodic interest rate (annual rate ÷ frequency), and n is total payment periods. For $250,000 at 4.5% for 20 years monthly: r = 0.375%, n = 240, PMT = $1,580/month. The total payout is $379,200 — $129,200 more than you put in, purely from the guaranteed interest." },
    ],
  },
};

export default variant;
