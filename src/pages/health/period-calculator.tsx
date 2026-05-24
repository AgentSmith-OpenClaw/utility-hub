import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PeriodCalculator = dynamic(() => import('../../components/Health/PeriodCalculator'), { ssr: false });

const SLUG = '/health/period-calculator';

const FAQS = [
  {
    q: 'How does a period calculator work?',
    a: 'A period calculator predicts when your next period will start based on the first day of your last period and your average cycle length. It assumes a consistent cycle and uses the formula: next period = last period start + cycle length.',
  },
  {
    q: 'What is a normal menstrual cycle length?',
    a: 'A normal menstrual cycle typically ranges from 21 to 35 days, with 28 days being the most common average. Your personal cycle length may vary, so using your own average (calculated from the last 3–6 months) will give more accurate predictions.',
  },
  {
    q: 'What is the PMS window?',
    a: 'The PMS (premenstrual syndrome) window is the 3–5 days before your period starts when hormonal changes can cause symptoms like mood swings, bloating, fatigue, food cravings, and irritability. This calculator highlights those dates for planning purposes.',
  },
  {
    q: 'How is the fertile window calculated?',
    a: 'The fertile window is the 6 days leading up to and including ovulation. Ovulation typically occurs 14 days before your next period (assuming a 14-day luteal phase). Sperm can survive for up to 5 days, so the full fertile window spans 5 days before ovulation through ovulation day.',
  },
  {
    q: 'Can I use this as a method of contraception?',
    a: 'No. This calculator provides estimates based on averages and should not be used as a form of birth control or family planning to avoid pregnancy. Many factors can affect actual cycle timing. Consult a healthcare provider for personalized guidance.',
  },
  {
    q: 'Why does my cycle length sometimes vary?',
    a: 'Cycle lengths vary due to factors like stress, illness, travel, weight changes, hormonal fluctuations, medications, and sleep patterns. Using a rolling 3–6 month average rather than a single cycle gives a more reliable prediction.',
  },
];

export default function PeriodCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Period Calculator',
    slug: SLUG,
    description: 'Predict your next period date and track your menstrual cycle. See a 3-cycle projection with PMS window and fertile window indicators.',
    category: 'UtilitiesApplication',
    featureList: 'Predict next period date from last period start, Calculate days until next period, 3-cycle projection forward, Highlight PMS window dates, Show fertile window with ovulation day, Current cycle day tracking',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Period Calculator – Track and Predict Your Menstrual Cycle</title>
        <meta name="description" content="Predict your next period date and track your menstrual cycle. See a 3-cycle projection with PMS window and fertile window indicators." />
        <meta name="keywords" content="period calculator, menstrual cycle tracker, when is my next period, period tracker, pms calculator, menstrual calculator, period prediction" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🗓️" title="Period Calculator" tagline="Predict your next period, track your menstrual cycle, and see your PMS window" parent="health" theme="violet">
        <PeriodCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Predict your next period date and track your menstrual cycle. See a 3-cycle projection with PMS window and fertile window indicators."
        features={[
          'Predict next period date from last period start date',
          'See days until your next period with live countdown',
          'View a 3-cycle projection of upcoming periods',
          'Track PMS window with symptom timing alerts',
          'See fertile window and ovulation day for each cycle',
          'Link to the Ovulation Calculator for detailed fertility tracking',
          'Customize cycle length and period length for accurate predictions',
        ]}
        steps={[
          { title: 'Enter last period date', desc: 'Select the first day of your last menstrual period.' },
          { title: 'Set cycle and period length', desc: 'Adjust the sliders to match your average cycle length (default 28 days) and period length (default 5 days).' },
          { title: 'View your prediction', desc: 'See your next period date, days until it starts, and the PMS window.' },
          { title: 'Review 3-cycle projection', desc: 'See period predictions for the next 3 months to plan ahead.' },
        ]}
        faqs={FAQS}
        relatedTools={[
          { name: 'Ovulation Calculator', href: '/health/ovulation-calculator', icon: '🌸' },
          { name: 'Due Date Calculator', href: '/health/due-date-calculator', icon: '🤰' },
          { name: 'Pregnancy Weight Gain Calculator', href: '/health/pregnancy-weight-gain-calculator', icon: '⚖️' },
        ]}
      />
    </>
  );
}