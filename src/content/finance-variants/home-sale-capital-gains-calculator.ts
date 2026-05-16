import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'home-sale-capital-gains-calculator',
  calculatorId: 'capital-gains-tax-us',
  seo: {
    title: 'Home Sale Capital Gains Tax Calculator (Section 121) | Toolisk',
    metaDescription: 'Calculate capital gains tax on your home sale. Applies the $250k/$500k Section 121 exclusion for primary residences and shows the taxable gain. Free.',
    keywords: 'home sale capital gains calculator, home sale tax calculator, section 121 exclusion, primary residence capital gains, house sale tax',
    ogTitle: 'Home Sale Capital Gains Tax Calculator',
    ogDescription: 'Calculate capital gains tax on a home sale with the Section 121 exclusion ($250k/$500k).',
  },
  hero: {
    icon: '🏡',
    h1: 'Home Sale Capital Gains Tax Calculator',
    tagline: "Selling your home? The Section 121 exclusion shields up to $500,000 of gain from tax. This calculator applies the exclusion and computes any remaining tax liability.",
    gradient: 'from-green-600 via-emerald-600 to-teal-600',
    breadcrumbLabel: 'Home Sale Capital Gains',
  },
  content: {
    aboutDescription: 'A primary residence sale with 2-of-5-year occupancy qualifies for the Section 121 exclusion — $250,000 for single filers, $500,000 for married filing jointly. Only the gain above the exclusion is taxable. This calculator applies the exclusion correctly.',
    features: [
      '🏡 Section 121 exclusion ($250k single / $500k MFJ)',
      '📊 Eligible improvements added to cost basis',
      '🔢 Long-term capital gains tax on remaining gain',
      '💰 NIIT calculation on excess gain',
      '🏛️ State tax on taxable portion',
    ],
    steps: [
      { title: 'Enter home purchase and sale details', desc: 'Purchase price, improvements, sale price, selling costs.' },
      { title: 'Confirm primary residence eligibility', desc: 'Lived in home 2 of last 5 years enables the exclusion.' },
      { title: 'Enter filing status and income', desc: 'Determines exclusion amount and LTCG bracket.' },
      { title: 'See taxable gain and tax', desc: 'Gain after exclusion, long-term capital gains tax, NIIT, and state.' },
    ],
    faqs: [
      { q: 'Does Section 121 apply if I haven\'t lived there for 2 years?', a: "Partial exclusions are available if you have to move for specific reasons (job change, health, unforeseen circumstances) before meeting the 2-year threshold. The exclusion is prorated: if you lived there 18 of the required 24 months (75%), you get 75% of the full exclusion. A qualified tax advisor can help determine if your situation qualifies." },
      { q: 'Do improvements to my home reduce capital gains?', a: "Yes — improvements add to your cost basis, reducing the gain. Capital improvements (new roof, addition, kitchen remodel) increase basis. Repairs and maintenance do not. Keep all improvement receipts permanently — they reduce your tax bill when you sell. This calculator includes an improvements field for this purpose." },
    ],
    longform: [
      { type: 'h2', text: "Section 121: The Most Valuable Tax Break in the Code" },
      { type: 'p', text: "The Section 121 exclusion is one of the most generous tax benefits for ordinary Americans. A married couple who bought a home for $400,000 and sold for $1,000,000 with $100,000 in improvements has a $500,000 gain. With the $500,000 MFJ exclusion, the entire gain is tax-free — saving potentially $75,000+ in federal capital gains tax and NIIT. The exclusion can be used once every two years, and the 2-of-5-year rule allows flexibility for homeowners who move frequently." },
    ],
  },
};

export default variant;
