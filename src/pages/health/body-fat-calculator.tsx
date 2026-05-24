import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const BodyFatCalculator = dynamic(() => import('../../components/Health/BodyFatCalculator'), { ssr: false });

const SLUG = '/health/body-fat-calculator';

const FAQS = [
  {
    q: 'How is body fat percentage measured?',
    a: 'This calculator uses two methods: the US Navy method uses neck, waist, and hip measurements in a regression formula. The BMI-based method estimates body fat from your BMI, age, and sex. Neither method is as accurate as DEXA scans or hydrostatic weighing, but both provide useful estimates.',
  },
  {
    q: 'What is a healthy body fat percentage?',
    a: 'For men, 6–17% is considered fitness/athletic range, 18–24% is average, and 25%+ is in the obese range. For women, 14–20% is athletic, 21–31% is average, and 32%+ is obese. Essential fat (needed for organ function) is 2–5% for men and 10–13% for women.',
  },
  {
    q: 'Should I use the Navy method or BMI-based method?',
    a: 'The US Navy method is generally more accurate because it uses circumference measurements that correlate with fat distribution. The BMI-based method is a rougher estimate useful when you only have weight and height. If you can take the measurements accurately, use the Navy method.',
  },
  {
    q: 'What is the difference between fat mass and lean mass?',
    a: 'Fat mass is the weight of all body fat. Lean mass includes muscles, bones, organs, and water. Knowing both helps you understand your body composition beyond just weight — two people with the same weight can have very different fat vs lean ratios.',
  },
  {
    q: 'How do I measure my waist and neck accurately?',
    a: 'Use a flexible tape measure (like a tailoring tape). For neck, measure the narrowest point below the Adam\'s apple. For waist, stand relaxed and measure at navel height (men) or the narrowest point (women). Keep the tape parallel to the floor and snug but not compressing skin.',
  },
];

export default function BodyFatCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Body Fat Calculator',
    slug: SLUG,
    description: 'Estimate your body fat percentage using the US Navy method or BMI-based formula. Get your fat mass, lean mass, and body fat category.',
    category: 'UtilitiesApplication',
    featureList: 'Body fat % via US Navy method, BMI-based estimation fallback, Fat mass and lean mass breakdown, Male and female categories, Metric and imperial units, Visual body fat gauge',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Body Fat Calculator – Calculate Your Body Fat Percentage | Toolisk</title>
        <meta name="description" content="Estimate your body fat percentage using the US Navy method or BMI formula. Find your category — athletes, fitness, average, or obese — and see your fat mass vs lean mass." />
        <meta name="keywords" content="body fat calculator, body fat percentage calculator, navy body fat calculator, how to measure body fat, body fat categories, lean mass calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Body Fat Calculator – Calculate Your Body Fat Percentage | Toolisk" />
        <meta property="og:description" content="Estimate your body fat percentage using the US Navy method or BMI formula. See your fat mass vs lean mass and body fat category." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="📐"
        title="Body Fat Calculator"
        tagline="Estimate your body fat percentage using the US Navy method or BMI formula. See your fat mass, lean mass, and category."
        parent="health"
        theme="violet"
      >
        <BodyFatCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Estimate your body fat percentage using the US Navy circumference method or a BMI-based fallback formula. Get your body fat category (Essential, Athletes, Fitness, Average, or Obese), fat mass, and lean mass in both metric and imperial units. Visual gauge shows where you fall on the body fat spectrum."
        features={[
          '📏 US Navy Method with neck, waist, hip measurements',
          '⚖️ BMI-based fallback when measurements unavailable',
          '🧍 Male and female category ranges',
          '⚡ Instant results as you type',
          '📊 Visual body fat gauge',
          '⚖️ Fat mass and lean mass breakdown',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Choose your method', desc: 'Select US Navy Method for higher accuracy or BMI-based if you only have height and weight.' },
          { title: 'Enter your measurements', desc: 'For Navy method: enter height, weight, neck, waist, and hip (women only). For BMI method: enter height, weight, and age.' },
          { title: 'Read your results', desc: 'See your body fat percentage, category, fat mass, and lean mass with a visual gauge.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding body fat percentage</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Body fat percentage is the proportion of your total body weight that is fat tissue. Unlike BMI, which only uses height and weight, body fat measurement accounts for the actual composition of your body. Two people at the same weight can have dramatically different fat percentages — a muscular athlete may score as overweight on BMI while having very low body fat.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The US Navy method (also called the US Navy circumference method) was developed by the US Navy in the 1980s as a practical way to estimate body fat without expensive equipment. It uses a series of circumference measurements combined with height in a regression equation. While not as accurate as DEXA scans or hydrostatic weighing, it provides a reasonable population-level estimate for most people.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'Ideal Weight Calculator', href: '/health/ideal-weight-calculator', icon: '🏋️' },
          { name: 'TDEE Calculator', href: '/health/tdee-calculator', icon: '📊' },
        ]}
      />
    </>
  );
}