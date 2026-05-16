import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'how-much-to-save-for-college',
  calculatorId: 'college-savings-529',
  seo: {
    title: 'How Much to Save for College Calculator | Toolisk',
    metaDescription: 'Calculate exactly how much you need to save each month for college. Accounts for 529 growth, college cost inflation, and your child\'s age. Free.',
    keywords: 'how much to save for college, college savings goal, monthly college savings, how much for college fund, college savings by age',
    ogTitle: 'How Much to Save for College?',
    ogDescription: 'Get a specific monthly savings target to fully fund your child\'s college education.',
  },
  hero: {
    icon: '📚',
    h1: 'How Much Should I Save for College?',
    tagline: "The answer depends on your child's age, today's college costs, and inflation. Enter your details — get a specific monthly savings target.",
    gradient: 'from-teal-600 via-cyan-600 to-sky-600',
    breadcrumbLabel: 'How Much to Save for College',
  },
  content: {
    aboutDescription: "The question every parent asks but few answer correctly. Most estimates ignore college cost inflation and the fact that you're still earning returns while drawing down in college years. This calculator solves for the precise monthly savings needed.",
    features: [
      '📚 Precise monthly savings target',
      '📈 College cost inflation projection',
      '🔢 Binary-search PMT solver for exact contribution',
      '💰 What your current plan will cover (vs the gap)',
      '🎯 Year-by-year funding schedule',
    ],
    steps: [
      { title: "Start with child's age", desc: "Younger children give you more time — but also more inflation to overcome." },
      { title: 'Set your college cost target', desc: "Public in-state? Private? Choose the type and let the calculator inflate it." },
      { title: 'Enter what you have now', desc: "Current 529 balance — a head start reduces the required monthly contribution." },
      { title: 'Get your savings target', desc: "The exact monthly contribution to be 100% funded by college start." },
    ],
    faqs: [
      { q: 'What if I can\'t save the full recommended amount?', a: "Save what you can — even partial funding is better than none. The calculator shows the funding gap if you save less than the recommended amount. Remember: your child can also contribute through work, scholarships, grants, and loans. Most families fund 30-50% of the goal from 529 savings, with the rest from other sources." },
      { q: 'When should I start saving for college?', a: "As early as possible. Starting at birth vs. age 5 dramatically reduces the required monthly contribution because of the extra years of compound growth. For a $200,000 college cost target, starting at birth vs age 5 reduces the required monthly contribution by 30-40%. Time is your biggest advantage." },
    ],
    longform: [
      { type: 'h2', text: "How the Monthly Savings Calculator Works" },
      { type: 'p', text: "This calculator projects your 529 balance to college start using monthly compounding, then simulates withdrawing each year's (inflated) tuition at the start of the year while the remaining balance continues to earn returns. If the balance runs out mid-college, it solves for the exact monthly contribution that would avoid any shortfall — using binary search to find the precise PMT that produces a fully-funded result." },
    ],
  },
};

export default variant;
