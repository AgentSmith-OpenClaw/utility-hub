import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'no-closing-cost-refinance-calculator',
  calculatorId: 'mortgage-refinance-breakeven',
  seo: {
    title: 'No-Closing-Cost Refinance Calculator | Toolisk',
    metaDescription: 'Compare lender-paid vs borrower-paid closing costs. See when a no-closing-cost refi with a slightly higher rate beats paying fees upfront.',
    keywords: 'no closing cost refinance, lender paid closing costs, no fee refinance calculator, zero cost refinance, closing cost comparison',
    ogTitle: 'No-Closing-Cost Refinance Calculator',
    ogDescription: 'Compare zero-closing-cost refi vs paying upfront — find which wins for your timeline.',
  },
  hero: {
    icon: '🆓',
    h1: 'No-Closing-Cost Refinance Calculator',
    tagline: 'Zero closing costs sounds free — but lenders recover those fees through a slightly higher rate. Find out which option actually saves you more.',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    breadcrumbLabel: 'No-Closing-Cost Refi Calculator',
  },
  content: {
    aboutDescription: 'A no-closing-cost refi rolls lender fees into a higher interest rate instead of an upfront payment. Whether this is better depends entirely on how long you keep the loan. This calculator makes the comparison concrete.',
    features: [
      '🔄 Compare roll-in vs pay-upfront scenarios',
      '📅 Break-even timeline for each approach',
      '💰 Net savings comparison at your stay horizon',
      '📊 Cumulative cost chart showing crossover',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter current loan', desc: 'Existing balance, rate, and remaining years.' },
      { title: 'Model the no-cost offer', desc: 'Set closing costs to $0 and the slightly higher offered rate.' },
      { title: 'Compare to paying upfront', desc: 'Re-enter the lower rate with full closing costs. Compare both results.' },
      { title: 'Check your stay horizon', desc: 'The option with higher stay-horizon savings wins.' },
    ],
    faqs: [
      { q: 'Is a no-closing-cost refi actually free?', a: 'No. The lender recoups fees through a rate premium — typically 0.125–0.375% higher than the market rate. Over a 10-year stay, that premium often costs more than the fees would have.' },
      { q: 'When does no-closing-cost win?', a: 'When you plan to sell or refinance again within 3–4 years. The rate premium costs less over a short window than paying $5,000–$8,000 upfront with no recovery time.' },
    ],
    longform: [
      { type: 'h2', text: 'The Hidden Cost of "Free" Refinancing' },
      { type: 'p', text: 'No-closing-cost refinances are marketed as a cost-free way to lower your rate. They are not free — the fees are shifted into your interest rate, where they accrue quietly every month for as long as you hold the loan. On a $300,000 loan, a 0.25% rate premium costs about $62/month — or $7,440 over 10 years versus the $5,500 you would have paid upfront. The no-cost option loses over a 10-year horizon in this scenario.' },
      { type: 'p', text: 'The crossover point for no-cost vs upfront is usually 4–6 years. Before that, no-cost wins. After it, paying upfront wins. Use this calculator to find the exact crossover for your specific numbers.' },
      { type: 'callout', tone: 'info', text: 'A third option: ask the lender to split the difference. You pay half the closing costs and accept a rate 0.125% above the lowest possible. This middle path often optimizes for the 5–8 year stay window.' },
    ],
  },
};

export default variant;
