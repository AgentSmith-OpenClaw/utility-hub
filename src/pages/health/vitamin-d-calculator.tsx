import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const VitaminDCalculator = dynamic(() => import('../../components/Health/VitaminDCalculator'), { ssr: false });

const SLUG = '/health/vitamin-d-calculator';

const FAQS = [
  { q: 'How much Vitamin D do I need per day?', a: 'The Endocrine Society recommends 600–2000 IU/day for most adults. Adults over 70, people with darker skin, those living at high latitudes, or those with limited sun exposure may need toward the higher end or above 2000 IU/day under medical supervision.' },
  { q: 'What is the difference between Vitamin D2 and D3?', a: 'Vitamin D3 (cholecalciferol) is the form produced by your skin in response to sunlight and is also found in animal products. Vitamin D2 (ergocalciferol) comes from plant sources and some supplements. Studies suggest D3 is more effective at raising and maintaining serum 25(OH)D levels.' },
  { q: 'Can I get enough Vitamin D from food alone?', a: 'Very few foods naturally contain significant Vitamin D. Fatty fish (salmon, mackerel) and cod liver oil are the richest natural sources. Most people cannot meet their Vitamin D needs through diet without fortified foods or supplements.' },
  { q: 'What is a safe upper limit for Vitamin D supplementation?', a: 'The Endocrine Society suggests 2000 IU/day as a safe upper limit for most adults without medical supervision. The Institute of Medicine sets the tolerable upper intake level at 4000 IU/day. Excessively high doses (above 10,000 IU/day for prolonged periods) can lead to toxicity and hypercalcemia.' },
  { q: 'Does sunscreen prevent Vitamin D production?', a: 'Yes, SPF 15+ sunscreen can reduce Vitamin D synthesis by up to 99%. However, most people do not apply enough sunscreen to fully block synthesis, and brief daily sun exposure (10–30 min depending on skin type and latitude) is generally considered sufficient for Vitamin D while still being mindful of skin cancer risk.' },
  { q: 'How often should I have my Vitamin D levels tested?', a: 'Testing frequency depends on your risk factors. Those with known deficiency, malabsorption issues, kidney disease, or who are on high-dose supplements should test more frequently (every 3–6 months). Most healthy adults with no risk factors can test annually or every 2–3 years.' },
];

export default function VitaminDCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Vitamin D Calculator',
    slug: SLUG,
    description: 'Estimate your daily Vitamin D needs based on skin type, latitude, sun exposure, and diet using Endocrine Society 2011 guidelines.',
    category: 'UtilitiesApplication',
    featureList: 'Daily Vitamin D need estimation, Skin type Fitzpatrick scale, Latitude and season adjustment, Sun exposure calculation, Dietary Vitamin D intake tracker, Serum 25(OH)D risk categories, Supplement dose recommendations, Food sources guide',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Vitamin D Calculator – Find Your Daily Vitamin D Needs | Toolisk</title>
        <meta name="description" content="Calculate how much Vitamin D you need per day based on your skin type, location, sun exposure, and diet using Endocrine Society guidelines." />
        <meta name="keywords" content="vitamin d calculator, daily vitamin d intake, vitamin d deficiency calculator, how much vitamin d do I need, sun vitamin d calculator, vitamin d food sources, endocrine society vitamin d guidelines" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Vitamin D Calculator – Find Your Daily Vitamin D Needs | Toolisk" />
        <meta property="og:description" content="Calculate how much Vitamin D you need per day based on your skin type, location, sun exposure, and diet." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="☀️"
        title="Vitamin D Calculator"
        tagline="Estimate your daily Vitamin D needs based on skin type, latitude, sun exposure, and diet. Built on Endocrine Society 2011 guidelines."
        parent="health"
        theme="violet"
      >
        <VitaminDCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate how much Vitamin D you need per day based on your skin type, location, sun exposure, and diet. Uses Endocrine Society 2011 guidelines to estimate your serum 25(OH)D level and recommend whether you need a supplement."
        features={[
          '☀️ Fitzpatrick skin type selector (I–VI) with descriptions',
          '📍 Latitude and climate adjustments for UV availability',
          '🗓️ Summer/winter season toggle affecting UV synthesis',
          '⏱️ Sun exposure slider (0–60 min/day)',
          '🥗 Interactive dietary Vitamin D checklist (12 foods)',
          '💊 Supplement toggle with recommended dose calculation',
          '🩸 Serum 25(OH)D risk categories with color coding',
          '📊 Food sources table with IU per serving',
          '⚕️ Sun exposure tips and safety guidance',
        ]}
        steps={[
          { title: 'Enter your age and skin type', desc: 'Older adults and those with darker skin types generally need more Vitamin D from diet and supplements.' },
          { title: 'Set your location and season', desc: 'Higher latitudes and winter months reduce UV-B availability for Vitamin D synthesis.' },
          { title: 'Input sun exposure and diet', desc: 'Use the slider for daily sun exposure and check foods you regularly eat to calculate your dietary Vitamin D intake.' },
          { title: 'Review your results', desc: 'See your estimated daily need, serum 25(OH)D risk category, and whether a supplement is recommended.' },
        ]}
        faqs={FAQS}
        relatedTools={[
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
          { name: 'Protein Calculator', href: '/health/protein-calculator', icon: '🍽️' },
          { name: 'Water Intake Calculator', href: '/health/water-intake-calculator', icon: '💧' },
        ]}
      />
    </>
  );
}