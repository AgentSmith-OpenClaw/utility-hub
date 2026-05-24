import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ProteinCalculator = dynamic(() => import('../../components/Health/ProteinCalculator'), { ssr: false });

const SLUG = '/health/protein-calculator';

const FAQS = [
  { q: 'How much protein should I eat per day?', a: 'Protein needs depend on your body weight, activity level, and goals. The general ranges from 0.8g/kg (sedentary) up to 2.0g/kg (extreme athletic training). This calculator adjusts for all three factors.' },
  { q: 'What is the best protein intake for muscle gain?', a: 'For muscle gain, aim for 1.6–2.0g of protein per kg of body weight. This calculator uses 1.6g/kg base for strength training plus an additional 0.3g/kg goal adjustment when you select "Muscle Gain".' },
  { q: 'How much protein do I need for fat loss?', a: 'During fat loss, higher protein intake (1.6–2.0g/kg) helps preserve lean muscle mass while creating a calorie deficit. This calculator adds 0.3g/kg above your activity base when you select "Fat Loss".' },
  { q: 'How should I distribute protein across meals?', a: 'Aim for 25–40g of protein per meal, spaced evenly across 3–5 meals. This calculator shows protein per meal assuming 4 meals. Distributing protein evenly throughout the day maximizes muscle protein synthesis.' },
  { q: 'Is too much protein bad for you?', a: 'For most healthy individuals, up to 2g of protein per kg of body weight is safe. Very high intakes (above 3g/kg) may strain kidneys in susceptible individuals. Consult a healthcare provider if you have kidney disease.' },
];

export default function ProteinCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Protein Calculator',
    slug: SLUG,
    description: 'Calculate your daily protein requirements based on body weight, activity level, and fitness goals. Includes per-meal breakdown and high-protein food list.',
    category: 'UtilitiesApplication',
    featureList: 'Dynamic g/kg multipliers, Activity level selector (6 options), Goal-based adjustments, Protein per meal breakdown, High-protein food list, Comparison to typical intake',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Protein Calculator – Calculate Your Daily Protein Intake | Toolisk</title>
        <meta name="description" content="Find out exactly how much protein you should eat per day based on your weight, activity level, and goals. Includes per-meal breakdown and high-protein food list." />
        <meta name="keywords" content="protein calculator, daily protein intake calculator, how much protein should I eat, protein per day calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Protein Calculator – Calculate Your Daily Protein Intake | Toolisk" />
        <meta property="og:description" content="Find out exactly how much protein you should eat per day based on your weight, activity level, and goals." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🥩"
        title="Protein Calculator"
        tagline="Calculate your daily protein requirements based on body weight, activity level, and fitness goals."
        parent="health"
        theme="violet"
      >
        <ProteinCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Find out exactly how much protein you should eat per day based on your weight, activity level, and goals. Includes per-meal breakdown and high-protein food list."
        features={[
          '⚖️ Metric (kg) and imperial (lbs) support',
          '🏃 6 activity levels with dynamic g/kg multipliers',
          '🎯 Goal adjustments for fat loss and muscle gain',
          '🍽️ Per-meal protein breakdown (4 meals)',
          '📊 Comparison to typical daily intake',
          '🥩 High-protein food sources table',
          '⚡ Results update instantly as you type',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Enter your body weight', desc: 'Choose metric or imperial and type in your current body weight.' },
          { title: 'Select your activity level', desc: 'Pick from 6 activity options — from sedentary to extreme athlete — to set your base protein multiplier.' },
          { title: 'Choose your goal', desc: 'Select Maintain, Fat Loss, or Muscle Gain to adjust your protein target above the activity base.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why protein matters</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Protein is essential for building and repairing muscle, producing enzymes and hormones, and supporting immune function. The Institute of Medicine recommends adults consume 0.8g of protein per kg of body weight daily, but this baseline is designed for sedentary individuals. Active people, especially those doing strength or endurance training, need substantially more.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Spreading protein evenly across 3–5 meals maximizes muscle protein synthesis. Research suggests consuming 25–40g per meal is optimal for most people. Whey protein, chicken, fish, eggs, Greek yogurt, and legumes are excellent sources to help you hit your daily target.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Macro Calculator', href: '/health/macro-calculator', icon: '🥗' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'TDEE Calculator', href: '/health/tdee-calculator', icon: '⚡' },
          { name: 'Body Fat Calculator', href: '/health/body-fat-calculator', icon: '📊' },
        ]}
      />
    </>
  );
}