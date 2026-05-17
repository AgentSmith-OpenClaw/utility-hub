import Head from 'next/head';
import PercentageCalculator from '../../components/Utilities/PercentageCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/utilities/percentage-calculator';

const FAQS = [
  { q: 'How do I calculate X% of Y?', a: 'Multiply Y by X and divide by 100. For example, 20% of 150 = (150 × 20) ÷ 100 = 30. In the tool, enter 20 in the percentage field and 150 in the total field.' },
  { q: 'How do I find what percentage X is of Y?', a: 'Divide X by Y and multiply by 100. For example, 30 is what percent of 150? (30 ÷ 150) × 100 = 20%. Use the second calculator on this page.' },
  { q: 'How do I calculate percentage change?', a: 'Percentage change = ((New Value - Old Value) / |Old Value|) × 100. A positive result is an increase; negative is a decrease. The tool labels these as percent change from one value to another.' },
  { q: 'How do I add a percentage to a number?', a: 'Multiply the number by (1 + percentage/100). For example, adding 15% to $100 = $100 × 1.15 = $115. To subtract 15%, multiply by 0.85.' },
  { q: 'How is sales tax calculated?', a: 'Multiply the pre-tax price by (1 + tax rate/100). A $50 item with 8.5% sales tax = $50 × 1.085 = $54.25.' },
];

export default function PercentageCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Percentage Calculator',
    slug: SLUG,
    description: 'Calculate percentages — X% of Y, what percent X is of Y, percent change, and add/subtract percentages.',
    category: 'UtilitiesApplication',
    featureList: 'Percent of number, What percent is X of Y, Percent change, Add/subtract percent',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Percentage Calculator — X% of Y, Percent Change & More | Toolisk</title>
        <meta name="description" content="Free percentage calculator. Find X% of a number, calculate what percent X is of Y, compute percent change, and add or subtract percentages. Instant results." />
        <meta name="keywords" content="percentage calculator, percent of number, percentage change, percent increase decrease, what percent is x of y, add percentage, sales tax calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Percentage Calculator | Toolisk" />
        <meta property="og:description" content="Calculate percentages instantly — X% of Y, percent change, add/subtract percent, and more." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="%" title="Percentage Calculator" tagline="Find X% of Y, calculate percent change, add tips and discounts — four calculators in one." parent="utilities" theme="amber">
        <PercentageCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A four-in-one percentage calculator covering the most common everyday math: finding a percentage of a number, expressing one number as a percentage of another, calculating percent increase or decrease, and adding or subtracting a percentage from a value."
        features={[
          '🔢 X% of Y — find the part',
          '📊 X is what % of Y — find the rate',
          '📈 Percent change — increase or decrease',
          '➕ Add or subtract a percentage',
          '⚡ All results update instantly',
          '📋 Copy any result with one click',
        ]}
        steps={[
          { title: 'Choose a calculation type', desc: 'Pick from four common percentage problems shown side by side.' },
          { title: 'Enter your values', desc: 'Type numbers into the input fields — results appear instantly.' },
          { title: 'Copy the result', desc: 'Click the copy icon next to any result to use it elsewhere.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Common percentage calculations</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Restaurant tips:</strong> 15%, 18%, or 20% of the bill</li>
              <li><strong>Retail discounts:</strong> 25% off the original price</li>
              <li><strong>Sales tax:</strong> add 6–10% to the pre-tax amount</li>
              <li><strong>Investment returns:</strong> percent change from purchase to current price</li>
              <li><strong>Grade calculation:</strong> score as a percentage of total points</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Unit Converter', href: '/utilities/unit-converter', icon: '⚖️' },
          { name: 'Age Calculator', href: '/utilities/age-calculator', icon: '📅' },
          { name: 'Aspect Ratio Calculator', href: '/tools/aspect-ratio', icon: '📐' },
        ]}
      />
    </>
  );
}
