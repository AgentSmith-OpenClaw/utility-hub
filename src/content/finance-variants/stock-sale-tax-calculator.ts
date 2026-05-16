import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'stock-sale-tax-calculator',
  calculatorId: 'capital-gains-tax-us',
  seo: {
    title: 'Stock Sale Tax Calculator: Capital Gains (2026) | Toolisk',
    metaDescription: 'Calculate the capital gains tax on a stock or ETF sale. See federal short/long-term rates, NIIT, and state tax on your profit. 2026 brackets. Free.',
    keywords: 'stock sale tax calculator, stock capital gains tax, equity sale tax, how much tax on stock sale, stock profit tax calculator',
    ogTitle: 'Stock Sale Tax Calculator',
    ogDescription: 'See exactly how much tax you owe on a stock or ETF sale — federal, NIIT, and state.',
  },
  hero: {
    icon: '📊',
    h1: 'Stock Sale Tax Calculator',
    tagline: 'Selling stock or ETFs? Your tax depends on how long you held the shares. This calculator computes your exact federal + state capital gains tax in seconds.',
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    breadcrumbLabel: 'Stock Sale Tax',
  },
  content: {
    aboutDescription: "Stocks and ETFs are taxed as capital gains when sold. Held more than a year: 0%, 15%, or 20% based on income. Held a year or less: ordinary income rates (10-37%). This calculator handles both and shows the tax-saving benefit of holding longer.",
    features: [
      '📊 Short and long-term stock sale tax',
      '📅 Auto-classify by holding period',
      '💡 Tax savings if you wait past 365 days',
      '🔢 NIIT and state tax included',
      '📈 Net proceeds after all taxes',
    ],
    steps: [
      { title: 'Enter purchase and sale details', desc: 'Cost basis, sale price, commissions, and dates.' },
      { title: 'Enter your income', desc: 'Determines which bracket the gain falls in.' },
      { title: 'Set state tax rate', desc: '50-state dropdown or manual entry.' },
      { title: 'See net proceeds', desc: 'After-tax amount you keep and the effective tax rate on your profit.' },
    ],
    faqs: [
      { q: 'Are stock dividends and capital gains taxed the same way?', a: "No. 'Qualified dividends' (most dividends from US stocks and qualified foreign stocks held long enough) are taxed at the same preferential rates as long-term capital gains (0/15/20%). 'Ordinary dividends' are taxed as ordinary income. Capital gains from selling stock depend only on holding period — not on whether the stock paid dividends." },
      { q: 'What is the wash-sale rule and does it apply here?', a: "The wash-sale rule disallows a capital loss if you buy the same or substantially identical stock within 30 days before or after selling at a loss. This calculator shows gains (not losses), so the wash-sale rule is typically not relevant. However, if you have losses, be mindful: selling at a loss and repurchasing within 30 days is a common tax planning mistake that violates the wash-sale rule." },
    ],
    longform: [
      { type: 'h2', text: "Tax Planning for Stock Investors" },
      { type: 'p', text: "The most impactful tax planning decisions for stock investors: (1) Hold for long-term treatment (>365 days) whenever feasible. (2) Tax-loss harvest — sell positions at a loss to offset gains. (3) Use tax-advantaged accounts (IRA, 401k, HSA) for high-turnover or high-dividend assets. (4) Consider gifting appreciated stock to charity — you avoid the capital gain entirely. (5) Be aware of year-end mutual fund capital gain distributions, which can be taxable even without selling shares." },
    ],
  },
};

export default variant;
