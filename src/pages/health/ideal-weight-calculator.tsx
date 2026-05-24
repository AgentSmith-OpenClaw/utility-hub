import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const IdealWeightCalculator = dynamic(() => import('../../components/Health/IdealWeightCalculator'), { ssr: false });

const SLUG = '/health/ideal-weight-calculator';

const FAQS = [
  { q: 'What is the ideal weight formula?', a: 'The ideal weight calculator uses four doctor-developed formulas: Devine (1974), Robinson (1983), Miller (1983), and Hamwi (1964). Each formula uses height and sex to estimate a healthy body weight, though they produce slightly different results.' },
  { q: 'Why do the formulas give different results?', a: 'Each researcher used different study populations and statistical methods when developing their formula. The variation between results represents the uncertainty in estimating an "ideal" weight from height alone. A range rather than a single number is often more useful.' },
  { q: 'Which formula is most accurate?', a: 'No single formula is universally more accurate than others. The Hamwi and Devine formulas tend to produce lower estimates, while Miller tends to be higher. All are simplified estimates that cannot account for muscle mass, bone density, age, or body composition.' },
  { q: 'Does muscle mass affect ideal weight?', a: 'Yes. Muscle is denser than fat, so a muscular person may weigh more but have less body fat. These formulas cannot distinguish between fat mass and lean mass, which is why athletes often find these estimates underestimate their healthy weight.' },
];

export default function IdealWeightCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Ideal Weight Calculator',
    slug: SLUG,
    description: 'Find your ideal body weight using four doctor-developed formulas — Devine, Robinson, Miller, and Hamwi. Compare results across all methods.',
    category: 'UtilitiesApplication',
    featureList: 'Height-based ideal weight calculation, Four formula comparison (Devine, Robinson, Miller, Hamwi), Metric and imperial unit support, Male and female formulas, Average and range display',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Ideal Weight Calculator – Compare Devine, Robinson, Miller & Hamwi Formulas</title>
        <meta name="description" content="Find your ideal body weight using four doctor-developed formulas. See side-by-side comparison of Devine, Robinson, Miller, and Hamwi methods." />
        <meta name="keywords" content="ideal weight calculator, ideal body weight calculator, devine formula, robinson formula, healthy weight for height" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🎯" title="Ideal Weight Calculator" tagline="Find your ideal body weight using four doctor-developed formulas" parent="health" theme="violet">
        <IdealWeightCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Find your ideal body weight using four doctor-developed formulas — Devine, Robinson, Miller, and Hamwi. Compare all results side-by-side."
        features={[
          'Four evidence-based formulas in one tool',
          'Side-by-side comparison of all results',
          'Average and range calculation',
          'Metric and imperial unit support',
          'Male and female specific formulas',
        ]}
        steps={[
          { title: 'Enter your height', desc: 'Input your height in centimeters (metric) or feet and inches (imperial).' },
          { title: 'Select your biological sex', desc: 'Choose male or female — this changes the formula coefficients used for each method.' },
          { title: 'View all results', desc: 'See all four formula results at once, plus the average and range across all methods.' },
        ]}
        faqs={FAQS}
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Body Fat Calculator', href: '/health/body-fat-calculator', icon: '📐' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
        ]}
      />
    </>
  );
}