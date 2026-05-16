import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'reverse-mortgage-payment-calculator',
  calculatorId: 'reverse-mortgage',
  seo: {
    title: 'Reverse Mortgage Payment Calculator: Tenure & Term | Toolisk',
    metaDescription: 'Calculate monthly reverse mortgage payments for tenure (lifetime) and term options. Compare how long net proceeds last as monthly income. Free.',
    keywords: 'reverse mortgage payment calculator, tenure payment reverse mortgage, term payment reverse mortgage, monthly reverse mortgage income, hecm monthly payment',
    ogTitle: 'Reverse Mortgage Payment Calculator',
    ogDescription: 'Calculate lifetime tenure and fixed-term monthly payments from your reverse mortgage proceeds.',
  },
  hero: {
    icon: '💰',
    h1: 'Reverse Mortgage Payment Calculator',
    tagline: "A reverse mortgage can pay you monthly for life (tenure) or for a fixed period (term). This calculator shows exactly how much you'd receive under each option.",
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    breadcrumbLabel: 'Reverse Mortgage Payments',
  },
  content: {
    aboutDescription: 'The tenure and term payment options convert your HECM proceeds into a monthly income stream. Tenure payments last for life; term payments cover a fixed number of years. This calculator computes both using the standard HECM annuity formula.',
    features: [
      '💰 Tenure (lifetime) monthly payment',
      '📅 Term monthly payment (custom years)',
      '📊 All four payout options side-by-side',
      '⏱️ Accrual rate (expected rate + 0.5% MIP)',
      '📈 25-year loan balance projection',
    ],
    steps: [
      { title: 'Calculate net proceeds', desc: 'Enter home value, mortgage, age, and closing costs.' },
      { title: 'Set payment preference', desc: 'Tenure (lifetime) or term (fixed years).' },
      { title: 'Review payment options', desc: 'All four payout options shown simultaneously for comparison.' },
      { title: 'See long-term equity impact', desc: 'How loan balance grows vs home value over 25 years.' },
    ],
    faqs: [
      { q: "How is the tenure payment calculated?", a: "The HECM tenure payment uses HUD age 100 as the actuarial horizon. PMT = NetProceeds × monthlyAccrualRate / (1 − (1 + monthlyAccrualRate)^−n), where n = (100 − youngstAge) × 12 and monthly accrual rate = (expected rate + 0.5% ongoing MIP) / 12. A 70-year-old has n = 360 months (30 years)." },
      { q: "Does the tenure payment stop if I live past 100?", a: "No — the HECM tenure payment contract guarantees payments for as long as you live in the home, regardless of whether the loan balance exceeds the home's value or you outlive the actuarial calculation. This is one of the most valuable features of the HECM tenure option and is backed by FHA insurance." },
    ],
    longform: [
      { type: 'h2', text: "Tenure vs. Term: Choosing Your Payment Structure" },
      { type: 'p', text: "Tenure payments are typically lower than term payments for the same proceeds — because they must last indefinitely, potentially 30+ years. A 10-year term concentrates the same proceeds into 120 payments, making each payment larger. The right choice depends on your other income, expenses, and how long you expect to stay in the home. Many borrowers choose tenure to eliminate longevity risk — the guarantee of income no matter how long they live." },
    ],
  },
};

export default variant;
