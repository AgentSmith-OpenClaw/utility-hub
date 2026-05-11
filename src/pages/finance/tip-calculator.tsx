import Head from 'next/head';
import TipCalculator from '../../components/Finance/TipCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/tip-calculator';

const FAQS = [
  { q: 'How much should I tip in the US?', a: 'Standard US tipping is 18–20% on the pre-tax bill at sit-down restaurants. 15% is the minimum acceptable; 20%+ for great service. Bartenders typically get $1–2 per drink or 20% of the tab. Takeout is appreciated at 10% but not required.' },
  { q: 'How much should I tip in Europe?', a: 'Tipping in Europe varies but is generally lower than the US. In most countries (France, Italy, Spain, Germany), 5–10% is generous if a service charge isn\'t already added. In the UK, 10–15% is standard at sit-down restaurants if no service charge.' },
  { q: 'Should I tip on tax?', a: 'Technically no — tips should be on the pre-tax bill. Tipping on the post-tax total adds about 1–2% extra (depending on local sales tax) and is sometimes done out of habit or simplicity. Either is acceptable, but on the pre-tax amount is the technically correct convention.' },
  { q: 'What about automatic gratuity for large groups?', a: 'Many US restaurants automatically add 18–20% gratuity for parties of 6 or 8+. Check the bill carefully — a separate tip on top of the auto-gratuity is double-paying. Most servers will not expect additional tip if auto-gratuity is included.' },
  { q: 'Is tipping expected in Australia?', a: 'No — tipping is not expected in Australia. Servers are paid a living wage. A 10% tip for excellent service is appreciated but not required. Same in New Zealand and most Asian countries (notable exception: parts of China and Hong Kong).' },
];

export default function TipCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Tip Calculator',
    slug: SLUG,
    description: 'Calculate restaurant tips and split bills. Multi-currency with regional tipping etiquette guides for US, UK, EU, Australia, Canada, and India.',
    category: 'UtilitiesApplication',
    featureList: 'Tip percent quick buttons, Bill splitting, Round-up option, Regional etiquette, Multi-currency',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Tip Calculator — Split Bills with Regional Tipping Etiquette | Toolisk</title>
        <meta name="description" content="Free tip calculator with bill splitting and regional tipping etiquette for US, UK, Europe, Australia, Canada, and India. Multi-currency with round-up option." />
        <meta name="keywords" content="tip calculator, restaurant tip calculator, bill split calculator, gratuity calculator, tipping etiquette, how much to tip" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Tip Calculator | Toolisk" />
        <meta property="og:description" content="Calculate tips, split bills, and learn regional tipping norms." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="🧮" title="Tip Calculator" tagline="Calculate the tip, split the bill, and get regional tipping etiquette in one place." gradient="from-pink-600 via-rose-600 to-red-600">
        <TipCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A bill calculator that does more than the math — also shows you the local tipping convention for the country you're in. Quick percent buttons (15%, 18%, 20%, 25%), a slider for custom percentages, bill splitting between any number of people, and a round-up-to-the-dollar option."
        features={[
          '⚡ Quick tip buttons (0%, 10%, 15%, 18%, 20%, 22%, 25%)',
          '👥 Split bills between any number of people',
          '🔄 Round up total to the nearest whole currency unit',
          '🌍 Regional tipping etiquette for 6 currencies',
          '💰 Multi-currency: USD, EUR, GBP, AUD, CAD, INR',
          '📋 Copy any value (bill, tip, total, per-person)',
        ]}
        steps={[
          { title: 'Enter the bill', desc: 'Pre-tax amount is the standard convention; post-tax also works.' },
          { title: 'Pick a tip %', desc: 'Use a quick button or the slider for a custom amount.' },
          { title: 'Split between people', desc: 'For group meals, set the number of people to get per-person totals.' },
          { title: 'Toggle round-up', desc: 'For a clean cash payment, round the total up to the nearest dollar.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Tipping by country — quick reference</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>🇺🇸 United States:</strong> 18–20% sit-down, 10% takeout, 20%+ for great service</li>
              <li><strong>🇨🇦 Canada:</strong> 15–20% sit-down, similar to US norms</li>
              <li><strong>🇬🇧 United Kingdom:</strong> 10–12.5% if no service charge added (often included in London)</li>
              <li><strong>🇪🇺 Europe:</strong> 5–10% extra is generous (service often included in bill)</li>
              <li><strong>🇦🇺 Australia / 🇳🇿 New Zealand:</strong> Optional, 10% only for excellent service</li>
              <li><strong>🇮🇳 India:</strong> 5–10% if no service charge included (10% common at upscale restaurants)</li>
              <li><strong>🇯🇵 Japan:</strong> Do not tip — can be considered insulting</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Sales Tax / VAT / GST', href: '/finance/sales-tax-vat-gst-calculator', icon: '🧾' },
          { name: 'Percentage Calculator', href: '/tools/percentage-calculator', icon: '%' },
          { name: 'Unit Converter', href: '/tools/unit-converter', icon: '⚖️' },
        ]}
      />
    </>
  );
}
