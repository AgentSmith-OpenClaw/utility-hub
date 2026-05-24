import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PregnancyWeightGainCalculator = dynamic(() => import('../../components/Health/PregnancyWeightGainCalculator'), { ssr: false });

const SLUG = '/health/pregnancy-weight-gain-calculator';

const FAQS = [
  {
    q: 'How is the recommended pregnancy weight gain calculated?',
    a: 'The recommended weight gain is based on your pre-pregnancy BMI using IOM (Institute of Medicine) 2009 guidelines. Your BMI is calculated from your pre-pregnancy weight and height, then placed into a category (underweight, normal, overweight, or obese) that determines your recommended total weight gain range.',
  },
  {
    q: 'Why does carrying twins change the recommended weight gain?',
    a: 'Carrying twins requires additional weight gain to support two babies. According to IOM guidelines, women carrying twins should aim for an additional 10–15 lbs (4.5–7 kg) on top of the single pregnancy recommendations. This supports the growth and development of both babies.',
  },
  {
    q: 'How much weight should I gain each week during pregnancy?',
    a: 'In the first trimester, weight gain is minimal (about 0.5–2 lbs total for most women). In the second and third trimesters, women with normal BMI should gain about 1 lb per week (0.45 kg). Women who are underweight may need slightly more, and those who are overweight or obese may need slightly less.',
  },
  {
    q: 'Why is pre-pregnancy BMI important for weight gain?',
    a: 'Pre-pregnancy BMI helps determine how much weight is needed to support a healthy pregnancy. Women who start pregnancy underweight need to gain more, while those who start overweight or obese may need to gain less. This reduces risks for both mother and baby, including complications like gestational diabetes and high blood pressure.',
  },
  {
    q: 'What if I\'m already past my first trimester?',
    a: 'The calculator accounts for your current gestational week and estimates typical weight gain to date. It then shows remaining weight to gain based on your recommended total. The trimester breakdown helps you understand expected gain patterns at each stage of pregnancy.',
  },
  {
    q: 'Should I worry if my weight gain is different from the recommendation?',
    a: 'These are guidelines, not strict targets. Every pregnancy is unique, and your healthcare provider will monitor your weight gain at each visit. They can provide personalized guidance based on your overall health, nutrition, and baby\'s growth. Don\'t hesitate to discuss any concerns with your provider.',
  },
];

export default function PregnancyWeightGainCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Pregnancy Weight Gain Calculator',
    slug: SLUG,
    description: 'Calculate recommended weight gain during pregnancy based on pre-pregnancy BMI and gestational week using IOM guidelines. Supports metric and imperial units, twins mode, and shows trimester breakdown.',
    category: 'UtilitiesApplication',
    featureList: 'Calculate pre-pregnancy BMI, IOM-recommended weight gain ranges by BMI category, Support for twin pregnancies, Weekly gain rate recommendations, Trimester-by-trimester breakdown, Progress tracking based on gestational week, Metric and imperial unit support',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Pregnancy Weight Gain Calculator – IOM Guidelines for Healthy Weight Gain</title>
        <meta name="description" content="Calculate how much weight you should gain during your pregnancy based on your pre-pregnancy BMI and current gestational week using IOM guidelines." />
        <meta name="keywords" content="pregnancy weight gain calculator, iom pregnancy weight gain, how much weight during pregnancy, pregnancy bmi calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="📈"
        title="Pregnancy Weight Gain Calculator"
        tagline="Calculate recommended weight gain during pregnancy based on your pre-pregnancy BMI and current gestational week using IOM guidelines"
        parent="health"
        theme="violet"
      >
        <PregnancyWeightGainCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate how much weight you should gain during your pregnancy based on your pre-pregnancy BMI and current gestational week using IOM guidelines. Get personalized weekly gain targets and trimester breakdown."
        features={[
          'Pre-pregnancy BMI calculation and categorization',
          'IOM 2009 guideline-based recommended weight gain ranges',
          'Support for twin pregnancies with adjusted recommendations',
          'Weekly weight gain rate for 2nd and 3rd trimester',
          'Trimester-by-trimester expected gain breakdown',
          'Progress tracking based on current gestational week',
          'Metric and imperial unit support',
        ]}
        steps={[
          { title: 'Select your unit preference', desc: 'Choose between metric (kg/cm) or imperial (lbs/ft) units.' },
          { title: 'Enter your pre-pregnancy weight and height', desc: 'Input your weight and height as they were before pregnancy.' },
          { title: 'Enter your current gestational week', desc: 'How many weeks along are you? This helps calculate typical weight gain to date.' },
          { title: 'Indicate if carrying twins', desc: 'Select twins mode for adjusted recommendations that account for additional weight needs.' },
          { title: 'Review your personalized recommendations', desc: 'See your BMI category, recommended total gain, weekly rate, and remaining weight to gain.' },
        ]}
        faqs={FAQS}
        relatedTools={[
          { name: 'Due Date Calculator', href: '/health/due-date-calculator', icon: '🤰' },
          { name: 'Ovulation Calculator', href: '/health/ovulation-calculator', icon: '🌸' },
          { name: 'Period Calculator', href: '/health/period-calculator', icon: '🩸' },
        ]}
      />
    </>
  );
}