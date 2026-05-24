import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const DueDateCalculator = dynamic(() => import('../../components/Health/DueDateCalculator'), { ssr: false });

const SLUG = '/health/due-date-calculator';

const FAQS = [
  {
    q: 'How is my due date calculated?',
    a: 'Most healthcare providers use Naegele\'s rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). This assumes a 28-day cycle and ovulation on day 14. If you use conception date directly, we add 266 days (38 weeks).',
  },
  {
    q: 'What\'s the difference between using LMP vs conception date?',
    a: 'Last Menstrual Period (LMP) is the most common method because most women know their LMP but not the exact conception date. If you know your conception date precisely (from fertility tracking), using it directly gives a more accurate EDD. The difference is typically just the 14-day luteal phase.',
  },
  {
    q: 'How accurate is the estimated due date?',
    a: 'Only about 4% of babies are born exactly on their due date. A due date is an estimate — healthy pregnancies can vary by several weeks. First trimester ultrasounds are the most accurate for confirming due date in the early weeks.',
  },
  {
    q: 'What is a trimester and how are they divided?',
    a: 'Pregnancy is divided into three trimesters: First trimester (weeks 1–12) covers embryonic development and organ formation. Second trimester (weeks 13–26) is often called the "golden period" with reduced nausea and more energy. Third trimester (weeks 27–40+) is when the baby grows rapidly and you prepare for birth.',
  },
  {
    q: 'Should I adjust for my cycle length?',
    a: 'Yes — if your cycle is longer than 28 days, your actual ovulation and conception likely occur later than day 14. Adjusting the cycle length in the calculator accounts for this and gives a more accurate due date. Cycles can vary from 20 to 45 days.',
  },
  {
    q: 'What are key pregnancy milestones?',
    a: '12 weeks: end of first trimester, miscarriage risk drops. 20 weeks: anatomy scan, halfway point. 24 weeks: baby is viable outside the womb with medical support. 36 weeks: baby is full-term position. 40 weeks: your estimated due date.',
  },
];

export default function DueDateCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Pregnancy Due Date Calculator',
    slug: SLUG,
    description: 'Calculate your estimated due date and current gestational week based on your last menstrual period or conception date. Includes trimester breakdown and milestone timeline.',
    category: 'UtilitiesApplication',
    featureList: 'Calculate due date from last menstrual period, Calculate due date from conception date, Adjustable cycle length (20-45 days), Current gestational age in weeks and days, Trimester breakdown, Week-by-week milestone timeline, Pregnancy progress tracker',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Pregnancy Due Date Calculator – Calculate Your Estimated Due Date</title>
        <meta name="description" content="Calculate your estimated due date and current gestational week based on your last menstrual period or conception date. Includes trimester breakdown and milestone timeline." />
        <meta name="keywords" content="due date calculator, pregnancy due date calculator, when am I due, gestational age calculator, pregnancy week calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🤰"
        title="Pregnancy Due Date Calculator"
        tagline="Calculate your estimated due date and current gestational week based on your last menstrual period or conception date"
        parent="health"
        theme="violet"
      >
        <DueDateCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your estimated due date and current gestational week based on your last menstrual period or conception date. Includes trimester breakdown and milestone timeline."
        features={[
          'Calculate due date from last menstrual period (LMP)',
          'Calculate due date from known conception date',
          'Adjustable cycle length for accurate results',
          'Current gestational age in weeks and days',
          'Trimester breakdown with weekly progress',
          'Week-by-week milestone timeline with key发育',
        ]}
        steps={[
          { title: 'Choose your input method', desc: 'Select "Last Period" if you know your LMP, or "Conception Date" if you know exactly when you conceived.' },
          { title: 'Enter your date', desc: 'Input the first day of your last period or your conception date.' },
          { title: 'Adjust cycle length if needed', desc: 'If your cycle is longer or shorter than 28 days, adjust it for a more accurate result.' },
          { title: 'Review your results', desc: 'See your estimated due date, current pregnancy week, trimester, and milestone timeline.' },
        ]}
        faqs={FAQS}
        relatedTools={[
          { name: 'Ovulation Calculator', href: '/health/ovulation-calculator', icon: '📅' },
          { name: 'Period Calculator', href: '/health/period-calculator', icon: '🩸' },
          { name: 'Pregnancy Weight Gain Calculator', href: '/health/pregnancy-weight-gain-calculator', icon: '⚖️' },
        ]}
      />
    </>
  );
}