import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CalorieCalculator = dynamic(() => import('../../components/Health/CalorieCalculator'), { ssr: false });

const SLUG = '/health/calorie-calculator';

const FAQS = [
  { q: 'What is BMR?', a: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest. This calculator uses the Mifflin-St Jeor equation: (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5 for men or −161 for women.' },
  { q: 'What is TDEE?', a: 'TDEE (Total Daily Energy Expenditure) is your BMR multiplied by your activity factor. It estimates how many calories you burn each day including all activities.' },
  { q: 'How do the goal adjustments work?', a: 'For weight loss, a deficit of 500 kcal/day is applied (~3,500 kcal/week ≈ 1 lb). For muscle gain, a surplus of 300 kcal/day supports muscle growth while minimizing fat gain.' },
  { q: 'What activity factor should I use?', a: 'Choose based on your weekly exercise: sedentary (desk job, little/no exercise) = 1.2×; lightly active (1–3 days/week) = 1.375×; moderately active (3–5 days/week) = 1.55×; very active (6–7 days/week) = 1.725×; extra active (very hard training or physical job) = 1.9×.' },
  { q: 'What macro split does this calculator use?', a: 'The standard split is 30% protein, 40% carbs, and 30% fat. Protein is set at ~1.6–2.2g per kg bodyweight for muscle preservation; the calculator shows targets based on your calculated calorie intake.' },
  { q: 'Is this tool suitable for medical or clinical use?', a: 'No. This calculator provides estimates only. Individual calorie needs vary due to genetics, hormone function, gut health, and other factors. Always consult a healthcare professional for personalized advice.' },
];

export default function CalorieCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Calorie Calculator',
    slug: SLUG,
    description: 'Calculate your daily calorie needs based on age, weight, height, sex, and activity level using the Mifflin-St Jeor equation. Supports goal-based planning for weight loss, maintenance, and muscle gain.',
    category: 'UtilitiesApplication',
    featureList: 'BMR calculation (Mifflin-St Jeor), TDEE with activity multipliers, Goal-based calorie targets (lose/maintain/gain), Macro split recommendations, Metric and imperial units',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Calorie Calculator – Calculate Your Daily Calorie Needs | Toolisk</title>
        <meta name="description" content="Calculate how many calories you should eat per day based on your age, weight, height, sex, and activity level. Supports weight loss, maintenance, and muscle gain goals." />
        <meta name="keywords" content="calorie calculator, daily calorie intake, how many calories should I eat, tdee calculator, bmr calculator, macros calculator, weight loss calculator, muscle gain calories" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Calorie Calculator – Calculate Your Daily Calorie Needs | Toolisk" />
        <meta property="og:description" content="Calculate how many calories you should eat per day based on your age, weight, height, sex, and activity level. Supports weight loss, maintenance, and muscle gain goals." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🔥"
        title="Calorie Calculator"
        tagline="Calculate your daily calorie needs with goal-based planning for weight loss, maintenance, or muscle gain."
        parent="health"
        theme="violet"
      >
        <CalorieCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate how many calories you should eat per day using the Mifflin-St Jeor BMR equation multiplied by your activity factor. Set your goal — lose, maintain, or gain — and get your personalized daily calorie target and macro split."
        features={[
          '📏 Metric (cm/kg) and imperial (ft, in/lbs) support',
          '🔥 BMR via Mifflin-St Jeor equation',
          '⚡ TDEE with 5 activity level multipliers',
          '🎯 Goal-based targets: −500 kcal loss, TDEE maintenance, +300 kcal surplus',
          '🥗 Macro split recommendations (protein / carbs / fat)',
          '⚡ Results update instantly as you type',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Enter your details', desc: 'Select your unit system, enter your sex, age, height, and weight.' },
          { title: 'Choose activity level', desc: 'Pick the activity level that best matches your weekly exercise routine.' },
          { title: 'Select your goal', desc: 'Choose Lose, Maintain, or Gain to see your personalized daily calorie target.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How calorie targets are calculated</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              This calculator uses the <strong>Mifflin-St Jeor equation</strong> to estimate your Basal Metabolic Rate (BMR) — the calories your body burns at complete rest. Your BMR is then multiplied by an activity factor to give your Total Daily Energy Expenditure (TDEE), which accounts for all your daily movement and exercise.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              For <strong>weight loss</strong>, a deficit of 500 kcal/day is applied, which typically produces a ~1 lb weight loss per week. For <strong>muscle gain</strong>, a surplus of 300 kcal/day provides extra energy for muscle synthesis while minimizing fat accumulation. <strong>Maintenance</strong> uses your TDEE directly.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The macro split shown (30% protein, 40% carbs, 30% fat) is a balanced starting point. Athletes or those with specific body composition goals may adjust their ratios with guidance from a registered dietitian.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Body Fat Calculator', href: '/health/body-fat-calculator', icon: '📊' },
          { name: 'Macro Calculator', href: '/health/macro-calculator', icon: '🥗' },
        ]}
      />
    </>
  );
}