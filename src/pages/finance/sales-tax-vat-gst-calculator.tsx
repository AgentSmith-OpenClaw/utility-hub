import Head from 'next/head';
import SalesTaxVatGstCalculator from '../../components/Finance/SalesTaxVatGstCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/sales-tax-vat-gst-calculator';

const FAQS = [
  { q: 'What is the difference between sales tax, VAT, and GST?', a: 'Sales tax (US) is a single-stage tax charged only at the final sale to the consumer. VAT (EU/UK) and GST (Australia/Canada) are charged at each stage of production but with credits for tax paid on inputs — so the net tax burden falls on the end consumer. Functionally similar; structurally different.' },
  { q: 'How do I add VAT/GST to a price?', a: 'Multiply the net price by (1 + rate/100). For 20% VAT on £100, the gross price is £100 × 1.20 = £120. The VAT amount is £20.' },
  { q: 'How do I back out VAT/GST from a gross price?', a: 'Divide the gross price by (1 + rate/100) to get the net. For £120 gross at 20% VAT: £120 ÷ 1.20 = £100 net, with £20 VAT included. The "Remove" mode of this calculator does this automatically.' },
  { q: 'Which US states have no sales tax?', a: 'Five states have no statewide sales tax: Delaware, Montana, New Hampshire, Oregon, and Alaska (though Alaskan cities can charge local rates). Some states with low rates also exempt groceries, prescription drugs, or clothing.' },
  { q: 'What is the highest VAT rate in Europe?', a: 'Hungary has the highest standard VAT rate in the EU at 27%. Sweden, Denmark, Croatia, Norway, and Iceland are next at 25%. Switzerland (not EU) has the lowest in Western Europe at 8.1%.' },
];

export default function SalesTaxVatGstCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Sales Tax / VAT / GST Calculator',
    slug: SLUG,
    description: 'Calculate sales tax, VAT, or GST for the US, EU, UK, Australia, and Canada. Add to a price or back it out from a gross amount.',
    category: 'FinanceApplication',
    featureList: 'US sales tax, EU VAT, UK VAT, Australia GST, Canada GST/HST/PST, Add or remove tax',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Sales Tax, VAT &amp; GST Calculator — US, EU, UK, AU, CA | Toolisk</title>
        <meta name="description" content="Calculate sales tax (US), VAT (EU/UK), or GST (Australia, Canada) instantly. Add tax to a price or back it out from a gross amount. Includes regional rate presets." />
        <meta name="keywords" content="sales tax calculator, vat calculator, gst calculator, hst calculator, eu vat, uk vat, australia gst, canada hst, sales tax by state" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Sales Tax / VAT / GST Calculator | Toolisk" />
        <meta property="og:description" content="Calculate US sales tax, EU/UK VAT, AU/CA GST in one tool." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="🧾" title="Sales Tax, VAT & GST Calculator" tagline="One calculator for US sales tax, EU/UK VAT, Australian and Canadian GST — with regional presets." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <SalesTaxVatGstCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A unified sales tax, VAT, and GST calculator covering the US, European Union, United Kingdom, Australia, and Canada. Pick a region, choose a rate preset (or enter custom), and either add tax to a net price or back it out of a gross price. Built-in rate presets cover the most common scenarios in each jurisdiction."
        features={[
          '🇺🇸 US sales tax (state and major city presets)',
          '🇪🇺 EU VAT (standard and reduced rates by country)',
          '🇬🇧 UK VAT (20% standard, 5% reduced, 0% zero-rated)',
          '🇦🇺 Australia GST (10% standard)',
          '🇨🇦 Canada GST/HST/PST (federal + provincial combinations)',
          '🔁 Add tax or back it out (gross-to-net)',
        ]}
        steps={[
          { title: 'Pick your region', desc: 'US, EU, UK, AU, or CA. The tax label changes (sales tax / VAT / GST) accordingly.' },
          { title: 'Choose a rate preset', desc: 'Common rates for the region are pre-loaded. Custom rates also supported.' },
          { title: 'Choose direction', desc: 'Add tax to a pre-tax price, or back tax out of a gross price.' },
          { title: 'Read the breakdown', desc: 'Net, tax amount, and gross are all shown — copy any value with one click.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Common use cases</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>E-commerce checkout:</strong> calculate the all-in price for a shopper before they hit "checkout"</li>
              <li><strong>Invoicing:</strong> back out VAT from a quoted gross price for accounting</li>
              <li><strong>Travel budgeting:</strong> figure out the real cost of items abroad with the local VAT/GST</li>
              <li><strong>Cross-border e-commerce:</strong> compare VAT-inclusive vs VAT-exclusive pricing across regions</li>
              <li><strong>Quoting:</strong> contractors and freelancers showing both ex-VAT and inc-VAT amounts on quotes</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '📋' },
          { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator', icon: '💵' },
          { name: 'Tip Calculator', href: '/finance/tip-calculator', icon: '🧾' },
        ]}
      />
    </>
  );
}
