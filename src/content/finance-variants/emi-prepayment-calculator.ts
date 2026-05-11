import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'emi-prepayment-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'EMI Prepayment Calculator — See Interest Saved & Tenure Cut | Toolisk',
    metaDescription:
      'Free EMI prepayment calculator. Add one-time or recurring part-payments and instantly see how much interest you save, how many months you shave off, and whether to reduce EMI or tenure.',
    keywords:
      'emi prepayment calculator, loan prepayment calculator, part payment calculator, home loan prepayment, reduce emi vs reduce tenure, interest saved on prepayment',
    ogTitle: 'EMI Prepayment Calculator — Interest Saved & Tenure Cut',
    ogDescription:
      'Add prepayments and instantly see how much interest you save and how many months you shave off your loan.',
  },

  hero: {
    icon: '⚡',
    h1: 'EMI Prepayment Calculator',
    tagline:
      'Add one-time or recurring prepayments and see exactly how much interest you save — and whether reducing EMI or tenure works better for you.',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    breadcrumbLabel: 'EMI Prepayment Calculator',
  },

  content: {
    aboutDescription:
      'A focused prepayment calculator for any amortizing loan. Model one-time lump-sum payments, monthly extras, or annual windfalls — and compare what happens if those rupees go toward shrinking your EMI versus shortening your tenure. Built on the same engine as our full EMI Calculator.',
    features: [
      '⚡ Instant interest-saved & months-saved figures',
      '🔁 Recurring monthly or yearly prepayment scenarios',
      '⚖️ Reduce-EMI vs reduce-tenure side-by-side',
      '📅 Full revised amortization schedule',
      '📊 Charts for principal vs interest over time',
      '💾 Export the revised plan to PDF or Excel',
    ],
    steps: [
      { title: 'Enter your existing loan', desc: 'Outstanding principal (or original amount), interest rate, and remaining tenure.' },
      { title: 'Add a prepayment', desc: 'Pick a month and amount. Add as many entries as you need — one-time bonus, annual top-up, or a recurring monthly extra.' },
      { title: 'Choose a strategy', desc: 'Toggle between Reduce Tenure (recommended for max savings) and Reduce EMI (for cashflow relief).' },
      { title: 'Read the savings', desc: 'See total interest saved, months shaved off, and a revised month-by-month schedule.' },
      { title: 'Export & share', desc: 'Download the revised plan as PDF or Excel, or share a snapshot via the share buttons.' },
    ],
    faqs: [
      {
        q: 'Is it always better to prepay than to invest?',
        a: 'Not always. The rough rule: if your post-tax loan rate is higher than the expected after-tax return on a comparable-risk investment, prepay. For a 9% home loan, that beats most fixed-income returns but may underperform long-term equity. The right answer also depends on emotional cost of debt and how disciplined you are with the alternative — many people end up not investing the surplus, in which case prepayment wins by default.',
      },
      {
        q: 'Reduce EMI or reduce tenure — which actually saves more?',
        a: 'Reduce tenure almost always saves more total interest because you keep paying the higher EMI for fewer months. Reduce EMI is only better when you genuinely need the monthly cashflow back — for emergencies, a new goal, or to absorb another loan. Use the calculator to see both numbers for your loan and decide deliberately.',
      },
      {
        q: 'When in the loan tenure does prepayment have the biggest impact?',
        a: 'The earlier the better. Loans are front-loaded with interest — in the first third of the tenure, most of your EMI is interest. Prepaying ₹1L in year 2 of a 20-year loan saves dramatically more than the same ₹1L in year 15. Try the same prepayment at different start months in the calculator and compare.',
      },
      {
        q: 'Are there prepayment penalties I should watch for?',
        a: 'In most jurisdictions, floating-rate retail loans (home, education) cannot levy prepayment charges. Fixed-rate loans, car loans, and personal loans often can — typically 2–5% of the prepaid amount. Always check your sanction letter for "foreclosure" or "part-payment" charges before transferring funds.',
      },
      {
        q: 'How frequently should I prepay?',
        a: 'A consistent yearly prepayment of one extra EMI (effectively 13 payments a year) cuts a typical 20-year home loan by 4–5 years. Quarterly or monthly extras compound even better. Set a recurring annual transfer right after a predictable inflow — bonus, tax refund, appraisal — and let it run on autopilot.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why prepayment math beats intuition' },
      {
        type: 'p',
        text: 'Most borrowers think of prepayment as "paying less interest later." The actual mechanic is sharper: every rupee prepaid permanently removes the interest that rupee would have accumulated for the rest of the loan. On a 9% loan with 15 years left, ₹1 prepaid today removes about ₹2.80 of future payments. That asymmetry is what makes early, aggressive prepayments so powerful — and why a calculator beats gut-feel every time.',
      },
      { type: 'h3', text: 'The two strategies, plainly' },
      {
        type: 'ul',
        items: [
          'Reduce tenure: keep EMI the same, finish the loan earlier. Saves more total interest because more months are eliminated entirely.',
          'Reduce EMI: keep the end date the same, lower your monthly outflow. Useful when monthly cashflow is tight or you have a competing goal coming up.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Default to reduce-tenure. Switch to reduce-EMI only when you can name the specific cashflow need you are buying — a college fee, a sabbatical, a new EMI.',
      },
      { type: 'h2', text: 'A simple yearly playbook' },
      {
        type: 'ol',
        items: [
          'Each January, prepay one extra month of EMI as a lump sum.',
          'Each time your salary goes up, raise your monthly EMI by 5% (auto-debit lets you do this).',
          'Route 50% of every bonus into prepayment until the loan is below 50% of original principal.',
          'Once below 50%, switch the prepayment habit into an SIP — keep the discipline, change the destination.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'EMI Prepayment Calculator',
    softwareFeatures:
      'Prepayment simulation, Reduce EMI vs Reduce Tenure comparison, Revised amortization schedule, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Mortgage Prepayment Calculator', href: '/finance/mortgage-prepayment-calculator', icon: '🏠' },
    { name: 'Amortization Schedule', href: '/finance/amortization-calculator', icon: '📅' },
    { name: 'Compound Interest', href: '/finance/compound-interest-calculator', icon: '📊' },
  ],
};

export default variant;
