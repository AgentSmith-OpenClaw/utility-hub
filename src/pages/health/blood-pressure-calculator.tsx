import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const BloodPressureCalculator = dynamic(() => import('../../components/Health/BloodPressureCalculator'), { ssr: false });

const SLUG = '/health/blood-pressure-calculator';

const FAQS = [
  {
    q: 'What is blood pressure?',
    a: 'Blood pressure is the force of your blood pushing against the walls of your arteries. It\'s recorded as two numbers: systolic (the top number — pressure when your heart beats) and diastolic (the bottom number — pressure when your heart rests).',
  },
  {
    q: 'What do the blood pressure categories mean?',
    a: 'The AHA/ACC 2017 guidelines define five categories: Normal (under 120/80), Elevated (120-129 / under 80), Hypertension Stage 1 (130-139 or 80-89), Hypertension Stage 2 (140+ or 90+), and Hypertensive Crisis (above 180/120) — the latter requires immediate medical care.',
  },
  {
    q: 'What is pulse pressure?',
    a: 'Pulse pressure is the difference between your systolic and diastolic readings (Systolic − Diastolic). A normal pulse pressure is about 40 mmHg. Wide pulse pressure (above 60) can indicate stiff arteries or other cardiovascular issues.',
  },
  {
    q: 'What is Mean Arterial Pressure (MAP)?',
    a: 'MAP represents the average pressure in your arteries during one cardiac cycle. It\'s calculated as: Diastolic + (Pulse Pressure ÷ 3). MAP is used in clinical settings to assess organ perfusion. A normal MAP is around 70–100 mmHg.',
  },
  {
    q: 'Is this tool a substitute for a doctor visit?',
    a: 'No. This calculator is for informational purposes only based on AHA/ACC guidelines. It cannot diagnose hypertension or any medical condition. Always consult a qualified healthcare provider for personalized assessment and treatment.',
  },
];

export default function BloodPressureCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Blood Pressure Calculator',
    slug: SLUG,
    description: 'Classify your blood pressure reading using AHA/ACC 2017 guidelines. Understand your systolic and diastolic numbers, pulse pressure, and mean arterial pressure.',
    category: 'UtilitiesApplication',
    featureList: 'AHA/ACC 2017 classification, Systolic and diastolic inputs, Color-coded result categories, Pulse pressure calculation, Mean Arterial Pressure (MAP), Crisis warning banner, Disclaimer note',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Blood Pressure Calculator – Classify Your BP Reading (AHA/ACC Guidelines) | Toolisk</title>
        <meta name="description" content="Enter your systolic and diastolic blood pressure to get an instant classification. Understand your readings using AHA/ACC 2017 guidelines with recommended actions." />
        <meta name="keywords" content="blood pressure calculator, bp chart, is my blood pressure normal, blood pressure categories, systolic diastolic" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Blood Pressure Calculator – Classify Your BP Reading (AHA/ACC Guidelines) | Toolisk" />
        <meta property="og:description" content="Enter your systolic and diastolic blood pressure to get an instant classification using AHA/ACC 2017 guidelines." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🩺"
        title="Blood Pressure Calculator"
        tagline="Classify your blood pressure reading using AHA/ACC 2017 guidelines. Understand what your systolic and diastolic numbers mean for your heart health."
        parent="health"
        theme="violet"
      >
        <BloodPressureCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Enter your systolic and diastolic blood pressure to receive an instant classification using the AHA/ACC 2017 guidelines. The tool shows your BP category with color-coded results, pulse pressure, and Mean Arterial Pressure. Includes a crisis warning for readings above 180/120 mmHg."
        features={[
          '📊 AHA/ACC 2017 BP classification guidelines',
          '🩸 Systolic and diastolic blood pressure inputs',
          '🎨 Color-coded result cards (green/amber/orange/red)',
          '💓 Pulse pressure calculation (systolic − diastolic)',
          '📈 Mean Arterial Pressure (MAP) calculation',
          '🚨 Crisis warning banner for readings above 180/120',
          '⚡ Instant results as you type',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Enter your readings', desc: 'Type your systolic (top number) and diastolic (bottom number) blood pressure readings in mmHg.' },
          { title: 'Get your classification', desc: 'Your BP is instantly classified into Normal, Elevated, Stage 1/2 Hypertension, or Crisis using AHA/ACC 2017 guidelines.' },
          { title: 'Review additional metrics', desc: 'See your Pulse Pressure and Mean Arterial Pressure alongside personalized guidance for your category.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">About Blood Pressure Classification</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              The 2017 ACC/AHA guidelines lowered the thresholds for hypertension diagnosis, which means millions more people are now classified as having elevated blood pressure or hypertension. Early detection is critical because high blood pressure is a leading risk factor for heart attack, stroke, kidney disease, and other serious health conditions.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              While a single high reading does not mean you have hypertension — blood pressure fluctuates throughout the day and can be affected by stress, caffeine, physical activity, and even the time of day — repeated elevated readings warrant a conversation with your healthcare provider.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Heart Rate Calculator', href: '/health/heart-rate-calculator', icon: '❤️' },
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
        ]}
      />
    </>
  );
}