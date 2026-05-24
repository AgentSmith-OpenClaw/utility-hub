import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const AnxietyScoreCalculator = dynamic(() => import('../../components/Health/AnxietyScoreCalculator'), { ssr: false });

const SLUG = '/health/anxiety-score-calculator';

const FAQS = [
  {
    q: 'What is the GAD-7 anxiety test?',
    a: 'The GAD-7 (Generalized Anxiety Disorder 7-item scale) is a clinically validated self-report questionnaire used to screen for and measure the severity of generalized anxiety disorder. It asks about anxiety symptoms over the past 2 weeks.',
  },
  {
    q: 'How is the GAD-7 scored?',
    a: 'Each of the 7 questions is scored from 0 to 3: 0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day. The total score ranges from 0 to 21. Scores of 0–4 indicate minimal anxiety, 5–9 mild, 10–14 moderate, and 15–21 severe anxiety.',
  },
  {
    q: 'Is this a diagnosis?',
    a: 'No. The GAD-7 is a screening tool, not a diagnostic tool. Only a qualified healthcare provider (such as a doctor, psychiatrist, or licensed therapist) can diagnose an anxiety disorder. This calculator can help you understand your symptoms and decide whether to seek professional support.',
  },
  {
    q: 'Who should take the GAD-7?',
    a: 'Anyone who wants to understand their anxiety levels can take the GAD-7. It is particularly useful if you have been feeling nervous, worried, or anxious for an extended period and want to assess whether those feelings may indicate an anxiety disorder.',
  },
  {
    q: 'What should I do if my score is high?',
    a: 'If your score suggests moderate to severe anxiety, consider reaching out to a healthcare provider. Therapy (especially Cognitive Behavioral Therapy) and/or medication can be very effective. If you are having thoughts of self-harm, please contact a crisis helpline immediately.',
  },
  {
    q: 'Is my score private?',
    a: 'Yes. This calculator runs entirely in your browser — no data is sent to any server. Your responses are never stored or shared.',
  },
];

export default function AnxietyScoreCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Anxiety Score Calculator – GAD-7 Self-Assessment',
    slug: SLUG,
    description: 'Take the clinically validated GAD-7 anxiety test to assess your anxiety level. Get an instant score with severity classification and guidance on next steps.',
    category: 'UtilitiesApplication',
    featureList: 'Clinically validated GAD-7 questionnaire, Instant score calculation 0–21, Color-coded severity classification, Personalized next steps based on score, Crisis resources for severe anxiety, Fully client-side — no data sent to servers',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Anxiety Score Calculator – GAD-7 Self-Assessment Test</title>
        <meta name="description" content="Take the clinically validated GAD-7 anxiety test to assess your anxiety level. Get an instant score with severity classification and guidance on next steps." />
        <meta name="keywords" content="anxiety test, gad-7 calculator, anxiety score calculator, anxiety assessment, generalized anxiety disorder test" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🧠" title="Anxiety Score Calculator" tagline="Clinically validated GAD-7 self-assessment — understand your anxiety level and find your next steps" parent="health" theme="violet">
        <AnxietyScoreCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Take the clinically validated GAD-7 anxiety test to assess your anxiety level. Get an instant score with severity classification and guidance on next steps."
        features={[
          'Clinically validated GAD-7 questionnaire',
          'Instant score calculation (0–21)',
          'Color-coded severity classification',
          'Personalized next steps based on your score',
          'Crisis resources for severe anxiety',
          'Fully client-side — no data sent to servers',
        ]}
        steps={[
          { title: 'Answer all 7 questions', desc: 'Rate how often each anxiety symptom occurred over the past 2 weeks — from "Not at all" to "Nearly every day."' },
          { title: 'Click Calculate', desc: 'Once all questions are answered, click to see your total GAD-7 score and severity level.' },
          { title: 'Review your results', desc: 'See your score, what it means, and recommended next steps tailored to your severity level.' },
          { title: 'Take next steps', desc: 'Based on your results, consider the suggested actions — from self-care strategies to reaching out to a healthcare provider.' },
        ]}
        faqs={FAQS}
        relatedTools={[
          { name: 'Sleep Calculator', href: '/health/sleep-calculator', icon: '😴' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
        ]}
      />
    </>
  );
}