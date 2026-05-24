import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CalorieDeficitCalculator = dynamic(() => import('../../components/Health/CalorieDeficitCalculator'), { ssr: false });

const SLUG = '/health/calorie-deficit-calculator';

const FAQS = [
  { q: 'How does a calorie deficit work?', a: 'A calorie deficit occurs when you consume fewer calories than your body burns each day. This forces your body to use stored fat for energy, leading to weight loss. A deficit of 3,500 kcal equals approximately 1 lb of body fat.' },
  { q: 'What is a safe calorie deficit for weight loss?', a: 'A deficit of 250–750 kcal per day is generally considered sustainable and safe for most people. A 500 kcal/day deficit leads to about 1 lb of weight loss per week. Deficits above 1,000 kcal/day may cause muscle loss, nutrient deficiencies, and metabolic slowdown.' },
  { q: 'How long will it take to reach my goal weight?', a: 'The time depends on your current weight, goal weight, and daily deficit. For example, a 500 kcal/day deficit with a 20 lb goal takes roughly 20 weeks. Use the calculator above to get a personalized projection.' },
  { q: 'Should I eat back the calories I burn from exercise?', a: 'It depends on your goal. Eating back exercise calories can sometimes stall weight loss if estimates are inaccurate. If you prefer to eat back calories, use a conservative estimate and monitor your weight trend over 2–3 weeks before adjusting.' },
  { q: 'Is 1000 kcal deficit too aggressive?', a: 'Yes, a 1,000 kcal/day deficit is generally considered aggressive and is not appropriate for most people. It may lead to muscle loss, fatigue, nutrient deficiencies, gallstones, and a slower metabolism. Consult a healthcare provider for personalized guidance.' },
];

export default function CalorieDeficitCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Calorie Deficit Calculator',
    slug: SLUG,
    description: 'Calculate how long it will take to reach your goal weight with a calorie deficit. See projected weekly weight loss and timeline to goal.',
    category: 'UtilitiesApplication',
    featureList: 'Calorie deficit calculation, Weekly weight loss projection, Weight curve chart, Goal timeline estimation, Deficit comparison table, Metric and imperial units',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Calorie Deficit Calculator – Calculate Your Weight Loss Timeline | Toolisk</title>
        <meta name="description" content="Calculate exactly how long it will take to reach your goal weight with our calorie deficit calculator. See projected weekly weight loss and timeline to goal." />
        <meta name="keywords" content="calorie deficit calculator, weight loss timeline calculator, how long to lose weight, calorie deficit for weight loss, weekly weight loss calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Calorie Deficit Calculator – Calculate Your Weight Loss Timeline | Toolisk" />
        <meta property="og:description" content="Calculate exactly how long it will take to reach your goal weight. See projected weekly weight loss and timeline to goal." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="📉"
        title="Calorie Deficit Calculator"
        tagline="Calculate how long it will take to reach your goal weight based on your daily calorie deficit."
        parent="health"
        theme="violet"
      >
        <CalorieDeficitCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Our calorie deficit calculator uses the rule that 3,500 kcal equals approximately 1 lb of body fat. Enter your current weight, goal weight, and daily deficit to see your projected weekly weight loss and timeline to reach your goal."
        features={[
          '⚖️ Current and goal weight in kg or lbs',
          '📉 Daily deficit selector: 250 / 500 / 750 / 1000 kcal',
          '📊 Line chart showing projected weight over time',
          '⏱️ Time-to-goal estimate in weeks and months',
          '🔢 Total calorie deficit needed to reach goal',
          '⚠️ Warning for aggressive deficits over 1000 kcal/day',
          '📋 Side-by-side comparison of all four deficit options',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Enter your current weight', desc: 'Select metric (kg) or imperial (lbs) and enter your current body weight.' },
          { title: 'Set your goal weight', desc: 'Enter your target weight. The calculator will immediately show how far you need to go.' },
          { title: 'Choose your daily calorie deficit', desc: 'Pick a deficit of 250, 500, 750, or 1000 kcal/day. Higher deficits mean faster results but require more discipline.' },
          { title: 'Review your projection', desc: 'See your estimated weekly loss, time to goal, weight curve, and a comparison against other deficit levels.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How the calorie deficit calculator works</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              The calculator uses a well-established rule: 3,500 kcal of energy is approximately equal to 1 lb of body fat. If you maintain a daily deficit of 500 kcal, you will lose roughly 1 lb per week (500 × 7 = 3,500). The projections account for the fact that weight loss often slows over time as your body adapts, but use a linear model for simplicity.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The chart shows your projected weight at weeks 4, 8, 12, 16, 20, and beyond until you reach your goal. The comparison table lets you see how choosing a 250 kcal/day deficit versus 1,000 kcal/day affects your timeline — the difference is often striking.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Percentage Calculator', href: '/utilities/percentage-calculator', icon: '%' },
          { name: 'Unit Converter', href: '/utilities/unit-converter', icon: '⚖️' },
        ]}
      />
    </>
  );
}