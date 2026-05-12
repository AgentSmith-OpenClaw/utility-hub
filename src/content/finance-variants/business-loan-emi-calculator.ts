import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'business-loan-emi-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'Business Loan EMI Calculator — SME & MSME Monthly Payment | Toolisk',
    metaDescription:
      'Free business loan EMI calculator for SMEs, MSMEs, and self-employed. Compute monthly EMI, total interest, and the cashflow impact before accepting any working-capital or term-loan offer.',
    keywords:
      'business loan emi calculator, sme loan emi, msme loan calculator, working capital loan emi, business loan calculator india, term loan emi calculator',
    ogTitle: 'Business Loan EMI Calculator — SME & MSME Monthly Payment',
    ogDescription:
      'Compute monthly EMI, total interest, and cashflow impact on any business or working-capital loan.',
  },

  hero: {
    icon: '🏢',
    h1: 'Business Loan EMI Calculator',
    tagline:
      'Working-capital and SME loans carry rates of 11–24%. Run the numbers before you sign — your margin and your runway depend on this calculation.',
    gradient: 'from-blue-700 via-indigo-700 to-violet-700',
    breadcrumbLabel: 'Business Loan EMI Calculator',
  },

  content: {
    aboutDescription:
      'A business loan EMI calculator built for the realities of SME and MSME borrowing in India — wide rate range (11–24%), 12 to 60 month tenures, and the cashflow planning that matters more than the headline EMI. Model term loans, working capital, and equipment finance with the same engine.',
    features: [
      '🏢 Tuned for SME / MSME loan tenures (12–60 months)',
      '💰 EMI as % of monthly revenue / profit',
      '📊 Total interest as % of loan amount',
      '⚡ Prepayment & part-payment scenarios',
      '📅 Month-by-month amortization',
      '💾 PDF / Excel export for your CA / banker',
    ],
    steps: [
      { title: 'Enter loan amount', desc: 'Use the sanctioned amount net of processing fees, GST, and insurance — that is the actual cash that hits your account.' },
      { title: 'Add the rate (APR, not "flat")', desc: 'Many lenders quote "flat rate" which sounds lower. Convert flat to reducing balance: reducing-rate ≈ flat × 1.85 for short tenures. Use the reducing rate here.' },
      { title: 'Set tenure', desc: 'Match tenure to the asset life: 12–24 months for working capital, 36–60 months for equipment, longer for property-backed loans.' },
      { title: 'Stress-test cashflow', desc: 'Take your worst recent month\'s profit. Does the EMI still leave room for it? If not, the loan is too big or the tenure too short.' },
      { title: 'Export for your CA', desc: 'Download the schedule to your accountant before signing the agreement.' },
    ],
    faqs: [
      {
        q: 'How is a "flat rate" different from a reducing-balance rate?',
        a: 'A flat rate is calculated on the original principal for the entire tenure, regardless of how much you have repaid. A reducing-balance rate is calculated each month on what you still owe. A flat rate of 12% over 3 years is roughly equivalent to a 22% reducing-balance rate — almost double. Always insist on quotes expressed as APR (reducing balance) and use those in this calculator.',
      },
      {
        q: 'What is a safe EMI-to-revenue ratio for a small business?',
        a: 'A working rule: total debt service (all loan EMIs combined) should stay under 30% of average monthly EBITDA, and under 15% of revenue. Cross those thresholds and a single bad quarter can push you into default. Use the calculator to model "what if revenue drops 25% for two months" — if that scenario breaks you, the loan is too large.',
      },
      {
        q: 'Should I take a working capital loan or a term loan?',
        a: 'A term loan is for one-time capital expenditure (machinery, fit-out, expansion) and is amortized over years. Working capital is a revolving facility for day-to-day cashflow (inventory, receivables) and behaves more like a credit line. If you are buying an asset that produces revenue for 5+ years, take a term loan; if you are smoothing cashflow, use working capital and never let it become permanent.',
      },
      {
        q: 'Are there prepayment penalties on business loans?',
        a: 'Almost always, especially in the first 6–12 months — typically 2–5% of the outstanding amount. RBI has restricted prepayment penalties on floating-rate retail loans but business loans (even floating) are usually exempt. Negotiate the prepayment clause before signing — many banks will waive it for established customers, but only if you ask in writing.',
      },
      {
        q: 'What documents do business loans need?',
        a: 'Standard set: 2–3 years of audited financials, latest 6–12 months of bank statements, GST returns, ITR, ownership / lease proof for the business premises, and KYC of all partners or directors. The biggest single delay is bank statements showing inconsistent cashflow — clean books and clear narration in your business account speed up approval by weeks.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The two questions that matter more than the EMI' },
      {
        type: 'p',
        text: 'Most founders fixate on the monthly EMI. That is the wrong number. Two other questions decide whether the loan helps or hurts:',
      },
      {
        type: 'ol',
        items: [
          'What is the return on the borrowed capital? If the loan funds inventory that turns 4× a year at 30% margin, a 16% rate is a bargain. If it funds office renovation that returns nothing, 12% is a luxury you cannot afford.',
          'What is the breakeven scenario for repayment? Take your trailing 12-month worst month. Add the EMI. If you still have positive cashflow, you can survive a bad quarter. If not, you are gambling.',
        ],
      },
      { type: 'h3', text: 'Working capital vs term loan, in one line each' },
      {
        type: 'ul',
        items: [
          'Term loan: borrow once, amortize over years — best for assets that produce revenue for years.',
          'Working capital / OD: revolving line, interest only on what you draw — best for smoothing inventory and receivables.',
          'Invoice discounting: short-term cash against a specific invoice — best when one big customer pays slowly.',
          'Equipment finance: term loan secured by the machine itself — usually the cheapest option for capex.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If a banker pushes a term loan when you described a cashflow problem, you are getting the wrong product. Ask them specifically for a CC (cash credit) or OD (overdraft) and compare.',
      },
    ],
  },

  schema: {
    softwareName: 'Business Loan EMI Calculator',
    softwareFeatures:
      'SME / MSME EMI, Term loan modeling, Total interest cost, Prepayment scenarios, PDF & Excel export',
  },

  relatedTools: [
    { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '💳' },
    { name: 'Loan Against Property EMI', href: '/finance/loan-against-property-emi-calculator', icon: '🏠' },
    { name: 'Personal Loan EMI', href: '/finance/personal-loan-emi-calculator', icon: '👤' },
  ],
};

export default variant;
