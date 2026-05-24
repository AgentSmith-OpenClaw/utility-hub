import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const WaistToHipCalculator = dynamic(() => import('../../components/Health/WaistToHipCalculator'), { ssr: false });

const SLUG = '/health/waist-to-hip-calculator';

const FAQS = [
  { q: 'What is waist-to-hip ratio (WHR)?', a: 'WHR is the ratio of your waist circumference to your hip circumference. It is used to assess body fat distribution and is a better predictor of health risk than BMI because it captures where fat is stored — specifically abdominal fat, which is more metabolically harmful than fat stored elsewhere.' },
  { q: 'How do I measure my waist and hip correctly?', a: 'For waist: measure at the narrowest point of your torso, typically just above your belly button. For hip: measure at the widest point of your buttocks. Use a flexible tape measure and keep it level all around. Measure against skin or light clothing for the most accurate result.' },
  { q: 'Why do thresholds differ for men and women?', a: 'Men and women naturally store fat differently due to hormonal factors. Women typically store more fat in the hip and thigh area (gynoid pattern), while men tend to store more fat in the abdomen (android pattern). These biological differences are why the WHO uses sex-specific cut-offs.' },
  { q: 'Is WHR a better measure than BMI?', a: 'WHR is better at capturing health risk related to fat distribution. BMI only considers total weight relative to height and cannot distinguish between muscle and fat or indicate where fat is stored. However, WHR does not directly measure body fat percentage. Both are screening tools, not diagnostic measures.' },
  { q: 'What health conditions is high WHR associated with?', a: 'An elevated WHR (indicating more abdominal fat) is associated with increased risk of cardiovascular disease, type 2 diabetes, metabolic syndrome, and certain cancers. Visceral fat around the organs is metabolically active and contributes to inflammation, insulin resistance, and elevated cholesterol.' },
];

export default function WaistToHipCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Waist-to-Hip Ratio Calculator',
    slug: SLUG,
    description: 'Calculate your WHR and assess your risk for cardiovascular disease and type 2 diabetes using the WHO classification system.',
    category: 'UtilitiesApplication',
    featureList: 'WHR calculation, WHO risk classification, Metric and imperial units, Male and female thresholds, Visual gauge display, Informational explanation',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Waist-to-Hip Ratio Calculator – Assess Your Health Risk</title>
        <meta name="description" content="Calculate your WHR and find out your risk level for cardiovascular disease and type 2 diabetes using the WHO classification system." />
        <meta name="keywords" content="waist to hip ratio calculator, whr calculator, waist hip ratio chart, body shape health risk, visceral fat calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Waist-to-Hip Ratio Calculator – Assess Your Health Risk" />
        <meta property="og:description" content="Calculate your WHR and find out your risk level for cardiovascular disease and type 2 diabetes using the WHO classification system." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="📏"
        title="Waist-to-Hip Ratio Calculator"
        tagline="Calculate your WHR and assess your risk for cardiovascular disease and type 2 diabetes using the WHO classification system."
        parent="health"
        theme="violet"
      >
        <WaistToHipCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your waist-to-hip ratio (WHR) and instantly see your health risk classification based on WHO standards. Supports both metric (cm) and imperial (inches) measurements, with separate thresholds for men and women."
        features={[
          '📏 Metric (cm) and imperial (inches) support',
          '⚧ Separate WHO thresholds for men and women',
          '🎯 Instant WHR result to 2 decimal places',
          '📊 Visual gauge showing your position on the risk spectrum',
          '🔴 Color-coded risk categories (green / amber / rose)',
          '⚡ 100% browser-based — no data sent anywhere',
        ]}
        steps={[
          { title: 'Select your biological sex', desc: 'Thresholds differ for men and women due to natural differences in fat distribution patterns.' },
          { title: 'Choose your unit system', desc: 'Toggle between metric (centimetres) and imperial (inches) at the top.' },
          { title: 'Enter your measurements', desc: 'Measure your waist at the narrowest point and hips at the widest point, then type them in.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding WHR and your health risk</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Waist-to-hip ratio is considered a more accurate health risk indicator than BMI because it reflects body fat distribution — specifically abdominal or visceral fat. Unlike subcutaneous fat stored just beneath the skin, visceral fat surrounds internal organs and is metabolically active, releasing fatty acids and inflammatory markers directly into the bloodstream.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Research consistently shows that people with apple-shaped bodies (carrying more weight around the middle) face higher health risks than those with pear-shaped bodies (weight stored around hips and thighs). WHR captures this distinction, which is why it is recommended by the WHO alongside BMI for a more complete picture of metabolic health.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Body Fat Calculator', href: '/health/body-fat-calculator', icon: '💪' },
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
          { name: 'Calorie Calculator', href: '/health/calorie-calculator', icon: '🔥' },
        ]}
      />
    </>
  );
}