import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Callout, Comparison, KeyTakeaways } from '../components';

export const rentalPropertyCapRateGuide: BlogArticle = {
  slug: 'rental-property-cap-rate-guide',
  category: 'Real Estate',
  title: 'Rental Property Cap Rate: What\'s a Good Return in 2026?',
  description:
    'Cap rate, cash-on-cash, DSCR, and the 1% rule explained with real numbers. Learn what cap rates each US market actually delivers and how to spot a deal vs a money pit.',
  publishedDate: '2026-05-11',
  readTime: '13 min read',
  keywords: 'cap rate, rental property roi, cash on cash return, dscr, 1 percent rule, rental property analysis, real estate investing',
  relatedTools: [
    { name: 'Rental Property ROI Calculator', href: '/finance/rental-roi-calculator' },
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
    { name: 'Buy vs Rent Calculator', href: '/finance/buy-vs-rent-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Three investors look at the same property in Cleveland. One calls it the deal of the year. One walks away. One
        hasn&apos;t even looked at the numbers — they just liked the kitchen. Spoiler: the second investor is right, and
        the kitchen lover will lose money for five years before they admit it. Welcome to rental property analysis,
        where the math separates investors from gamblers.
      </Lead>

      <H2>The four numbers that decide every rental deal</H2>
      <p>
        Forget HGTV. The only metrics that matter for buy-and-hold rentals are these four:
      </p>
      <ol className="space-y-2">
        <li><strong>Cap rate</strong> — net operating income ÷ purchase price (apples-to-apples market comparison)</li>
        <li><strong>Cash-on-cash return</strong> — annual cash flow ÷ total cash invested (your real return on the money you put in)</li>
        <li><strong>DSCR</strong> — net operating income ÷ debt service (how lenders judge the deal)</li>
        <li><strong>The 1% rule</strong> — monthly rent ÷ purchase price (quick screening filter)</li>
      </ol>
      <p>
        If you can&apos;t calculate these for a property in 60 seconds, you don&apos;t know enough to buy it.
      </p>

      <ToolCTA
        href="/finance/rental-roi-calculator"
        label="Open the Rental ROI Calculator"
        hint="Plug in any property and get all four metrics instantly — including the expenses beginners forget."
        accent="blue"
      />

      <H2>What&apos;s a "good" cap rate? It depends on the market</H2>
      <p>
        Cap rate (NOI divided by purchase price) varies dramatically by region. The same 5% cap rate is
        excellent in Manhattan and disastrous in Memphis. Here&apos;s a rough US framework for 2026:
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="text-left p-3 font-semibold">Market type</th><th className="text-left p-3 font-semibold">Typical cap rate</th><th className="text-left p-3 font-semibold">Profile</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">Tier 1 metros (NYC, LA, SF, Boston)</td><td className="p-3 font-mono">3–5%</td><td className="p-3 text-gray-600">Low cash flow, high appreciation. Plays for long-term equity.</td></tr>
            <tr><td className="p-3">Tier 2 cities (Atlanta, Denver, Austin, Nashville)</td><td className="p-3 font-mono">5–7%</td><td className="p-3 text-gray-600">Balanced cash flow + appreciation. The sweet spot for most.</td></tr>
            <tr><td className="p-3">Cash-flow markets (Cleveland, KC, Memphis)</td><td className="p-3 font-mono">8–12%</td><td className="p-3 text-gray-600">Strong cash flow, lower appreciation. Higher hassle.</td></tr>
            <tr><td className="p-3">Distressed/turnkey markets</td><td className="p-3 font-mono">12%+</td><td className="p-3 text-gray-600">Higher risk — vacancy, tenant quality, declining areas.</td></tr>
          </tbody>
        </table>
      </div>

      <H3>The trade-off you can&apos;t escape</H3>
      <p>
        Higher cap rate usually means lower appreciation. A 10% cap rate Memphis duplex throws off cash but probably
        won&apos;t double in 20 years. A 4% cap rate San Francisco condo barely cash-flows but might triple. Pick the
        strategy that matches your goals — don&apos;t expect both from one property.
      </p>

      <H2>Cash-on-cash return: what you actually earn</H2>
      <p>
        Cap rate ignores financing. Cash-on-cash return doesn&apos;t. It tells you the real return on the cash you
        actually put in — down payment + closing costs + rehab.
      </p>
      <p>
        Example: $300k property, 25% down ($75k), $8k closing, $5k rehab. Total cash in: $88k.
        After mortgage and all expenses, the property nets $440/month ($5,280/year) in cash flow.
        Cash-on-cash = $5,280 ÷ $88,000 = <strong>6.0%</strong>.
      </p>
      <p>
        For comparison, that&apos;s about what a 60/40 stock-bond portfolio averages — except the rental also gives
        you mortgage paydown, depreciation tax benefits, and (hopefully) appreciation. That&apos;s the leverage
        rentals provide that index funds don&apos;t.
      </p>

      <H2>DSCR: the lender&apos;s lens</H2>
      <p>
        DSCR (Debt Service Coverage Ratio) is NOI ÷ annual mortgage payment. Banks use it to decide if a property
        can support its own mortgage. Most DSCR-only loans (no income verification) require:
      </p>
      <ul>
        <li><strong>1.0–1.20:</strong> tight; usually requires extra reserves</li>
        <li><strong>1.20–1.25:</strong> standard minimum</li>
        <li><strong>1.50+:</strong> qualifies for the best rates</li>
      </ul>
      <p>
        A DSCR below 1.0 means the property doesn&apos;t generate enough to cover its mortgage. You&apos;re subsidizing
        it from your day job. That&apos;s technically allowed, but it&apos;s not a rental — it&apos;s a hobby.
      </p>

      <H2>The four expenses that kill "great deals"</H2>
      <p>
        Most deals look great on paper because the seller&apos;s pro-forma assumes 0% vacancy, 0% maintenance,
        self-management, and no capital expenditures. None of those assumptions hold in reality. Here&apos;s
        what to budget:
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="text-left p-3 font-semibold">Expense</th><th className="text-left p-3 font-semibold">Typical</th><th className="text-left p-3 font-semibold">Why</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">Vacancy</td><td className="p-3 font-mono">5–8% of rent</td><td className="p-3 text-gray-600">Even hot markets see turnover. Two months between leases is normal.</td></tr>
            <tr><td className="p-3">Maintenance</td><td className="p-3 font-mono">8–10% of rent</td><td className="p-3 text-gray-600">Clogged drains, leaks, broken appliances, paint between tenants.</td></tr>
            <tr><td className="p-3">Capital expenditures</td><td className="p-3 font-mono">1% of value/yr</td><td className="p-3 text-gray-600">Roof every 20 years, HVAC every 15, water heater every 10.</td></tr>
            <tr><td className="p-3">Property management</td><td className="p-3 font-mono">8–10% of rent</td><td className="p-3 text-gray-600">Even self-managing, value your time at this rate.</td></tr>
          </tbody>
        </table>
      </div>

      <Callout accent="amber">
        <strong>The "if I self-manage" trap:</strong> if a deal only works because you don&apos;t pay management,
        it&apos;s not a real investment — it&apos;s a part-time job with mediocre pay. Your time has value.
        Always model the deal with management included, even if you choose to self-manage.
      </Callout>

      <H2>The 1% rule: still useful, rarely achievable</H2>
      <p>
        The 1% rule says monthly rent should equal at least 1% of the purchase price. A $200k house should
        rent for $2,000+/month. In 2026, this is hard to find in most US metros — prices have outrun rents
        in coastal markets and most growth cities.
      </p>
      <p>
        Where to still find 1%+ deals: Midwestern cities (Cleveland, Indianapolis, Memphis, KC),
        Rust Belt areas (Pittsburgh, Buffalo), and select Texas/Florida secondary markets. These come
        with their own challenges — higher vacancy risk, different tenant pool, declining-population
        risk in some neighborhoods.
      </p>

      <H2>Putting it together: the deal-evaluation checklist</H2>
      <p>
        Before you submit an offer, you should have answered:
      </p>
      <ol className="space-y-1">
        <li>What&apos;s the cap rate? Is it appropriate for the market?</li>
        <li>What&apos;s the cash-on-cash return? Better than alternatives?</li>
        <li>What&apos;s the DSCR with realistic expenses? Will lenders fund it?</li>
        <li>How does it score on the 1% rule? Cash-flow market or appreciation play?</li>
        <li>What&apos;s the cash needed (down + closing + rehab + 6 months reserves)?</li>
        <li>What&apos;s the worst-case if vacancy doubles or interest rates rise on refinance?</li>
      </ol>
      <p>
        If you can&apos;t answer all six, walk away. There&apos;s another deal next week.
      </p>

      <KeyTakeaways
        items={[
          'Cap rate sweet spot for most US investors: 5–7% (Tier 2 metros).',
          'Cash-on-cash return is your real return on invested capital — aim for 8–12%+.',
          'DSCR ≥ 1.25 is the lender minimum; below 1.0 means the property cannot support itself.',
          '1% rule still useful as a screening filter, especially in Midwest/Rust Belt markets.',
          'Always model vacancy (5–8%), maintenance (8–10%), capex (1% of value), and management (8–10%) — even if self-managing.',
          'Higher cap rate ≠ better deal. Match the market to your strategy: cash flow vs appreciation.',
        ]}
      />
    </div>
  ),
};
