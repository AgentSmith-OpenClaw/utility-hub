import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'fha-loan-affordability-calculator',
  calculatorId: 'house-affordability',
  seo: {
    title: 'FHA Loan Affordability Calculator — Max Home Price',
    metaDescription:
      'Calculate how much home you can afford with an FHA loan. Uses 3.5% down and FHA 31/43 DTI (or 40/50 with compensating factors). Includes PITI and MIP cost.',
    keywords: 'fha loan affordability calculator, fha home buying calculator, fha dti calculator, fha 3.5 down affordability, how much can i afford fha',
    ogTitle: 'FHA Loan Affordability Calculator',
    ogDescription: 'Max home price, PITI, and DTI for FHA buyers — includes 3.5% down and MIP impact.',
  },
  hero: {
    icon: '🏦',
    h1: 'FHA Loan Affordability Calculator',
    tagline: 'Max home price for FHA buyers: 3.5% down, FHA DTI guidelines (31/43 or 36/50 with compensating factors), and full PITI breakdown.',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    breadcrumbLabel: 'FHA Affordability Calculator',
  },
  content: {
    aboutDescription:
      'FHA loans allow lower down payments and more flexible DTI ratios than conventional loans — but they come with mortgage insurance premiums (MIP) that increase your effective monthly payment. This calculator models FHA affordability under standard (31/43) and stretch (36/50) DTI guidelines.',
    features: [
      '🏦 FHA-specific DTI presets (31/43 and 36/50 stretch)',
      '📊 Full PITI breakdown including insurance',
      '🚦 Color-coded DTI flags against FHA limits',
      '💰 3.5% down preset (FHA minimum for 580+ credit)',
      '📈 Side-by-side conventional vs FHA stretch comparison',
    ],
    steps: [
      { title: 'Set down payment to 3.5%', desc: 'The FHA minimum for borrowers with 580+ credit score. 10% required for 500–579 FICO.' },
      { title: 'Select FHA DTI preset', desc: '"Standard (31/43)" for straightforward applications; "FHA Stretch (36/50)" if you have compensating factors.' },
      { title: 'Enter income and debts', desc: 'Gross annual income and all monthly non-housing debt minimums.' },
      { title: 'Fill rate and property costs', desc: 'FHA rates are typically 0.25–0.50% lower than conventional for the same borrower profile.' },
      { title: 'Read the result', desc: 'Max home price and PITI — add the FHA upfront MIP (1.75% of loan) to closing costs separately.' },
    ],
    faqs: [
      {
        q: 'What is the FHA loan DTI limit?',
        a: 'Standard FHA guidelines allow a front-end DTI of 31% and back-end DTI of 43%. With compensating factors (cash reserves, residual income, or strong credit), FHA can approve up to 40% front-end and 50% back-end. This calculator has both presets — "Standard (31/43)" and "FHA Stretch (36/50)".',
      },
      {
        q: 'What is FHA MIP and how does it affect affordability?',
        a: 'FHA Mortgage Insurance Premium (MIP) has two parts: (1) Upfront MIP: 1.75% of the loan amount, paid at closing or rolled into the loan. (2) Annual MIP: 0.55–1.05% of the remaining loan balance per year, paid monthly. On a $300,000 loan with 3.5% down, annual MIP adds roughly $150–$265/month. This calculator does not yet include MIP separately — add it manually as additional monthly cost.',
      },
      {
        q: 'Is an FHA loan better than conventional for first-time buyers?',
        a: 'FHA wins when: credit score is under 680, down payment is under 10%, or back-end DTI is above 43%. Conventional wins when: credit score is above 720, down payment is 20%+ (no MIP), or you want to remove MI faster. FHA MIP stays for the loan life if down payment was under 10%; conventional PMI drops at 20% equity.',
      },
      {
        q: 'What credit score do I need for an FHA loan?',
        a: 'Minimum 500 credit score (10% down required). Minimum 580 credit score (3.5% down allowed). Most FHA lenders prefer 620+ for the best rates. Scores below 580 qualify technically but many lenders will not approve them in practice.',
      },
    ],
    longform: [
      {
        type: 'h2',
        text: 'FHA vs conventional: which loan gives you more buying power?',
      },
      {
        type: 'p',
        text: 'At a given income level, FHA stretch DTI (36/50) will produce a higher maximum home price than conventional (28/36), because the income thresholds are looser. However, FHA MIP increases your effective monthly payment — which partially offsets the DTI advantage. At 3.5% down and 7% rate, FHA MIP adds roughly $175–$250/month on a $250k–$350k loan, effectively reducing how much home you can afford by $25,000–$35,000 once you account for the full payment.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: "FHA loans do not limit you to first-time buyers — any borrower who meets the credit and income requirements can use an FHA loan. The restriction is on how many FHA loans you can hold simultaneously (typically one, with exceptions for relocation).",
      },
    ],
  },
  relatedTools: [
    { name: 'House Affordability', href: '/finance/house-affordability-calculator', icon: '🏠' },
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏡' },
  ],
};

export default variant;
