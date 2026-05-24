import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const HeartRateCalculator = dynamic(() => import('../../components/Health/HeartRateCalculator'), { ssr: false });

const SLUG = '/health/heart-rate-calculator';

const FAQS = [
  { q: 'How is max heart rate calculated?', a: 'This calculator uses the Tanaka formula: 208 − (0.7 × age). Research shows this is more accurate than the traditional 220 − age formula, especially for people over 30.' },
  { q: 'What is the Karvonen formula?', a: 'The Karvonen formula (heart rate reserve method) calculates target heart rate zones by accounting for your resting heart rate: Target HR = (Heart Rate Reserve × %intensity) + Resting HR. Heart Rate Reserve = Max HR − Resting HR.' },
  { q: 'What is a normal resting heart rate?', a: 'For adults, a normal resting heart rate is 60–100 bpm. Well-trained athletes often have lower resting heart rates (40–60 bpm) due to better cardiovascular fitness. Measuring resting HR first thing in the morning gives the most accurate reading.' },
  { q: 'Which zone should I train in?', a: 'Most adults benefit from spending most of their exercise time in the Light to Moderate zones (50–70% intensity) for building aerobic base. Higher intensity zones (Hard, Maximum, All-Out) should be used sparingly and progressively.' },
  { q: 'Are heart rate zones the same for everyone?', a: 'No. Heart rate zones are individualised based on your age and resting heart rate using the Karvonen formula. They can also be affected by medications (especially beta-blockers), fitness level, altitude, and health conditions.' },
];

export default function HeartRateCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Target Heart Rate Calculator',
    slug: SLUG,
    description: 'Calculate your target heart rate zones for exercise using the Karvonen formula. Find your fat burn, cardio, and peak training zones.',
    category: 'UtilitiesApplication',
    featureList: 'Max heart rate (Tanaka formula), Heart rate reserve calculation, 5 target heart rate zones, Zone descriptions and training guidance, Optional resting heart rate input',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Target Heart Rate Calculator – Find Your Exercise Heart Rate Zones | Toolisk</title>
        <meta name="description" content="Calculate your target heart rate zones for exercise using the Karvonen formula. Find your fat burn, cardio, and peak training zones based on your age and resting heart rate." />
        <meta name="keywords" content="target heart rate calculator, heart rate zone calculator, karvonen formula calculator, max heart rate calculator, exercise heart rate zones, fat burn zone, cardio zone" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Target Heart Rate Calculator – Find Your Exercise Heart Rate Zones | Toolisk" />
        <meta property="og:description" content="Calculate your target heart rate zones for exercise using the Karvonen formula. Find your fat burn, cardio, and peak training zones." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="❤️"
        title="Target Heart Rate Calculator"
        tagline="Find your personal exercise heart rate zones using the Karvonen formula — from fat burn to peak performance."
        parent="health"
        theme="violet"
      >
        <HeartRateCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your personal target heart rate zones for different exercise intensities using the scientifically-validated Karvonen (heart rate reserve) formula. Enter your age and resting heart rate to see your fat burn, aerobic, threshold, VO2 max, and peak zones with bpm ranges and training guidance."
        features={[
          '❤️ Max heart rate using Tanaka formula (208 − 0.7 × age)',
          '📊 Heart rate reserve calculation via Karvonen method',
          '🎯 5 target zones with bpm ranges: Light, Moderate, Hard, Maximum, All-Out',
          '📖 Per-zone training descriptions for each intensity level',
          '⚡ Results update instantly as you type',
          '🔒 100% browser-based — no data is sent anywhere',
        ]}
        steps={[
          { title: 'Enter your age', desc: 'Type your age in years. Your max heart rate is calculated automatically using the Tanaka formula.' },
          { title: 'Optionally add resting heart rate', desc: 'For more accurate zones, enter your resting heart rate (ideally measured first thing in the morning). Default is 70 bpm.' },
          { title: 'Review your zones', desc: 'See your 5 target heart rate zones with bpm ranges and training guidance for each intensity level.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding Heart Rate Zones</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Heart rate zone training is a proven method for structuring exercise intensity. By training in different zones, you can target specific physiological adaptations — from fat burning and aerobic endurance to anaerobic power and VO2 max.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              This calculator uses the <strong>Karvonen formula</strong> (also called the heart rate reserve method), which is more personalised than simple percentage-of-max approaches because it accounts for your resting heart rate. The formula: Target HR = (Heart Rate Reserve × %intensity) + Resting HR.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The <strong>Tanaka formula</strong> (208 − 0.7 × age) is used for max heart rate, as research shows it is more accurate than the traditional 220 − age formula, especially for adults over 30.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'TDEE Calculator', href: '/health/tdee-calculator', icon: '⚡' },
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
        ]}
      />
    </>
  );
}