import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CaffeineCalculator = dynamic(() => import('../../components/Health/CaffeineCalculator'), { ssr: false });

const SLUG = '/health/caffeine-calculator';

const FAQS = [
  { q: 'How does the caffeine calculator work?', a: 'This calculator uses the average caffeine half-life of 5.5 hours. After each half-life period, your body eliminates half of the remaining caffeine. So 100mg becomes ~50mg after 5.5 hours, ~25mg after 11 hours, and so on.' },
  { q: 'What is the recommended daily caffeine limit?', a: 'The FDA recommends a maximum of 400mg of caffeine per day for healthy adults. Pregnant women should limit to 200mg/day. Individual tolerance varies based on age, weight, genetics, and health conditions.' },
  { q: 'How long does caffeine stay in your system?', a: 'Caffeine has a half-life of about 5–6 hours in most adults. This means caffeine can remain in your system for 10–12 hours after your last intake. It takes roughly 5 half-lives (about 25–30 hours) for caffeine to be nearly completely eliminated.' },
  { q: 'What affects caffeine metabolism?', a: 'Several factors affect how quickly you metabolize caffeine: age (older adults process it more slowly), liver function, pregnancy, smoking status, birth control pills, and genetics. Smokers process caffeine about twice as fast as non-smokers.' },
  { q: 'How accurate is the decay timeline?', a: 'The calculator uses the population average half-life of 5.5 hours. Individual half-lives can range from 2–10 hours. The decay curve is an estimate based on typical adult metabolism and should be used as a general guide, not precise medical advice.' },
  { q: 'Can I track multiple drinks at different times?', a: 'Yes. Add any number of caffeine sources with their consumption time. The calculator computes the remaining caffeine from each source at your chosen reference time and shows the combined total with a full 24-hour decay curve.' },
];

export default function CaffeineCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Caffeine Calculator',
    slug: SLUG,
    description: 'Calculate your total caffeine intake from coffee, tea, energy drinks and more. See when your caffeine levels will drop below half with our decay timeline.',
    category: 'UtilitiesApplication',
    featureList: 'Caffeine intake tracking, 5.5-hour half-life decay, FDA 400mg limit comparison, 24-hour decay curve, multiple drink support, common caffeine sources table',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Caffeine Calculator – Calculate Your Daily Caffeine Intake | Toolisk</title>
        <meta name="description" content="Calculate your total caffeine intake from coffee, tea, energy drinks and more. See when your caffeine levels will drop below half with our decay timeline." />
        <meta name="keywords" content="caffeine calculator, daily caffeine intake, how much caffeine in coffee, caffeine decay calculator, coffee calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Caffeine Calculator – Calculate Your Daily Caffeine Intake | Toolisk" />
        <meta property="og:description" content="Calculate your total caffeine intake from coffee, tea, energy drinks and more. See when your caffeine levels will drop below half with our decay timeline." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="☕"
        title="Caffeine Calculator"
        tagline="Calculate your total caffeine intake from coffee, tea, energy drinks, and more. See when your caffeine levels will drop below half."
        parent="health"
        theme="violet"
      >
        <CaffeineCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Track caffeine from any source — brewed coffee, espresso, tea, energy drinks, cola, or chocolate. See your current caffeine level, how it decays over 24 hours using the 5.5-hour half-life, and get warned if you exceed the FDA's 400mg daily limit."
        features={[
          '☕ Track multiple drinks with custom times',
          '📉 Real-time caffeine decay using 5.5h half-life',
          '⚠️ FDA 400mg/day warning with progress bar',
          '📊 Visual 24-hour decay curve (Recharts)',
          '🕐 Milestone alerts: 200mg, 100mg, 50mg, 25mg thresholds',
          '📋 Complete common caffeine sources reference table',
        ]}
        steps={[
          { title: 'Add a caffeine source', desc: 'Select a drink from the common list or enter a custom source with its caffeine content in mg.' },
          { title: 'Set consumption time', desc: 'Enter the time you consumed the drink. Default is now. Use the reference time to calculate from any past or future point.' },
          { title: 'Review your caffeine level', desc: 'See your total current caffeine, percentage of FDA max, and the decay curve showing when levels will drop below key thresholds.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How caffeine half-life works</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Caffeine is metabolized by the liver using the CYP1A2 enzyme. The average half-life in healthy adults is about 5.5 hours — meaning after 5.5 hours, half of the caffeine you consumed is still in your system. After another 5.5 hours (11 hours total), a quarter remains. This exponential decay continues until caffeine is nearly eliminated.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              For example, if you drink a 200mg energy drink at 3pm, you'll have roughly 100mg at 8:30pm, 50mg at 2am, and 25mg at 7:30am. This is why caffeine consumed in the afternoon can still affect sleep — a cup at 4pm means you still have ~50mg in your blood at midnight.
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mt-6">Factors that change caffeine sensitivity</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Smokers process caffeine roughly twice as fast (half-life ~3 hours). Oral contraceptives slow it by 2x. Pregnant women have a much longer half-life (15+ hours). Older adults also metabolize caffeine more slowly. Genetics play a significant role — some people have fast or slow variants of the CYP1A2 gene.
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