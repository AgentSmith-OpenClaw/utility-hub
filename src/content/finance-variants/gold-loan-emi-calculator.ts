import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'gold-loan-emi-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'Gold Loan EMI Calculator — Monthly Payment & Interest | Toolisk',
    metaDescription:
      'Free gold loan EMI calculator. Enter loan amount, rate, and tenure to see your monthly EMI, total interest, and the all-in cost of pledging gold for short-term liquidity.',
    keywords:
      'gold loan emi calculator, gold loan calculator india, muthoot gold loan emi, manappuram gold loan emi, gold loan per gram, gold loan interest calculator',
    ogTitle: 'Gold Loan EMI Calculator — Monthly Payment & Interest',
    ogDescription:
      'See your monthly gold loan EMI, total interest, and the real cost of pledging gold for short-term liquidity.',
  },

  hero: {
    icon: '🥇',
    h1: 'Gold Loan EMI Calculator',
    tagline:
      'Gold loans are fast, but the rate range is huge — 8% from banks to 24% from some NBFCs. See your real EMI and total interest before you walk into a branch.',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    breadcrumbLabel: 'Gold Loan EMI Calculator',
  },

  content: {
    aboutDescription:
      'A focused gold loan EMI calculator that models the short tenures (3–36 months) and wide rate band (8–24%) typical of gold-backed lending in India. Compare bullet repayment, regular EMI, and partial bullet schemes — and see when a gold loan is the cheapest source of short-term liquidity versus when it is a quiet trap.',
    features: [
      '🥇 Built for 3–36 month gold loan tenures',
      '📊 Bullet repayment vs regular EMI scenarios',
      '💰 Total interest as % of loan amount',
      '⚡ Foreclosure / prepayment modeling',
      '📅 Month-by-month schedule',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter loan amount', desc: 'Most lenders offer 65–75% of the gold value (LTV). Use the actual sanctioned amount, not the gold valuation.' },
      { title: 'Add interest rate', desc: 'Banks: 8–14%. NBFCs: 12–24%. The "₹1/gram/month" pitch translates to a rate — calculate it before agreeing.' },
      { title: 'Choose tenure & scheme', desc: 'Regular EMI (most common), bullet (interest monthly, principal at end), or partial bullet — each behaves differently in the calculator.' },
      { title: 'Compare offers', desc: 'Run the same loan amount at two rates side by side. The interest gap is usually larger than people expect.' },
      { title: 'Export your plan', desc: 'Download a clean repayment schedule before pledging anything.' },
    ],
    faqs: [
      {
        q: 'Is a gold loan cheaper than a personal loan?',
        a: 'From a bank, yes — gold loans are secured, so banks offer 8–14% versus 11–22% on unsecured personal loans. From an NBFC the gap shrinks dramatically (12–24% on gold loans), and you give up the gold as collateral. For amounts under ₹3 lakh and tenures under 18 months, a bank gold loan is usually the cheapest formal credit option in India.',
      },
      {
        q: 'What is the difference between bullet repayment and EMI?',
        a: 'Bullet means you pay only interest monthly and the full principal at the end of the tenure — useful when you expect a lump-sum inflow (bonus, FD maturity). EMI means equal monthly payments covering principal + interest, like a normal loan. Bullet costs slightly more total interest but preserves monthly cashflow; EMI builds equity from day one.',
      },
      {
        q: 'How is the gold valued?',
        a: 'Lenders compute "purity-adjusted weight" (24 karat equivalent) × current 22K market rate × loan-to-value (typically 65–75%). RBI caps LTV at 75% for retail gold loans, so on ₹1 lakh of gold value you can borrow up to ₹75,000. Always ask for the valuation slip — overvaluation by the lender is rare; undervaluation is not.',
      },
      {
        q: 'What happens if I miss EMIs on a gold loan?',
        a: 'Lenders are quick — most send notices within 30 days and auction the pledged gold within 60–90 days of default. Unlike home loans, there is no SARFAESI delay; the gold is already in their vault. Even a single missed EMI can trigger penal interest of 2–4% per month on the overdue amount. Set up auto-debit and an emergency cushion of at least 2 EMIs before pledging.',
      },
      {
        q: 'Is "₹1 per gram per month" the same as a normal interest rate?',
        a: 'No, and that pitch is designed to obscure the rate. ₹1/gram/month on a loan that gave you ₹3,500/gram works out to roughly 0.029% per month or ~0.35% per year on the gold value — but ~0.45–0.55% per year on the loan amount, which sounds tiny until you realize their "monthly" or "annual" headline rate is calculated differently. Always ask for the effective annual rate (APR) in writing.',
      },
    ],
    longform: [
      { type: 'h2', text: 'When a gold loan is actually a great deal' },
      {
        type: 'p',
        text: 'Gold loans get a bad reputation because of the way they are marketed at street-corner NBFCs. The product itself is genuinely useful: short tenure, secured, no income proof, fast disbursal. From a public-sector bank at 9%, a 12-month gold loan is often cheaper than a credit card EMI (16%+) or a personal loan (14%+), and far cheaper than a payday-style instant loan (24%+).',
      },
      { type: 'h3', text: 'A simple test for whether to take one' },
      {
        type: 'ul',
        items: [
          'Tenure is under 18 months and you have a clear repayment source (bonus, FD maturity, asset sale).',
          'Rate is 12% or lower from a bank (not the first NBFC quote).',
          'The cash need is genuine and short-term — medical, education fee, business inventory — not lifestyle.',
          'You can absorb the worst case: losing the gold if you cannot repay.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Avoid rolling over a gold loan repeatedly. Renewing every 6 months at 18% effectively turns it into a perpetual high-rate debt, and lenders will quietly raise the rate on each renewal.',
      },
      { type: 'h2', text: 'The negotiation lever most people miss' },
      {
        type: 'p',
        text: 'Walk into a public-sector bank with your gold and ask for the lowest published gold loan rate. Then visit one private NBFC and one private bank. The first three quotes will usually span an 8 percentage-point range. Run each through this calculator and you will see the total-interest gap is often 30–60% of the principal over 24 months. That is the cost of accepting the first offer.',
      },
    ],
  },

  schema: {
    softwareName: 'Gold Loan EMI Calculator',
    softwareFeatures:
      'Gold loan EMI, Bullet vs regular repayment, Total interest cost, Prepayment modeling, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Personal Loan EMI', href: '/finance/personal-loan-emi-calculator', icon: '👤' },
    { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '💳' },
    { name: 'EMI Prepayment Calculator', href: '/finance/emi-prepayment-calculator', icon: '⚡' },
  ],
};

export default variant;
