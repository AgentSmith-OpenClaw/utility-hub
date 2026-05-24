import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const OvulationCalculator = dynamic(() => import('../../components/Health/OvulationCalculator'), { ssr: false });

const SLUG = '/health/ovulation-calculator';

const FAQS = [
  {
    q: 'How does an ovulation calculator work?',
    a: 'An ovulation calculator estimates when you ovulate based on the first day of your last period and your average cycle length. The average luteal phase (time between ovulation and your next period) is about 14 days, so ovulation is typically predicted as cycle length minus 14 days.',
  },
  {
    q: 'When is a woman most fertile?',
    a: 'A woman is most fertile during the 2 days leading up to and including ovulation — often called the "peak fertility" window. Sperm can survive in the reproductive tract for up to 5 days, so the full fertile window is typically 5 days before ovulation through ovulation day.',
  },
  {
    q: 'How accurate is an ovulation calculator?',
    a: 'An ovulation calculator provides estimates based on average values and assumes regular cycles. Many factors can affect actual ovulation timing, including stress, illness, travel, weight changes, and hormonal fluctuations. This tool is not a substitute for medical advice or fertility tracking methods.',
  },
  {
    q: 'Can I use this to avoid pregnancy?',
    a: 'No. This calculator should not be used as a method of contraception or family planning for avoiding pregnancy. It is intended only for conception planning. Consult a healthcare provider for personalized guidance on fertility awareness or birth control methods.',
  },
  {
    q: 'What cycle length should I use?',
    a: 'Use your own average cycle length, which is the number of days from the first day of your period to the day before your next period starts. If your cycles vary, average the last 3–6 months. Cycle lengths between 21 and 35 days are considered normal, with 28 days being most common.',
  },
];

export default function OvulationCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Ovulation Calculator',
    slug: SLUG,
    description: 'Predict your ovulation date and fertile window based on your menstrual cycle length. See your most fertile days for conception planning.',
    category: 'UtilitiesApplication',
    featureList: 'Predict ovulation date from last period, Calculate 6-day fertile window, Highlight most fertile days, 2-cycle projection view, Current cycle day tracking, Next period estimate',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Ovulation Calculator – Find Your Fertile Window</title>
        <meta name="description" content="Predict your ovulation date and fertile window based on your menstrual cycle length. See your most fertile days for conception planning." />
        <meta name="keywords" content="ovulation calculator, fertile window calculator, when do I ovulate, ovulation date calculator, fertility calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🌸" title="Ovulation Calculator" tagline="Predict your fertile window and ovulation date based on your menstrual cycle" parent="health" theme="violet">
        <OvulationCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Predict your ovulation date and fertile window based on your menstrual cycle length. See your most fertile days for conception planning."
        features={[
          'Predict ovulation date from last period start date',
          'Calculate your 6-day fertile window automatically',
          'Highlight your most fertile days for conception',
          'See a 2-cycle projection with current and next cycle',
          'Track which day of your cycle you are currently on',
          'Estimate when your next period is expected',
        ]}
        steps={[
          { title: 'Enter last period date', desc: 'Select the first day of your last menstrual period.' },
          { title: 'Set cycle length', desc: 'Adjust the slider to match your average cycle length (default is 28 days).' },
          { title: 'View your prediction', desc: 'See your predicted ovulation date, fertile window, and most fertile days.' },
          { title: 'Plan ahead', desc: 'Review the 2-cycle projection to plan for conception timing.' },
        ]}
        faqs={FAQS}
        relatedTools={[
          { name: 'Period Calculator', href: '/health/period-calculator', icon: '📅' },
          { name: 'Due Date Calculator', href: '/health/due-date-calculator', icon: '👶' },
          { name: 'Pregnancy Weight Gain Calculator', href: '/health/pregnancy-weight-gain-calculator', icon: '⚖️' },
        ]}
      />
    </>
  );
}