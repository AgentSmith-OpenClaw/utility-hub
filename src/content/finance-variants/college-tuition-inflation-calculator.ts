import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'college-tuition-inflation-calculator',
  calculatorId: 'college-savings-529',
  seo: {
    title: 'College Tuition Inflation Calculator | Future Cost | Toolisk',
    metaDescription: 'Project future college tuition costs accounting for 5%+ annual inflation. See what today\'s $30,000/year college will cost in 10, 13, or 18 years. Free.',
    keywords: 'college tuition inflation calculator, future college cost calculator, college cost inflation, how much will college cost in 10 years, tuition inflation rate',
    ogTitle: 'College Tuition Inflation Calculator',
    ogDescription: 'See what college will actually cost in future years at historical 5% tuition inflation.',
  },
  hero: {
    icon: '📊',
    h1: 'College Tuition Inflation Calculator',
    tagline: "College costs rise faster than inflation — about 5% per year. A $30,000/year school today costs $56,000 in 13 years. See your exact future cost target.",
    gradient: 'from-red-600 via-rose-600 to-pink-600',
    breadcrumbLabel: 'College Tuition Inflation',
  },
  content: {
    aboutDescription: 'College cost inflation has averaged 5-6% annually for decades — well above CPI. This calculator shows what any college costs today will cost in any future year, and how that affects your savings requirements.',
    features: [
      '📊 Year-by-year cost projection at custom inflation rate',
      '📈 Historical 5% default (College Board data)',
      '💰 Total 4-year inflated cost',
      '🎯 Monthly savings needed to cover inflated costs',
      '📉 Sensitivity to different inflation scenarios',
    ],
    steps: [
      { title: 'Enter current annual cost', desc: "Today's tuition + room and board for your target school." },
      { title: 'Set years until college', desc: "Based on child's age or a custom future year." },
      { title: 'Set inflation rate', desc: 'Default 5% (historical average); adjust for your projection.' },
      { title: 'See future costs', desc: 'Year-by-year cost and total 4-year bill in future dollars.' },
    ],
    faqs: [
      { q: 'Why does college cost so much more than general inflation?', a: "College cost inflation consistently outpaces CPI due to: (1) the 'Baumol cost disease' — labor-intensive service with limited productivity gains; (2) easy availability of student loans driving demand regardless of price; (3) university spending on facilities, athletics, and administration that outpaces enrollment growth. Historically 5-6% annually vs. 2-3% for general CPI." },
      { q: 'Should I use 5% inflation or a higher number?', a: "5% is a reasonable baseline based on historical College Board data. Public universities have often inflated faster; elite private schools somewhat slower (they discount heavily for aid). If your child is very young and you want to be conservative, 6-7% is reasonable. If you're within 5 years of college, actual costs are more predictable." },
    ],
    longform: [
      { type: 'h2', text: "The College Inflation Math That Surprises Most Parents" },
      { type: 'p', text: "At 5% annual inflation, college costs double every 14 years. A baby born today will face tuition costs 2x current rates by the time they enroll. A 5-year-old will face costs 1.6x current rates. This compound inflation is why savings calculators that don't account for tuition inflation dramatically understate the amount families need to save. Always inflation-adjust your college cost target before setting a savings goal." },
    ],
  },
};

export default variant;
