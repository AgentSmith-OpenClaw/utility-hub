import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const BmrCalculator = dynamic(() => import('../../components/Health/BmrCalculator'), { ssr: false });

const SLUG = '/health/bmr-calculator';

const FAQS = [
  { q: 'What is BMR?', a: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest — just to maintain basic functions like breathing, circulation, and cell production.' },
  { q: 'How is BMR calculated?', a: 'This calculator uses the Mifflin-St Jeor equation: BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5 for men, or −161 for women. It is considered one of the most accurate BMR formulas for most people.' },
  { q: 'What is the difference between BMR and TDEE?', a: 'BMR is the calories burned at complete rest. TDEE (Total Daily Energy Expenditure) multiplies BMR by an activity factor (1.2–1.9) to estimate total calories burned including activity. TDEE is what most calorie goals are based on.' },
  { q: 'What is body surface area (BSA)?', a: 'BSA is calculated using the DuBois formula: 0.007184 × weight^0.425 × height^0.725. It is used in medical contexts such as drug dosing and estimating cardiac output.' },
  { q: 'Is BMR the same for everyone?', a: 'No. BMR is influenced by muscle mass, thyroid conditions, age, sex, genetics, and temperature. This calculator provides an estimate based on the Mifflin-St Jeor equation.' },
];

export default function BmrCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'BMR Calculator',
    slug: SLUG,
    description: 'Calculate your Basal Metabolic Rate using the Mifflin-St Jeor equation. See how many calories your body burns at complete rest, body surface area, and comparison to average.',
    category: 'UtilitiesApplication',
    featureList: 'BMR calculation (Mifflin-St Jeor), Body Surface Area (DuBois formula), Visual BMR spectrum bar, Comparison to average BMR, Metric and imperial units, Sex-specific formulas',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>BMR Calculator – Calculate Your Basal Metabolic Rate</title>
        <meta name="description" content="Calculate how many calories your body burns at complete rest using the Mifflin-St Jeor equation. Understand your baseline energy needs." />
        <meta name="keywords" content="bmr calculator, basal metabolic rate calculator, how many calories at rest, men bmr, women bmr" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="BMR Calculator – Calculate Your Basal Metabolic Rate" />
        <meta property="og:description" content="Calculate how many calories your body burns at complete rest using the Mifflin-St Jeor equation." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🔥"
        title="BMR Calculator"
        tagline="Calculate your Basal Metabolic Rate using the Mifflin-St Jeor equation — the calories your body burns at complete rest."
        parent="health"
        theme="violet"
      >
        <BmrCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your Basal Metabolic Rate (BMR) using the scientifically validated Mifflin-St Jeor equation. See how many calories your body needs at complete rest, body surface area via the DuBois formula, and how your BMR compares to average values for your sex."
        features={[
          '🔥 Mifflin-St Jeor equation — most accurate BMR formula',
          '📐 Body Surface Area (DuBois formula)',
          '📊 Visual BMR spectrum bar with 5 levels',
          '⚖️ Comparison to average BMR (men ~1700, women ~1400)',
          '📏 Metric (cm/kg) and imperial (ft, in/lbs) support',
          '⚡ Results update instantly as you type',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Select your unit system', desc: 'Toggle between Metric (cm/kg) and Imperial (ft, in/lbs) at the top.' },
          { title: 'Enter your details', desc: 'Select your biological sex, enter your age, height, and weight.' },
          { title: 'Get your BMR', desc: 'Your Basal Metabolic Rate is displayed prominently along with BSA, a visual spectrum bar, and comparison to average.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What is Basal Metabolic Rate?</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Your Basal Metabolic Rate (BMR) is the number of calories your body requires to maintain basic life functions — breathing, circulation, cell production, and nutrient absorption — while at complete rest. It accounts for roughly 60–75% of your total daily energy expenditure.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The Mifflin-St Jeor equation, used in this calculator, was published in 1990 and is considered the most accurate BMR formula for most non-athletic adults. It takes into account your weight, height, age, and sex — the four variables most strongly correlated with metabolic rate.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              To estimate your total daily calorie needs (TDEE), multiply your BMR by an activity multiplier: 1.2 for sedentary, 1.375 for lightly active, 1.55 for moderately active, 1.725 for very active, and 1.9 for extra active.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'TDEE Calculator', href: '/health/tdee-calculator', icon: '⚡' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
        ]}
      />
    </>
  );
}