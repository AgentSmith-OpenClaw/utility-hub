import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'short-term-capital-gains-calculator',
  calculatorId: 'capital-gains-tax-us',
  seo: {
    title: 'Short-Term Capital Gains Tax Calculator (2026) | Toolisk',
    metaDescription: 'Calculate federal and state tax on short-term capital gains. See how much you owe on investments held less than a year. 2026 tax rates. Free.',
    keywords: 'short term capital gains calculator, short term capital gains tax, stcg calculator, capital gains held less than 1 year, short term stock sale tax',
    ogTitle: 'Short-Term Capital Gains Tax Calculator',
    ogDescription: 'Calculate ordinary-income tax on short-term gains (held ≤ 365 days) with 2026 brackets.',
  },
  hero: {
    icon: '⚡',
    h1: 'Short-Term Capital Gains Tax Calculator',
    tagline: "Held for a year or less? Short-term gains are taxed as ordinary income at rates up to 37%. This calculator shows exactly how much you owe — and what you'd save by waiting.",
    gradient: 'from-red-600 via-rose-600 to-orange-600',
    breadcrumbLabel: 'STCG Calculator',
  },
  content: {
    aboutDescription: "Short-term capital gains are taxed at the same rates as wages — from 10% to 37%. This calculator computes the exact tax using the stacked-bracket method and shows how much you'd save by holding longer.",
    features: [
      '⚡ Short-term gain taxed as ordinary income',
      '🔢 2026 bracket stacking on top of other income',
      '💡 Short vs. long-term comparison',
      '💰 Potential savings from waiting one more year',
      '🏛️ State tax included',
    ],
    steps: [
      { title: 'Enter sale details and dates', desc: 'Calculator auto-identifies the holding period as short-term.' },
      { title: 'Enter your ordinary income', desc: 'Short-term gains stack on top — total income determines bracket.' },
      { title: 'Set state tax rate', desc: '50-state preset or manual entry.' },
      { title: 'See tax and savings', desc: 'Current tax vs what it would be if you waited past 365 days.' },
    ],
    faqs: [
      { q: 'Is there anything I can do to reduce short-term capital gains tax?', a: "Yes: (1) Wait to cross 365 days (if the position is still desirable). (2) Use capital losses from other positions to offset the gain (tax-loss harvesting). (3) If the gain is in a retirement account, it's not taxable until withdrawal. (4) Gift appreciated assets to family members in lower brackets. (5) Donate appreciated securities to charity — you avoid the gain entirely and get the deduction." },
      { q: 'Do short-term gains trigger NIIT?', a: "Yes. The 3.8% Net Investment Income Tax applies regardless of whether the gain is short-term or long-term. It applies to the lesser of your net investment income or the amount by which your MAGI exceeds $200,000 (single) or $250,000 (MFJ). Both short and long-term gains count as net investment income." },
    ],
    longform: [
      { type: 'h2', text: "Short-Term Gains vs. Long-Term: The True Cost of Impatience" },
      { type: 'p', text: "Selling within a year locks in ordinary income tax rates. Waiting one more day past 365 days switches you to preferential long-term rates. For a taxpayer in the 24% ordinary bracket, a $20,000 short-term gain costs $4,800 in federal tax (plus state). The same gain at long-term 15% costs $3,000 — a $1,800 difference on this one sale. Over a lifetime of investing, the discipline of waiting for long-term treatment is one of the highest-value behaviors an investor can adopt." },
    ],
  },
};

export default variant;
