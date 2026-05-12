import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'student-loan-payoff-calculator',
  calculatorId: 'student-loan',

  seo: {
    title: 'Student Loan Payoff Calculator — Pay Off Faster & Save | Toolisk',
    metaDescription:
      'Free student loan payoff calculator. See how extra payments shrink your tenure, total interest saved, and the exact debt-free date — for federal or private loans.',
    keywords:
      'student loan payoff calculator, pay off student loans calculator, student loan extra payment calculator, student debt free calculator, accelerated student loan payoff',
    ogTitle: 'Student Loan Payoff Calculator — Pay Off Faster & Save',
    ogDescription:
      'See how extra payments shrink your student loan tenure and total interest paid.',
  },

  hero: {
    icon: '🎓',
    h1: 'Student Loan Payoff Calculator',
    tagline:
      'Standard repayment runs 10 years. An extra $100/month often kills the loan 2–3 years early and saves five figures in interest. See your exact numbers.',
    gradient: 'from-indigo-700 via-blue-700 to-cyan-700',
    breadcrumbLabel: 'Student Loan Payoff',
  },

  content: {
    aboutDescription:
      'A student loan payoff calculator focused on the impact of extra payments. Plug in your balance, rate, and minimum payment — then layer in a monthly extra, a year-end lump sum, or both — and see months saved, total interest avoided, and an exact debt-free date. Works for US federal and private loans and Indian education loans alike.',
    features: [
      '🎓 Standard vs accelerated payoff side-by-side',
      '⚡ Extra monthly + annual lump-sum modeling',
      '📊 Total interest saved, in dollars / rupees',
      '📅 Exact debt-free date',
      '📈 Break-even on refinance scenarios',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter loan balance & rate', desc: 'Current outstanding balance and weighted-average interest rate across all your student loans. Federal: 4–7%. Private: 4–12%. Indian: 8–13%.' },
      { title: 'Set the minimum / standard payment', desc: 'Use your servicer\'s scheduled monthly payment as the baseline.' },
      { title: 'Add extra payments', desc: 'Monthly extra (even $50–100), annual lump-sum (tax refund, bonus), or both. The calculator stacks them correctly.' },
      { title: 'Compare scenarios', desc: 'See standard payoff vs accelerated. The total-interest gap is usually larger than borrowers expect.' },
      { title: 'Export your plan', desc: 'Download the month-by-month schedule and use it as a payoff tracker.' },
    ],
    faqs: [
      {
        q: 'How much does an extra $100/month save on a student loan?',
        a: 'On a $40,000 federal loan at 5.5% over the standard 10 years, an extra $100/month saves roughly $3,200 in interest and pays the loan off ~22 months early. On a $40k private loan at 9%, the same extra payment saves ~$6,400 and finishes the loan 26 months early. The higher your rate and balance, the bigger the payoff from even modest extra payments. The calculator gives you the exact number for your specific loans.',
      },
      {
        q: 'Should I pay off student loans early or invest?',
        a: 'A rough rule: if your loan rate is above 6%, prioritize payoff. Below 4%, prioritize investing in tax-advantaged accounts (401k match, Roth IRA). Between 4–6% is grey — depends on tax deduction eligibility (US: student loan interest is deductible up to $2,500/year, India: Section 80E full interest deduction), your risk tolerance, and whether the alternative is genuinely productive investment. Most borrowers should at least capture any employer 401k match before accelerating loan payoff.',
      },
      {
        q: 'Are there penalties for paying off student loans early?',
        a: 'No, federal loans (US) and education loans (India) explicitly cannot charge prepayment penalties. US private loans almost never do either — competitive pressure has eliminated them across major lenders. The only watch-out is making sure your servicer applies extra payments to principal, not to "early" future payments. Mark each extra payment "apply to current principal" in the servicer\'s portal, or you risk just buying yourself an early future installment with zero interest savings.',
      },
      {
        q: 'Snowball or avalanche for student loans?',
        a: 'Most student-loan borrowers have one or two large loans rather than the many small balances that make snowball motivational. Avalanche (highest rate first) is usually the better fit — typically meaning you target the unsubsidized federal loans or private loans before the subsidized federal ones. If you have many small loans of similar size, snowball\'s motivation advantage might justify the small interest cost. The calculator can compare both for your specific loan mix.',
      },
      {
        q: 'Should I refinance my student loans?',
        a: 'Sometimes. Refinancing private-to-private at a lower rate is almost always a win if your credit has improved. Refinancing federal-to-private is risky — you give up federal protections (income-driven repayment, deferment options, PSLF eligibility, COVID-era pauses) in exchange for a possibly lower rate. Most borrowers should not refinance federal loans unless they are certain they will not need the federal flexibility. Use the calculator to compare your current trajectory vs a refinanced one before pulling the trigger.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why student loans punish patience' },
      {
        type: 'p',
        text: 'Student loans are amortized like mortgages, which means the first years of payments are mostly interest. On a 10-year loan at 6%, the first year\'s payments are roughly 55% interest, 45% principal. Stretching the loan to 20 years (income-driven repayment, extended repayment) makes the early-year ratio even worse — sometimes 75% interest. Paying extra principal in years 1–3 is dramatically more impactful than the same dollar amount in years 7–10, because you eliminate years of compounded interest on that dollar.',
      },
      { type: 'h3', text: 'A worked example: $40,000 at 6%, 10 years' },
      {
        type: 'ul',
        items: [
          'Standard payoff: $444/month, 120 payments, $13,322 total interest.',
          'Standard + $100/month extra: 95 payments, $10,184 interest, 25 months saved.',
          'Standard + $250/month extra: 73 payments, $7,545 interest, 47 months saved.',
          'Standard + $500/month extra: 52 payments, $5,054 interest, 68 months saved.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'The math is non-linear: $100/month extra saves $3k; $500/month saves only $8k. The diminishing returns are real. The sweet spot is usually $100–200/month extra unless you have a windfall — then a lump-sum prepayment beats sustained smaller extras.',
      },
      { type: 'h2', text: 'A payoff playbook by income level' },
      {
        type: 'ol',
        items: [
          'Capture 401k match (free money) before any extra student loan payments.',
          'Build a $1,000 emergency fund — anything bigger, save in parallel with debt payoff.',
          'Pay $50–100/month above the minimum on the highest-rate loan. Build the habit.',
          'Route 50% of every windfall (tax refund, bonus, gift) directly to principal.',
          'When your annual income jumps 10%+, raise the monthly extra by half the increase.',
          'Once debt-free, redirect the entire former payment into investing. The habit was the point.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Student Loan Payoff Calculator',
    softwareFeatures:
      'Standard vs accelerated payoff, Extra payment modeling, Lump-sum prepayment, Total interest saved, Debt-free date, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Student Loan Calculator', href: '/finance/student-loan-calculator', icon: '🎓' },
    { name: 'Education Loan EMI', href: '/finance/education-loan-emi-calculator', icon: '🎓' },
    { name: 'Credit Card Debt Snowball', href: '/finance/credit-card-debt-snowball-calculator', icon: '⛄' },
  ],
};

export default variant;
