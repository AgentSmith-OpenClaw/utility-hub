import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const KetoCalculator = dynamic(() => import('../../components/Health/KetoCalculator'), { ssr: false });

const SLUG = '/health/keto-calculator';

const FAQS = [
  { q: 'What is the ketogenic diet?', a: 'The ketogenic (keto) diet is a very low-carb, moderate-protein, high-fat dietary approach that shifts your body into ketosis — a metabolic state where it burns fat for fuel instead of glucose. Typically, keto diets restrict net carbs to 20–50g per day.' },
  { q: 'How many net carbs should I eat on keto?', a: 'Most people achieve and maintain ketosis with 20–30g of net carbs per day. Strict keto often uses 20g, while lazy keto may allow up to 50g. Going above 50g significantly reduces the likelihood of staying in ketosis.' },
  { q: 'How is protein calculated on this calculator?', a: 'Protein is set at approximately 1.4g per kg of body weight (about 0.64g per lb), which is a moderate level sufficient for muscle preservation on a ketogenic diet without excess gluconeogenesis.' },
  { q: 'Why is fat the largest macro on keto?', a: 'On a standard ketogenic diet, fat provides 70–75% of total calories because it becomes the primary fuel source when carbs are severely restricted. Dietary fat also helps you feel satiated and supports vitamin absorption.' },
  { q: 'What is TDEE and why does it matter?', a: 'TDEE (Total Daily Energy Expenditure) is your estimated total daily calorie burn — your BMR plus activity. For weight loss on keto, a 10% calorie deficit from TDEE is used, which is more sustainable than aggressive restriction.' },
  { q: 'What about electrolytes on keto?', a: 'Electrolyte needs increase on keto due to increased urinary excretion. Common recommendations are 2000–3000mg sodium, 1000–1500mg potassium, and 300–400mg magnesium daily. This varies based on activity and individual factors.' },
];

export default function KetoCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Keto Calculator',
    slug: SLUG,
    description: 'Calculate your optimal keto macros — net carbs, protein, and fat — to achieve and maintain ketosis. Includes TDEE base and electrolyte recommendations.',
    category: 'UtilitiesApplication',
    featureList: 'Keto macro calculation (net carbs, protein, fat), TDEE via Mifflin-St Jeor, Carb limit presets (20/25/30/50g), Weight loss or maintenance goal, Visual pie chart macro split, Electrolyte recommendations, Ketosis warning for high carb limits, Metric and imperial units',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Keto Calculator – Calculate Your Optimal Keto Macros</title>
        <meta name="description" content="Calculate the perfect macronutrient split for the ketogenic diet. Find your net carb, protein, and fat targets to achieve and maintain ketosis." />
        <meta name="keywords" content="keto calculator, keto macro calculator, keto carb limit, how many carbs on keto, ketogenic diet calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Keto Calculator – Calculate Your Optimal Keto Macros" />
        <meta property="og:description" content="Calculate the perfect macronutrient split for the ketogenic diet. Find your net carb, protein, and fat targets to achieve and maintain ketosis." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🥑"
        title="Keto Calculator"
        tagline="Calculate your optimal keto macros — net carbs, protein, and fat — to achieve and maintain ketosis."
        parent="health"
        theme="violet"
      >
        <KetoCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your optimal macronutrient split for the ketogenic diet. Enter your details to get personalized net carb, protein, and fat targets based on your TDEE, with visual charts and comparison to standard keto ratios."
        features={[
          '📏 Metric (cm/kg) and imperial (ft, in/lbs) support',
          '🔥 TDEE via Mifflin-St Jeor equation',
          '🥑 Carb limit presets: Strict 20g / Moderate 25g / Liberal 30g / Lazy 50g',
          '⚖️ Goal selector: weight loss (−10%) or maintenance',
          '🥧 Visual pie chart showing carb/protein/fat percentage split',
          '⚠️ Ketosis warning when carb limit is set too high',
          '💧 Electrolyte recommendations (sodium, potassium, magnesium)',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Enter your details', desc: 'Select your unit system, enter your sex, age, height, and weight.' },
          { title: 'Choose activity level', desc: 'Pick the activity level that best matches your weekly exercise routine to calculate your TDEE.' },
          { title: 'Set your carb limit and goal', desc: 'Choose your daily net carb limit and whether you want to lose weight or maintain.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How keto macros are calculated</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              This calculator uses the <strong>Mifflin-St Jeor equation</strong> to estimate your Basal Metabolic Rate (BMR), then applies an activity multiplier for Total Daily Energy Expenditure (TDEE). For weight loss, a 10% deficit from TDEE is applied.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              <strong>Protein</strong> is set at 1.4g per kg of body weight (~0.64g per lb) — a moderate level sufficient to preserve lean mass without excess gluconeogenesis. <strong>Net carbs</strong> are fixed at your chosen limit (20–50g). <strong>Fat</strong> fills the remaining calories after protein and carbs are accounted for.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The standard keto ratio is approximately 5% carbs, 25% protein, and 70% fat. This calculator may show higher carb percentages at liberal limits because the protein target is body-weight based rather than a strict percentage — this supports muscle preservation while still maintaining low-carb intake.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'Macro Calculator', href: '/health/macro-calculator', icon: '🍽️' },
          { name: 'TDEE Calculator', href: '/health/tdee-calculator', icon: '⚡' },
        ]}
      />
    </>
  );
}