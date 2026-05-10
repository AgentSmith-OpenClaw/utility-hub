import Head from 'next/head';
import UnitConverter from '../../components/Tools/UnitConverter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/unit-converter';

const FAQS = [
  { q: 'How do I convert miles to kilometers?', a: '1 mile = 1.60934 kilometers. To convert, multiply the number of miles by 1.60934. For example, 10 miles = 16.09 km. Use the Length category and select Mile (from) and Kilometer (to).' },
  { q: 'How do I convert Fahrenheit to Celsius?', a: 'Use the formula: °C = (°F − 32) × 5/9. For example, 72°F = (72 − 32) × 5/9 = 22.2°C. The Temperature category handles this automatically.' },
  { q: 'How do I convert pounds to kilograms?', a: '1 pound (lb) = 0.453592 kilograms. To convert, multiply by 0.453592. For example, 150 lbs = 68.04 kg.' },
  { q: 'What units are supported?', a: 'Length (km, m, cm, mm, mile, yard, foot, inch, nautical mile), Weight (kg, g, mg, ton, lb, oz, stone), Temperature (°C, °F, K), Volume (L, mL, m³, US gallon, UK gallon, cup, fl oz, tbsp, tsp), Area (m², km², cm², ha, acre, mi², ft², yd²), and Speed (m/s, km/h, mph, knot, ft/s).' },
  { q: 'How accurate are the conversions?', a: 'All conversion factors are based on official SI and US customary definitions. Results are shown to 8 significant figures, which is more than sufficient for everyday use. Scientific or engineering work may need additional precision.' },
];

export default function UnitConverterPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Unit Converter',
    slug: SLUG,
    description: 'Convert between units of length, weight, temperature, volume, area, and speed. 50+ units across 6 categories.',
    category: 'UtilitiesApplication',
    featureList: 'Length, Weight, Temperature, Volume, Area, Speed, 50+ units, Instant conversion',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Unit Converter — Length, Weight, Temperature, Volume & More | Toolisk</title>
        <meta name="description" content="Convert between 50+ units across length, weight, temperature, volume, area, and speed. Instant results with all conversions shown at once. Free, browser-based." />
        <meta name="keywords" content="unit converter, length converter, weight converter, temperature converter, miles to km, fahrenheit to celsius, pounds to kg, volume converter, area converter" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Unit Converter | Toolisk" />
        <meta property="og:description" content="Convert between 50+ units of length, weight, temperature, volume, area, and speed instantly." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="⚖️" title="Unit Converter" tagline="Convert between 50+ units of length, weight, temperature, volume, area, and speed — all in one place.">
        <UnitConverter />
      </ToolShell>

      <ToolSEOContent
        description="A comprehensive unit converter covering 6 categories and 50+ units: length (metric and imperial), mass/weight, temperature (Celsius, Fahrenheit, Kelvin), volume (liters, gallons, cups, teaspoons), area (m², acres, hectares), and speed (km/h, mph, knots). All conversions happen in the browser."
        features={[
          '📏 Length — metric, imperial, nautical',
          '⚖️ Weight — kg, g, lb, oz, stone',
          '🌡️ Temperature — Celsius, Fahrenheit, Kelvin',
          '🧪 Volume — L, mL, gallons, cups, teaspoons',
          '🗺️ Area — m², km², acres, hectares',
          '💨 Speed — m/s, km/h, mph, knots',
        ]}
        steps={[
          { title: 'Select a category', desc: 'Choose from Length, Weight, Temperature, Volume, Area, or Speed.' },
          { title: 'Pick from and to units', desc: 'Select the units you are converting between using the dropdowns.' },
          { title: 'Enter a value', desc: 'Type in your number and the result appears immediately.' },
          { title: 'See all conversions', desc: 'Scroll down to see the input value converted to every unit in the category at once.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Metric vs imperial — when it matters</h2>
            <p className="text-slate-600 leading-relaxed">
              The United States is one of three countries still using the imperial system for everyday measurements. If you travel, cook international recipes, follow scientific papers, or work with international teams, you will frequently need to convert between systems.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Cooking:</strong> US recipes use cups and teaspoons; European recipes use grams and milliliters</li>
              <li><strong>Travel:</strong> highway speeds in km/h vs mph, body weight in kg vs lbs</li>
              <li><strong>Weather:</strong> Fahrenheit for US audiences, Celsius for the rest of the world</li>
              <li><strong>Real estate:</strong> square feet (US) vs square meters (most other countries)</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Percentage Calculator', href: '/tools/percentage-calculator', icon: '%' },
          { name: 'CSS Unit Converter', href: '/tools/css-unit-converter', icon: '📐' },
          { name: 'Aspect Ratio Calculator', href: '/tools/aspect-ratio', icon: '🖼️' },
        ]}
      />
    </>
  );
}
