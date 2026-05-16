import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'long-term-capital-gains-calculator',
  calculatorId: 'capital-gains-tax-us',
  seo: {
    title: 'Long-Term Capital Gains Tax Calculator (2026) | Toolisk',
    metaDescription: 'Calculate your 2026 federal long-term capital gains tax at 0%, 15%, or 20% based on income. Includes NIIT and state tax. Free.',
    keywords: 'long term capital gains calculator, long term capital gains tax 2026, ltcg calculator, capital gains tax rate, 15 percent capital gains',
    ogTitle: 'Long-Term Capital Gains Tax Calculator',
    ogDescription: 'Calculate 2026 long-term capital gains tax at 0%, 15%, or 20% — including NIIT and state.',
  },
  hero: {
    icon: '📈',
    h1: 'Long-Term Capital Gains Tax Calculator (2026)',
    tagline: "Held your investment more than a year? Long-term capital gains are taxed at 0%, 15%, or 20% — far less than ordinary income. This calculator shows your exact rate and tax.",
    gradient: 'from-emerald-600 via-green-600 to-teal-600',
    breadcrumbLabel: 'LTCG Calculator',
  },
  content: {
    aboutDescription: "Long-term capital gains get preferential tax rates vs. short-term gains taxed as ordinary income. Where you fall in the 0/15/20% brackets depends on total income — this calculator stacks the gain correctly on top of your other income.",
    features: [
      '📈 0% / 15% / 20% LTCG bracket calculation',
      '🔢 Gain stacked correctly on top of ordinary income',
      '💰 NIIT (3.8%) calculation',
      '📊 Bracket fill visualization',
      '🏛️ State tax with 50-state preset',
    ],
    steps: [
      { title: 'Enter your asset sale details', desc: 'Purchase price, sale price, fees, and purchase date.' },
      { title: 'Confirm long-term holding', desc: 'Held more than 365 days — calculator auto-verifies.' },
      { title: 'Enter your income', desc: 'Other ordinary income determines which LTCG bracket applies.' },
      { title: 'See your tax', desc: 'Federal LTCG, NIIT, and state tax with effective rate.' },
    ],
    faqs: [
      { q: 'How do I know which LTCG bracket I\'m in?', a: "The LTCG bracket depends on your total taxable income (ordinary income + long-term gains). For 2026 single filers: 0% up to $48,350, 15% from $48,350 to $533,400, 20% above. But the gain stacks on top of ordinary income — if ordinary income is $90,000, the 0% bracket is already used up, and all gains are taxed at 15%." },
      { q: 'Does it matter if my gain is from stock vs real estate?', a: "For long-term gains: stocks, ETFs, and real estate (non-primary) are all taxed at 0/15/20% LTCG rates. Exception: Section 1250 depreciation recapture on rental real estate is taxed at up to 25%, and collectibles are taxed at up to 28%. Primary residence has a $250k/$500k exclusion before the LTCG rate applies." },
    ],
    longform: [
      { type: 'h2', text: "Why Long-Term Gains Are So Valuable" },
      { type: 'p', text: "The difference between short-term and long-term treatment can be enormous. A single filer with $95,000 of ordinary income who sells stock for a $50,000 gain: short-term would add $50,000 to ordinary income, taxed at 22-24% ($11,000-12,000 in federal tax). Long-term: the entire $50,000 is taxed at 15% = $7,500 in federal tax. Waiting one day past 365 days saved $3,500-4,500 in this example." },
    ],
  },
};

export default variant;
