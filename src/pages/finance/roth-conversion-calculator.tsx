import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

const RothConversionCalculator = dynamic(
  () => import('../../components/RothConversion/RothConversionCalculator'),
  { ssr: false },
);

const SLUG = '/finance/roth-conversion-calculator';

const FAQS = [
  {
    q: 'When does a Roth conversion make financial sense?',
    a: "A Roth conversion is most beneficial when your current marginal tax rate is lower than your expected rate at retirement. Common situations: you've had a low-income year, you're between jobs, or you retired early before Social Security and RMDs kick in. It also makes sense if you expect tax rates to rise generally, or if you want to reduce future Required Minimum Distributions (RMDs) — which only apply to pre-tax accounts.",
  },
  {
    q: "What's the difference between paying tax from outside cash vs. withholding from the conversion?",
    a: "If you pay the conversion tax from outside savings, the full converted amount ends up in your Roth — you've effectively added that tax payment to your Roth balance as untaxed principal. If you withhold from the conversion, the taxable amount is the full conversion but only (conversion − tax) lands in Roth. This is significantly worse mathematically, especially before age 59½ when the withheld portion may also incur a 10% early withdrawal penalty. Always pay from outside cash if possible.",
  },
  {
    q: 'Does a Roth conversion affect Medicare premiums or Social Security?',
    a: "Yes. Roth conversion income counts toward Modified Adjusted Gross Income (MAGI), which determines Medicare IRMAA surcharges (two-year lookback) and what percentage of Social Security benefits are taxable. A large conversion in a single year can trigger a premium surcharge that lasts two years. Many advisors recommend 'partial conversions' — converting enough each year to stay just below a Medicare IRMAA threshold or Social Security taxation cliff.",
  },
  {
    q: 'Can I undo a Roth conversion?',
    a: "No. The Tax Cuts and Jobs Act (TCJA) of 2017 eliminated the 'recharacterization' option for Roth conversions — what you convert stays converted. Previously you could undo a conversion if the Roth account value fell after converting; that's no longer available. This makes timing more important: don't convert right before a market decline if you can avoid it.",
  },
];

export default function RothConversionCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Roth Conversion Calculator',
    slug: SLUG,
    description: 'Calculate the federal + state tax cost of a Roth conversion and compare the after-tax future value vs staying in a Traditional IRA. 2026 tax brackets.',
    category: 'FinanceApplication',
    featureList: '2026 federal tax brackets, Incremental conversion tax, Roth vs Traditional future value, Bracket fill visualization, Pay-from-outside vs withhold comparison, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Roth Conversion Calculator (2026 Tax Brackets) | Toolisk</title>
        <meta name="description" content="Calculate the tax cost of converting a Traditional IRA or 401(k) to Roth. Compare after-tax future value using 2026 federal brackets. Free." />
        <meta name="keywords" content="roth conversion calculator, traditional to roth, roth ira conversion tax, roth conversion 2026, roth vs traditional, roth conversion ladder" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Roth Conversion Calculator" />
        <meta property="og:description" content="See the tax cost of your Roth conversion and whether converting beats staying Traditional." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Roth Conversion Calculator | Toolisk" />
        <meta name="twitter:description" content="2026 tax brackets, bracket fill visualization, and Roth vs Traditional future value comparison." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <p className="text-center text-xs text-slate-500 py-2 bg-amber-50 border-b border-amber-100">Estimates only — not tax advice. Consult a CPA or tax advisor for your specific situation.</p>
      <RothConversionCalculator />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a Roth Conversion and Why Does It Matter?</h2>
          <p className="text-slate-600 mb-3">A Roth conversion moves money from a pre-tax retirement account (Traditional IRA, 401(k), 403(b)) to a Roth IRA. The converted amount is added to your taxable income in the conversion year — you pay ordinary income tax now — but from that point forward, the money grows tax-free and qualified withdrawals are completely tax-free in retirement.</p>
          <p className="text-slate-600 mb-3">The core financial decision is a tax-rate bet: you're comparing your <em>current</em> marginal rate against your <em>expected</em> rate at withdrawal. If you expect to be in a higher bracket in retirement (due to Social Security, RMDs, other income), converting now — at today's lower rate — can save substantial money over time. If you expect to be in a lower bracket later, conversion is harder to justify.</p>
          <p className="text-slate-600">This calculator makes that comparison explicit. It computes the exact dollar tax cost of converting at today's 2026 federal brackets, shows which brackets the conversion fills, and then projects both the Roth and Traditional paths forward — using your expected return and retirement tax rate — to show which strategy produces more after-tax wealth.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How the Conversion Tax Is Calculated</h2>
          <p className="text-slate-600 mb-3">The conversion amount stacks on top of your other ordinary income. This calculator uses the <strong>stacked-bracket method</strong>: it computes federal tax on your other income alone, then computes federal tax on (other income + conversion amount), and takes the difference. This gives the exact incremental tax attributable to the conversion — without overstating it by applying a flat marginal rate to the whole amount.</p>
          <p className="text-slate-600 mb-3">For example, if you have $95,000 of other income (single filer) and convert $100,000, the conversion spans the 22% bracket ($103,350 ceiling for single) and crosses into the 24% bracket. The calculator breaks down exactly how much falls in each bracket, so you can see whether converting $80,000 instead of $100,000 keeps you inside a lower bracket.</p>
          <p className="text-slate-600">State tax is added as a flat rate on the full conversion amount (simplified approximation). Several states — Florida, Texas, Nevada, and others — have no state income tax. California and New York have high progressive rates that significantly affect the conversion math.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Worked Example</h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-slate-700 mb-2"><strong>Scenario:</strong> Single filer, $95,000 other income, $100,000 conversion, pay from outside cash, 5% state rate, 15-year horizon, 7% return, 22% retirement tax rate.</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Federal tax on $195,000 − Federal tax on $95,000 = incremental federal conversion tax (spans 22% and 24% brackets)</li>
              <li>State tax = $100,000 × 5% = $5,000</li>
              <li>Total conversion tax ≈ $26,800</li>
              <li>Full $100,000 lands in Roth (paid from outside cash)</li>
              <li>Roth at year 15: $100,000 × (1.07)^15 ≈ <strong>$275,900</strong> (fully tax-free)</li>
              <li>Traditional at year 15: $100,000 × (1.07)^15 × (1 − 22%) = <strong>$215,200</strong> after retirement tax</li>
              <li>Net benefit of converting: $275,900 − $215,200 = <strong>$60,700</strong></li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="font-semibold text-slate-800 mb-2">{f.q}</h3>
                <p className="text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Related Calculators</h2>
          <ul className="space-y-2 text-slate-600">
            <li><Link href="/finance/rmd-calculator" className="text-indigo-600 hover:underline">RMD Calculator</Link> — Project future Required Minimum Distributions from pre-tax accounts.</li>
            <li><Link href="/finance/hsa-calculator" className="text-indigo-600 hover:underline">HSA Calculator</Link> — Another triple-tax-advantaged retirement strategy.</li>
            <li><Link href="/finance/capital-gains-tax-calculator" className="text-indigo-600 hover:underline">Capital Gains Tax Calculator</Link> — Plan investment sales alongside Roth conversions.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
