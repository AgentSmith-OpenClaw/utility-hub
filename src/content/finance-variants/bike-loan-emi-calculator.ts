import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'bike-loan-emi-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'Bike Loan EMI Calculator — Two-Wheeler Monthly Payment | Toolisk',
    metaDescription:
      'Free bike loan EMI calculator. Enter on-road price, down payment, interest rate and tenure to see your monthly two-wheeler EMI and total interest before you head to the dealer.',
    keywords:
      'bike loan emi calculator, two wheeler emi calculator, motorcycle loan calculator, scooter loan emi, bajaj bike emi, hero bike emi calculator, royal enfield emi',
    ogTitle: 'Bike Loan EMI Calculator — Two-Wheeler Monthly Payment',
    ogDescription:
      'See your monthly bike EMI and total interest on any two-wheeler loan before walking into the showroom.',
  },

  hero: {
    icon: '🏍️',
    h1: 'Bike Loan EMI Calculator',
    tagline:
      'Two-wheeler loans look small, but the interest rates are some of the highest in retail lending. See your real monthly EMI and total interest before signing.',
    gradient: 'from-orange-600 via-amber-600 to-yellow-500',
    breadcrumbLabel: 'Bike Loan EMI Calculator',
  },

  content: {
    aboutDescription:
      'A bike loan EMI calculator tuned for the realities of two-wheeler financing — short tenures (12–48 months), aggressive dealer offers, and rates that quietly creep into the 14–22% range. Find out what your scooter or motorcycle really costs before the salesperson finishes the paperwork.',
    features: [
      '🏍️ Tuned for 12–48 month two-wheeler tenures',
      '💰 Down payment slider with break-even view',
      '📊 Total interest vs on-road price comparison',
      '⚡ Prepayment / early-closure modeling',
      '📅 Month-by-month payment schedule',
      '💾 Export comparison sheet to PDF or Excel',
    ],
    steps: [
      { title: 'Enter on-road price', desc: 'Use the full on-road figure including road tax, registration, and insurance — not the ex-showroom price the ad shows.' },
      { title: 'Set your down payment', desc: 'For two-wheelers, 25–30% down keeps the rate negotiable. Zero-down offers usually hide higher rates or processing fees.' },
      { title: 'Add rate and tenure', desc: 'Bike loan rates typically run 14–22%. Try 24 vs 36 months — the EMI difference is small, the interest difference is not.' },
      { title: 'Compare dealer offers', desc: 'Run the calculator twice — once with the dealer\'s offer, once with a bank loan rate — and compare total cost honestly.' },
      { title: 'Export and decide', desc: 'Download the schedule and walk in with a number, not a vibe.' },
    ],
    faqs: [
      {
        q: 'Why are bike loan interest rates so much higher than car loans?',
        a: 'Two reasons. First, the ticket size is small (often under ₹1 lakh) so banks earn less per loan and price the rate up to make it worthwhile. Second, the resale value of bikes drops faster than cars, so the collateral is weaker. Expect 14–22% versus 9–11% for car loans — and never accept the first rate the dealer quotes.',
      },
      {
        q: 'Should I take a bike loan or pay in full?',
        a: 'If you have the cash and the loan rate is above 12%, pay in full. The only argument for a bike loan is preserving an emergency buffer — and even then, only at the lowest rates dealers offer (sometimes 9–10% on premium brands during sales). At 18%+, you are paying a luxury tax on your own impatience.',
      },
      {
        q: 'What tenure is best for a bike loan?',
        a: '24 months is the sweet spot for most riders. 12 months is ideal but pushes the EMI uncomfortably high; 36+ months looks cheap monthly but you risk owing more than the bike\'s worth before year two. Use the calculator to compare 24 vs 36 — the extra interest is often 15–25% more for that 12-month "comfort."',
      },
      {
        q: 'Can I prepay a bike loan?',
        a: 'Yes, but bike loans almost always carry foreclosure charges — typically 3–5% of the outstanding amount, sometimes higher in the first 6 months. Check your sanction letter. Despite the penalty, prepaying after month 6 still saves money in most cases because of the high rate.',
      },
      {
        q: 'Are zero-down or "no cost EMI" bike offers actually free?',
        a: 'No. "No cost EMI" usually means the interest is rolled into a higher upfront price or processing fee. Zero-down loans often quietly bump your rate by 1–2%. Always ask for the total amount payable in writing and run that number through this calculator — the truth shows up immediately.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The two-wheeler financing trap' },
      {
        type: 'p',
        text: 'Bike loans are the highest-margin product on a dealer\'s floor. The motorcycle margin is thin; the finance margin is fat. That is why the friendly finance executive walks you through paperwork in five minutes — the longer you sit there, the more chance you ask uncomfortable questions about the actual rate.',
      },
      { type: 'h3', text: 'Three numbers to demand before you sign' },
      {
        type: 'ul',
        items: [
          'Annual percentage rate (APR), not just the "EMI" — APR includes processing fees and insurance bundling',
          'Total amount payable across the full tenure (EMI × months + down payment)',
          'Foreclosure / prepayment charges, expressed in rupees, not percentages',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'If the dealer cannot produce these three numbers on paper, walk out. A bank loan at a lower rate, signed at the bank, is almost always cheaper than dealer-arranged finance.',
      },
      { type: 'h2', text: 'A simple bike-buying playbook' },
      {
        type: 'ol',
        items: [
          'Decide your maximum out-the-door budget before visiting any showroom.',
          'Get a pre-approved two-wheeler loan from your bank at their published rate.',
          'Walk in with the bank approval in hand — dealers will often match or beat it just to keep the deal.',
          'Insist on the on-road price, not the ex-showroom price, when comparing dealers.',
          'Run every offer through this calculator before saying yes.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Bike Loan EMI Calculator',
    softwareFeatures:
      'Two-wheeler EMI, Down payment scenarios, Total interest cost, Prepayment modeling, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Car Loan EMI Calculator', href: '/finance/car-loan-emi-calculator', icon: '🚗' },
    { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '💳' },
    { name: 'Personal Loan EMI', href: '/finance/personal-loan-emi-calculator', icon: '👤' },
  ],
};

export default variant;
