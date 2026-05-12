import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'first-time-homebuyer-affordability-calculator',
  calculatorId: 'house-affordability',
  seo: {
    title: 'First-Time Homebuyer Affordability Calculator',
    metaDescription:
      'First-time homebuyer affordability calculator. Get a max home price based on income, debts, and down payment — with PITI breakdown and DTI analysis tailored for first-time buyers.',
    keywords: 'first time homebuyer affordability calculator, first time buyer home calculator, how much house can first time buyer afford, first home affordability calculator',
    ogTitle: 'First-Time Homebuyer Affordability Calculator',
    ogDescription: 'Max home price, PITI, and DTI for first-time buyers — with low down payment presets.',
  },
  hero: {
    icon: '🔑',
    h1: 'First-Time Homebuyer Affordability Calculator',
    tagline: 'Find the maximum home price you can afford as a first-time buyer — with low down payment presets, PITI breakdown, and DTI guidance.',
    gradient: 'from-teal-600 via-emerald-600 to-green-600',
    breadcrumbLabel: 'First-Time Buyer Affordability',
  },
  content: {
    aboutDescription:
      'A home affordability calculator built for first-time buyers who are still figuring out down payments and DTI limits. Includes 3–5% down presets, explains what PITI means, and shows three DTI scenarios so you know your range — not just a single number.',
    features: [
      '🔑 Low down payment presets (3%, 3.5%, 5%, 10%)',
      '📊 PITI breakdown — every cost component explained',
      '🚦 Color-coded DTI flags with plain-English interpretation',
      '🏦 Three DTI scenarios: conservative, standard, FHA stretch',
      '📈 Affordability comparison chart across all three',
    ],
    steps: [
      { title: 'Enter your gross income', desc: 'Annual before-tax salary. Use combined income if buying with a partner.' },
      { title: 'Enter monthly debts', desc: 'Car loans, student loans, credit card minimums. Do not include rent — that goes away.' },
      { title: 'Set your down payment', desc: 'First-time buyers often start at 3–5%. 20% avoids PMI but takes longer to save.' },
      { title: 'Enter current rates', desc: 'Check today\'s rates from a bank or Bankrate. Even 0.5% difference changes buying power by $20k–$30k.' },
      { title: 'Read your range', desc: 'Conservative, standard, and FHA stretch scenarios give you a realistic range to shop within.' },
    ],
    faqs: [
      {
        q: 'What is the minimum down payment for a first-time home buyer?',
        a: 'The lowest you can go: 3% on conventional loans (Fannie/Freddie HomeReady or Home Possible programs), or 3.5% on FHA loans with 580+ credit score. VA loans require 0% down for eligible veterans. USDA loans are also 0% down for eligible rural properties. The 20% "standard" avoids PMI but is not required.',
      },
      {
        q: 'How do first-time homebuyer programs affect affordability?',
        a: 'Many states and cities offer down payment assistance (DPA) grants or low-interest second liens that reduce how much you need to bring to closing. Some programs also offer below-market first mortgage rates. These can effectively increase your purchasing power by $10,000–$30,000. Check your state housing finance agency (HFA) for current programs.',
      },
      {
        q: 'Should I include HOA fees in my budget?',
        a: 'Yes — lenders count HOA fees as part of your housing payment for DTI purposes. HOA fees for condos and townhomes often run $200–$600/month, which materially reduces the max home price you qualify for. If you are considering a condo, look up its HOA fees before using this calculator.',
      },
      {
        q: 'What is PMI and should I pay it to buy sooner?',
        a: 'PMI (Private Mortgage Insurance) costs 0.5–1.5%/yr of the loan amount when your down payment is under 20% on a conventional loan. On a $300k loan, that is $125–$375/month extra. It drops off once you hit 20% equity. Whether to pay PMI to buy sooner vs wait to save 20% down depends on rent costs, home price appreciation, and investment returns. In rapidly appreciating markets, paying PMI to buy earlier has often been the better financial decision.',
      },
    ],
    longform: [
      {
        type: 'h2',
        text: 'The first-time buyer budgeting sequence',
      },
      {
        type: 'ol',
        items: [
          'Get a pre-approval letter — it locks in the lender\'s DTI calculation and tells you your official ceiling',
          'Set your target payment — run this calculator at your actual comfort level, not the lender\'s maximum',
          'Estimate property tax for your target neighborhoods — it varies enormously (0.5% to 2.5%)',
          'Add HOA if buying condo/townhome — often $200–$600/month',
          'Budget for closing costs — typically 2–5% of purchase price above the down payment',
          'Keep 3–6 months emergency fund intact after closing',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'The lender\'s pre-approval amount is a maximum, not a recommendation. Most financial advisors suggest keeping your housing payment (PITI) at or under 25–28% of gross income for long-term financial health — even if you can qualify for more.',
      },
    ],
  },
  relatedTools: [
    { name: 'House Affordability', href: '/finance/house-affordability-calculator', icon: '🏠' },
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏡' },
    { name: 'Buy vs Rent', href: '/finance/buy-vs-rent-calculator', icon: '⚖️' },
  ],
};

export default variant;
