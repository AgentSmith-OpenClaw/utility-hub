import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'dti-home-loan-calculator',
  calculatorId: 'house-affordability',
  seo: {
    title: 'DTI Home Loan Calculator — Debt-to-Income for Mortgage',
    metaDescription:
      'Calculate your debt-to-income (DTI) ratio for a home loan and find your maximum home price. Includes front-end and back-end DTI, color-coded against conventional, FHA, and VA limits.',
    keywords: 'dti home loan calculator, debt to income ratio mortgage, front end dti calculator, back end dti calculator, mortgage dti calculator, how much can i borrow dti',
    ogTitle: 'DTI Home Loan Calculator',
    ogDescription: 'Front-end and back-end DTI for your mortgage — color-coded against conventional, FHA, and VA limits.',
  },
  hero: {
    icon: '📐',
    h1: 'DTI Home Loan Calculator',
    tagline: 'Enter income and debts to see your front-end and back-end DTI — color-coded against conventional, FHA, and VA loan limits, with a maximum home price for each.',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    breadcrumbLabel: 'DTI Home Loan Calculator',
  },
  content: {
    aboutDescription:
      'Lenders use debt-to-income (DTI) ratios — not just income — to decide how much you can borrow. This calculator shows both front-end DTI (housing cost ÷ income) and back-end DTI (all debts ÷ income), and maps them to the limits for conventional, FHA, and VA loans.',
    features: [
      '📐 Front-end and back-end DTI with color-coded limit flags',
      '🏦 Three DTI presets: conservative (28/36), standard (31/43), FHA (36/50)',
      '📊 Max home price for each preset',
      '🚦 Visual pass/fail against loan guidelines',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter gross annual income', desc: 'Lenders use pre-tax income. Include all sources: salary, bonuses, rental income, self-employment (2-year average).' },
      { title: 'Enter all monthly debts', desc: 'Every recurring minimum: car loans, student loans, credit cards, personal loans, alimony/child support. Not utilities, subscriptions, or groceries.' },
      { title: 'Choose DTI preset', desc: 'Conservative (28/36) for conventional ideal; Standard (31/43) for conventional max; FHA Stretch (36/50) for FHA with compensating factors.' },
      { title: 'Set down payment and rate', desc: 'Both affect the loan size the calculator solves for.' },
      { title: 'Read DTI ratios and max price', desc: 'Front and back DTI update live, color-coded against your chosen loan guideline.' },
    ],
    faqs: [
      {
        q: 'What is the difference between front-end and back-end DTI?',
        a: 'Front-end DTI (housing ratio) = monthly housing payment (PITI) ÷ gross monthly income. Back-end DTI (total DTI) = (PITI + all other monthly debts) ÷ gross monthly income. Lenders check both — you need to pass both limits to qualify. Back-end DTI is typically the binding constraint for buyers with significant non-housing debts.',
      },
      {
        q: 'What counts as debt for back-end DTI?',
        a: 'Debts that appear on your credit report with a minimum payment: car loans, student loans, credit card minimums, personal loans, HELOC payments, alimony/child support court orders. Not counted: utilities, insurance, subscriptions, groceries, phone bills. Lenders run a full credit report — everything on it counts.',
      },
      {
        q: 'Can I get a mortgage with a 50% DTI?',
        a: 'FHA loans allow up to 50% back-end DTI with compensating factors: 12-month cash reserves, residual income above VA guidelines, or credit score above 620. At 50% DTI, half your gross income goes to debt payments — many borrowers find this uncomfortably tight. Approval is possible; comfortable living is a different question.',
      },
      {
        q: 'How do I lower my DTI before applying?',
        a: 'Pay off installment loans (car loans) or revolving balances to eliminate minimum payments. Avoid taking on new debt (car, personal loan) in the 6–12 months before applying. Increasing income also helps but lenders require 2-year history for self-employment or bonus income. DTI is a ratio — you can move it from either end.',
      },
    ],
    longform: [
      {
        type: 'h2',
        text: 'How lenders use DTI in underwriting',
      },
      {
        type: 'p',
        text: 'DTI is one of three primary underwriting factors alongside credit score and loan-to-value (LTV). A strong credit score (760+) and low LTV (80% or less) can sometimes allow a lender to approve slightly higher DTI ratios under automated underwriting systems (AUS). Conversely, a high DTI near the limit can be offset by large reserves (liquid assets equal to 12+ months of payments).',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'VA loans use a residual income model in addition to DTI — a minimum dollar amount of income remaining after all obligations. This is why VA sometimes approves higher DTI ratios than conventional: the residual income check provides a different safety backstop.',
      },
    ],
  },
  relatedTools: [
    { name: 'House Affordability', href: '/finance/house-affordability-calculator', icon: '🏠' },
    { name: 'Amortization Calculator', href: '/finance/amortization-calculator', icon: '📊' },
  ],
};

export default variant;
