import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const OneRepMaxCalculator = dynamic(() => import('../../components/Health/OneRepMaxCalculator'), { ssr: false });

const SLUG = '/health/one-rep-max-calculator';

const FAQS = [
  { q: 'What is a one-rep max?', a: 'A one-rep max (1RM) is the maximum amount of weight you can lift for a single repetition of a given exercise with proper form. It is the universal standard for measuring and comparing strength in weightlifting, powerlifting, and strength training.' },
  { q: "Why use a 1RM calculator instead of testing it?", a: "Testing your true 1RM requires a spotter, perfect technique, and carries a real injury risk — especially for beginners. A submaximal set of 3–5 reps is safer, easier to perform, and the formula estimates are accurate within 3–5% for most lifters." },
  { q: 'How accurate are 1RM formulas?', a: 'For sets of 5 reps or fewer, the Epley and Brzycki formulas are typically within 3–5% of the true value for experienced lifters. Accuracy drops as reps increase — estimates from a 10-rep set are less reliable. This calculator averages four formulas (Epley, Brzycki, Lombardi, O\'Conner) for a more robust estimate.' },
  { q: 'Which formula is best?', a: 'Epley is the most widely used and works well for 1–10 reps. Brzycki is conservative and safer. Lombardi tends to estimate higher. The average of all four gives a balanced estimate most lifters find realistic.' },
  { q: 'How do I use the percentage breakdown?', a: 'Once you know your estimated 1RM, use the percentage chart to program your training. For strength: work at 85–95% (3–5 reps). For hypertrophy: 75–85% (5–8 reps). For endurance: 65–75% (8–12 reps). The chart shows the exact weight for each percentage.' },
];

export default function OneRepMaxCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'One Rep Max Calculator',
    slug: SLUG,
    description: 'Estimate your one-rep max from any submaximal set. Uses Epley, Brzycki, Lombardi, and O\'Conner formulas with a percentage breakdown for programming.',
    category: 'UtilitiesApplication',
    featureList: 'One-rep max estimation, 4 formula comparison, Percentage breakdown, lb/kg toggle, Epley Brzycki Lombardi OConner formulas',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>One Rep Max Calculator — 1RM Estimate for Squat, Bench &amp; Deadlift | Toolisk</title>
        <meta name="description" content="Calculate your one-rep max (1RM) from any submaximal set. Uses 4 formulas (Epley, Brzycki, Lombardi, O'Conner) with a percentage table for programming. Free, no sign-up." />
        <meta name="keywords" content="one rep max calculator, 1rm calculator, one rep max, epley formula, strength calculator, weightlifting calculator, bench press calculator, squat calculator, deadlift calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="One Rep Max Calculator — 1RM Estimate | Toolisk" />
        <meta property="og:description" content="Estimate your one-rep max from any submaximal set. 4 formulas, percentage table, lb/kg toggle." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🏋️"
        title="One Rep Max Calculator"
        tagline="Estimate your 1RM from any submaximal set using 4 proven formulas."
        parent="health"
        theme="violet"
      >
        <OneRepMaxCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Enter the weight you lifted and how many reps you completed on any submaximal set (bench, squat, deadlift, or any lift). The calculator estimates your one-rep max using four formulas — Epley, Brzycki, Lombardi, and O'Conner — then averages them for a reliable estimate. The percentage table shows exactly what weight to use for any rep range."
        features={[
          '4-formula estimation (Epley, Brzycki, Lombardi, O\'Conner)',
          'Averaged result for a balanced estimate',
          'Percentage breakdown table (50%–100%)',
          'lb/kg unit toggle with instant conversion',
          'Works for any lift: squat, bench, deadlift, overhead press',
        ]}
        steps={[
          { title: 'Enter the weight', desc: 'Input the weight you lifted on your most recent submaximal set.' },
          { title: 'Enter the reps', desc: 'Enter how many reps you completed with good form. 5 or fewer gives the most accurate estimate.' },
          { title: 'Read your 1RM', desc: 'The average of four formulas gives a balanced estimate. Use the percentage table to plan your training.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How 1RM formulas actually work</h2>
            <p className="text-slate-600 leading-relaxed">
              All 1RM formulas are based on the same observation: the number of reps you can perform at a given weight follows a predictable curve. Epley (1985) observed that for each additional rep beyond one, the effective load decreases by about 2.5%. Brzycki (1993) modeled it as a linear drop-off. The differences between formulas are small for low-rep sets and grow as reps increase.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The practical takeaway: test with 3–5 reps, not 10. A set of 135 lb for 5 reps tells you far more about your true max than 100 lb for 15 reps. The calculator is most useful as a programming tool — use the percentage chart to set your working weights for any rep scheme.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'TDEE Calculator', href: '/health/tdee-calculator', icon: '⚡' },
          { name: 'Body Fat Calculator', href: '/health/body-fat-calculator', icon: '📐' },
          { name: 'Macro Calculator', href: '/health/macro-calculator', icon: '🍽️' },
        ]}
      />
    </>
  );
}
