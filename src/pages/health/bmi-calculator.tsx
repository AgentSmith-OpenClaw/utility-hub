import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const BmiCalculator = dynamic(() => import('../../components/Health/BmiCalculator'), { ssr: false });

const SLUG = '/health/bmi-calculator';

const FAQS = [
  { q: 'What is BMI?', a: 'BMI (Body Mass Index) is a screening metric calculated by dividing weight in kilograms by height in metres squared. It is used to categorise weight status as Underweight (<18.5), Normal (18.5–24.9), Overweight (25–29.9), or Obese (≥30).' },
  { q: 'How do I calculate BMI in imperial units?', a: 'BMI = (weight in lbs × 703) ÷ (height in inches)². Enter your height in feet and inches and your weight in pounds — the calculator converts automatically.' },
  { q: 'What is a healthy BMI?', a: 'According to the WHO, a BMI between 18.5 and 24.9 is considered normal weight for most adults. However, BMI does not account for muscle mass, bone density, or body fat distribution.' },
  { q: 'What is BMR and how is it calculated?', a: 'BMR (Basal Metabolic Rate) is the number of calories your body needs at complete rest. This calculator uses the Mifflin-St Jeor equation: (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5 (male) or −161 (female).' },
  { q: 'What is the healthy weight range for my height?', a: 'The healthy weight range is the weight corresponding to a BMI of 18.5–24.9 for your specific height. The calculator shows this range in kg or lbs automatically.' },
];

export default function BmiCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'BMI Calculator',
    slug: SLUG,
    description: 'Calculate BMI with metric or imperial units. Get your WHO category, healthy weight range, and optional BMR estimate.',
    category: 'UtilitiesApplication',
    featureList: 'BMI calculation, WHO classification, Healthy weight range, BMR estimate (Mifflin-St Jeor), Metric and imperial units',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>BMI Calculator — Body Mass Index with Healthy Weight Range | Toolisk</title>
        <meta name="description" content="Free BMI calculator for metric and imperial units. See your BMI category (WHO), healthy weight range for your height, and optional BMR estimate. 100% browser-based." />
        <meta name="keywords" content="bmi calculator, body mass index calculator, healthy weight calculator, bmi chart, bmi categories, bmr calculator, basal metabolic rate, healthy bmi range, weight calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="BMI Calculator — Body Mass Index & Healthy Weight Range | Toolisk" />
        <meta property="og:description" content="Calculate your BMI with metric or imperial units. Get your WHO category, healthy weight range, and BMR estimate." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="⚖️"
        title="BMI Calculator"
        tagline="Calculate your Body Mass Index, see your WHO category, healthy weight range, and optional BMR."
        parent="health"
        theme="violet"
      >
        <BmiCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A complete BMI calculator that supports both metric (cm/kg) and imperial (ft, in/lbs) units. Computes your Body Mass Index, classifies it using WHO categories, shows the healthy weight range for your height, and optionally estimates your Basal Metabolic Rate using the Mifflin-St Jeor equation."
        features={[
          '📏 Metric (cm/kg) and imperial (ft, in/lbs) support',
          '🏷️ WHO BMI categories with visual gauge',
          '⚖️ Healthy weight range for your height',
          '🔥 BMR estimate via Mifflin-St Jeor equation',
          '⚡ Results update instantly as you type',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Choose your unit system', desc: 'Toggle between Metric (cm/kg) and Imperial (ft, in/lbs) at the top.' },
          { title: 'Enter your height and weight', desc: 'Type your measurements — your BMI and category appear instantly.' },
          { title: 'Optionally add age for BMR', desc: 'Expand the BMR section, enter your age and sex to get your daily calorie baseline.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding your BMI</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              BMI is a widely used screening tool, but it has limitations. It does not distinguish between fat mass and muscle mass, which means athletes may have a high BMI without excess body fat. It also does not account for where fat is distributed in the body — visceral (abdominal) fat is more strongly associated with metabolic risk than subcutaneous fat.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              For most adults, BMI provides a useful first approximation. A result in the overweight or obese range is a prompt to investigate further — not a diagnosis. Your healthcare provider can assess additional factors like waist circumference, blood pressure, blood glucose, and cholesterol to give a fuller picture.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Unit Converter', href: '/utilities/unit-converter', icon: '⚖️' },
          { name: 'Age & Date Calculator', href: '/utilities/age-calculator', icon: '📅' },
          { name: 'Percentage Calculator', href: '/utilities/percentage-calculator', icon: '%' },
        ]}
      />
    </>
  );
}
