import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'financial-independence-retire-early-calculator',
  calculatorId: 'fire',
  seo: {
    title: 'Financial Independence Retire Early Calculator | Toolisk',
    metaDescription: 'Calculate how much you need for Financial Independence, Retire Early. Estimate your FIRE number, timeline, savings rate, and withdrawal plan.',
    keywords: 'financial independence retire early calculator, FIRE calculator, financial independence calculator, retire early calculator, fire number',
  },
  hero: {
    icon: '🔥',
    h1: 'Financial Independence Retire Early Calculator',
    tagline: 'Estimate the portfolio you need to stop depending on a paycheck and compare FIRE timelines at different savings rates.',
    gradient: 'from-orange-600 via-rose-600 to-red-600',
    breadcrumbLabel: 'Financial Independence Retire Early Calculator',
  },
  content: {
    aboutDescription: 'A FIRE calculator built around the full phrase people search for: Financial Independence, Retire Early. Enter your expenses, savings, investments, and expected returns to estimate when work becomes optional.',
    features: [
      '🔥 FIRE number and retirement timeline',
      '📈 Portfolio growth projection',
      '💰 Safe withdrawal rate modeling',
      '🎯 Savings-rate sensitivity checks',
      '🧭 Lean, Fat, Coast, and Barista FIRE comparisons',
      '💾 Export your plan for review',
    ],
    steps: [
      { title: 'Enter annual spending', desc: 'Your spending drives the FIRE number more than income does.' },
      { title: 'Add current investments', desc: 'Include liquid investment assets you can use to support retirement.' },
      { title: 'Set savings and return assumptions', desc: 'Use conservative real returns if your timeline is long.' },
      { title: 'Choose withdrawal rate', desc: 'Compare 3%, 3.5%, and 4% safe withdrawal assumptions.' },
      { title: 'Review your timeline', desc: 'See the projected date you reach financial independence.' },
    ],
    faqs: [
      { q: 'What does Financial Independence, Retire Early mean?', a: 'It means building enough invested assets that withdrawals can cover your expenses, making paid work optional before traditional retirement age.' },
      { q: 'How is the FIRE number calculated?', a: 'The common shortcut is annual expenses divided by your safe withdrawal rate. At 4%, that is 25x annual expenses; at 3.33%, it is about 30x.' },
      { q: 'Should I use 3% or 4%?', a: 'Use 4% for a traditional 30-year US-style retirement assumption. Use 3-3.5% for longer early-retirement timelines, higher inflation uncertainty, or more conservative planning.' },
    ],
    longform: [
      { type: 'h2', text: 'FIRE is a spending problem before it is an investing problem' },
      { type: 'p', text: 'Two people with the same salary can have completely different FIRE dates because the savings rate controls both sides of the equation: less spending means more money invested today and a smaller portfolio needed later.' },
      { type: 'callout', tone: 'tip', text: 'Run one scenario at your current spending and one at 10% lower spending. The timeline difference is often larger than changing your return assumption by a full percentage point.' },
    ],
  },
  schema: {
    softwareName: 'Financial Independence Retire Early Calculator',
    softwareFeatures: 'FIRE number, Retirement timeline, Withdrawal rate modeling, Savings-rate scenarios, Portfolio projection',
  },
  relatedTools: [
    { name: 'FIRE Number Calculator', href: '/finance/fire-number-calculator', icon: '🎯' },
    { name: 'Coast FIRE Calculator', href: '/finance/coast-fire-calculator', icon: '🌊' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator', icon: '📈' },
  ],
};

export default variant;
