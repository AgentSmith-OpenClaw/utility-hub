import Head from 'next/head';
import DiscountCalculator from '../../components/Finance/DiscountCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const SLUG = '/finance/discount-calculator';

const FAQS = [
  {
    q: 'How do I calculate the final price after a discount?',
    a: 'Final price = Original × (1 − discount %). For example, a $50 item with 25% off is $50 × 0.75 = $37.50. If the discount is a flat amount instead of a percentage, just subtract: $50 − $10 = $40. The calculator handles both directions automatically — pick "Discount %" or "Flat amount" to switch modes.',
  },
  {
    q: 'How do I work out the discount percentage from sale and original prices?',
    a: 'Discount % = ((Original − Sale) ÷ Original) × 100. Example: shirt was $80, now $52. The discount is ((80 − 52) ÷ 80) × 100 = 35%. Use the "Flat amount" mode in this calculator with the savings amount, and the implied percentage shows up automatically.',
  },
  {
    q: 'Is tax applied before or after the discount?',
    a: 'In almost every jurisdiction, tax is calculated on the post-discount price — that is, after the discount is applied. So a $100 item with 20% off and 8.875% NYC sales tax is: $100 × 0.80 = $80, then $80 × 1.08875 = $87.10 final. The calculator follows this standard order automatically.',
  },
  {
    q: 'What is the difference between markdown and markup?',
    a: 'Markdown is the discount from a higher price to a lower price (sale). Markup is the increase from cost to selling price. A $40 item that originally cost the store $25 has a 60% markup. If it goes on sale for $30, that is a 25% markdown from the regular price. They use the same percentage math but the base price differs — markup uses cost, markdown uses original retail.',
  },
  {
    q: 'Are "% off" and "X% discount" the same thing?',
    a: 'Yes — both mean the price is reduced by that percentage. "30% off" and "30% discount" produce identical math. Watch out for vaguer phrasing like "save up to 30%" (the maximum, not guaranteed) or "30% extra" (which sometimes means "30% bigger product for the same price," not a discount).',
  },
  {
    q: 'How do stacked / sequential discounts work?',
    a: 'They multiply, not add. A 20% discount followed by an additional 10% is not 30% off — it is 1 − (0.80 × 0.90) = 1 − 0.72 = 28% off. The order does not matter mathematically. Retailers often advertise stacked discounts because the numbers sound bigger than the effective combined percentage.',
  },
];

export default function DiscountCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Discount Calculator',
    slug: SLUG,
    description:
      'Free discount calculator — compute sale price, discount amount, and final price with tax. Works with percentage or flat-amount discounts.',
    category: 'UtilitiesApplication',
    featureList:
      'Percentage or flat discount, Tax-aware final price, Quick comparison table, Multi-currency',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Discount Calculator — Sale Price, Savings & Final Cost | Toolisk</title>
        <meta
          name="description"
          content="Free discount calculator. Enter original price and discount % (or flat amount) to see the sale price, savings, and tax-inclusive final cost. Multi-currency."
        />
        <meta
          name="keywords"
          content="discount calculator, sale price calculator, percent off calculator, percentage discount calculator, off calculator, markdown calculator, savings calculator"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Discount Calculator — Sale Price & Savings | Toolisk" />
        <meta
          property="og:description"
          content="Calculate sale price, savings, and final cost with tax in seconds."
        />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        parent="finance"
        icon="🏷️"
        title="Discount Calculator"
        tagline="Sale price, savings, and tax-inclusive final cost — for any percentage or flat-amount discount, in seconds."
        gradient="from-rose-600 via-pink-600 to-fuchsia-600"
      >
        <DiscountCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A no-nonsense discount calculator that handles both percentage discounts ('20% off') and flat-amount discounts ('$15 off'). Add an optional tax rate to see the final out-the-door cost. Works across currencies, with a quick comparison table showing what 10% to 80% off would look like on the same item."
        features={[
          '🏷️ Percentage or flat-amount discounts',
          '🧾 Tax-aware final price (US sales tax, VAT, GST)',
          '💰 Discount amount + savings shown clearly',
          '📊 Quick comparison table (10%–80% off)',
          '💱 Multi-currency (USD, INR, EUR, GBP, AUD, CAD)',
          '💾 PDF / Excel export with all scenarios',
        ]}
        steps={[
          { title: 'Enter original price', desc: 'The pre-discount, pre-tax sticker price.' },
          { title: 'Pick discount mode', desc: '"Discount %" for percentage-off offers, "Flat amount" for fixed-amount-off coupons.' },
          { title: 'Add tax (optional)', desc: 'Use 0% if the price already includes tax, or pick a quick preset.' },
          { title: 'Read your total', desc: 'Final price, savings, and the implied discount % all update live.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The discount math in one paragraph</h2>
            <p className="text-slate-600 leading-relaxed">
              For a percentage discount, the rule is simple: <strong>Final price = Original × (1 − discount %)</strong>. A 30% discount means you pay 70% of the original. For flat-amount discounts, just subtract. When tax is involved, the standard convention is that tax applies after the discount — so the final formula is <strong>Final = Original × (1 − discount %) × (1 + tax %)</strong>. The calculator handles this automatically; you do not need to chain anything by hand.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-2">Discount terminology cheat sheet</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>X% off / X% discount:</strong> Identical — price reduced by X% of original</li>
              <li><strong>Save $X:</strong> Flat amount off the original price</li>
              <li><strong>BOGO (Buy One, Get One):</strong> Equivalent to 50% off on the second item</li>
              <li><strong>Up to X% off:</strong> Maximum, not guaranteed — individual items vary</li>
              <li><strong>Markdown:</strong> Retailer term for a discount applied to a regular price</li>
              <li><strong>MSRP:</strong> Manufacturer's Suggested Retail Price — the reference price before discounts</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-4">Why stacked discounts are not what they sound like</h2>
            <p className="text-slate-600 leading-relaxed">
              When retailers advertise "30% off + extra 20% off," they are stacking — not adding. The two discounts multiply: <strong>1 − (0.70 × 0.80) = 44% effective discount</strong>, not 50%. That is still a great deal, but it is less than the sum of the two percentages. The reason brands phrase it this way: "30% + 20%" sounds bigger than "44%," even though the math says otherwise. Run any stacked discount through this calculator twice — once per discount — to see the true effective rate.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900">
              <strong>Shopping tip:</strong> If you see "extra 20% off all sale items," the 20% applies to the already-discounted price, not the original. Always confirm the "starting price" the second discount applies to before getting excited.
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-2">When a discount is actually a markup</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>"Was X, Now Y":</strong> Always verify the "Was" price was genuinely charged recently — many retailers inflate the original price before the sale</li>
              <li><strong>"Limited time only":</strong> Often perpetually re-extended; the "ending date" is a sales-pressure tactic</li>
              <li><strong>"Compare at $X":</strong> A comparison to MSRP, not the price the store actually charged</li>
              <li><strong>Coupon-stacking required:</strong> If you need three different coupons to hit the advertised discount, that is signaling thin margins on top of inflated pricing</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Sales Tax / VAT / GST', href: '/finance/sales-tax-vat-gst-calculator', icon: '🧾' },
          { name: 'Tip Calculator', href: '/finance/tip-calculator', icon: '🧮' },
          { name: 'Percentage Calculator', href: '/tools/percentage-calculator', icon: '%' },
        ]}
      />
    </>
  );
}
