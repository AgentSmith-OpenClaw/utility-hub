import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'traditional-to-roth-ira-calculator',
  calculatorId: 'roth-conversion',
  seo: {
    title: 'Traditional to Roth IRA Conversion Calculator | Toolisk',
    metaDescription: 'Calculate the tax cost and long-term benefit of converting a Traditional IRA to a Roth IRA. 2026 federal brackets included. Free.',
    keywords: 'traditional to roth ira calculator, roth conversion calculator, ira conversion calculator, traditional ira to roth, roth ira conversion 2026',
    ogTitle: 'Traditional to Roth IRA Conversion Calculator',
    ogDescription: 'See the tax cost and long-term after-tax benefit of converting your Traditional IRA to a Roth.',
  },
  hero: {
    icon: '🔄',
    h1: 'Traditional to Roth IRA Conversion Calculator',
    tagline: 'Pay tax now, never pay again. See whether converting your Traditional IRA to Roth makes financial sense — with exact 2026 bracket calculations.',
    gradient: 'from-indigo-600 via-violet-600 to-purple-600',
    breadcrumbLabel: 'IRA Conversion Calculator',
  },
  content: {
    aboutDescription: 'A Roth conversion is a permanent tax decision. This calculator models the incremental tax cost using 2026 federal brackets and compares the after-tax future value of converting vs keeping the money in a Traditional IRA.',
    features: [
      '🔄 Tax cost using 2026 stacked-bracket method',
      '📊 Roth vs Traditional future value comparison',
      '💡 Pay-from-outside vs withhold analysis',
      '🏛️ Bracket fill visualization',
      '📅 Break-even year calculation',
    ],
    steps: [
      { title: 'Enter conversion amount', desc: 'How much you want to convert from Traditional to Roth.' },
      { title: 'Enter your tax picture', desc: 'Filing status, other income, and state tax rate.' },
      { title: 'Set future assumptions', desc: 'Investment return and expected retirement tax rate.' },
      { title: 'See the verdict', desc: 'Whether converting makes financial sense for your specific numbers.' },
    ],
    faqs: [
      { q: 'What is the ideal income year for a Roth conversion?', a: "Low-income years are best: early retirement before RMDs kick in, a sabbatical year, or any year with unusually low income. These 'Roth conversion windows' allow you to convert at 12% or 22% rather than 24%+ that you might face later when Social Security, RMDs, and other income pile up." },
      { q: 'Is there a limit on how much I can convert?', a: "There is no dollar limit on Roth conversions. You can convert any amount from any eligible pre-tax account. The constraint is tax — large conversions push you into higher brackets. Most advisors recommend converting only enough each year to fill up a bracket, stopping before hitting the next higher rate." },
    ],
    longform: [
      { type: 'h2', text: "The Roth Conversion Window" },
      { type: 'p', text: "Many retirees have a 'Roth conversion window' between when they retire and when Social Security and RMDs begin — often ages 62-72. During this window, income is typically at its lowest point, making conversions more tax-efficient. Converting enough each year to fill the 22% bracket (without spilling into 24%) is a common strategy to gradually shift pre-tax assets to Roth without a large one-time tax hit." },
    ],
  },
};

export default variant;
