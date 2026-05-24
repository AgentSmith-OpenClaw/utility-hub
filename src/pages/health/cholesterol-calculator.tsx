import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CholesterolCalculator = dynamic(() => import('../../components/Health/CholesterolCalculator'), { ssr: false });

const SLUG = '/health/cholesterol-calculator';

const FAQS = [
  {
    q: 'What is a cholesterol ratio and why does it matter?',
    a: 'A cholesterol ratio is a comparison between two lipid values in your blood, such as total cholesterol divided by HDL. These ratios are considered stronger predictors of cardiovascular disease than any single number alone, because they reflect the balance between artery-clogging and artery-clearing cholesterol types.',
  },
  {
    q: 'What is a healthy TC/HDL ratio?',
    a: 'A Total Cholesterol / HDL ratio below 5 is considered desirable, with below 3.5 being optimal. Studies show that a ratio below 3.5 is associated with significantly lower rates of heart attack and stroke. You can calculate yours using our tool above.',
  },
  {
    q: 'What does LDL/HDL ratio tell me?',
    a: 'The LDL/HDL ratio shows the balance between "bad" cholesterol (LDL — which builds up in artery walls) and "good" cholesterol (HDL — which removes cholesterol from the arteries). Below 3.5 is desirable, and below 2.5 is optimal. A high ratio indicates more arterial plaque-building activity relative to removal.',
  },
  {
    q: 'What does the triglyceride/HDL ratio mean?',
    a: 'The TG/HDL ratio is an emerging marker of metabolic health. A ratio below 2 is ideal, and below 4 is acceptable. High values signal insulin resistance and metabolic syndrome, both major risk factors for heart disease and type 2 diabetes. Lifestyle changes (diet, exercise, weight loss) are highly effective at improving this ratio.',
  },
  {
    q: 'Is non-HDL cholesterol better than LDL?',
    a: 'Yes, according to ATP III guidelines, non-HDL cholesterol (Total minus HDL) is considered a better predictor of cardiovascular risk than LDL alone. It captures all atherogenic ("plaque-building") lipoproteins including LDL, VLDL, IDL, and remnant particles. Target values are 30 mg/dL higher than LDL targets.',
  },
  {
    q: 'Is this tool a substitute for a doctor visit?',
    a: 'No. This calculator is for informational purposes only based on ATP III guidelines. It cannot diagnose any medical condition. Always consult a qualified healthcare provider for personalized assessment, interpretation of your lipid panel, and treatment planning.',
  },
];

export default function CholesterolCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Cholesterol Calculator',
    slug: SLUG,
    description: 'Calculate your total cholesterol/HDL ratio, LDL/HDL ratio, and triglyceride ratio to assess your cardiovascular risk using ATP III guidelines.',
    category: 'UtilitiesApplication',
    featureList: 'ATP III cholesterol ratio calculations, TC/HDL, LDL/HDL, and TG/HDL ratios, Non-HDL cholesterol calculation, Color-coded risk classification (green/amber/red), Overall cardiovascular risk level assessment, Unit toggle for mg/dL and mmol/L, Explanation of each ratio, Disclaimer note',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Cholesterol Calculator – Calculate Your Cholesterol Ratios and Risk | Toolisk</title>
        <meta name="description" content="Calculate your total cholesterol/HDL ratio, LDL/HDL ratio, and triglyceride ratio to assess your cardiovascular risk using ATP III guidelines." />
        <meta name="keywords" content="cholesterol calculator, cholesterol ratio calculator, ldl hdl ratio, triglyceride calculator, cardiovascular risk calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Cholesterol Calculator – Calculate Your Cholesterol Ratios and Risk | Toolisk" />
        <meta property="og:description" content="Calculate your total cholesterol/HDL ratio, LDL/HDL ratio, and triglyceride ratio to assess your cardiovascular risk using ATP III guidelines." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="🫀"
        title="Cholesterol Calculator"
        tagline="Calculate your cholesterol ratios and assess cardiovascular risk using ATP III guidelines. Enter your lipid panel values to get TC/HDL, LDL/HDL, TG/HDL ratios, and an overall risk assessment."
        parent="health"
        theme="violet"
      >
        <CholesterolCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Enter your Total Cholesterol, HDL, LDL, and Triglycerides to calculate key cardiovascular risk ratios. Get color-coded results for TC/HDL, LDL/HDL, TG/HDL, Non-HDL cholesterol, and an overall risk assessment based on ATP III guidelines."
        features={[
          '🫀 TC/HDL, LDL/HDL, and TG/HDL ratio calculations',
          '📊 Non-HDL cholesterol (Total − HDL)',
          '🎨 Color-coded results (green/amber/red risk levels)',
          '⚖️ Overall cardiovascular risk assessment (Low/Moderate/High)',
          '🔄 Unit toggle between mg/dL and mmol/L',
          '📖 Plain-English explanation of each ratio',
          '📋 ATP III risk classification reference table',
          '⚡ Instant results as you type',
        ]}
        steps={[
          { title: 'Enter your lipid values', desc: 'Type your Total Cholesterol, HDL, LDL, and Triglycerides from your lab report. Toggle between mg/dL and mmol/L if needed.' },
          { title: 'Get your ratios', desc: 'Instantly see your TC/HDL, LDL/HDL, and TG/HDL ratios with color-coded risk levels for each.' },
          { title: 'Review overall risk', desc: 'See your overall cardiovascular risk level along with a Non-HDL cholesterol value and an explanation of what your numbers mean.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">About Cholesterol Ratios and ATP III Guidelines</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              The ATP III (Adult Treatment Panel III) guidelines, published by the National Cholesterol Education Program, established the framework for cholesterol screening and treatment in the United States. These guidelines emphasize the use of cholesterol ratios — not just individual lipid values — as better predictors of cardiovascular risk.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Research consistently shows that the Total Cholesterol/HDL ratio is one of the strongest independent predictors of coronary heart disease risk. An MDMA meta-analysis found that for every 1-point decrease in the TC/HDL ratio, heart disease risk drops by approximately 5%.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              While lab reports show individual values within reference ranges, the ratios reveal the balance between cholesterol types. Two people with "normal" LDL values can have very different risk profiles depending on their HDL and triglyceride levels — making ratio analysis essential for accurate cardiovascular assessment.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Blood Pressure Calculator', href: '/health/blood-pressure-calculator', icon: '🩺' },
          { name: 'Heart Rate Calculator', href: '/health/heart-rate-calculator', icon: '❤️' },
          { name: 'BMI Calculator', href: '/health/bmi-calculator', icon: '⚖️' },
        ]}
      />
    </>
  );
}