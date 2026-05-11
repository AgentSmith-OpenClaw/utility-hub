import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Callout, Comparison, KeyTakeaways } from '../components';

export const vatGstSalesTaxExplained: BlogArticle = {
  slug: 'vat-gst-sales-tax-explained',
  category: 'Tax',
  title: 'VAT vs Sales Tax vs GST: How Consumption Taxes Actually Work',
  description:
    'The structural differences between US sales tax, EU/UK VAT, and Canadian/Australian GST — and why the same shopping basket costs different amounts depending on where you check out.',
  publishedDate: '2026-05-11',
  readTime: '10 min read',
  keywords: 'vat vs sales tax, gst vs vat, consumption tax, eu vat rates, uk vat, australia gst, canada hst, sales tax by state',
  relatedTools: [
    { name: 'Sales Tax / VAT / GST Calculator', href: '/finance/sales-tax-vat-gst-calculator' },
    { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator' },
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Three names, one underlying mechanism: the consumer pays a percentage on top of the listed price.
        But sales tax (US), VAT (EU/UK), and GST (Australia/Canada) collect that percentage in fundamentally
        different ways — and those differences shape pricing, business compliance burden, and how visible the
        tax feels to consumers.
      </Lead>

      <H2>Sales tax: the simplest model</H2>
      <p>
        US sales tax is a single-stage tax: the consumer pays it only at the final sale. A retailer collects it
        and remits to the state (and sometimes city/county). Manufacturers and wholesalers don&apos;t pay it on
        their inputs because they&apos;re buying for resale.
      </p>
      <p>
        Visible to consumers because it&apos;s typically <em>added to the displayed price at checkout</em>. A $100
        item rings up as $108.50 in California. Most US receipts itemize the tax.
      </p>

      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Fact</th><th className="text-left p-3 font-semibold">Detail</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3 font-semibold">Set by</td><td className="p-3 text-gray-700">State + local. Five states (DE, MT, NH, OR, AK) have no statewide sales tax.</td></tr>
            <tr><td className="p-3 font-semibold">Typical rate</td><td className="p-3 text-gray-700">6–10% combined state + local; max ~10.25% in some Chicago and Seattle areas.</td></tr>
            <tr><td className="p-3 font-semibold">Exemptions</td><td className="p-3 text-gray-700">Vary by state — many exempt groceries, prescription drugs, clothing under $X.</td></tr>
            <tr><td className="p-3 font-semibold">Visibility</td><td className="p-3 text-gray-700">Added at checkout. Listed price excludes tax.</td></tr>
          </tbody>
        </table>
      </div>

      <H2>VAT: tax at every stage (with credits)</H2>
      <p>
        VAT (Value Added Tax) is collected at every stage of the supply chain — manufacturer to wholesaler to
        retailer to consumer. But businesses claim back the VAT they paid on inputs, so the net tax burden falls
        on the final consumer. Mechanically different from sales tax; economically similar outcome.
      </p>

      <Callout accent="blue">
        <strong>Why bother with the multi-stage approach?</strong> Better compliance. Each business in the chain
        has an incentive to demand a VAT invoice from suppliers (so they can reclaim it). This creates a self-policing
        paper trail that&apos;s much harder to evade than single-stage sales tax.
      </Callout>

      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Country</th><th className="text-left p-3 font-semibold">Standard VAT</th><th className="text-left p-3 font-semibold">Notes</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">Hungary</td><td className="p-3 font-mono">27%</td><td className="p-3 text-gray-600">Highest standard rate in the EU.</td></tr>
            <tr><td className="p-3">Croatia, Denmark, Sweden</td><td className="p-3 font-mono">25%</td><td className="p-3 text-gray-600">Tied for second-highest.</td></tr>
            <tr><td className="p-3">Italy</td><td className="p-3 font-mono">22%</td><td className="p-3 text-gray-600">Reduced rates of 4%, 5%, 10% for various categories.</td></tr>
            <tr><td className="p-3">Spain, Netherlands, Belgium</td><td className="p-3 font-mono">21%</td><td className="p-3 text-gray-600">Most large EU economies cluster here.</td></tr>
            <tr><td className="p-3">France</td><td className="p-3 font-mono">20%</td><td className="p-3 text-gray-600">Reduced rate 5.5% for most food, books.</td></tr>
            <tr><td className="p-3">Germany</td><td className="p-3 font-mono">19%</td><td className="p-3 text-gray-600">Reduced rate 7% for groceries, books, hotels.</td></tr>
            <tr><td className="p-3">Luxembourg</td><td className="p-3 font-mono">17%</td><td className="p-3 text-gray-600">Lowest standard VAT in the EU.</td></tr>
          </tbody>
        </table>
      </div>

      <H3>Reduced and zero VAT rates</H3>
      <p>
        Most EU countries apply reduced rates to "essentials": basic food, books, public transport, medical supplies.
        Some apply a 0% rate to specific goods (UK food, books, children&apos;s clothing). The rules are complex —
        whether a takeaway sandwich is "food" (zero-rated in UK) or "catering" (20% VAT) has been the subject of
        actual court cases.
      </p>

      <H2>GST: simple consumption tax for AU/NZ/CA/IN</H2>
      <p>
        GST (Goods and Services Tax) is structurally similar to VAT — multi-stage with input credits — but typically
        with a single rate and fewer exemptions, making it administratively simpler.
      </p>

      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Country</th><th className="text-left p-3 font-semibold">GST rate</th><th className="text-left p-3 font-semibold">Notes</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">🇦🇺 Australia</td><td className="p-3 font-mono">10%</td><td className="p-3 text-gray-600">Single rate; basic food, health, education exempt.</td></tr>
            <tr><td className="p-3">🇳🇿 New Zealand</td><td className="p-3 font-mono">15%</td><td className="p-3 text-gray-600">Single rate; very few exemptions — cleanest GST system globally.</td></tr>
            <tr><td className="p-3">🇸🇬 Singapore</td><td className="p-3 font-mono">9%</td><td className="p-3 text-gray-600">Was 7% in 2022; rose to 9% in 2024.</td></tr>
            <tr><td className="p-3">🇮🇳 India</td><td className="p-3 font-mono">5%, 12%, 18%, 28%</td><td className="p-3 text-gray-600">Multi-tier; replaced a tangle of state taxes in 2017.</td></tr>
          </tbody>
        </table>
      </div>

      <H3>Canada: federal + provincial complexity</H3>
      <p>
        Canada is its own special case. There&apos;s a 5% federal GST that applies everywhere. Then most provinces
        add a Provincial Sales Tax (PST) or harmonize into a single Harmonized Sales Tax (HST):
      </p>
      <ul>
        <li><strong>Ontario:</strong> 13% HST (federal + provincial combined)</li>
        <li><strong>Atlantic provinces (NS/NB/PE/NL):</strong> 15% HST</li>
        <li><strong>Quebec:</strong> 5% GST + 9.975% QST = ~14.975% (administered separately)</li>
        <li><strong>BC:</strong> 5% GST + 7% PST = 12% (PST applies to fewer items)</li>
        <li><strong>Alberta, NWT, Nunavut, Yukon:</strong> 5% GST only</li>
      </ul>

      <ToolCTA
        href="/finance/sales-tax-vat-gst-calculator"
        label="Open the Sales Tax / VAT / GST Calculator"
        hint="Calculate any of these — add tax to a price or back it out from a gross amount with regional presets."
        accent="blue"
      />

      <H2>Visibility: included vs added</H2>
      <p>
        A subtle but important behavioral difference:
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Region</th><th className="text-left p-3 font-semibold">Visibility</th><th className="text-left p-3 font-semibold">Notes</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">🇺🇸 US sales tax</td><td className="p-3">Excluded from listed price</td><td className="p-3 text-gray-600">Consumer sees it at checkout. Politically harder to raise.</td></tr>
            <tr><td className="p-3">🇪🇺 EU VAT</td><td className="p-3">Included in listed price</td><td className="p-3 text-gray-600">Consumer never sees the tax separately. Easier to raise.</td></tr>
            <tr><td className="p-3">🇬🇧 UK VAT</td><td className="p-3">Included in listed price</td><td className="p-3 text-gray-600">Same as EU. Receipts show VAT but listed prices don&apos;t.</td></tr>
            <tr><td className="p-3">🇦🇺 Australia GST</td><td className="p-3">Included in listed price</td><td className="p-3 text-gray-600">Same convention as EU/UK.</td></tr>
            <tr><td className="p-3">🇨🇦 Canada GST/HST</td><td className="p-3">Excluded from listed price</td><td className="p-3 text-gray-600">Same as US — added at checkout. Politically harder to raise.</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        This matters for behavior: consumers in tax-exclusive countries (US, Canada) are more aware of and more
        sensitive to consumption tax rates. Tax-inclusive countries (EU, UK, AU) can quietly raise rates without
        much consumer pushback because the price displayed at the shop doesn&apos;t change in feel.
      </p>

      <H2>Why this matters for cross-border shoppers and businesses</H2>
      <p>
        If you&apos;re shopping across borders or running a business that sells internationally, three things to know:
      </p>
      <ol>
        <li>
          <strong>EU VAT is reclaimable for tourists</strong> — non-residents can often reclaim VAT on purchases
          taken out of the EU. There&apos;s paperwork at the airport, but on a €1,000 purchase that&apos;s €170
          back in your pocket.
        </li>
        <li>
          <strong>Cross-border e-commerce thresholds vary</strong> — selling into the EU as a US business now
          requires VAT registration if you cross country-specific thresholds (€10,000 EU-wide for digital goods).
        </li>
        <li>
          <strong>US "use tax" exists too</strong> — most US states require residents to pay sales tax on items
          bought tax-free from out-of-state vendors. Almost no one does, but technically you owe it.
        </li>
      </ol>

      <KeyTakeaways
        items={[
          'Sales tax (US): single-stage, added at checkout, set by state + local — 0–10.25% combined.',
          'VAT (EU/UK): multi-stage with input credits, included in listed price — 17–27% standard rates in EU.',
          'GST (AU/NZ/CA/IN): like VAT but typically simpler, single-rate (Canada is a multi-rate exception).',
          'Tax-exclusive pricing (US, Canada) keeps tax visible; tax-inclusive (EU, UK, AU) hides it.',
          'EU has reduced and zero rates for food, books, and essentials — the rules get baroque.',
          'The same product can carry very different total prices across borders due to VAT/GST differences.',
        ]}
      />
    </div>
  ),
};
