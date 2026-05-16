import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'hecm-calculator',
  calculatorId: 'reverse-mortgage',
  seo: {
    title: 'HECM Calculator: Home Equity Conversion Mortgage | Toolisk',
    metaDescription: 'Calculate HECM reverse mortgage proceeds. Estimate your initial principal limit, fee breakdown, and net funds available. 2026 FHA limit. Free.',
    keywords: 'hecm calculator, home equity conversion mortgage calculator, hecm principal limit, hecm proceeds, fha reverse mortgage calculator',
    ogTitle: 'HECM Calculator',
    ogDescription: 'Estimate HECM reverse mortgage principal limit, fees, and net proceeds for all four payout options.',
  },
  hero: {
    icon: '🏛️',
    h1: 'HECM Calculator (Home Equity Conversion Mortgage)',
    tagline: 'The FHA-insured HECM is the only federally backed reverse mortgage. Enter your home value and age — see exactly how much equity you can access.',
    gradient: 'from-slate-700 via-blue-700 to-indigo-700',
    breadcrumbLabel: 'HECM Calculator',
  },
  content: {
    aboutDescription: 'The HECM (Home Equity Conversion Mortgage) is the dominant form of reverse mortgage in the US. It is FHA-insured, non-recourse, and available to homeowners 62+. This calculator estimates the principal limit using the HUD formula and provides all four payout options.',
    features: [
      '🏛️ HECM principal limit calculation',
      '📊 Principal Limit Factor (PLF) lookup by age',
      '💰 Full fee breakdown (IMIP, origination, other)',
      '📅 All four payout options side-by-side',
      '📈 25-year loan balance vs. home equity projection',
    ],
    steps: [
      { title: 'Enter home value and existing mortgage', desc: 'Existing mortgage is paid off from HECM proceeds.' },
      { title: 'Enter borrower age', desc: 'Youngest borrower drives the PLF — older = more proceeds.' },
      { title: 'Choose payout option', desc: 'Lump sum, LOC, term, or tenure (lifetime) monthly payments.' },
      { title: 'See principal limit and net proceeds', desc: 'Complete fee breakdown from max claim to net available.' },
    ],
    faqs: [
      { q: 'What is the 2026 HECM lending limit?', a: "The FHA HECM lending limit for 2026 is $1,209,750. This is the maximum home value used in the principal limit calculation — even if your home is worth more, the calculation caps at this limit. (The actual loan amount is still further reduced by the PLF and fees.)" },
      { q: 'What is the Principal Limit Factor?', a: "The PLF is a HUD-published table that determines what percentage of the max claim amount you can borrow. It increases with age (older borrowers get more) and decreases with higher expected interest rates. At age 70, 6% expected rate, the PLF is approximately 0.474 — meaning you can borrow about 47.4% of the home's value before fees." },
    ],
    longform: [
      { type: 'h2', text: "How HECM Proceeds Are Calculated" },
      { type: 'p', text: "Step 1: Determine the Max Claim Amount (MCA) = min(home value, $1,209,750). Step 2: Look up the Principal Limit Factor for the youngest borrower's age at a 6% expected rate. Step 3: Initial Principal Limit = MCA × PLF. Step 4: Subtract upfront costs (IMIP at 2% of MCA, origination fee capped at $6,000, other closing costs). Step 5: Subtract existing mortgage payoff. The result is the net funds available." },
    ],
  },
};

export default variant;
