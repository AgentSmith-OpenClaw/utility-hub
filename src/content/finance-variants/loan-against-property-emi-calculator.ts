import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'loan-against-property-emi-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'Loan Against Property EMI Calculator — LAP Monthly Payment | Toolisk',
    metaDescription:
      'Free loan against property (LAP) EMI calculator. Compute monthly EMI, total interest, and effective cost when you mortgage residential or commercial property for a personal or business need.',
    keywords:
      'loan against property emi calculator, lap emi calculator, mortgage loan calculator, property loan emi, lap calculator india, secured loan emi',
    ogTitle: 'Loan Against Property EMI Calculator — LAP Monthly Payment',
    ogDescription:
      'Compute LAP monthly EMI, total interest, and effective cost of mortgaging property for cash.',
  },

  hero: {
    icon: '🏘️',
    h1: 'Loan Against Property EMI Calculator',
    tagline:
      'LAP is the cheapest unsecured-purpose loan you can take — but the tenure is long and the collateral is real. Run the full picture before pledging your home or shop.',
    gradient: 'from-stone-700 via-slate-700 to-zinc-700',
    breadcrumbLabel: 'LAP EMI Calculator',
  },

  content: {
    aboutDescription:
      'A LAP EMI calculator tuned for the long tenures (10–15 years), large ticket sizes (₹10 lakh to ₹5 crore), and mid-band rates (9–14%) that characterize loans against residential and commercial property. See the monthly EMI, the total interest over a long horizon, and the prepayment break-even — before you pledge the title deed.',
    features: [
      '🏘️ Long-tenure modeling (10–15 years)',
      '📊 Total interest as % of property value',
      '💰 LTV-aware loan amount guidance',
      '⚡ Prepayment / part-payment scenarios',
      '📅 Full amortization schedule',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter loan amount', desc: 'Banks typically offer 50–70% of the property\'s market value for residential, 40–55% for commercial. Use the sanctioned amount net of processing fees.' },
      { title: 'Add the rate', desc: 'LAP rates are typically 1.5–2.5% higher than home loans. Public sector: 9–11%. Private / NBFC: 10.5–14%.' },
      { title: 'Set tenure', desc: '10–15 years is the typical range. Longer than 15 rarely makes sense — interest stacks up dramatically and you keep the property pledged for too long.' },
      { title: 'Plan prepayments', desc: 'Most LAPs allow part-payment without penalty on floating rates. Use the prepayment scenarios to see how 1 extra EMI/year shortens the loan.' },
      { title: 'Export & decide', desc: 'Download the schedule and the total interest figure. If total interest is >70% of principal, reconsider tenure or amount.' },
    ],
    faqs: [
      {
        q: 'Is LAP cheaper than a personal or business loan?',
        a: 'Yes, significantly. LAP rates (9–14%) sit well below unsecured personal loans (12–22%) and business loans (12–24%) because the lender has real-estate collateral. For amounts above ₹15 lakh or tenures above 5 years, LAP is almost always the cheapest formal credit in India — provided you are comfortable pledging the property.',
      },
      {
        q: 'What is the LTV (loan-to-value) on a LAP?',
        a: 'Residential property: 60–70% of market value, sometimes 75% for self-occupied homes. Commercial: 40–55%. Lenders use their own valuer, not yours — and the valuation is usually conservative (10–20% below market). On a ₹1 crore home expect a sanction of ₹55–65 lakh, not ₹70 lakh.',
      },
      {
        q: 'Can I take LAP on a property that already has a home loan?',
        a: 'Only if the home loan is mostly paid off — the lender needs to be in "first charge" position on the property. If you have ₹40L outstanding on a ₹1Cr property, a LAP lender might offer to take over the home loan + give you additional cash up to their LTV cap (roughly ₹65L total). It is called "balance transfer + top-up" and is one of the most efficient ways to unlock equity.',
      },
      {
        q: 'What is the end-use restriction on LAP?',
        a: 'Almost none. Unlike home loans (must be for property), LAP can be used for any legitimate purpose — business expansion, education, medical, wedding, debt consolidation. The only common restriction is that you cannot use LAP to buy speculative assets (stocks, crypto). Lenders rarely audit usage but they do ask for a declaration.',
      },
      {
        q: 'What happens if I default on a LAP?',
        a: 'The lender invokes SARFAESI: a 60-day notice to repay, then auction of the pledged property. This is faster than a civil court process — typically 6–12 months end to end. Always maintain a 6-month EMI emergency fund before taking LAP, because the asset at stake is usually your largest. If a job loss or business downturn is plausible, choose a smaller LAP than the maximum sanctioned.',
      },
    ],
    longform: [
      { type: 'h2', text: 'When LAP is brilliant — and when it is a trap' },
      {
        type: 'p',
        text: 'Used right, LAP is one of the most powerful tools in Indian personal finance. It converts illiquid real estate into long-tenure, low-rate credit at a fraction of unsecured loan cost. Used wrong, it monetizes the family home for a depreciating want and chains the household to 15 years of EMI.',
      },
      { type: 'h3', text: 'Good LAP uses' },
      {
        type: 'ul',
        items: [
          'Consolidating multiple high-rate debts (credit cards at 36%, personal loans at 18%) into a single 11% LAP.',
          'Funding a business expansion where the return on capital comfortably exceeds the loan rate.',
          'Bridging a major medical or education expense that would otherwise require selling investments or the property itself.',
          'Unlocking equity from a paid-off second property to invest in income-generating assets.',
        ],
      },
      { type: 'h3', text: 'Bad LAP uses' },
      {
        type: 'ul',
        items: [
          'Lifestyle spending — weddings, vacations, vehicles — where there is no return on the borrowed capital.',
          'Speculative investment — stocks, F&O, crypto — where the rate is a guaranteed cost but the return is not.',
          'Funding ongoing household expenses during a job loss. Use a smaller emergency loan instead; LAP locks you in for 15 years.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'A LAP is not "free money from your house." It is a 15-year obligation with the family home as the deposit. Treat it with the seriousness that implies.',
      },
    ],
  },

  schema: {
    softwareName: 'Loan Against Property EMI Calculator',
    softwareFeatures:
      'LAP EMI, Long-tenure modeling, Total interest cost, LTV guidance, Prepayment scenarios, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
    { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '💳' },
    { name: 'EMI Prepayment Calculator', href: '/finance/emi-prepayment-calculator', icon: '⚡' },
  ],
};

export default variant;
