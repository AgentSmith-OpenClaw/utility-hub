import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'fire-number-calculator',
  calculatorId: 'fire',
  seo: {
    title: 'FIRE Number Calculator — How Much You Need to Retire | Toolisk',
    metaDescription: 'Calculate your FIRE number from annual expenses and withdrawal rate. Compare 25x, 30x, and conservative early-retirement targets.',
    keywords: 'fire number calculator, calculate fire number, how much to retire early, financial independence number, 25x expenses calculator',
  },
  hero: {
    icon: '🎯',
    h1: 'FIRE Number Calculator',
    tagline: 'Turn annual expenses into a clear financial independence target using 25x, 30x, and custom withdrawal-rate assumptions.',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    breadcrumbLabel: 'FIRE Number Calculator',
  },
  content: {
    aboutDescription: 'A focused FIRE number calculator for the first question every early-retirement plan needs to answer: how large does the portfolio need to be before work becomes optional?',
    features: [
      '🎯 FIRE target from expenses',
      '⚖️ 3%, 3.5%, and 4% withdrawal rates',
      '📈 Timeline from current portfolio',
      '💰 Monthly investment requirement',
      '🔥 FIRE variant comparison',
      '📊 Year-by-year projection',
    ],
    steps: [
      { title: 'Enter monthly expenses', desc: 'Use spending you expect in retirement, not just today’s budget.' },
      { title: 'Pick a withdrawal rate', desc: 'Lower withdrawal rates require more corpus but improve resilience.' },
      { title: 'Add current corpus', desc: 'Include investments earmarked for retirement.' },
      { title: 'Set monthly investment', desc: 'See whether current savings are enough to reach the target.' },
    ],
    faqs: [
      { q: 'What is a FIRE number?', a: 'Your FIRE number is the invested portfolio needed to fund annual expenses without job income. It is usually annual expenses divided by safe withdrawal rate.' },
      { q: 'Why do people use 25x expenses?', a: 'Twenty-five times annual expenses corresponds to a 4% first-year withdrawal rate.' },
      { q: 'Is 25x enough for early retirement?', a: 'It can be aggressive for very long retirements. Many early retirees use 28-33x expenses to build a larger safety margin.' },
    ],
    longform: [
      { type: 'h2', text: 'The FIRE number is a range, not a magic line' },
      { type: 'p', text: 'Your number changes with spending, taxes, healthcare, housing, inflation, and withdrawal flexibility. Treat the calculator result as a planning range and rerun it whenever your life changes materially.' },
    ],
  },
  schema: {
    softwareName: 'FIRE Number Calculator',
    softwareFeatures: 'FIRE number calculation, 25x and 30x targets, Safe withdrawal rate, Retirement timeline',
  },
  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
    { name: 'Financial Independence Retire Early Calculator', href: '/finance/financial-independence-retire-early-calculator', icon: '🧭' },
    { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
  ],
};

export default variant;
