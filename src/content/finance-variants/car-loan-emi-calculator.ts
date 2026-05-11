import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'car-loan-emi-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'Car Loan EMI Calculator — Monthly Payment & Total Interest | Toolisk',
    metaDescription:
      'Free car loan EMI calculator. Enter on-road price, down payment, rate and tenure to see your monthly EMI and the full interest you will pay over the life of the loan.',
    keywords:
      'car loan emi calculator, auto loan calculator, vehicle loan emi, car emi calculator india, used car loan emi, monthly car payment calculator',
  },

  hero: {
    icon: '🚗',
    h1: 'Car Loan EMI Calculator',
    tagline:
      'See your monthly car loan EMI, total interest cost, and the impact of a larger down payment — before you sign anything at the dealership.',
    gradient: 'from-rose-600 via-pink-600 to-fuchsia-600',
    breadcrumbLabel: 'Car Loan EMI Calculator',
  },

  content: {
    aboutDescription:
      'A car loan EMI calculator that handles the shorter tenures (typically 3–7 years), higher rates (9–14%), and front-loaded depreciation that make car financing different from home loans. See whether a bigger down payment or a shorter tenure saves you more.',
    features: [
      '🚗 Tuned for 3–7 year auto loan tenures',
      '💸 Down payment slider to see "skin in the game" effect',
      '📊 Total interest vs total cost of the car',
      '⚡ Prepayment modeling for early closure',
      '📅 Month-by-month schedule',
      '💾 PDF / Excel export for dealer comparison',
    ],
    steps: [
      { title: 'Enter the on-road price', desc: 'Use the full out-the-door price including taxes, registration, and insurance — not the ex-showroom number.' },
      { title: 'Set the down payment', desc: '20% is the safe floor; 30%+ keeps you from going underwater on depreciation.' },
      { title: 'Add rate and tenure', desc: 'Most car loans run 36–60 months. Longer tenures lower the EMI but balloon interest.' },
      { title: 'Compare scenarios', desc: 'Run the calculator twice — once with the dealer\'s offer, once with 10% more down — and compare total cost.' },
      { title: 'Export your numbers', desc: 'Download a clean comparison sheet to bring to the showroom.' },
    ],
    faqs: [
      {
        q: 'What is a safe car loan EMI as a percentage of income?',
        a: 'Total vehicle cost (EMI + fuel + insurance + maintenance) should stay under 15% of take-home income, with the EMI itself ideally under 10%. Cars are depreciating assets — every percentage point above this trades long-term wealth for a metal box that loses 50% of its value in five years.',
      },
      {
        q: 'Should I take a longer tenure for a lower EMI?',
        a: 'Generally no. A 7-year car loan costs roughly 40% more total interest than a 5-year loan at the same rate, and you risk owing more than the car is worth (negative equity) for most of the tenure. If the 5-year EMI is uncomfortable, buy a cheaper car instead of extending the loan.',
      },
      {
        q: 'How much down payment should I make?',
        a: '20% minimum, 30% comfortable, 40%+ ideal. A higher down payment shortens the period of negative equity, lowers your interest cost, and protects you if the car is totaled in the first year. Banks often nudge you toward smaller down payments because that maximizes their interest income — not your savings.',
      },
      {
        q: 'Can I prepay a car loan?',
        a: 'Yes, but unlike home loans, car loans frequently carry prepayment penalties — typically 2–5% of the outstanding amount, or a fixed foreclosure fee. Check your sanction letter. Even with penalties, prepaying often pays back within 12–18 months of saved interest, especially if rates are above 11%.',
      },
      {
        q: 'New car loan vs used car loan EMI — what is different?',
        a: 'Used car loans usually carry rates 1–3% higher than new car loans because the collateral is depreciating faster and harder to value. The tenure may also be capped — banks will not lend for longer than the car\'s remaining useful life. Always check both rate and tenure for the specific vehicle age.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why cars are different from homes (financially)' },
      {
        type: 'p',
        text: 'A house can be a hedge against rent and may appreciate. A car begins losing value the second you drive off the lot — typically 20% in year one, ~50% by year five. Financing a depreciating asset at 10%+ interest is one of the most expensive things personal finance lets you do. The calculator is here to make the cost visible.',
      },
      { type: 'h3', text: 'The "true monthly cost" mental model' },
      {
        type: 'p',
        text: 'When you compare your EMI to a friend\'s, you are comparing the wrong number. The honest cost of owning a car is:',
      },
      {
        type: 'ul',
        items: [
          'Loan EMI + interest',
          'Fuel (estimate from your annual kilometres × current price ÷ mileage)',
          'Insurance (comprehensive, not just third-party)',
          'Service & maintenance (~₹15–40k/year depending on segment)',
          'Depreciation (the difference between what you paid and resale value, divided by years held)',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If depreciation alone outweighs the EMI, you are renting the car from yourself at the worst possible rate. Buy slightly older or slightly cheaper.',
      },
    ],
  },

  schema: {
    softwareName: 'Car Loan EMI Calculator',
    softwareFeatures: 'Auto loan EMI, Down payment scenarios, Total interest cost, Prepayment modeling, Excel export',
  },

  relatedTools: [
    { name: 'Auto Loan Calculator', href: '/finance/auto-loan-calculator', icon: '🚙' },
    { name: 'EMI Prepayment Calculator', href: '/finance/emi-prepayment-calculator', icon: '⚡' },
    { name: 'Personal Loan EMI', href: '/finance/personal-loan-emi-calculator', icon: '👤' },
  ],
};

export default variant;
