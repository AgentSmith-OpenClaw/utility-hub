import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'airbnb-roi-calculator',
  calculatorId: 'rental-roi',

  seo: {
    title: 'Airbnb ROI Calculator — Short-Term Rental Profitability | Toolisk',
    metaDescription:
      'Free Airbnb ROI calculator. Estimate occupancy, nightly rate, cleaning, platform fees, and all costs to see your real cash-on-cash return on any short-term rental property.',
    keywords:
      'airbnb roi calculator, airbnb income calculator, short term rental calculator, vrbo calculator, airbnb profit calculator, str cash flow calculator, airbnb investment analysis',
    ogTitle: 'Airbnb ROI Calculator — Short-Term Rental Profitability',
    ogDescription:
      'Estimate occupancy, nightly rate, fees, and all costs to see your real Airbnb cash-on-cash return.',
  },

  hero: {
    icon: '🏡',
    h1: 'Airbnb ROI Calculator',
    tagline:
      'Airbnb math is brutal once you include cleaning, platform fees, taxes, and turnover. See if a property actually pencils before you buy it.',
    gradient: 'from-rose-700 via-pink-700 to-fuchsia-700',
    breadcrumbLabel: 'Airbnb ROI Calculator',
  },

  content: {
    aboutDescription:
      'An ROI calculator tuned for short-term rental (STR) investment — Airbnb, Vrbo, Booking.com. Models the higher gross income but higher cost structure of STRs versus long-term rentals: occupancy variance, cleaning fees, platform commission, dynamic pricing, and the operational drag of turnovers. See cash-on-cash return, cap rate, and break-even occupancy honestly.',
    features: [
      '🏡 Short-term rental cash-flow modeling',
      '📊 Cash-on-cash return + cap rate',
      '🛏️ Occupancy-rate sensitivity (40–80%)',
      '💰 Cleaning, platform fees, channel commission',
      '⚖️ STR vs long-term rental comparison',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter property details', desc: 'Purchase price, down payment, loan terms, monthly mortgage. The capital you actually deploy drives the denominator of cash-on-cash return.' },
      { title: 'Set nightly rate & occupancy', desc: 'Use AirDNA, Mashvisor, or comparable Airbnb listings to estimate realistic numbers — not optimistic ones. Most new STRs see 55–65% occupancy in year 1.' },
      { title: 'Add operating costs', desc: 'Cleaning per turnover (₹1500–4000), platform fee (15%), utilities, internet, supplies, insurance, property tax, HOA, repairs. The list is longer than people expect.' },
      { title: 'Add dead-time', desc: 'Most listings have 10–25% involuntary downtime (between bookings, deep cleans, owner stays). Model it explicitly.' },
      { title: 'Read the verdict', desc: 'Cash-on-cash return, monthly cash flow, and break-even occupancy. Most failed STR purchases would have been caught by an honest version of this calculation.' },
    ],
    faqs: [
      {
        q: 'Is Airbnb actually more profitable than long-term rental?',
        a: 'Sometimes — but not as often as the hype suggests. In hot vacation markets (beach, ski, popular city centers), a well-run Airbnb can yield 2–4× the gross income of a long-term lease. But after cleaning, fees, dynamic-pricing software, turnovers, repairs from heavier wear, higher insurance, and your time managing it all, the net cash flow is often only 1.2–1.8× a long-term rental. Many STR investors are surprised to find the long-term option more profitable per hour of effort.',
      },
      {
        q: 'What occupancy rate should I assume?',
        a: 'Conservatively, 55–65% for a year-one STR in an established market. 70–80% for a well-established, professionally-managed listing in a peak market. Below 50% means you bought in a weak market or priced too high. Pull historical data from AirDNA or Mashvisor for your specific zip code — generic estimates over-state by 10–15 percentage points consistently.',
      },
      {
        q: 'What are the hidden costs of running an Airbnb?',
        a: 'Six expenses most first-time hosts underestimate: (1) cleaning at higher quality than long-term rentals demand, (2) supplies (coffee, toilet paper, soap, batteries — adds up), (3) STR-specific insurance (1.5–3× regular landlord policy), (4) furnishings depreciation and replacement (10–15% of furniture value per year), (5) dynamic pricing tool subscriptions ($30–50/month), (6) your own time — typically 4–10 hours/week unless you fully outsource to a co-host (which costs 15–25% of revenue).',
      },
      {
        q: 'How does the calculator handle seasonality?',
        a: 'Seasonality is built into the occupancy and nightly-rate inputs — use blended annual averages rather than peak or trough numbers. For very seasonal markets (ski towns, beach), it is often more accurate to model peak season and off-season separately, then add the cash flows. The calculator supports both approaches via the annual gross income field.',
      },
      {
        q: 'What if my city bans short-term rentals?',
        a: 'Always check local regulations before buying for STR. Many cities (NYC, LA, Barcelona, Mumbai, parts of Goa) have heavy restrictions or outright bans on STRs in residential zones. Some require a primary-residence requirement (host must live there 6+ months/year). Buying for STR in a regulation-risk market without a contingency plan is the single biggest blow-up risk in this category — model a "what if I have to convert to long-term tomorrow" scenario in this calculator before committing.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why Airbnb math fools first-time investors' },
      {
        type: 'p',
        text: 'The headline numbers on Airbnb are seductive. A property that rents long-term for ₹40k/month might gross ₹4–5k per night on Airbnb — that is ₹1.2 lakh/month at 80% occupancy! And then reality arrives: 60% real occupancy, 18% in platform and channel fees, ₹2k cleaning per turnover (12 turnovers/month = ₹24k), supplies and utilities ₹8k/month, dynamic-pricing software ₹3k/month, owner time worth ₹15–25k/month equivalent, repairs from heavier wear ₹10–15k/month equivalent. The ₹1.2 lakh quietly becomes ₹50k of actual cash flow — and you have a more demanding job than a long-term landlord.',
      },
      { type: 'h3', text: 'When STR genuinely beats long-term rental' },
      {
        type: 'ul',
        items: [
          'Vacation markets with 70%+ year-round occupancy and ₹6k+ ADR (average daily rate).',
          'Property close enough to live in for occasional owner use (the "use it 4 weeks/year" math improves overall returns).',
          'Markets without restrictive regulation and unlikely to add it (research city council trends).',
          'You enjoy hospitality and treat it as a small business, not passive investing.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'If your STR pencils only at >70% occupancy and >₹6k ADR, you are buying based on best-case assumptions. Model a 50% occupancy / ₹4.5k ADR scenario and confirm the property still cash-flows. If not, the risk is too concentrated.',
      },
      { type: 'h2', text: 'The honest STR investment checklist' },
      {
        type: 'ol',
        items: [
          'Pull 12 months of AirDNA / Mashvisor data for the exact area, not the city.',
          'Subtract 10% from the suggested occupancy and 10% from ADR — that is your conservative scenario.',
          'List every operating cost, including ones that feel small. They add up to 35–45% of gross.',
          'Calculate cash-on-cash on the conservative scenario. Acceptable: 6%+. Strong: 10%+.',
          'Run a "convert to long-term" stress test. If LTR would cash flow positive, you have a fallback.',
          'Check local regulation, then check it again 6 months later before closing.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Airbnb ROI Calculator',
    softwareFeatures:
      'Short-term rental cash flow, Cash-on-cash return, Cap rate, Occupancy sensitivity, Operating cost modeling, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Rental ROI Calculator', href: '/finance/rental-roi-calculator', icon: '🏘️' },
    { name: 'Buy vs Rent Calculator', href: '/finance/buy-vs-rent-calculator', icon: '⚖️' },
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
  ],
};

export default variant;
