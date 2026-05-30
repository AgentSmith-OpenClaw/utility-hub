import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PaceCalculator = dynamic(() => import('../../components/Health/PaceCalculator'), { ssr: false });

const SLUG = '/health/pace-calculator';

const FAQS = [
  { q: 'How do I use a pace calculator?', a: 'Enter your distance and your target time. The calculator shows your pace per km and per mile, your speed in km/h and mph, and estimated splits for common race distances at that same pace.' },
  { q: 'What pace do I need for a sub-4-hour marathon?', a: 'A 4-hour marathon requires a pace of approximately 5:41 per km (9:09 per mile). Enter 42.2 km and 4:00:00 in the calculator to see the exact pace and all split times.' },
  { q: 'What are negative splits?', a: 'Negative splits means running the second half of a race faster than the first half. Most world records are set with negative splits. If you are training for a race, practice running at or slightly slower than your target pace for the first half, then speed up.' },
  { q: 'Should I train at my race pace?', a: 'Most of your training should be at an easy conversational pace (60–75% effort). Only 10–20% of weekly mileage should be at race pace or faster. Use the calculator to find your easy pace — add 60–90 seconds per km to your race pace for recovery and long runs.' },
  { q: 'How accurate are the split estimates?', a: 'The split times assume a perfectly even pace throughout the race. In reality, most runners slow slightly in the second half. Use the splits as a pacing guide for the first half of your race — if you hit the split at the calculated time, you are on track.' },
];

export default function PaceCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Running Pace Calculator',
    slug: SLUG,
    description: 'Calculate your running pace per km and mile from any distance and time. Get speed and estimated splits for 5K, 10K, half marathon, and marathon.',
    category: 'UtilitiesApplication',
    featureList: 'Pace per km/mile, Speed in kmh/mph, Split times for 400m to marathon, Quick presets for 5K 10K Half Marathon',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Running Pace Calculator — Pace per Mile &amp; per KM | Toolisk</title>
        <meta name="description" content="Free running pace calculator. Enter your distance and time to see pace per km, pace per mile, speed, and estimated splits for 5K, 10K, half marathon, and marathon. No sign-up." />
        <meta name="keywords" content="pace calculator, running pace calculator, marathon pace calculator, pace per mile, pace per km, split calculator, race pace, 5k pace, 10k pace, half marathon pace" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Running Pace Calculator — Pace per Mile & per KM | Toolisk" />
        <meta property="og:description" content="Calculate your running pace from any distance and time. See speed, km/mile splits, and race projections." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🏃"
        title="Running Pace Calculator"
        tagline="Calculate your pace per mile and per km from any distance and time."
        parent="health"
        theme="violet"
      >
        <PaceCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Enter any distance and time — a 5K, a marathon, last Sunday's long run, or a Strava segment. The calculator shows your pace per km and per mile, your speed in km/h and mph, and estimated splits for 400m, 800m, 1K, 5K, 10K, half marathon, and marathon distances at the same pace. Quick presets for common race distances let you jump straight to the numbers."
        features={[
          'Pace per km and per mile from any distance/time',
          'Speed display in km/h and mph',
          'Split times for 400m to marathon distances',
          'Quick presets for 5K, 10K, half, and full marathon',
          'km and mile unit toggle',
        ]}
        steps={[
          { title: 'Choose your unit', desc: 'Toggle between km and miles. The calculator auto-switches the distance default.' },
          { title: 'Enter distance and time', desc: 'Type your distance and time in the input fields. Use the quick preset buttons for common races.' },
          { title: 'Read your pace', desc: 'See your pace per km and per mile, your speed, and projected split times for every standard race distance at that pace.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why pace matters more than speed</h2>
            <p className="text-slate-600 leading-relaxed">
              Speed tells you how fast you are going at one moment. Pace tells you how fast you need to go over a distance. For runners, pace is the actionable number — it is what you see on your watch, what you train to, and what you use to pace a race. Speed (km/h or mph) is useful for treadmill settings, but pace (minutes per km or mile) is the universal running metric.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The calculator shows both. Enter a recent race or training run time, note your pace, and use it to set your training zones: add 60–90 seconds per km for easy runs, subtract 10–15 seconds for tempo runs, and subtract 20–30 seconds for interval pace.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Target Heart Rate Calculator', href: '/health/heart-rate-calculator', icon: '❤️' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
        ]}
      />
    </>
  );
}
