import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'roth-conversion-ladder-calculator',
  calculatorId: 'roth-conversion',
  seo: {
    title: 'Roth Conversion Ladder Calculator | Toolisk',
    metaDescription: 'Plan a multi-year Roth conversion ladder to minimize taxes and reduce future RMDs. See year-by-year tax cost and optimal conversion amount per year. Free.',
    keywords: 'roth conversion ladder calculator, roth ladder, multi year roth conversion, roth conversion strategy, roth conversion ladder early retirement',
    ogTitle: 'Roth Conversion Ladder Calculator',
    ogDescription: 'Plan a multi-year Roth conversion ladder to optimize your lifetime tax bill.',
  },
  hero: {
    icon: '🪜',
    h1: 'Roth Conversion Ladder Calculator',
    tagline: 'The Roth conversion ladder is an early retirement tax strategy: convert just enough each year to stay in a low bracket and build tax-free Roth balances over 5+ years.',
    gradient: 'from-violet-600 via-purple-600 to-pink-600',
    breadcrumbLabel: 'Roth Ladder Calculator',
  },
  content: {
    aboutDescription: 'A Roth conversion ladder converts pre-tax funds gradually over multiple years, staying in lower brackets each year rather than taking a large one-time tax hit. The 5-year seasoning rule means early retirees can access Roth conversions penalty-free after waiting.',
    features: [
      '🪜 Year-by-year conversion plan',
      '📊 Annual tax cost by bracket',
      '⏱️ 5-year seasoning rule tracker',
      '💰 Total tax cost vs. future RMD impact',
      '📈 Roth balance accumulation chart',
    ],
    steps: [
      { title: 'Enter current pre-tax balance', desc: 'Total Traditional IRA / 401(k) balance to convert over time.' },
      { title: 'Set annual conversion target', desc: 'How much to convert each year (often sized to fill a bracket).' },
      { title: 'Enter income and tax picture', desc: 'Other income that limits how much you can convert at each rate.' },
      { title: 'See multi-year plan', desc: 'Tax cost per year and when Roth funds become penalty-free.' },
    ],
    faqs: [
      { q: 'What is the 5-year rule for Roth conversions?', a: "Each Roth conversion starts its own 5-year clock. If you withdraw the converted amount within 5 years and you're under 59½, you'll owe a 10% penalty on the withdrawn amount (but not income tax — you already paid that). For the ladder strategy, you plan conversions 5 years in advance so they're penalty-free when you need the cash." },
      { q: 'Who is the Roth conversion ladder best for?', a: "Early retirees who retire before age 59½ and have low-income years before Social Security and RMDs begin. By converting each year at low rates and accessing the funds after the 5-year wait, they can live on converted Roth funds penalty-free — a strategy sometimes called the 'FIRE Roth ladder.'" },
    ],
    longform: [
      { type: 'h2', text: "The Roth Conversion Ladder: A Multi-Year Tax Strategy" },
      { type: 'p', text: "Instead of converting a large amount at once (and potentially pushing into a high bracket), a conversion ladder converts a smaller amount each year — often sized to fill the 12% or 22% bracket. Over 5-10 years, a significant portion of pre-tax savings can be moved to Roth at relatively low tax rates. The result is lower future RMDs, lower future taxes on Social Security, and a pool of tax-free money available in retirement." },
    ],
  },
};

export default variant;
