import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const TdeeCalculator = dynamic(() => import('../../components/Health/TdeeCalculator'), { ssr: false });

const SLUG = '/health/tdee-calculator';

const FAQS = [
  { q: 'What is TDEE?', a: 'TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including all physical activity. It is calculated by taking your BMR (Basal Metabolic Rate) and multiplying it by an activity factor.' },
  { q: 'How is TDEE calculated?', a: 'This calculator uses the Mifflin-St Jeor equation to estimate BMR: (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5 for males or −161 for females. The BMR is then multiplied by an activity factor (1.2–1.9) to get TDEE.' },
  { q: 'What is BMR?', a: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest — just to maintain basic functions like breathing, circulation, and cell production. It accounts for 60–75% of your total daily energy expenditure.' },
  { q: 'How do I choose my activity level?', a: 'Be honest about your typical week. Sedentary means office work with little exercise. Lightly active means light exercise 1–3 days. Moderately active means 3–5 days of moderate workouts. Very active means 6–7 days of hard training. Extremely active means a physical job plus daily hard exercise.' },
  { q: 'How accurate is TDEE?', a: 'TDEE is an estimate. Actual expenditure varies based on muscle mass, hormones, medical conditions, and other factors. Use it as a starting point for nutrition planning, not an exact number. Most people find it accurate within ±10%.' },
  { q: 'Should I eat more or less than my TDEE?', a: 'To lose weight, eat below your TDEE (typically 300–500 kcal deficit). To gain weight or build muscle, eat above it. A registered dietitian can help you set appropriate targets based on your specific goals.' },
];

export default function TdeeCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'TDEE Calculator',
    slug: SLUG,
    description: 'Calculate your Total Daily Energy Expenditure using your BMR and activity level. See exactly how many calories you burn per day.',
    category: 'UtilitiesApplication',
    featureList: 'BMR calculation via Mifflin-St Jeor, 5 activity levels with detailed descriptions, Visual BMR vs Activity breakdown chart, Metric and imperial unit support, Comparison to average male/female intake',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>TDEE Calculator – Calculate Your Total Daily Energy Expenditure</title>
        <meta name="description" content="Find out exactly how many calories you burn each day with our TDEE calculator. Uses your BMR and activity level to give accurate daily energy expenditure." />
        <meta name="keywords" content="tdee calculator, total daily energy expenditure, daily calorie burn calculator, how many calories do I burn" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="TDEE Calculator – Calculate Your Total Daily Energy Expenditure" />
        <meta property="og:description" content="Find out exactly how many calories you burn each day with our TDEE calculator. Uses your BMR and activity level to give accurate daily energy expenditure." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="⚡"
        title="TDEE Calculator"
        tagline="Calculate exactly how many calories you burn per day — your basal metabolic rate plus activity level."
        parent="health"
        theme="violet"
      >
        <TdeeCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your Total Daily Energy Expenditure (TDEE) accurately. This calculator uses the Mifflin-St Jeor equation for BMR and five detailed activity levels to give you a precise daily calorie burn. See a visual breakdown of BMR vs activity calories, compare to average intakes, and plan your nutrition with confidence."
        features={[
          '📏 Metric (cm/kg) and imperial (ft, in/lbs) support',
          '🔥 BMR via Mifflin-St Jeor equation',
          '🏃 5 activity levels with detailed descriptions',
          '📊 Visual breakdown: BMR vs Activity calories',
          '⚖️ Comparison to average male (2,500) and female (2,000) intake',
          '⚡ Results update instantly as you type',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Enter your details', desc: 'Type your age, sex, height, and weight. Toggle between metric and imperial units.' },
          { title: 'Select your activity level', desc: 'Choose the option that best matches your typical week — from sedentary office work to extremely active with a physical job.' },
          { title: 'Read your TDEE', desc: 'See your total daily calorie needs, the BMR at rest, and the calories from activity. Use it to plan your nutrition.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding TDEE</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Total Daily Energy Expenditure (TDEE) is the most accurate estimate of how many calories you burn in a day. Unlike a simple calorie calculator that just guesses, TDEE starts with your actual Basal Metabolic Rate — the calories your body burns at complete rest — then adds the calories burned through activity.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The activity multiplier is key. A sedentary person multiplies their BMR by 1.2, while an extremely active person multiplies by 1.9 — almost 60% more calories. This is why two people of the same height and weight can have very different daily energy needs.
            </p>
            <h3 className="text-lg font-bold text-slate-800 mt-6">Why TDEE matters</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              If you are trying to lose weight, you need to eat less than your TDEE. If you are trying to build muscle, you need to eat more. Eating at exactly your TDEE is maintenance. Most people find a 300–500 kcal daily deficit effective for steady, sustainable fat loss — losing about 0.5–1 kg per week.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'BMR Calculator', href: '/health/bmr-calculator', icon: '📊' },
          { name: 'Macro Calculator', href: '/health/macro-calculator', icon: '🥗' },
        ]}
      />
    </>
  );
}