import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'crypto-capital-gains-calculator',
  calculatorId: 'capital-gains-tax-us',
  seo: {
    title: 'Crypto Capital Gains Tax Calculator (US 2026) | Toolisk',
    metaDescription: 'Calculate US federal and state capital gains tax on cryptocurrency sales. Short and long-term rates, NIIT included. 2026 tax brackets. Free.',
    keywords: 'crypto capital gains calculator, crypto tax calculator, bitcoin capital gains, ethereum tax calculator, cryptocurrency tax 2026',
    ogTitle: 'Crypto Capital Gains Tax Calculator',
    ogDescription: 'Calculate US federal and state capital gains tax on cryptocurrency sales for 2026.',
  },
  hero: {
    icon: '₿',
    h1: 'Crypto Capital Gains Tax Calculator (US)',
    tagline: 'Every crypto sale is a taxable event in the US. Enter your cost basis and sale price — see exactly how much tax you owe on your Bitcoin, Ethereum, or other crypto.',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    breadcrumbLabel: 'Crypto Tax Calculator',
  },
  content: {
    aboutDescription: 'The IRS treats cryptocurrency as property, not currency. Every sale, swap, or spend is a taxable event. This calculator computes the capital gains tax on a crypto sale using 2026 federal brackets — short-term (ordinary rates) or long-term (0/15/20%).',
    features: [
      '₿ Crypto sale tax calculation',
      '📅 Auto-classify short vs long-term by holding period',
      '🔢 2026 federal bracket stacking',
      '⚡ NIIT calculation',
      '🏛️ State tax with preset rates',
    ],
    steps: [
      { title: 'Select cryptocurrency as asset type', desc: 'Crypto is treated as property — same capital gains rules as stocks.' },
      { title: 'Enter cost basis and sale price', desc: 'Cost basis = price you paid + fees to acquire.' },
      { title: 'Enter purchase and sale dates', desc: 'Holding period determines short vs long-term treatment.' },
      { title: 'See your tax liability', desc: 'Federal + state + NIIT with effective tax rate on the gain.' },
    ],
    faqs: [
      { q: 'Is swapping one crypto for another taxable?', a: "Yes — in the US, swapping one cryptocurrency for another is a taxable event. When you trade BTC for ETH, for example, it's treated as if you sold BTC for cash (triggering capital gains/losses) and then used that cash to buy ETH. This applies to DeFi swaps, NFT purchases using crypto, and using crypto to pay for goods. Record every transaction's date, amount, and USD value." },
      { q: 'What cost basis method should I use for crypto?', a: "The IRS allows FIFO (first in, first out), LIFO (last in, first out), HIFO (highest cost, first out — minimizes gains), and specific identification. HIFO typically produces the lowest tax bill but requires detailed record-keeping of each purchase lot. This calculator uses a single cost basis entry — for sophisticated multi-lot analysis, use specialized crypto tax software." },
    ],
    longform: [
      { type: 'h2', text: "Crypto Tax Rules: What Every US Holder Must Know" },
      { type: 'p', text: "The IRS has taxed crypto as property since 2014 (Notice 2014-21). Every disposal — sale, swap, spend, gift (above the annual gift exclusion), or staking reward — is a reportable event. In 2023, Congress added crypto to Form 1099-DA reporting requirements starting in 2026, meaning exchanges will report your transactions directly to the IRS. Tax non-compliance is increasingly risky. Calculate your liability before you sell." },
    ],
  },
};

export default variant;
