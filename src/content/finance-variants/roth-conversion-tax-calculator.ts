import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'roth-conversion-tax-calculator',
  calculatorId: 'roth-conversion',
  seo: {
    title: 'Roth Conversion Tax Calculator (2026 Brackets) | Toolisk',
    metaDescription: 'Calculate the exact federal and state tax you owe on a Roth IRA conversion using 2026 tax brackets. See bracket fill and effective conversion rate. Free.',
    keywords: 'roth conversion tax calculator, roth conversion tax 2026, how much tax on roth conversion, roth conversion tax cost, ira conversion tax',
    ogTitle: 'Roth Conversion Tax Calculator',
    ogDescription: 'See exactly how much tax a Roth conversion costs using 2026 federal brackets and state rates.',
  },
  hero: {
    icon: '🏛️',
    h1: 'Roth Conversion Tax Calculator (2026)',
    tagline: 'A Roth conversion is taxed as ordinary income. This calculator shows the exact federal and state tax cost — broken down by bracket — before you convert.',
    gradient: 'from-rose-600 via-red-600 to-orange-600',
    breadcrumbLabel: 'Roth Conversion Tax',
  },
  content: {
    aboutDescription: 'The tax on a Roth conversion is the most important number in the decision — and it\'s not simply "your marginal rate × conversion amount." Because the conversion stacks on top of other income, different portions may be taxed at different rates. This calculator shows the exact breakdown.',
    features: [
      '🏛️ 2026 federal bracket stacking (not just marginal rate)',
      '📊 Bracket fill visualization',
      '💰 Federal + state conversion tax',
      '📉 Effective conversion rate',
      '⚡ What-if: how much fits in each bracket',
    ],
    steps: [
      { title: 'Enter your other income', desc: 'Wages, Social Security, pensions, and other ordinary income this year.' },
      { title: 'Enter conversion amount', desc: 'How much you are converting.' },
      { title: 'Enter state rate', desc: 'Flat-rate approximation for your state.' },
      { title: 'See the tax breakdown', desc: 'Exact federal tax by bracket + state tax + effective rate.' },
    ],
    faqs: [
      { q: "Why isn't my conversion tax just my marginal rate × the conversion amount?", a: "Because the conversion spans multiple brackets. If your income is $85,000 and you convert $100,000, the first $18,350 fills the remaining 22% bracket, then $78,750 falls in the 24% bracket (for a single filer). The blended effective rate is less than 24% — this calculator computes the exact amount in each bracket." },
      { q: 'How does state tax apply to a Roth conversion?', a: 'Most states tax Roth conversions as ordinary income. This calculator applies a flat state rate to the full conversion amount. A few states (FL, TX, NV, WA, etc.) have no income tax. California taxes conversions at ordinary rates up to 13.3%.' },
    ],
    longform: [
      { type: 'h2', text: "The Stacked-Bracket Method Explained" },
      { type: 'p', text: "Calculating the tax on a Roth conversion requires the stacked-bracket method: compute federal tax on your other income alone, then compute it on (other income + conversion amount), and take the difference. This gives the exact incremental tax attributable to the conversion. A single marginal rate applied to the whole conversion overstates the tax if any portion lands in a lower bracket — which happens whenever your other income doesn't already fill the higher bracket." },
    ],
  },
};

export default variant;
