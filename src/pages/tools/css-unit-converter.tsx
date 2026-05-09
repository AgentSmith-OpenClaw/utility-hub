import Head from 'next/head';
import CssUnitConverter from '../../components/Tools/CssUnitConverter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/css-unit-converter';

export default function CssUnitConverterPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CSS Unit Converter',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Convert between CSS units: px, em, rem, pt, pc, %, vw, vh. Configurable root and parent font sizes plus viewport dimensions.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'px to rem conversion, em rem px conversion, vw vh viewport units, pt pc print units, configurable context',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What does 1rem equal in pixels?', acceptedAnswer: { '@type': 'Answer', text: 'By default, 1rem = 16px because that\'s the browser\'s default root font size. If you set html { font-size: 18px } in CSS, then 1rem becomes 18px. The whole point of rem is that this scales site-wide if you change the root.' } },
      { '@type': 'Question', name: 'When should I use rem vs em?', acceptedAnswer: { '@type': 'Answer', text: 'Use rem for font sizes, spacing, and layout — predictable because it\'s always relative to the root. Use em for component-internal scaling — e.g. padding inside a button that should grow with the button\'s font size.' } },
      { '@type': 'Question', name: 'What\'s the difference between vw and %?', acceptedAnswer: { '@type': 'Answer', text: '1vw = 1% of the viewport width, regardless of any parent. 1% in width is 1% of the parent element\'s width. Use vw for hero text or full-bleed elements; use % for elements that should respect a container.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>CSS Unit Converter — px, em, rem, pt, vw, vh | Toolisk</title>
        <meta name="description" content="Free CSS unit converter. Convert between px, em, rem, pt, pc, %, vw, and vh with adjustable root font size and viewport dimensions. Built for designers and developers." />
        <meta name="keywords" content="css unit converter, px to rem, rem to px, em to px, vw to px, css units, font size converter" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="CSS Unit Converter | Toolisk" />
        <meta property="og:description" content="Convert px, em, rem, pt, pc, %, vw, vh — with custom context." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="📐" title="CSS Unit Converter" tagline="Convert between px, em, rem, pt, pc, %, vw, vh. Tweak the root and viewport context to match your design system.">
        <CssUnitConverter />
      </ToolShell>

      <ToolSEOContent
        description="A CSS unit converter for designers and front-end developers. Enter any value in any unit and instantly see equivalents in seven others. The context panel lets you set custom root font size, viewport dimensions, and percentage base — exactly matching your project setup."
        features={[
          '🔄 Convert all 8 common CSS units',
          '⚙️ Configurable root font size (1rem)',
          '📱 Custom viewport width / height',
          '🎯 Adjustable percentage base',
          '📋 Copy any value with one click',
          '🔢 Live precision (3–4 decimal places)',
        ]}
        steps={[
          { title: 'Enter a value', desc: 'Type the number and select its current unit.' },
          { title: 'Optionally adjust the context', desc: 'Default 16px root and your current viewport are used unless you change them.' },
          { title: 'Read off the conversions', desc: 'All 8 units are calculated live. The active unit is highlighted.' },
          { title: 'Copy and paste into CSS', desc: 'Each card has a copy button that includes the unit suffix.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Quick reference</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Absolute units</div>
                <p>px, pt (point = 1/72 inch), pc (pica = 12pt). Fixed regardless of parent or viewport.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Relative-to-font</div>
                <p>em (parent font size), rem (root font size). Most useful for typography and accessible scaling.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Relative-to-viewport</div>
                <p>vw (1% viewport width), vh (1% height). Great for hero sections and fluid sizing.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Percentage</div>
                <p>% is relative to the parent property — width to parent width, font-size to parent font-size, etc.</p>
              </div>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Color Converter', href: '/tools/color-converter', icon: '🎨' },
          { name: 'JSON Viewer', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'Markdown Preview', href: '/tools/markdown-preview', icon: '📑' },
        ]}
        relatedArticles={[
          { title: 'CSS Units Explained: px, em, rem, vw', href: '/tools/learn/css-units-explained' },
        ]}
      />
    </>
  );
}
