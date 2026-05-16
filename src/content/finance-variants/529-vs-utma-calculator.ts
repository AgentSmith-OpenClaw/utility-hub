import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: '529-vs-utma-calculator',
  calculatorId: 'college-savings-529',
  seo: {
    title: '529 vs UTMA Calculator: College Savings Comparison | Toolisk',
    metaDescription: 'Compare 529 plan (tax-free growth for education) vs UTMA account (flexible but taxable). See which grows more after tax for your college savings goal. Free.',
    keywords: '529 vs utma, 529 plan vs utma, 529 vs custodial account, utma vs 529 college savings, which is better 529 or utma',
    ogTitle: '529 vs UTMA Calculator',
    ogDescription: 'Compare 529 tax-free growth vs UTMA taxable growth for your college savings strategy.',
  },
  hero: {
    icon: '⚖️',
    h1: '529 vs UTMA Calculator',
    tagline: 'A 529 is tax-free if used for education. A UTMA is flexible but taxable. If your child might not attend college, the trade-off matters — see the numbers.',
    gradient: 'from-amber-600 via-orange-600 to-rose-600',
    breadcrumbLabel: '529 vs UTMA',
  },
  content: {
    aboutDescription: "A 529's tax advantage is real — but only if the money is used for education. A UTMA gives the child full access at 18 (or 21) for any purpose, but growth is taxable. This calculator shows the after-tax difference for both paths.",
    features: [
      '⚖️ 529 vs UTMA after-tax balance at college start',
      '📊 Kiddie tax impact on UTMA growth',
      '💡 Flexibility vs. tax advantage trade-off',
      '📈 Growth comparison chart',
      '🔍 UTMA withdrawal tax on capital gains',
    ],
    steps: [
      { title: 'Enter contribution amount and horizon', desc: 'Same contribution to compare apples-to-apples.' },
      { title: 'Set tax rates', desc: "Your rate for UTMA annual tax drag; 529 growth is tax-free." },
      { title: 'Set return assumption', desc: 'Same return for both accounts.' },
      { title: 'Compare after-tax balances', desc: "See how much the 529 tax advantage is worth in dollars." },
    ],
    faqs: [
      { q: 'What is a UTMA account?', a: "A Uniform Transfers to Minors Act (UTMA) account is a custodial account where you (as custodian) hold assets for a minor. Unlike a 529, withdrawals from a UTMA have no restrictions — the money can be used for anything. At majority (18-21 depending on state), the child gains full control. Growth is subject to 'kiddie tax' rules until the child is 19 (or 24 if a full-time student)." },
      { q: 'Does a 529 hurt financial aid more than a UTMA?', a: "529 accounts owned by a parent count as parental assets on the FAFSA, assessed at up to 5.64%. UTMA accounts count as student assets, assessed at 20%. So a UTMA actually hurts financial aid eligibility more than a 529, contrary to popular belief. Under the latest FAFSA simplification, 529s owned by grandparents are no longer reported on the FAFSA at all." },
    ],
    longform: [
      { type: 'h2', text: "529 vs UTMA: The Tax Advantage Is Real" },
      { type: 'p', text: "For a 13-year savings horizon at 6% returns and a 22% tax rate, a UTMA account pays roughly 5% effective annual tax on dividends and gains (varying by realization and kiddie tax), while the 529 pays nothing. This annual drag compounds: a $300/month contribution to a UTMA reaches about $80,000 less after 13 years than the equivalent 529 — a meaningful difference even accounting for the 529's flexibility restrictions." },
    ],
  },
};

export default variant;
