import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'reverse-mortgage-vs-heloc',
  calculatorId: 'reverse-mortgage',
  seo: {
    title: 'Reverse Mortgage vs HELOC Calculator | Toolisk',
    metaDescription: 'Compare a HECM reverse mortgage vs a HELOC for seniors 62+. See which offers more proceeds, better terms, and fits your retirement income needs. Free.',
    keywords: 'reverse mortgage vs heloc, hecm vs heloc, reverse mortgage or heloc, which is better reverse mortgage or heloc, reverse mortgage heloc comparison',
    ogTitle: 'Reverse Mortgage vs HELOC',
    ogDescription: 'Compare the HECM reverse mortgage and a HELOC for retirement income and equity access.',
  },
  hero: {
    icon: '⚖️',
    h1: 'Reverse Mortgage vs HELOC Calculator',
    tagline: "Both tap home equity — but a HELOC requires monthly payments, while a reverse mortgage doesn't. For homeowners 62+, the right choice depends on income, age, and how long you plan to stay.",
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    breadcrumbLabel: 'Reverse Mortgage vs HELOC',
  },
  content: {
    aboutDescription: 'A HELOC requires monthly interest payments (and P&I at repayment). A reverse mortgage requires no monthly payments at all. This calculator shows your HECM proceeds and compares it to what a HELOC would cost each month — helping you choose the right equity access strategy.',
    features: [
      '⚖️ HECM proceeds vs HELOC credit limit',
      '💸 HELOC monthly payment vs $0 HECM payment',
      '📊 Equity consumption comparison over time',
      '🔒 HECM LOC growth vs HELOC freeze risk',
      '✅ Recommendation framework for 62+ homeowners',
    ],
    steps: [
      { title: 'Enter home details', desc: 'Value, existing mortgage, and borrower age.' },
      { title: 'Compare proceeds', desc: 'HECM net available vs HELOC credit limit at same CLTV.' },
      { title: 'Compare monthly cost', desc: 'HELOC requires payment; HECM does not.' },
      { title: 'Make your decision', desc: "Context on when each option wins for your situation." },
    ],
    faqs: [
      { q: 'Who should choose a HELOC over a reverse mortgage?', a: "Borrowers who: (1) plan to sell the home in the near term (within 5-10 years), since the HECM has substantial upfront fees; (2) have strong regular income and can easily afford HELOC payments; (3) are younger than 70 and want to preserve maximum equity for their heirs; or (4) want flexibility to repay and reborrow (the revolving feature of a HELOC)." },
      { q: 'Who should choose a reverse mortgage over a HELOC?', a: "Borrowers who: (1) are on a fixed retirement income and cannot comfortably make monthly payments; (2) want to eliminate mortgage payments from their budget; (3) want the LOC growth feature (no HELOC equivalent); (4) have insufficient income to qualify for a HELOC; or (5) are older (75+) where the PLF is favorable and the upfront costs are justified by the expected tenure." },
    ],
    longform: [
      { type: 'h2', text: "Key Differences Between HECM and HELOC" },
      { type: 'p', text: "Monthly payments: HELOC requires interest-only during draw, then P&I. HECM: zero monthly payments required. Qualification: HELOC requires income and credit score qualifying. HECM: qualified based on age and home equity (financial assessment still applies). LOC stability: HELOC can be frozen. HECM LOC is contractually guaranteed as long as you live in the home. Rate: Both are variable, but the HECM includes a 0.5% annual MIP on the balance, making the effective cost higher." },
    ],
  },
};

export default variant;
