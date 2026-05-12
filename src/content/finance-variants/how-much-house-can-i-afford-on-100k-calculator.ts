import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'how-much-house-can-i-afford-on-100k-calculator',
  calculatorId: 'house-affordability',
  seo: {
    title: 'How Much House Can I Afford on $100k Salary?',
    metaDescription:
      'Find out how much house you can afford on a $100,000 salary. Enter your debts, down payment, and rate to get a personalized max home price with full PITI breakdown.',
    keywords: 'how much house can I afford on 100k, home affordability 100k salary, house buying on 100000 income, mortgage on 100k income',
    ogTitle: 'How Much House Can I Afford on $100k?',
    ogDescription: 'Personalized max home price, monthly PITI, and DTI analysis for a $100k income.',
  },
  hero: {
    icon: '🏠',
    h1: 'How Much House Can I Afford on $100k?',
    tagline: 'Enter your debts, down payment, and interest rate to get a personalized max home price — not a rule-of-thumb guess.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    breadcrumbLabel: 'Afford on $100k Calculator',
  },
  content: {
    aboutDescription:
      'This calculator starts with your $100k gross income and works through the 28/36 and FHA 36/50 DTI guidelines to produce the actual maximum home price your lender will approve — with full PITI breakdown and a three-scenario comparison.',
    features: [
      '🏠 Exact max home price for your income and debts',
      '📊 Full PITI breakdown — principal, interest, tax, insurance, HOA',
      '🚦 Front-end and back-end DTI with color-coded limit flags',
      '🏦 Three scenarios: conservative, standard, and FHA stretch',
      '💰 Works for any income — defaults preset to $100k for quick start',
    ],
    steps: [
      { title: 'Leave income at $100,000', desc: 'Or adjust to your actual gross annual income.' },
      { title: 'Enter monthly debts', desc: 'Car payments, student loans, minimum credit card payments — everything except housing.' },
      { title: 'Set down payment', desc: 'Percentage or flat amount. 20% avoids PMI; 3.5% is the FHA minimum.' },
      { title: 'Fill rate and term', desc: 'Current 30-year fixed is around 6.5–7.5% — use your quoted rate if you have one.' },
      { title: 'Read your number', desc: 'Max price, monthly PITI, and DTI ratios update instantly across all three scenarios.' },
    ],
    faqs: [
      {
        q: 'How much house can I afford on $100k salary with no debt?',
        a: 'With $100k income, $0 existing debts, 20% down, 7% rate, 1.2% property tax, and standard 31/43 DTI, you can afford roughly $380,000–$420,000. The conservative 28/36 DTI brings it to about $320,000–$360,000. FHA-stretch 36/50 DTI reaches ~$450,000–$490,000. These are starting ranges — your actual property tax rate and HOA have a significant effect.',
      },
      {
        q: 'What if I have $400/month in car payments — does that change the max price much?',
        a: 'Yes, meaningfully. With standard 31/43 DTI, $400/month in debts reduces your max back-end housing allowance by $400, which at 7% for 30 years corresponds to roughly $55,000–$60,000 less home you can afford. Higher debt loads push you toward the back-end DTI ceiling first.',
      },
      {
        q: 'Is 3× my salary a reliable rule for home buying?',
        a: 'The "3× salary" rule is a rough heuristic from lower-rate eras. At 7% interest rates, 3× income ($300k on $100k) is actually conservative — most 28/36 DTI calculations allow $320k–$380k at current rates. The rule matters more as a sanity check on your comfort level than as a lender limit.',
      },
      {
        q: 'Do lenders use gross or net income for DTI?',
        a: 'Lenders use gross (pre-tax) income for DTI calculations. Your actual take-home is less, which is why a 28% front-end DTI on gross can feel tight month-to-month. When budgeting personally, also run the numbers against your net take-home pay to ensure the payment is comfortable, not just approvable.',
      },
    ],
    longform: [
      {
        type: 'h2',
        text: '$100k salary home buying: what lenders actually approve',
      },
      {
        type: 'p',
        text: "The most common question in home buying is how the lender's DTI math translates to a real number you can search for on Zillow. At $100k, your gross monthly income is $8,333. Standard 31/43 DTI means the lender allows up to $2,583/month for housing (front-end). Subtract property tax, insurance, and HOA, and the remaining principal + interest payment determines the loan size — which divided by (1 − down payment%) gives you the home price.",
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'At $100k income, the difference between 7% and 6% rate is roughly $40,000–$50,000 in buying power. If rates drop while you are looking, re-run this calculator immediately.',
      },
    ],
  },
  relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
    { name: 'Buy vs Rent', href: '/finance/buy-vs-rent-calculator', icon: '🏡' },
  ],
};

export default variant;
