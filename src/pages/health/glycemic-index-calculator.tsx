import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const GlycemicIndexCalculator = dynamic(() => import('../../components/Health/GlycemicIndexCalculator'), { ssr: false });

const SLUG = '/health/glycemic-index-calculator';

const FAQS = [
  {
    q: 'What is the Glycemic Index (GI)?',
    a: 'The Glycemic Index is a ranking of carbohydrates in foods from 0 to 100 based on how quickly and how high they raise blood sugar levels after eating. Foods with a low GI (55 or less) are digested and absorbed slowly, causing a gradual rise in blood sugar. High-GI foods (70+) are digested quickly, causing a rapid spike.',
  },
  {
    q: 'What is Glycemic Load (GL)?',
    a: 'Glycemic Load accounts for both the quality (GI) and quantity (carbs) of carbohydrates in a serving of food. It\'s calculated as GL = (GI × carbs per serving) / 100. GL gives a more practical measure of how a food will affect your blood sugar in real-world portion sizes. A GL under 10 is low, 11–19 is medium, and 20+ is high.',
  },
  {
    q: 'What\'s the difference between GI and GL?',
    a: 'GI tells you how fast a carbohydrate food raises your blood sugar (the speed), while GL tells you how much it will raise it (the impact per serving). A watermelon has a high GI (76) but a low GL (~5) per slice because it\'s mostly water and fiber. This is why GL is often more useful for meal planning.',
  },
  {
    q: 'Why do some foods like eggs and fish have GI = 0?',
    a: 'Foods that contain essentially no carbohydrates (like eggs, fish, and meat) are assigned GI = 0. They have minimal direct impact on blood sugar levels. However, they can still influence insulin response and satiety through protein and fat content.',
  },
  {
    q: 'Is this tool a substitute for medical nutrition therapy?',
    a: 'No. This calculator provides estimated GI and GL values from published databases for informational purposes. Individual responses to foods can vary based on many factors including ripeness, cooking method, meal composition, gut microbiota, and metabolic health. Always consult a qualified healthcare provider or registered dietitian for personalized dietary advice.',
  },
];

export default function GlycemicIndexCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Glycemic Index Calculator',
    slug: SLUG,
    description: 'Look up the glycemic index and glycemic load of 30+ common foods. Calculate GL for any serving size to manage blood sugar levels and support diabetes management.',
    category: 'UtilitiesApplication',
    featureList: '30+ food database with GI values, Adjustable serving size slider, Glycemic Load calculation, Color-coded GI classifications (low/medium/high), Custom food input for GI and carbs, Best low-GI foods by category, Health tips per classification, Disclaimer note',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Glycemic Index Calculator – Find GI and GL for Common Foods | Toolisk</title>
        <meta name="description" content="Look up the glycemic index and glycemic load of 30+ common foods. Calculate GL for any serving size to manage blood sugar levels." />
        <meta name="keywords" content="glycemic index calculator, gi calculator, glycemic load calculator, low gi foods, blood sugar calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Glycemic Index Calculator – Find GI and GL for Common Foods | Toolisk" />
        <meta property="og:description" content="Look up the glycemic index and glycemic load of 30+ common foods. Calculate GL for any serving size to manage blood sugar levels." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🍬"
        title="Glycemic Index Calculator"
        tagline="Look up the glycemic index and glycemic load of 30+ common foods. Calculate GL for any serving size to support blood sugar management and diabetes control."
        parent="health"
        theme="violet"
      >
        <GlycemicIndexCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Search a database of 30+ common foods to find their glycemic index (GI) and calculate glycemic load (GL) for any serving size. Includes low-GI food recommendations, health tips based on classification, and a custom food input for any food not in the database."
        features={[
          '🍬 30+ foods with GI values in a searchable database',
          '📊 Adjustable serving size slider (0.25× to 3×)',
          '⚡ Instant Glycemic Load calculation: GL = (GI × Carbs) ÷ 100',
          '🎨 Color-coded results: green (low GI), amber (medium), red (high)',
          '🥗 Best low-GI foods grouped by category',
          '🔢 Custom food input — enter any food\'s GI and carb content',
          '💡 Health tips based on GI classification',
          '🔒 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Search or browse the food database', desc: 'Use the search bar or filter by category (fruits, vegetables, grains, etc.) to find a food from our database of 30+ items.' },
          { title: 'Select a food and adjust serving size', desc: 'Click a food card to select it. Use the serving size slider to adjust the portion — GL is calculated instantly based on your chosen multiplier.' },
          { title: 'Read your results and health tip', desc: 'See the GI value, classification badge (low/medium/high), carb content, and personalized health guidance based on your selected food.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding Glycemic Index & Glycemic Load</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              The Glycemic Index (GI) ranks foods on a scale from 0 to 100 based on how quickly they raise blood glucose levels after eating. Foods are classified as low GI (55 or less), medium GI (56–69), or high GI (70+). The reference food is glucose (GI = 100). However, GI alone doesn&apos;t account for how much carbohydrate is in a realistic serving — that&apos;s where Glycemic Load (GL) comes in.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Glycemic Load multiplies the GI by the actual carb content per serving and divides by 100: GL = (GI × carbs per serving) ÷ 100. This gives you the real-world blood sugar impact of eating a specific amount of a food. A GL under 10 is considered low, 11–19 is medium, and 20+ is high. Research suggests that choosing low-GL foods consistently can improve blood sugar control, support weight management, and reduce the risk of type 2 diabetes and heart disease.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'Macro Calculator', href: '/health/macro-calculator', icon: '🍽️' },
          { name: 'Keto Calculator', href: '/health/keto-calculator', icon: '🥑' },
        ]}
      />
    </>
  );
}