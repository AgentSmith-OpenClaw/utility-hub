import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const BacCalculator = dynamic(() => import('../../components/Health/BacCalculator'), { ssr: false });

const SLUG = '/health/bac-calculator';

const FAQS = [
  {
    q: 'How is BAC calculated?',
    a: 'This calculator uses the Widmark formula: BAC = (A × 5.14 / (W × r)) − 0.015 × H, where A is total alcohol in ounces, W is body weight in pounds, r is the distribution factor (0.68 for men, 0.55 for women), and H is hours since first drink.',
  },
  {
    q: 'What is a standard drink?',
    a: 'A standard drink in the US contains approximately 0.6 oz of pure alcohol, which is found in: 12 oz of beer (5% alcohol), 5 oz of wine (12% alcohol), or 1.5 oz of spirits (40% alcohol). This calculator treats all three as one standard drink.',
  },
  {
    q: 'When will I be legally sober?',
    a: 'The calculator estimates time to reach 0.00% BAC using an average metabolism rate of 0.015 BAC/hr. However, alcohol metabolism varies significantly between individuals based on genetics, liver function, food intake, medications, and other factors. Always err on the side of caution.',
  },
  {
    q: 'What is the legal BAC limit for driving?',
    a: 'In most US states, the legal limit is 0.08%. Many countries have lower limits: 0.05% in Australia, Germany, and Japan; 0.02% in Sweden, Norway, Russia, and China. Commercial drivers typically face stricter limits.',
  },
  {
    q: 'Can BAC continue to rise after I stop drinking?',
    a: 'Yes. Because alcohol must be absorbed through the stomach and small intestine before entering the bloodstream, BAC can continue to rise for 30–90 minutes after your last drink, depending on how much food is in your stomach.',
  },
  {
    q: 'Does food affect BAC?',
    a: 'Yes. Eating food, especially carbohydrates and fats, slows alcohol absorption, lowering peak BAC compared to drinking on an empty stomach. This is why the calculator factors in time — the longer the drinking period, the more your body processes alcohol.',
  },
];

export default function BacCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'BAC Calculator',
    slug: SLUG,
    description: 'Estimate your blood alcohol content based on drinks consumed, body weight, gender, and time. See when you will be legally sober.',
    category: 'UtilitiesApplication',
    featureList: 'BAC estimation via Widmark formula, Visual color-coded gauge, Time to legally sober countdown, Warning when above 0.08%, Legal BAC limits by country, Support for metric and imperial units',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>BAC Calculator – Estimate Your Blood Alcohol Content</title>
        <meta name="description" content="Calculate your estimated blood alcohol content and find out when you will be legally sober. See how long alcohol stays in your system." />
        <meta name="keywords" content="bac calculator, blood alcohol calculator, bac level calculator, how long does alcohol stay in system, drunk calculator, bac chart, bac limit" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="BAC Calculator – Estimate Your Blood Alcohol Content" />
        <meta property="og:description" content="Calculate your estimated blood alcohol content and find out when you will be legally sober." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🍺"
        title="BAC Calculator"
        tagline="Estimate your blood alcohol content, see when you will be legally sober, and compare legal limits worldwide."
        parent="health"
        theme="violet"
      >
        <BacCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Estimate your blood alcohol content using the Widmark formula. Enter your weight, sex, number of drinks, and time to see your estimated BAC, a color-coded gauge, and how long until you are legally sober. Includes legal BAC limits for major countries."
        features={[
          '📊 Widmark formula BAC estimation',
          '🎨 Color-coded visual gauge (Sober → Very High)',
          '⏱️ Time to reach 0.00% (legally sober) countdown',
          '⚠️ Driving warning when above 0.08% BAC',
          '🌍 Legal BAC limits in 10+ countries',
          '⚖️ Weight in lbs or kg',
          '🍺 Standard drink reference (beer, wine, spirits)',
          '🔒 100% browser-based — no data stored',
        ]}
        steps={[
          { title: 'Enter your details', desc: 'Select your sex and enter your body weight in lbs or kg.' },
          { title: 'Add your drinks', desc: 'Set the number of standard drinks consumed — use the +/− buttons or type directly.' },
          { title: 'Set the time', desc: 'Enter how long you took to consume those drinks and the total time since your first drink.' },
          { title: 'Read your BAC', desc: 'See your estimated BAC, the color-coded gauge, how long until you are sober, and compare legal limits worldwide.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">About the Widmark Formula</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              The BAC calculator uses the Widmark formula, one of the most widely used methods for estimating blood alcohol content. The formula accounts for the total alcohol consumed, body weight, and a gender-specific distribution factor (men have a higher proportion of body water than women, diluting alcohol more effectively). The result is then reduced by a standard metabolism rate of 0.015 BAC per hour.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The estimates provided by this tool are approximations. Actual BAC can vary significantly based on individual factors including genetics (particularly the ADH and ALDH enzyme variants), liver health, whether you ate food, medications, hydration status, and even menstrual cycle phase. This tool is intended for educational purposes only — never use it to decide whether it is safe to drive after drinking.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'Sleep Calculator', href: '/health/sleep-calculator', icon: '😴' },
        ]}
      />
    </>
  );
}