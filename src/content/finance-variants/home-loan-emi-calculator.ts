import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'home-loan-emi-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'Home Loan EMI Calculator — Monthly Payment, Interest & Tenure | Toolisk',
    metaDescription:
      'Free home loan EMI calculator. Estimate your monthly payment, total interest over the full tenure, and see exactly when each EMI flips from being mostly interest to mostly principal.',
    keywords:
      'home loan emi calculator, housing loan emi, home loan calculator, monthly home loan payment, home loan interest, housing loan emi calculator india',
  },

  hero: {
    icon: '🏠',
    h1: 'Home Loan EMI Calculator',
    tagline:
      'Estimate your monthly home loan payment, see total interest over the full tenure, and stress-test what happens if rates rise or you prepay.',
    gradient: 'from-blue-700 via-indigo-700 to-violet-700',
    breadcrumbLabel: 'Home Loan EMI Calculator',
  },

  content: {
    aboutDescription:
      'A home loan EMI calculator built for the long-tenure, large-principal nature of housing loans. Compare 15-, 20-, and 30-year scenarios, layer in prepayments from yearly bonuses, and see the exact month your EMI starts paying down more principal than interest.',
    features: [
      '🏠 Tuned for 15–30 year housing loans',
      '📈 Full amortization with principal/interest split',
      '⚡ Layer prepayments from bonuses or windfalls',
      '🔁 Compare reduce-EMI vs reduce-tenure strategies',
      '📊 Visualize the principal vs interest crossover',
      '💾 Export to PDF or Excel for your loan file',
    ],
    steps: [
      { title: 'Enter loan amount', desc: 'The sanctioned principal — what the bank is actually disbursing after margin money.' },
      { title: 'Set the interest rate', desc: 'Your current floating or fixed rate. Try both your rate and rate + 1% to see refinance/reset risk.' },
      { title: 'Choose tenure', desc: '15, 20, 25, or 30 years. The calculator shows monthly EMI plus lifetime interest for each.' },
      { title: 'Add prepayments (optional)', desc: 'Model an annual bonus prepayment to see how it compresses tenure.' },
      { title: 'Review & export', desc: 'Read the amortization table or download the full schedule as Excel.' },
    ],
    faqs: [
      {
        q: 'How much home loan EMI can I really afford?',
        a: 'A safe ceiling is total EMIs (across all loans) at 35–40% of net monthly income, after factoring in property tax, society maintenance, and home insurance. If your loan stretches that ratio with everything included, the loan is controlling your finances rather than the other way around. Stress-test at rate + 1.5% as a buffer.',
      },
      {
        q: 'Should I take a 20-year or 30-year home loan?',
        a: 'A 30-year loan gives a smaller EMI and more room to invest elsewhere, but you will pay roughly 70–90% more total interest than a 20-year loan at the same rate. The smart middle path is to take the longer tenure for safety, then systematically prepay to finish in 18–22 years.',
      },
      {
        q: 'Does the EMI change when interest rates change?',
        a: 'On floating-rate loans, your bank can either reset your EMI or extend your tenure when the benchmark rate moves. Most banks default to extending tenure, which means you barely feel it month-to-month but pay much more interest. Ask explicitly for an EMI reset if rates fall, and stress-test for an EMI rise if rates climb.',
      },
      {
        q: 'When does the EMI start paying more principal than interest?',
        a: 'On a typical 20-year home loan, the crossover point is around year 11 — that is, you spend more than half the loan tenure paying mostly interest. Prepayments dramatically pull this crossover earlier. The calculator marks the crossover month for you in the amortization view.',
      },
      {
        q: 'Are home loan EMIs tax-deductible?',
        a: 'In India, principal repayment is deductible under Section 80C (within the overall ₹1.5L limit) and interest paid is deductible under Section 24(b) up to ₹2L for a self-occupied property. In the US, mortgage interest is deductible on Schedule A up to the IRS limits. Always confirm current rules with your tax advisor — this calculator focuses on cash math, not tax math.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The home loan is not just an EMI' },
      {
        type: 'p',
        text: 'Most home loan comparisons happen on one number: the monthly EMI. That misses three things that move the actual cost more — the rate spread above the benchmark, the processing/legal/insurance bundle at disbursement, and the bank\'s default reset behavior when rates move. The EMI tells you what you pay this month. The other three tell you what you pay for the next 240.',
      },
      { type: 'h3', text: 'What to verify in your sanction letter' },
      {
        type: 'ul',
        items: [
          'Spread over the benchmark rate (Repo/MCLR/EBLR) — this is fixed for the life of the loan; ask if you can negotiate it down.',
          'Reset frequency — monthly, quarterly, or annual; faster resets feel more volatile but are usually cheaper over time.',
          'Default reset behavior on rate moves — does the bank change your EMI or your tenure? Ask in writing.',
          'Prepayment terms — confirm there are no foreclosure or part-payment charges on a floating-rate retail home loan.',
          'Insurance bundling — credit-life or property insurance is almost always optional and rarely the best deal.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'A 0.25% lower rate but a tighter prepayment clause is often a worse deal. Run the total-cost numbers — including realistic prepayments — before chasing the lowest headline rate.',
      },
    ],
  },

  schema: {
    softwareName: 'Home Loan EMI Calculator',
    softwareFeatures:
      'Monthly EMI calculation, Long-tenure amortization, Prepayment scenarios, Principal-vs-interest crossover, Excel export',
  },

  relatedTools: [
    { name: 'Mortgage Calculator (US)', href: '/finance/mortgage-calculator', icon: '🇺🇸' },
    { name: 'Buy vs Rent', href: '/finance/buy-vs-rent-calculator', icon: '🏘️' },
    { name: 'EMI Prepayment Calculator', href: '/finance/emi-prepayment-calculator', icon: '⚡' },
  ],
};

export default variant;
