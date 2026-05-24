import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SleepCalculator = dynamic(() => import('../../components/Health/SleepCalculator'), { ssr: false });

const SLUG = '/health/sleep-calculator';

const FAQS = [
  {
    q: 'How does a sleep cycle calculator work?',
    a: 'A typical sleep cycle lasts about 90 minutes. By multiplying full cycles (4, 5, or 6) and adding ~14 minutes to fall asleep, you get recommended times to wake or sleep that align with natural sleep rhythms.',
  },
  {
    q: 'How many sleep cycles do I need?',
    a: 'Most adults feel optimal with 5 cycles (7.5 hours), which balances rest with realistic schedules. 6 cycles (9 hours) is ideal if you have the time. 4 cycles (6 hours) is the minimum for functional rest.',
  },
  {
    q: 'Should I count time to fall asleep?',
    a: 'Yes — the calculator adds ~14 minutes as an average fall-asleep buffer. If you typically take longer, you may want to set a slightly earlier bedtime.',
  },
  {
    q: 'Is the sleep calculator accurate for everyone?',
    a: 'It provides estimates based on average sleep science. Individual sleep needs, circadian rhythms, and lifestyle vary. Use recommendations as a starting point and adjust as needed.',
  },
  {
    q: 'What time should I go to bed to wake up at 6 AM?',
    a: 'With 5 cycles (optimal): 6:00 AM minus (5 × 90min + 14min) = 8:46 PM. The calculator shows all options — 4, 5, or 6 cycles — so you can choose what fits your schedule.',
  },
];

export default function SleepCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Sleep Calculator',
    slug: SLUG,
    description: 'Calculate the optimal sleep time based on 90-minute sleep cycles. Wake up refreshed by aligning with your natural circadian rhythm using our sleep cycle calculator.',
    category: 'UtilitiesApplication',
    featureList: 'Calculate best bedtimes based on wake time, Calculate best wake times based on current sleep time, 90-minute sleep cycle algorithm, 4/5/6 cycle options, Sleep quality indicator, Visual sleep window timeline',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Sleep Calculator – Find the Best Time to Wake Up or Fall Asleep</title>
        <meta name="description" content="Calculate the optimal sleep time based on 90-minute sleep cycles. Wake up refreshed by aligning with your natural circadian rhythm using our sleep cycle calculator." />
        <meta name="keywords" content="sleep calculator, sleep cycle calculator, what time should I wake up, best time to sleep calculator, sleep schedule" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="😴" title="Sleep Calculator" tagline="Find the best times to fall asleep or wake up based on 90-minute sleep cycles" parent="health" theme="violet">
        <SleepCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate the optimal sleep time based on 90-minute sleep cycles. Wake up refreshed by aligning with your natural circadian rhythm using our sleep cycle calculator."
        features={[
          'Calculate best bedtimes from any wake time',
          'Calculate optimal wake times from current sleep time',
          'Choose between 4, 5, or 6 sleep cycles',
          'Visual sleep window timeline',
          'Sleep quality recommendations',
        ]}
        steps={[
          { title: 'Choose your mode', desc: 'Select "I want to wake up at..." or "I\'m going to sleep now...".' },
          { title: 'Set your time', desc: 'Enter your desired wake time or current sleep time.' },
          { title: 'Pick your cycles', desc: 'Choose 4, 5, or 6 sleep cycles — 5 is optimal for most adults.' },
          { title: 'Review recommended times', desc: 'See all three options and pick the one that fits your schedule.' },
        ]}
        faqs={FAQS}
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'Water Intake Calculator', href: '/health/water-intake-calculator', icon: '💧' },
        ]}
      />
    </>
  );
}