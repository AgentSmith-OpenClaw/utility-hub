import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'personal-loan-emi-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'Personal Loan EMI Calculator — Monthly Payment & Foreclosure Math | Toolisk',
    metaDescription:
      'Free personal loan EMI calculator. See your monthly EMI, total interest cost on high-rate unsecured loans, and whether foreclosing early actually saves money after charges.',
    keywords:
      'personal loan emi calculator, personal loan calculator, unsecured loan emi, personal loan interest calculator, personal loan foreclosure',
  },

  hero: {
    icon: '👤',
    h1: 'Personal Loan EMI Calculator',
    tagline:
      'Personal loans carry the highest interest of any retail credit. See the real cost, model an early foreclosure, and decide if it is worth refinancing.',
    gradient: 'from-orange-600 via-amber-600 to-yellow-600',
    breadcrumbLabel: 'Personal Loan EMI Calculator',
  },

  content: {
    aboutDescription:
      'A personal loan EMI calculator tuned for the 1–5 year tenures and 11–24% interest rates of unsecured personal lending. Model foreclosure charges, compare with a balance transfer, and decide whether to pay it off aggressively.',
    features: [
      '👤 Tuned for unsecured personal loans (1–5 yr)',
      '🔥 Highlights total interest as % of principal',
      '✂️ Foreclosure scenario with charges',
      '🔁 Compare with a balance transfer at lower rate',
      '📅 Full amortization schedule',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter loan amount', desc: 'Use the disbursed amount (after processing fee) — that\'s the cash that actually hits your account.' },
      { title: 'Set rate and tenure', desc: 'Personal loan rates range 11–24%. Tenure typically 12–60 months.' },
      { title: 'Compute the EMI', desc: 'The calculator shows EMI plus total interest cost as a % of your original principal — often eye-opening.' },
      { title: 'Test foreclosure', desc: 'Pick a month and see outstanding principal + foreclosure charge vs. interest you would save.' },
      { title: 'Decide next step', desc: 'If foreclosure pays back, do it. If not, consider a balance transfer to a lower rate.' },
    ],
    faqs: [
      {
        q: 'Is taking a personal loan a bad idea?',
        a: 'Not always — but it is almost always the most expensive money you can borrow legally. Personal loans make sense for short-term, well-defined needs you will repay quickly (a medical emergency, consolidating credit card debt). They rarely make sense for lifestyle expenses, holidays, or weddings, where the EMI lingers long after the memory fades.',
      },
      {
        q: 'How much can I borrow as a personal loan?',
        a: 'Banks typically cap at 10–24× monthly net salary, depending on your credit score, employer category, and existing obligations. Just because you are eligible for a large amount does not mean it is wise — keep total EMI obligations under 50% of net income, ideally well under.',
      },
      {
        q: 'Should I prepay or foreclose a personal loan early?',
        a: 'Usually yes. Personal loans typically allow part-prepayment after 6–12 EMIs, and foreclosure after 12. Charges are 2–5% of outstanding. Even after the penalty, foreclosing a 15%+ loan with idle savings is one of the highest "guaranteed returns" you can earn — there is no investment that beats it risk-free.',
      },
      {
        q: 'What about a balance transfer to a lower rate?',
        a: 'A balance transfer is worth it when the rate difference is >2% and you have more than 18 months of tenure left. Account for the processing fee (~1–2%) on the new loan and any foreclosure charge on the old one. Use the EMI calculator to compute the new EMI, then compare lifetime interest cost.',
      },
      {
        q: 'Why is the EMI on a personal loan so high?',
        a: 'Two reasons: high interest rates (11–24%) because the loan is unsecured, and short tenures (1–5 years) because banks want their money back fast. Together those create EMIs that can be 5–8% of the borrowed amount per month. A ₹5L personal loan at 15% over 3 years is roughly ₹17,300/month — about 41% of total cost is interest.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Personal loans: the expensive convenience' },
      {
        type: 'p',
        text: 'The reason personal loans are easy to get is also why they are expensive: no collateral, no end-use restriction, fast disbursal. The bank prices that convenience aggressively, and once the loan is on your books, the EMI is locked in regardless of why you took it. The calculator helps you see what that convenience actually costs over the full tenure.',
      },
      { type: 'h3', text: 'Where personal loans genuinely make sense' },
      {
        type: 'ul',
        items: [
          'Medical or family emergency where time is critical.',
          'Consolidating multiple credit card balances (any rate < 24% beats card debt).',
          'A short, finite gap — a 3-month income transition — that you can repay quickly.',
        ],
      },
      { type: 'h3', text: 'Where they almost never make sense' },
      {
        type: 'ul',
        items: [
          'Funding a wedding or vacation (one-week event, five-year EMI).',
          'Investing the proceeds — the spread between loan rate and post-tax returns is rarely positive.',
          'Topping up an existing loan instead of prepaying it.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'If a personal loan is your only path to a "want," that is usually a sign the want is bigger than the budget. Sleep on it for 30 days before the EMI starts.',
      },
    ],
  },

  schema: {
    softwareName: 'Personal Loan EMI Calculator',
    softwareFeatures:
      'Personal loan EMI, Foreclosure scenario, Balance transfer comparison, Interest as % of principal, Excel export',
  },

  relatedTools: [
    { name: 'Credit Card Payoff', href: '/finance/credit-card-payoff-calculator', icon: '💳' },
    { name: 'EMI Prepayment Calculator', href: '/finance/emi-prepayment-calculator', icon: '⚡' },
    { name: 'Car Loan EMI', href: '/finance/car-loan-emi-calculator', icon: '🚗' },
  ],
};

export default variant;
