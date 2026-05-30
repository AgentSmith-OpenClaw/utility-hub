import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SleepCalculator = dynamic(() => import('../../components/Health/SleepCalculator'), { ssr: false });

const SLUG = '/health/sleep-calculator';

const FAQS = [
  { q: 'How does the sleep cycle calculator work?', a: 'It divides your sleep into 90-minute cycles, the average length of one full sleep cycle. It adds 15 minutes for the average time it takes to fall asleep. It then calculates when to go to bed (if you set a wake-up time) or when to wake up (if you set a bedtime) so you wake up between cycles rather than mid-cycle.' },
  { q: 'Why is waking up between sleep cycles important?', a: 'Waking up in the middle of deep sleep causes sleep inertia — that groggy, disoriented feeling that can last an hour. Waking up between cycles (during lighter sleep) helps you feel more refreshed and alert.' },
  { q: 'How many sleep cycles do I need?', a: 'Most adults need 4–6 cycles per night (6–9 hours). Four cycles (6 hours) is the minimum. Five cycles (7.5 hours) is optimal for most people. Six cycles (9 hours) is beneficial during high stress or intense training.' },
  { q: 'Is 15 minutes to fall asleep accurate?', a: 'It is an average. If you consistently fall asleep in under 5 minutes, you may be sleep-deprived. If it takes over 30 minutes, that may indicate insomnia or anxiety. Adjust the calculator\'s assumption mentally — if you typically take 20 minutes, aim for the time 5 minutes earlier.' },
  { q: 'Does this work for shift workers?', a: 'Yes. Set the wake-up time to whatever time you need to wake up. The sleep cycle principle is the same regardless of when you go to bed. Consistency matters more than the specific clock time.' },
];

export default function SleepCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Sleep Calculator',
    slug: SLUG,
    description: 'Calculate the best time to go to bed or wake up based on 90-minute sleep cycles. Avoid grogginess by waking between cycles.',
    category: 'UtilitiesApplication',
    featureList: 'Sleep cycle calculation, Bedtime calculator, Wake-up time calculator, 90-minute cycle tracking, Fall-asleep time adjustment',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Sleep Calculator — Best Bedtime &amp; Wake-Up Time | Toolisk</title>
        <meta name="description" content="Free sleep calculator based on 90-minute sleep cycles. Enter when you need to wake up or go to bed and get the optimal times to feel rested. No sign-up." />
        <meta name="keywords" content="sleep calculator, sleep cycle calculator, bedtime calculator, wake up time calculator, REM cycle, best time to sleep, sleep tracker" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Sleep Calculator — Best Bedtime & Wake-Up Time | Toolisk" />
        <meta property="og:description" content="Calculate when to sleep or wake up based on 90-minute sleep cycles. Avoid waking up groggy." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="😴"
        title="Sleep Calculator"
        tagline="Calculate the best time to go to bed or wake up based on 90-minute sleep cycles."
        parent="health"
        theme="violet"
      >
        <SleepCalculator />
      </ToolShell>

      <ToolSEOContent
        description="This sleep calculator uses the average sleep cycle length of 90 minutes to tell you exactly when to go to bed or when to set your alarm. Add 15 minutes to fall asleep, and it calculates the ideal window so you wake up between cycles rather than during deep sleep — the difference between feeling rested and feeling groggy all morning."
        features={[
          'I need to wake up at — enter your alarm time, get optimal bedtimes',
          'I go to bed at — enter your bedtime, get optimal wake-up times',
          '6 recommended times based on 1–6 sleep cycles',
          '90-minute cycle length with 15-minute fall-asleep buffer',
          'Recommended option highlighted for 6–9 hours of sleep',
        ]}
        steps={[
          { title: 'Choose your mode', desc: 'Select "I need to wake up at" (if you have a fixed alarm) or "I go to bed at" (if you know when you will sleep).' },
          { title: 'Set the time', desc: 'Pick the hour, minute, and AM/PM using the dropdowns.' },
          { title: 'Pick a result', desc: 'The calculator shows 4 options ranked by number of sleep cycles. The recommended option gives you 9 hours of rest.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why sleep cycles matter more than total hours</h2>
            <p className="text-slate-600 leading-relaxed">
              Sleep is not one continuous state. You cycle through light sleep, deep sleep, and REM sleep roughly every 90 minutes. Waking up during deep sleep triggers sleep inertia — the heavy, confused feeling that can last an hour or more. Waking up during lighter sleep (between cycles) means you feel alert almost immediately.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Eight hours of sleep that leaves you waking up mid-cycle can feel worse than six hours that aligns with your cycle. The calculator accounts for the 15-minute average time to fall asleep, then maps your cycles so you wake naturally.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'TDEE Calculator', href: '/health/tdee-calculator', icon: '⚡' },
          { name: 'Water Intake Calculator', href: '/health/water-intake-calculator', icon: '💧' },
        ]}
      />
    </>
  );
}
