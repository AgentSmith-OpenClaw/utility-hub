import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const WaterIntakeCalculator = dynamic(() => import('../../components/Health/WaterIntakeCalculator'), { ssr: false });

const SLUG = '/health/water-intake-calculator';

const FAQS = [
  { q: 'How much water should I drink per day?', a: 'A common recommendation is 30–35 mL per kg of body weight. For a 70 kg adult, that works out to roughly 2.1–2.5 litres per day. Your exact needs depend on activity level, climate, and health goals.' },
  { q: 'How does exercise affect water needs?', a: 'Plan to add 250–500 mL of water for every 30 minutes of exercise, depending on intensity. Sweating during physical activity increases fluid loss, so athletes and highly active people often need significantly more than sedentary individuals.' },
  { q: 'Does hot weather increase how much water I should drink?', a: 'Yes. In hot climates your body loses water through perspiration to regulate temperature. An extra 250 mL per day is a typical adjustment for hot environments, though very hot or humid conditions may require more.' },
  { q: 'Does water intake change if I am trying to lose or gain weight?', a: 'Weight-loss goals often increase water needs by about 20%, as adequate hydration supports metabolism and helps the body utilise fat for energy. Muscle-gain goals typically add about 15%, since building muscle tissue requires water.' },
  { q: 'How many cups of water should I drink per meal?', a: 'Dividing your daily target by 4 gives a rough per-meal guide. For a 2 400 mL daily target, that is about 600 mL per meal — roughly 2.5 standard 8 oz cups.' },
];

export default function WaterIntakeCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Water Intake Calculator',
    slug: SLUG,
    description: 'Calculate how much water you should drink daily based on weight, activity level, climate, and health goals.',
    category: 'UtilitiesApplication',
    featureList: 'Body weight in kg or lbs, Activity level selector, Exercise minutes input, Hot/cold climate adjustment, Goal-based adjustment, Per-meal breakdown, Glass tracker visualisation',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Water Intake Calculator – Calculate Your Daily Hydration Needs | Toolisk</title>
        <meta name="description" content="Find out how much water you should drink per day based on your weight, activity level, and climate. Includes per-meal breakdown and glass tracker." />
        <meta name="keywords" content="water intake calculator, daily water intake, how much water should I drink, hydration calculator, daily hydration needs, water goal calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Water Intake Calculator – Calculate Your Daily Hydration Needs | Toolisk" />
        <meta property="og:description" content="Find out how much water you should drink per day based on your weight, activity level, and climate." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="💧"
        title="Water Intake Calculator"
        tagline="Calculate how much water you should drink daily based on your weight, activity level, climate, and health goals."
        parent="health"
        theme="violet"
      >
        <WaterIntakeCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your optimal daily water intake using your body weight, activity level, exercise minutes, climate, and fitness goal. Includes per-meal breakdown and a visual glass tracker."
        features={[
          '⚖️ Weight in kg or lbs with unit toggle',
          '🏃 Activity level selector (sedentary to athlete)',
          '💪 Exercise minutes input with auto-adjustment',
          '🌡️ Climate adjustment (temperate, hot, cold)',
          '🎯 Goal-based calculation (maintain, lose, gain)',
          '🥛 Per-meal breakdown across 4 meals',
          '🥛 Visual glass tracker with 4 animated cups',
          '⚡ Instant results as you type',
          '🔒 100% browser-based — no data stored',
        ]}
        steps={[
          { title: 'Enter your body weight', desc: 'Use the toggle to switch between kilograms and pounds, then enter your weight.' },
          { title: 'Set your activity level', desc: 'Choose the option that best matches your daily activity from sedentary through to athlete.' },
          { title: 'Add exercise and climate', desc: 'Enter your daily exercise minutes and select your typical climate.' },
          { title: 'Choose your goal', desc: 'Select maintain, lose weight, or gain muscle to adjust your target accordingly.' },
          { title: 'Review your results', desc: 'See your daily target in mL and cups, per-meal breakdown, and the glass tracker.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why hydration matters</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Water is essential for virtually every bodily function — from regulating temperature and transporting nutrients to lubricating joints and supporting cognitive performance. Even mild dehydration can impair concentration, increase fatigue, and affect mood.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              While the classic "8 glasses a day" rule is a useful starting point, individual needs vary considerably. Athletes, people in hot climates, those with higher body weight, and people pursuing fat loss or muscle gain typically need more than the average person. This calculator adjusts for those variables to give you a more personalised target.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Drinking water throughout the day — rather than all at once — supports better absorption. Spreading intake across 4 meals is a practical strategy to hit your target without overwhelming your digestive system.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Sleep Calculator', href: '/health/sleep-calculator', icon: '😴' },
        ]}
      />
    </>
  );
}