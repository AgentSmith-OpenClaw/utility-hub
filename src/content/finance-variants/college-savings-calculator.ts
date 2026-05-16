import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'college-savings-calculator',
  calculatorId: 'college-savings-529',
  seo: {
    title: 'College Savings Calculator: 529 Plan | Toolisk',
    metaDescription: 'Project your 529 college savings balance against inflated future college costs. Find the monthly contribution to fully fund your child\'s education. Free.',
    keywords: 'college savings calculator, 529 college savings, how much to save for college, college fund calculator, 529 plan calculator',
    ogTitle: 'College Savings Calculator',
    ogDescription: 'Project 529 balance vs inflated college costs and find the monthly contribution needed.',
  },
  hero: {
    icon: '🎓',
    h1: 'College Savings Calculator',
    tagline: "College costs inflation is relentless. This calculator projects what college will actually cost when your child enrolls — and how much you need to save each month to fund it.",
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    breadcrumbLabel: 'College Savings Calculator',
  },
  content: {
    aboutDescription: 'A 529 plan grows tax-free for college. But how much will college actually cost in 13 years? This calculator inflates today\'s costs at 5% annually, projects your 529 balance, and tells you if you\'re on track — or how much more you need to save.',
    features: [
      '🎓 529 balance projection at college start',
      '📈 College cost inflation modeling (default 5%)',
      '🔍 Year-by-year college cost breakdown',
      '💡 Recommended monthly contribution to fully fund',
      '🏛️ State tax deduction savings calculator',
    ],
    steps: [
      { title: "Enter child's age", desc: 'College starts at 18 — the calculator computes years remaining.' },
      { title: 'Enter current 529 balance and contributions', desc: 'What you have now and what you plan to add monthly.' },
      { title: 'Enter current annual college cost', desc: "Today's tuition + room and board at your target school type." },
      { title: 'See if you\'re on track', desc: 'Projected balance vs inflated costs — and the contribution needed to close any gap.' },
    ],
    faqs: [
      { q: 'How much does college cost today on average?', a: "For 2025-26, the College Board reports average costs (tuition + room & board) of $25,300 for public in-state, $43,900 for public out-of-state, and $57,600 for private four-year colleges. This calculator defaults to $30,000 — a reasonable mid-range for public in-state — but you should adjust to your target school type." },
      { q: 'Is a 529 the best way to save for college?', a: "For most families, yes — tax-free growth and withdrawals make 529s hard to beat for college savings. Alternatives include Coverdell ESAs (low contribution limit), UTMA accounts (flexible but no tax-free growth for education), and I Bonds (inflation-linked but complicated withdrawal rules). If you have an HSA and pay medical out of pocket, HSA funds can also be used for education after 65." },
    ],
    longform: [
      { type: 'h2', text: "Why College Cost Inflation Matters More Than Investment Returns" },
      { type: 'p', text: "College costs have historically risen 5-6% annually — more than double general CPI and often faster than stock market averages in real terms. A child born today will face tuition bills 2-3x higher in real dollars than today's rates. This is why this calculator front-loads the inflation assumption: the enemy isn't insufficient returns, it's underestimating the cost target." },
    ],
  },
};

export default variant;
