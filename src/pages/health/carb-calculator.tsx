import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CarbCalculator = dynamic(() => import('../../components/Health/CarbCalculator'), { ssr: false });

const SLUG = '/health/carb-calculator';

const FAQS = [
  { q: 'How many carbs should I eat per day?', a: 'It depends on your goals and activity level. For a standard balanced diet, 45–55% of total calories from carbs is common — roughly 225–330g for a 2000 calorie diet. Athletes or very active people may need more. Always consult a healthcare provider for personalized advice.' },
  { q: 'What is the difference between total carbs and net carbs?', a: 'Total carbs include all carbohydrate types — starch, sugar, and fiber. Net carbs equal total carbs minus fiber, and are commonly used in ketogenic diets because fiber has minimal impact on blood sugar and ketosis.' },
  { q: 'Is low-carb the same as keto?', a: 'No. Low-carb typically means 25–35% of calories from carbs (about 125–175g on a 2000 calorie diet), while ketogenic diets restrict carbs to 5–10% (about 25–50g) to induce ketosis. Keto is a subset of low-carb with a much stricter carb limit.' },
  { q: 'How is fiber recommendation calculated?', a: 'This calculator uses the general guideline of 14g of fiber per 1000 calories consumed. For example, a 2000 calorie diet would target approximately 28g of fiber per day, which aligns with general dietary recommendations.' },
  { q: 'Do I need to count carbs exactly?', a: 'For most people, aiming for a range rather than precise counting is sufficient. If you have specific goals like weight loss, diabetes management, or athletic performance, more precise tracking may be helpful. A registered dietitian can help you find the right approach.' },
  { q: 'What foods should I avoid on a low-carb diet?', a: 'High-sugar foods, refined grains, starchy vegetables (potatoes, corn), legumes, and sugary beverages are typically limited. Focus on non-starchy vegetables, quality proteins, and healthy fats while monitoring total carbohydrate intake.' },
];

export default function CarbCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Carb Calculator',
    slug: SLUG,
    description: 'Calculate your daily carbohydrate intake based on calorie needs and dietary preference — standard, low-carb, or ketogenic.',
    category: 'UtilitiesApplication',
    featureList: 'Carbohydrate calculation for Standard (45-55%), Low-Carb (25-35%), and Keto (5-10%) diets, TDEE calculation via Mifflin-St Jeor, Manual calorie entry mode, Net carbs for keto mode, Fiber recommendation (14g per 1000 kcal), Visual macro breakdown with progress bars, Common high-carb foods reference list, Metric and imperial unit support',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Carb Calculator – Calculate Your Daily Carbohydrate Intake</title>
        <meta name="description" content="Calculate how many carbs you should eat per day based on your calorie needs. Supports standard, low-carb, and keto diet plans." />
        <meta name="keywords" content="carb calculator, daily carb intake calculator, low carb calculator, how many carbs per day, keto carb calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Carb Calculator – Calculate Your Daily Carbohydrate Intake" />
        <meta property="og:description" content="Calculate how many carbs you should eat per day based on your calorie needs. Supports standard, low-carb, and keto diet plans." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🍞"
        title="Carb Calculator"
        tagline="Calculate your daily carbohydrate intake based on calorie needs and dietary preference — standard, low-carb, or ketogenic."
        parent="health"
        theme="violet"
      >
        <CarbCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate how many carbohydrates you should eat per day based on your calorie needs. Supports standard, low-carb, and ketogenic diet plans with personalized recommendations and a visual macro breakdown."
        features={[
          '📊 Three diet profiles: Standard (45–55%), Low-Carb (25–35%), Keto (5–10%)',
          '🔥 TDEE calculation via Mifflin-St Jeor equation',
          '✏️ Manual calorie entry option for flexible planning',
          '🔢 Net carbs display for keto mode (total carbs minus fiber)',
          '🌾 Fiber recommendation at 14g per 1000 kcal',
          '📏 Metric (cm/kg) and imperial (ft, in/lbs) unit support',
          '📋 Common high-carb foods reference list with serving sizes',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Choose your calorie source', desc: 'Use TDEE calculation (enter age, sex, height, weight, activity) or enter your daily calorie target manually.' },
          { title: 'Select your diet profile', desc: 'Pick Standard, Low-Carb, or Keto to set your carbohydrate percentage range.' },
          { title: 'Review your results', desc: 'See your total daily carbs, net carbs (for keto), fiber target, and full macro breakdown with visual progress bars.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How carb recommendations are calculated</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              This calculator determines your carbohydrate needs in two ways. In <strong>TDEE mode</strong>, it first estimates your Basal Metabolic Rate using the Mifflin-St Jeor equation, then applies an activity multiplier to get your Total Daily Energy Expenditure. In <strong>manual mode</strong>, you enter your calorie target directly.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Once calories are established, the calculator applies the selected diet profile percentage: <strong>Standard (50%)</strong>, <strong>Low-Carb (30%)</strong>, or <strong>Keto (7.5%)</strong>. These represent the midpoint of each range for balanced calculation. Carbs are valued at 4 kcal per gram, which is used consistently across all diet plans.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              For <strong>keto users</strong>, net carbs are displayed as total carbohydrates minus fiber, which is the more relevant metric when following a strict low-carb diet. Fiber is also separately recommended at 14g per 1000 calories consumed — a general guideline that supports digestive health and satiety.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'Macro Calculator', href: '/health/macro-calculator', icon: '🍽️' },
          { name: 'Keto Calculator', href: '/health/keto-calculator', icon: '🥑' },
          { name: 'TDEE Calculator', href: '/health/tdee-calculator', icon: '⚡' },
        ]}
      />
    </>
  );
}