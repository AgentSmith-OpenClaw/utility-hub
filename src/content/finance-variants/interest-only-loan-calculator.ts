import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'interest-only-loan-calculator',
  calculatorId: 'amortization',

  seo: {
    title: 'Interest-Only Loan Calculator — Payment & Reset Math | Toolisk',
    metaDescription:
      'Free interest-only loan calculator. See your interest-only monthly payment, the reset to full amortization, and the lifetime cost of the deferred principal.',
    keywords:
      'interest only loan calculator, interest only mortgage calculator, io loan calculator, balloon loan calculator, interest only vs amortizing loan, deferred principal loan',
    ogTitle: 'Interest-Only Loan Calculator — Payment & Reset Math',
    ogDescription:
      'See your interest-only monthly payment, reset to full amortization, and lifetime cost.',
  },

  hero: {
    icon: '🎢',
    h1: 'Interest-Only Loan Calculator',
    tagline:
      'Interest-only loans look cheap for the first few years — then the reset hits. See exactly what the IO period costs you over the loan\'s full life.',
    gradient: 'from-amber-700 via-orange-700 to-red-700',
    breadcrumbLabel: 'Interest-Only Loan Calculator',
  },

  content: {
    aboutDescription:
      'A calculator for interest-only (IO) loans — products where you pay only interest for an initial period (typically 5–10 years), then reset to a fully amortizing payment for the remainder. Common in IO mortgages, HELOCs, construction loans, and some business credit lines. Models the IO payment, the post-reset payment shock, and the total interest paid versus a fully amortizing equivalent.',
    features: [
      '🎢 Interest-only period + amortizing reset modeling',
      '📊 IO payment vs post-reset payment',
      '⚖️ Total cost vs fully amortizing equivalent',
      '⚠️ Reset payment shock visualization',
      '📅 Full schedule across both phases',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter loan amount & rate', desc: 'Use the actual loan amount (not the home price) and the current interest rate. Most IO loans are adjustable-rate — the calculator assumes today\'s rate as a baseline.' },
      { title: 'Set the IO period', desc: 'Typically 5, 7, or 10 years. During this period you pay interest only — principal is not reduced.' },
      { title: 'Add total term', desc: 'Usually 30 years total. After the IO period ends, the remaining balance amortizes over the remaining term.' },
      { title: 'Read both payments', desc: 'IO monthly payment vs the post-reset amortizing payment. The reset is often 40–60% higher.' },
      { title: 'Export the comparison', desc: 'See total interest paid versus a fully amortizing equivalent loan. The IO premium adds up.' },
    ],
    faqs: [
      {
        q: 'How much lower is an interest-only payment?',
        a: 'On a $500,000 loan at 7%, the interest-only payment is roughly $2,917/month. A standard 30-year fully amortizing payment is $3,326. So IO saves about $410/month — but you make zero principal progress, meaning after 10 years you still owe the full $500k while an amortizing borrower has paid down ~$70k. The "savings" is really deferred principal that you owe later, plus extra interest from a higher average balance.',
      },
      {
        q: 'What is the reset payment after the IO period?',
        a: 'After the IO period ends, your remaining principal amortizes over the remaining term (usually 20 years). On the $500k example, a $500k balance over 20 years at 7% means a new payment of $3,876/month — a 33% jump from the IO period\'s $2,917, and 17% higher than what a fully amortizing borrower has been paying all along. If rates have risen meanwhile (IO loans are usually adjustable), the reset can be even worse.',
      },
      {
        q: 'When does an interest-only loan make sense?',
        a: 'Three legitimate cases. (1) Variable income — a high earner with lumpy income (bonus, equity, commission) who plans to pay big principal lump-sums during the IO period. (2) Bridge financing — buying a new home before selling the old one, where IO keeps total monthly outflow manageable for 12–24 months. (3) Investment property — if rental income covers IO but not full amortization initially, IO can be a tactical choice while rents grow. Used outside these cases, IO loans almost always cost more than they save.',
      },
      {
        q: 'Why did interest-only loans contribute to the 2008 crisis?',
        a: 'Many subprime borrowers in 2003–2007 took IO loans they could only afford during the IO period, betting that rising home prices would let them refinance or sell before the reset. When prices stopped rising in 2007, the resets hit borrowers with no equity, no refinance options, and payments 40–60% above their original budgets. Mass defaults followed. The lesson: never take an IO loan you cannot afford in its post-reset form.',
      },
      {
        q: 'Should I make principal payments during the IO period?',
        a: 'Almost always yes, if you can. Most IO loans allow voluntary principal payments without penalty. Even modest extra principal during the IO period reduces both the eventual reset balance and the total interest paid. The borrowers who use IO well treat it as flexibility (option to pay less when needed) rather than a license to pay less always. The calculator can model "IO + voluntary principal" scenarios to see the impact.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The "free cashflow" illusion' },
      {
        type: 'p',
        text: 'On the surface, an IO loan trades a few hundred dollars in monthly payment now for a balloon problem later. In practice, two compounding effects make it more expensive than the simple math suggests. First, you pay interest on the full principal for the entire IO period — there is no balance reduction to slow the interest meter. Second, the amortization period after the reset is shorter (20 years instead of 30) because the IO years are already gone, so the post-reset payment is substantially higher than a same-balance, full-term loan.',
      },
      { type: 'h3', text: 'A worked comparison: $500k, 7%, 30 years' },
      {
        type: 'ul',
        items: [
          'Fully amortizing 30-year: $3,326/month, $697,560 total payments, $197,560 total interest.',
          'IO 10 years + amortizing 20: $2,917/month for 10 years, then $3,876/month for 20 years. Total: $1,280,280. Total interest: $780,280.',
          'IO loan costs roughly $82,720 more in interest over the full term — for the convenience of 10 years of lower payments.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'If the only way you can afford the property is during the IO period, you cannot actually afford the property. Plan for the post-reset payment as your real budget, or pick a smaller loan.',
      },
      { type: 'h2', text: 'A safer way to use an IO loan' },
      {
        type: 'ol',
        items: [
          'Underwrite the deal at the post-reset payment, not the IO payment. If it does not cash-flow there, walk away.',
          'Make voluntary principal payments equivalent to what a fully amortizing loan would require during the IO period — capturing the flexibility without the long-term cost.',
          'Use the option to skip principal payments only in genuinely lean months — not as a default.',
          'Refinance to a fully amortizing loan before the reset if rates and equity allow. Set a calendar reminder 12 months before the reset to start the process.',
          'Avoid IO loans on primary residences unless you have a specific use case the calculator confirms.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Interest-Only Loan Calculator',
    softwareFeatures:
      'Interest-only payment, Post-reset amortization, Total cost vs amortizing equivalent, Payment shock visualization, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Amortization Calculator', href: '/finance/amortization-calculator', icon: '📅' },
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
    { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '💳' },
  ],
};

export default variant;
