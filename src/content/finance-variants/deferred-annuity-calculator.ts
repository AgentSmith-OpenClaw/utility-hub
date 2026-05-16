import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'deferred-annuity-calculator',
  calculatorId: 'annuity',
  seo: {
    title: 'Deferred Annuity Calculator: Accumulation Phase | Toolisk',
    metaDescription: 'Project your deferred annuity balance during the accumulation phase. See future value of contributions and estimate the income stream at annuitization. Free.',
    keywords: 'deferred annuity calculator, annuity accumulation calculator, fixed deferred annuity, deferred annuity growth, annuitization calculator',
    ogTitle: 'Deferred Annuity Calculator',
    ogDescription: 'Project your deferred annuity balance and estimate future income at annuitization.',
  },
  hero: {
    icon: '⏳',
    h1: 'Deferred Annuity Calculator',
    tagline: 'Contribute over time, let your money grow tax-deferred, and then convert to guaranteed income at retirement. See the full picture in one calculation.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    breadcrumbLabel: 'Deferred Annuity Calculator',
  },
  content: {
    aboutDescription: 'A deferred annuity has two phases: accumulation (money grows tax-deferred) and distribution (you receive income). This calculator projects the accumulation phase and optionally previews what income the future lump sum could generate.',
    features: [
      '⏳ Accumulation phase: FV of lump sum + contributions',
      '📊 Tax-deferred compound growth',
      '🔄 Optional annuitization preview at the end',
      '💰 Total contributions vs growth breakdown',
      '📈 Year-by-year balance chart',
    ],
    steps: [
      { title: 'Enter starting balance and contributions', desc: 'Initial deposit and ongoing periodic contributions.' },
      { title: 'Set accumulation period and return', desc: 'Years until annuitization and expected annual return.' },
      { title: 'Toggle annuitization preview', desc: 'Optionally see what income the projected lump sum could generate.' },
      { title: 'View accumulated balance', desc: 'Future value breakdown: your contributions vs investment growth.' },
    ],
    faqs: [
      { q: 'How is a deferred annuity different from a mutual fund?', a: 'The key difference is tax treatment: growth in a deferred annuity is tax-deferred until withdrawal (similar to a traditional IRA). However, annuity withdrawals are taxed as ordinary income (not capital gains rates), and there\'s typically a 10% penalty for withdrawals before age 59½. Annuities also have insurance guarantees that mutual funds don\'t.' },
      { q: 'What is the surrender period?', a: 'Most deferred annuities have a surrender period — typically 5-10 years — during which early withdrawals incur surrender charges (often starting at 7-8% and declining each year). After the surrender period, you can withdraw or annuitize without these charges. Factor this in if you may need liquidity.' },
    ],
    longform: [
      { type: 'h2', text: "Deferred Annuity Accumulation: The Math" },
      { type: 'p', text: "The future value of a deferred annuity combines two elements: (1) the future value of any existing balance growing at compound interest, and (2) the future value of periodic contributions as an ordinary annuity. The sum gives the projected lump sum at annuitization. That lump sum can then be converted to a monthly income stream using the standard PMT formula — which this calculator can optionally preview." },
    ],
  },
};

export default variant;
